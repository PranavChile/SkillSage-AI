# ==============================================================================
# Copyright (c) 2026 SkillSage AI. All Rights Reserved.
#
# This file is part of the SkillSage AI Resume Analyzer project.
# Unauthorized copying of this file, via any medium is strictly prohibited.
# Proprietary and confidential.
#
# Authors: Pranav Chile, Madhura Chavekar, Lajim Mulla, Yash Yargaonkar
# ==============================================================================
import os
import re
import joblib
import nltk
from io import BytesIO
from typing import Any, Dict, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Optional heavy deps (import safely)
try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    from pdf2image import convert_from_bytes
    import pytesseract
except ImportError:
    convert_from_bytes = None
    pytesseract = None

try:
    import docx
except ImportError:
    docx = None

from nltk.corpus import stopwords

# Ensure NLTK stopwords available
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    try:
        nltk.download('stopwords', quiet=True)
    except Exception:
        pass


class ResumeAnalyzer:
    def __init__(self,
                 model_path: str = "../public/models/domain_classifier.pkl",
                 vectorizer_path: str = "../public/models/tfidf_vectorizer.pkl"):
        
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        self.model_path = model_path if os.path.isabs(model_path) else os.path.normpath(os.path.join(base_dir, model_path))
        self.vectorizer_path = vectorizer_path if os.path.isabs(vectorizer_path) else os.path.normpath(os.path.join(base_dir, vectorizer_path))

        self.model = None
        self.vectorizer = None

        print(f"Looking for Model at: {self.model_path}")
        print(f"Looking for Vectorizer at: {self.vectorizer_path}")

        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                print("✅ Model loaded successfully!")
            else:
                print("⚠️ Model file NOT FOUND.")
                
            if os.path.exists(self.vectorizer_path):
                self.vectorizer = joblib.load(self.vectorizer_path)
                print("✅ Vectorizer loaded successfully!")
            else:
                print("⚠️ Vectorizer file NOT FOUND.")
        except Exception as e:
            print(f"❌ Error loading ML artifacts: {e}")
            self.model = None
            self.vectorizer = None

        try:
            self.stopwords = set(stopwords.words('english'))
        except Exception:
            self.stopwords = set()

    def extract_text_from_pdf(self, file_bytes: bytes) -> str:
        try:
            if pdfplumber:
                with pdfplumber.open(BytesIO(file_bytes)) as pdf:
                    pages = [p.extract_text() or "" for p in pdf.pages]
                    text = "\n".join(pages).strip()
                    if text:
                        return text
        except Exception:
            pass
            
        try:
            if PyPDF2:
                reader = PyPDF2.PdfReader(BytesIO(file_bytes))
                pages = [page.extract_text() or "" for page in reader.pages]
                text = " ".join(pages).strip()
                if text:
                    return text
        except Exception:
            pass

        try:
            if convert_from_bytes and pytesseract:
                images = convert_from_bytes(file_bytes, dpi=300)
                ocr_pages = [pytesseract.image_to_string(img) for img in images]
                text = "\n".join(ocr_pages).strip()
                if text:
                    return text
        except Exception:
            pass

        return ""

    def extract_text_from_docx(self, file_bytes: bytes) -> str:
        try:
            if not docx:
                raise RuntimeError("python-docx not installed")
            document = docx.Document(BytesIO(file_bytes))
            return " ".join([para.text for para in document.paragraphs if para.text])
        except Exception:
            return ""

    def clean_text(self, text: str) -> str:
        if not text:
            return ""
        s = str(text).lower()
        s = re.sub(r'\S+@\S+', ' ', s)
        s = re.sub(r'http\S+|www\S+', ' ', s)
        s = re.sub(r'[^a-zA-Z\s]', ' ', s)
        s = ' '.join(s.split())
        if self.stopwords:
            tokens = [t for t in s.split() if t not in self.stopwords]
            s = ' '.join(tokens)
        return s

    def _is_valid_resume(self, text: str) -> bool:
        resume_indicators = [
            "experience", "education", "skills", "projects", "summary", 
            "objective", "work history", "employment", "university", 
            "degree", "bachelor", "master", "certifications", "profile"
        ]
        text_lower = text.lower()
        match_count = sum(1 for kw in resume_indicators if re.search(r'\b' + kw + r'\b', text_lower))
        return match_count >= 3

    def _heuristic_predict_from_text(self, text: str) -> Dict[str, Any]:
        domain_keywords = {
            "Data Science": ["machine learning", "scikit-learn", "pandas", "numpy", "tensorflow", "pytorch"],
            "Backend": ["django", "flask", "sqlalchemy", "rest api", "nodejs", "fastapi"],
            "Frontend": ["react", "angular", "vue", "html", "css", "javascript", "typescript"],
            "DevOps": ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd"],
            "Linux Administrator": ["linux", "bash", "shell scripting", "redhat", "ubuntu", "centos", "sysadmin", "system administration", "networking", "apache", "nginx", "ssh", "troubleshooting", "servers", "active directory"]
        }
        text_lower = (text or "").lower()
        
        scores = {domain: sum(len(re.findall(r'\b' + re.escape(kw) + r'\b', text_lower)) for kw in keywords)
                  for domain, keywords in domain_keywords.items()}
        
        sorted_domains = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        total = sum(scores.values())
        
        if sorted_domains[0][1] == 0:
            return {"domain": "Unknown", "confidence": 50.0, "skills": [], "secondary_domains": [], "extracted_text_length": len(text or ""), "processed_text_length": len(self.clean_text(text or ""))}
            
        best_domain = sorted_domains[0][0]
        best_score = sorted_domains[0][1]
        primary_confidence = float(min(95.0, max(60.0, (best_score / max(1, total)) * 100.0)))
        
        secondary_domains = []
        if len(sorted_domains) > 1:
            second_domain = sorted_domains[1][0]
            second_score = sorted_domains[1][1]
            if total > 0 and (second_score / total) >= 0.20:
                sec_conf = float(min(85.0, max(40.0, (second_score / total) * 100.0)))
                secondary_domains.append({"domain": second_domain, "confidence": sec_conf})

        return {
            "domain": best_domain, 
            "confidence": primary_confidence, 
            "skills": self._get_skills_for_domain(best_domain),
            "secondary_domains": secondary_domains,
            "extracted_text_length": len(text or ""), 
            "processed_text_length": len(self.clean_text(text or ""))
        }

    def _get_skills_for_domain(self, domain: str) -> List[str]:
        mapping = {
            "Data Science": ["pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "machine learning"],
            "Backend": ["django", "flask", "sqlalchemy", "rest api", "nodejs", "fastapi"],
            "Frontend": ["react", "angular", "vue", "html", "css", "javascript", "typescript"],
            "DevOps": ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd"],
            "Linux Administrator": ["linux", "bash scripting", "networking", "server administration", "apache/nginx", "troubleshooting"]
        }
        return mapping.get(domain, [])

    def predict_domain(self, file_content: Any, filename: str = "") -> Dict[str, Any]:
        text = ""
        ext = (filename or "").lower().split('.')[-1] if filename else ""
        try:
            if isinstance(file_content, (bytes, bytearray)):
                if ext in ("pdf",):
                    text = self.extract_text_from_pdf(bytes(file_content))
                elif ext in ("docx", "doc"):
                    text = self.extract_text_from_docx(bytes(file_content))
                else:
                    try:
                        text = file_content.decode('utf-8', errors='ignore')
                    except Exception:
                        text = str(file_content)
            else:
                text = str(file_content or "")
        except Exception:
            text = str(file_content or "")
            
        if not text:
            return {"domain": "Unknown", "confidence": 50.0, "skills": [], "secondary_domains": [], "model_used": False}

        if not self._is_valid_resume(text):
            print("⚠️ Document rejected: Not a valid resume.")
            return {
                "error": "The uploaded file does not appear to be a resume. Please upload a document containing standard resume sections (e.g., Experience, Education, Skills)."
            }
                    
        processed = self.clean_text(text)
        
        if self.model and self.vectorizer:
            try:
                X = self.vectorizer.transform([processed])
                
                if hasattr(self.model, "predict_proba"):
                    probs = self.model.predict_proba(X)[0]
                    classes = self.model.classes_
                    
                    domain_probs = sorted(zip(classes, probs), key=lambda x: x[1], reverse=True)
                    primary_domain = str(domain_probs[0][0])
                    primary_conf = float(round(domain_probs[0][1] * 100, 2))
                    
                    secondary_domains = []
                    if len(domain_probs) > 1:
                        sec_domain = str(domain_probs[1][0])
                        sec_conf = float(round(domain_probs[1][1] * 100, 2))
                        if sec_conf >= 20.0:
                            secondary_domains.append({"domain": sec_domain, "confidence": sec_conf})

                    if primary_conf > 50.0:
                        return {
                            "domain": primary_domain, 
                            "confidence": primary_conf, 
                            "skills": self._get_skills_for_domain(primary_domain),
                            "secondary_domains": secondary_domains,
                            "extracted_text_length": len(text), 
                            "processed_text_length": len(processed),
                            "model_used": True
                        }
                    else:
                        print(f"⚠️ ML Confidence too low ({primary_conf}%). Falling back to keyword search.")
                else:
                    pred = self.model.predict(X)[0]
                    return {"domain": str(pred), "confidence": 85.0, "skills": self._get_skills_for_domain(str(pred)), "secondary_domains": [], "model_used": True}
                    
            except Exception as e:
                print(f"[WARN] ML model prediction failed, falling back to heuristic: {e}")

        fallback = self._heuristic_predict_from_text(text)
        fallback["model_used"] = False
        return fallback


class PlagiarismChecker:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()

    def check(self, text: str, corpus: List[str]) -> Dict[str, Any]:
        if not text or not corpus:
            return {"plagiarized": False, "similarity_score": 0.0}
            
        try:
            docs = [text] + corpus
            tfidf = self.vectorizer.fit_transform(docs)
            sims = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()
            max_sim = float(sims.max()) if len(sims) > 0 else 0.0
            return {"plagiarized": max_sim > 0.7, "similarity_score": float(round(max_sim, 2))}
        except Exception as e:
            print(f"[WARN] Plagiarism check failed: {e}")
            return {"plagiarized": False, "similarity_score": 0.0}


class ResumeImprover:
    def improve(self, text: str) -> str:
        suggestions = []
        text_lower = text.lower()
        if "team" not in text_lower:
            suggestions.append("Highlight teamwork and collaboration experience.")
        if "project" not in text_lower:
            suggestions.append("Add details about specific projects you worked on.")
        if "achievement" not in text_lower:
            suggestions.append("Include measurable achievements to strengthen impact.")
            
        improved = (text + "\n\nSuggestions:\n- " + "\n- ".join(suggestions)) if suggestions else text
        return improved
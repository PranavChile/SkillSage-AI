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
except Exception:
    PyPDF2 = None

try:
    import pdfplumber
except Exception:
    pdfplumber = None

try:
    from pdf2image import convert_from_bytes
    import pytesseract
except Exception:
    convert_from_bytes = None
    pytesseract = None

try:
    import docx
except Exception:
    docx = None

from nltk.corpus import stopwords

# Ensure NLTK stopwords available
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    try:
        nltk.download('stopwords')
    except Exception:
        pass


class ResumeAnalyzer:
    def __init__(self,
                 model_path: str = "public/models/domain_classifier.pkl",
                 vectorizer_path: str = "public/models/tfidf_vectorizer.pkl"):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.model_path = model_path if os.path.isabs(model_path) else os.path.join(base_dir, model_path)
        self.vectorizer_path = vectorizer_path if os.path.isabs(vectorizer_path) else os.path.join(base_dir, vectorizer_path)

        self.model = None
        self.vectorizer = None

        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
            if os.path.exists(self.vectorizer_path):
                self.vectorizer = joblib.load(self.vectorizer_path)
        except Exception as e:
            print(f"❌ Error loading artifacts: {e}")
            self.model = None
            self.vectorizer = None

        try:
            self.stopwords = set(stopwords.words('english'))
        except Exception:
            self.stopwords = set()

    def extract_text_from_pdf(self, file_bytes: bytes) -> str:
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
            if pdfplumber:
                with pdfplumber.open(BytesIO(file_bytes)) as pdf:
                    pages = [p.extract_text() or "" for p in pdf.pages]
                    text = "\n".join(pages).strip()
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

    def _heuristic_predict_from_text(self, text: str) -> Dict[str, Any]:
        domain_keywords = {
            "Data Science": ["machine learning", "scikit-learn", "pandas", "numpy", "tensorflow", "pytorch"],
            "Backend": ["django", "flask", "sqlalchemy", "rest api", "nodejs", "fastapi"],
            "Frontend": ["react", "angular", "vue", "html", "css", "javascript", "typescript"],
            "DevOps": ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd"],
        }
        text_lower = (text or "").lower()
        scores = {domain: sum(len(re.findall(r'\b' + re.escape(kw) + r'\b', text_lower)) for kw in keywords)
                  for domain, keywords in domain_keywords.items()}
        best_domain = max(scores, key=lambda k: scores[k])
        best_score = scores.get(best_domain, 0)
        total = sum(scores.values())
        if best_score == 0:
            return {"domain": "Unknown", "confidence": 50.0, "skills": [], "extracted_text_length": len(text or ""),
                    "processed_text_length": len(self.clean_text(text or "")), "matched_keywords": 0}
        confidence = float(min(95, max(60, int((best_score / max(1, total)) * 100))))
        return {"domain": best_domain, "confidence": confidence, "skills": self._get_skills_for_domain(best_domain),
                "extracted_text_length": len(text or ""), "processed_text_length": len(self.clean_text(text or "")),
                "matched_keywords": best_score}

    def _get_skills_for_domain(self, domain: str) -> List[str]:
        mapping = {
            "Data Science": ["pandas", "numpy", "scikit-learn", "tensorflow"],
            "Backend": ["django", "flask", "fastapi", "sql"],
            "Frontend": ["react", "vue", "javascript", "css"],
            "DevOps": ["docker", "kubernetes", "aws"],
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
            return {"domain": "Unknown", "confidence": 50.0, "skills": [], "extracted_text_length": 0,
                    "processed_text_length": 0, "matched_keywords": 0}
        processed = self.clean_text(text)
        if self.model and self.vectorizer:
            try:
                X = self.vectorizer.transform([processed])
                if hasattr(self.model, "predict_proba"):
                    probs = self.model.predict_proba(X)[0]
                    max_idx = int(probs.argmax())
                    domain = self.model.classes_[max_idx] if hasattr(self.model, "classes_") else str(self.model.predict(X)[0])
                    confidence = float(round(probs.max() * 100, 2))
                else:
                    pred = self.model.predict(X)[0]
                    domain = pred
                    confidence = 85.0
                return {"domain": domain, "confidence": confidence, "skills": self._get_skills_for_domain(domain),
                        "extracted_text_length": len(text), "processed_text_length": len(processed), "matched_keywords": 0}
            except Exception:
                pass
        return self._heuristic_predict_from_text(text)


class PlagiarismChecker:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()

    def check(self, text: str, corpus: List[str]) -> Dict[str, Any]:
        """Compare text against a corpus and return similarity scores."""
        docs = [text] + corpus
        tfidf = self.vectorizer.fit_transform(docs)
        sims = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()
        max_sim = sims.max() if len(sims) > 0 else 0.0
        return {"plagiarized": max_sim > 0.7, "similarity_score": float(round(max_sim, 2))}


class ResumeImprover:
    def improve(self, text: str) -> str:
        """Provide simple improvement suggestions."""
        suggestions = []
        if "team" not in text.lower():
            suggestions.append("Highlight teamwork and collaboration experience.")
        if "project" not in text.lower():
            suggestions.append("Add details about specific projects you worked on.")
        if "achievement" not in text.lower():
            suggestions.append("Include measurable achievements to strengthen impact.")
        improved = text + "\n\nSuggestions:\n- " + "\n- ".join(suggestions) if suggestions else text

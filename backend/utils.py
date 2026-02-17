import re
import os
import mimetypes
from pathlib import Path
from typing import Dict, List, Optional, Union
import pandas as pd
import numpy as np
from datetime import datetime
import json

class FileHandler:
    """Utility class for handling file operations"""
    
    SUPPORTED_EXTENSIONS = {
        'pdf': 'application/pdf',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'doc': 'application/msword',
        'txt': 'text/plain',
        'rtf': 'application/rtf'
    }
    
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    
    @staticmethod
    def validate_file(filename: str, file_content: bytes) -> Dict[str, Union[bool, str]]:
        """Validate uploaded file"""
        
        # Check file size
        if len(file_content) > FileHandler.MAX_FILE_SIZE:
            return {
                "valid": False,
                "error": f"File size exceeds {FileHandler.MAX_FILE_SIZE // (1024*1024)}MB limit"
            }
        
        # Check file extension
        file_extension = filename.lower().split('.')[-1]
        if file_extension not in FileHandler.SUPPORTED_EXTENSIONS:
            return {
                "valid": False, 
                "error": f"Unsupported file format. Supported: {', '.join(FileHandler.SUPPORTED_EXTENSIONS.keys())}"
            }
        
        # Check if file is not empty
        if len(file_content) == 0:
            return {
                "valid": False,
                "error": "File is empty"
            }
        
        return {
            "valid": True,
            "extension": file_extension,
            "size": len(file_content),
            "mime_type": FileHandler.SUPPORTED_EXTENSIONS[file_extension]
        }

class TextProcessor:
    """Utility class for text processing operations"""
    
    @staticmethod
    def extract_contact_info(text: str) -> Dict[str, Optional[str]]:
        """Extract contact information from resume text"""
        contact_info = {
            "email": None,
            "phone": None,
            "linkedin": None,
            "github": None
        }
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            contact_info["email"] = email_match.group()
        
        # Extract phone number
        phone_patterns = [
            r'\b\d{3}-\d{3}-\d{4}\b',  # 123-456-7890
            r'\b\(\d{3}\)\s*\d{3}-\d{4}\b',  # (123) 456-7890
            r'\b\d{10}\b',  # 1234567890
            r'\b\d{3}\.\d{3}\.\d{4}\b'  # 123.456.7890
        ]
        
        for pattern in phone_patterns:
            phone_match = re.search(pattern, text)
            if phone_match:
                contact_info["phone"] = phone_match.group()
                break
        
        # Extract LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin_match = re.search(linkedin_pattern, text, re.IGNORECASE)
        if linkedin_match:
            contact_info["linkedin"] = linkedin_match.group()
        
        # Extract GitHub
        github_pattern = r'github\.com/[\w-]+'
        github_match = re.search(github_pattern, text, re.IGNORECASE)
        if github_match:
            contact_info["github"] = github_match.group()
        
        return contact_info
    
    @staticmethod
    def extract_education(text: str) -> List[Dict[str, str]]:
        """Extract education information from resume text"""
        education_keywords = [
            r'\b(bachelor|b\.?[sa]\.?|master|m\.?[sa]\.?|phd|doctorate|diploma)\b',
            r'\b(university|college|institute|school)\b',
            r'\b(computer science|engineering|business|marketing|finance|biology|chemistry|physics|mathematics)\b'
        ]
        
        education_sections = []
        
        # Look for education section
        education_section_pattern = r'education.*?(?=\n\n|\n[A-Z]|\n\s*$)'
        education_match = re.search(education_section_pattern, text, re.IGNORECASE | re.DOTALL)
        
        if education_match:
            education_text = education_match.group()
            
            # Extract degree information
            degree_patterns = [
                r'(bachelor|master|phd|doctorate).*?(?=\n|$)',
                r'b\.?[sa]\.?.*?(?=\n|$)',
                r'm\.?[sa]\.?.*?(?=\n|$)'
            ]
            
            for pattern in degree_patterns:
                matches = re.finditer(pattern, education_text, re.IGNORECASE)
                for match in matches:
                    education_sections.append({
                        "degree": match.group().strip(),
                        "institution": "Not specified",
                        "year": "Not specified"
                    })
        
        return education_sections
    
    @staticmethod
    def extract_experience_years(text: str) -> Optional[int]:
        """Extract years of experience from resume text"""
        experience_patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'experience.*?(\d+)\+?\s*years?',
            r'(\d+)\+?\s*yrs?\s+experience'
        ]
        
        for pattern in experience_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return int(match.group(1))
        
        return None
    
    @staticmethod
    def calculate_readability_score(text: str) -> Dict[str, Union[int, str]]:
        """Calculate readability metrics for resume text.
        Uses textstat when available for robust Flesch scores and grade level.
        Falls back to a simple heuristic if textstat is not installed.
        """
        if not text or not text.strip():
            return {"score": 0, "level": "Poor", "grade_level": "N/A"}

        try:
            import textstat
            # Flesch Reading Ease: higher is easier (0-100+)
            flesch_score = textstat.flesch_reading_ease(text)
            # Flesch-Kincaid Grade Level: lower is easier (approx grade level)
            fk_grade = textstat.flesch_kincaid_grade(text)

            # Normalize flesch_score to 0-100 and determine level
            score = max(0, min(100, round(flesch_score)))
            if score >= 80:
                level = "Excellent"
            elif score >= 60:
                level = "Good"
            elif score >= 40:
                level = "Average"
            else:
                level = "Needs Improvement"

            # Grade level may be a float; round for display and return as string to match frontend types
            grade_level = round(fk_grade, 1) if isinstance(fk_grade, (int, float)) else "N/A"
            grade_level = str(grade_level)

            # Word/sentence counts
            sentences = len(re.findall(r'[.!?]+', text))
            words = len(text.split())

            return {
                "score": score,
                "level": level,
                "grade_level": grade_level,
                "word_count": words,
                "sentence_count": sentences
            }
        except Exception:
            # Fallback heuristic (previous simple method but improved syllable approx)
            sentences = len(re.findall(r'[.!?]+', text))
            words = len(text.split())
            characters = len(text.replace(' ', ''))

            if sentences == 0 or words == 0:
                return {"score": 0, "level": "Poor", "grade_level": "N/A"}

            avg_sentence_length = words / sentences
            # naive syllable estimation: count vowel groups per word
            syllables = sum(len(re.findall(r'[aeiouy]+', w.lower())) for w in text.split())
            avg_syllables_per_word = syllables / max(1, words)

            score = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables_per_word)
            score = max(0, min(100, score))

            if score >= 80:
                level = "Excellent"
            elif score >= 60:
                level = "Good"
            elif score >= 40:
                level = "Average"
            else:
                level = "Needs Improvement"

            # approximate grade level using Flesch-Kincaid formula
            fk_grade = 0.39 * avg_sentence_length + 11.8 * avg_syllables_per_word - 15.59
            grade_level = round(fk_grade, 1)
            grade_level = str(grade_level)

            return {
                "score": round(score),
                "level": level,
                "grade_level": grade_level,
                "word_count": words,
                "sentence_count": sentences
            }

class ResponseFormatter:
    """Utility class for formatting API responses"""
    
    @staticmethod
    def format_analysis_response(analysis_result: Dict, 
                               contact_info: Dict = None, 
                               readability: Dict = None) -> Dict:
        """Format complete analysis response"""
        
        response = {
            "timestamp": datetime.now().isoformat(),
            "status": "success",
            "data": {
                "classification": analysis_result,
                "metadata": {
                    "processed_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            }
        }
        
        if contact_info:
            response["data"]["contact_info"] = contact_info
        
        if readability:
            response["data"]["readability"] = readability
            
        return response
    
    @staticmethod
    def format_error_response(error_message: str, error_code: str = "PROCESSING_ERROR") -> Dict:
        """Format error response"""
        return {
            "timestamp": datetime.now().isoformat(),
            "status": "error", 
            "error": {
                "code": error_code,
                "message": error_message
            }
        }
    
    @staticmethod
    def format_improvement_response(suggestions: List[Dict], 
                                  overall_score: int,
                                  analysis_details: Dict = None) -> Dict:
        """Format improvement suggestions response"""
        return {
            "timestamp": datetime.now().isoformat(),
            "status": "success",
            "data": {
                "overall_score": overall_score,
                "total_suggestions": len(suggestions),
                "suggestions": suggestions,
                "analysis_details": analysis_details or {}
            }
        }

class CompanyMatcher:
    """Utility class for matching resumes to companies"""
    
    def __init__(self):
        self.company_database = self._load_company_database()
    
    def _load_company_database(self) -> Dict[str, List[Dict]]:
        """Load company database (in production, this would be from a real database)"""
        return {
            "Software Engineering": [
                {
                    "name": "Google",
                    "location": "Mountain View, CA",
                    "size": "Large (100,000+ employees)",
                    "industry": "Technology",
                    "hiring_focus": ["Python", "Java", "Go", "Machine Learning"],
                    "application_url": "https://careers.google.com"
                },
                {
                    "name": "Microsoft", 
                    "location": "Redmond, WA",
                    "size": "Large (200,000+ employees)",
                    "industry": "Technology",
                    "hiring_focus": ["C#", ".NET", "Azure", "AI"],
                    "application_url": "https://careers.microsoft.com"
                },
                {
                    "name": "Meta",
                    "location": "Menlo Park, CA", 
                    "size": "Large (70,000+ employees)",
                    "industry": "Social Media",
                    "hiring_focus": ["React", "JavaScript", "Python", "Mobile Development"],
                    "application_url": "https://www.metacareers.com"
                }
            ],
            "Data Science": [
                {
                    "name": "Netflix",
                    "location": "Los Gatos, CA",
                    "size": "Large (15,000+ employees)", 
                    "industry": "Entertainment/Streaming",
                    "hiring_focus": ["Python", "R", "Machine Learning", "Big Data"],
                    "application_url": "https://jobs.netflix.com"
                },
                {
                    "name": "Spotify",
                    "location": "Stockholm, Sweden",
                    "size": "Medium (6,000+ employees)",
                    "industry": "Music/Streaming",
                    "hiring_focus": ["Python", "Scala", "Machine Learning", "Analytics"],
                    "application_url": "https://www.lifeatspotify.com"
                }
            ],
            "Marketing": [
                {
                    "name": "HubSpot",
                    "location": "Cambridge, MA",
                    "size": "Medium (5,000+ employees)",
                    "industry": "Marketing Technology",
                    "hiring_focus": ["Digital Marketing", "Content Strategy", "SEO", "Analytics"],
                    "application_url": "https://www.hubspot.com/careers"
                }
            ]
        }
    
    def get_matching_companies(self, domain: str, skills: List[str] = None) -> List[Dict]:
        """Get companies that match the domain and skills"""
        companies = self.company_database.get(domain, [])
        
        if skills:
            # Score companies based on skill matches
            for company in companies:
                matching_skills = set(skills).intersection(set(company.get("hiring_focus", [])))
                company["skill_match_score"] = len(matching_skills)
                company["matching_skills"] = list(matching_skills)
            
            # Sort by skill match score
            companies.sort(key=lambda x: x.get("skill_match_score", 0), reverse=True)
        
        return companies

class Logger:
    """Simple logging utility"""
    
    @staticmethod
    def log_analysis(filename: str, domain: str, confidence: float, processing_time: float):
        """Log analysis results"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "filename": filename,
            "domain": domain,
            "confidence": confidence,
            "processing_time_seconds": processing_time
        }
        
        # In production, this would write to a proper logging system
        print(f"[ANALYSIS] {json.dumps(log_entry, indent=2)}")
    
    @staticmethod
    def log_error(error_message: str, context: Dict = None):
        """Log error with context"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "level": "ERROR",
            "message": error_message,
            "context": context or {}
        }
        
        print(f"[ERROR] {json.dumps(log_entry, indent=2)}")

# Utility functions
def clean_filename(filename: str) -> str:
    """Clean filename for safe storage"""
    # Remove or replace unsafe characters
    cleaned = re.sub(r'[<>:"/\\|?*]', '', filename)
    cleaned = cleaned.strip()
    
    # Ensure filename isn't too long
    if len(cleaned) > 100:
        name, ext = os.path.splitext(cleaned)
        cleaned = name[:95] + ext
    
    return cleaned

def generate_unique_filename(base_filename: str, directory: str = "uploads") -> str:
    """Generate unique filename to prevent conflicts"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    name, ext = os.path.splitext(base_filename)
    return f"{name}_{timestamp}{ext}"

def bytes_to_human_readable(size_bytes: int) -> str:
    """Convert bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"
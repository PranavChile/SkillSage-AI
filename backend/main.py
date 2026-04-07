# ==============================================================================
# Copyright (c) 2026 SkillSage AI. All Rights Reserved.
#
# This file is part of the SkillSage AI Resume Analyzer project.
# Unauthorized copying of this file, via any medium is strictly prohibited.
# Proprietary and confidential.
#
# Authors: Pranav Chile, Madhura Chavekar, Lajim Mulla, Yash Yargaonkar
# ==============================================================================
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import time
from pathlib import Path
import os

# Import our custom modules
try:
    from .models import ResumeAnalyzer, PlagiarismChecker, ResumeImprover
    from .utils import (
        FileHandler, TextProcessor, ResponseFormatter,
        CompanyMatcher, Logger
    )
except Exception:
    from models import ResumeAnalyzer, PlagiarismChecker, ResumeImprover
    from utils import (
        FileHandler, TextProcessor, ResponseFormatter,
        CompanyMatcher, Logger
    )

# Initialize FastAPI app
app = FastAPI(
    title="Resume Analyzer API",
    description="AI-powered resume analysis, improvement suggestions, and company matching",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8081",
        "*" # Catch-all for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzers
resume_analyzer = ResumeAnalyzer()
plagiarism_checker = PlagiarismChecker()
resume_improver = ResumeImprover()
company_matcher = CompanyMatcher()

# ----------------- Pydantic Response Models -----------------
class SecondaryDomain(BaseModel):
    domain: str
    confidence: float

class AnalysisResponse(BaseModel):
    domain: str
    confidence: float
    skills: List[str]
    secondary_domains: Optional[List[SecondaryDomain]] = []
    contact_info: Optional[Dict[str, str]] = None
    readability: Optional[Dict[str, Any]] = None
    processing_time: Optional[float] = None

class ImprovementResponse(BaseModel):
    overall_score: int
    suggestions: List[Dict[str, Any]]
    categories_analyzed: List[str]

class PlagiarismResponse(BaseModel):
    overall_score: float
    matches: List[Dict[str, Any]]
    total_matches: int
    recommendations: List[str]

class CompanyResponse(BaseModel):
    companies: List[Dict[str, Any]]
    total_count: int
    domain: str

# ----------------- Endpoints -----------------

@app.get("/")
async def root():
    return {
        "message": "Resume Analyzer API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "analyze": "/api/analyze-resume",
            "improve": "/api/improve-resume",
            "plagiarism": "/api/check-plagiarism",
            "companies": "/api/companies/{domain}",
            "domains": "/api/domains",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "models_loaded": {
            "resume_analyzer": resume_analyzer.model is not None,
            "plagiarism_checker": True,
            "resume_improver": True
        }
    }

@app.post("/api/analyze-resume", response_model=AnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    start_time = time.time()
    try:
        # Validate file
        file_content = await file.read()
        validation_result = FileHandler.validate_file(file.filename, file_content)

        if not validation_result["valid"]:
            raise HTTPException(status_code=400, detail=validation_result["error"])

        # Analyze resume
        analysis_result = resume_analyzer.predict_domain(file_content, file.filename)
        print("[DEBUG] analyze_resume -> analysis_result:", analysis_result)

        if "error" in analysis_result:
            raise HTTPException(status_code=422, detail=analysis_result["error"])

        # Extract info from the parsed text
        parsed_text = ""
        ext = (file.filename or "").lower().split('.')[-1]
        if ext in ("pdf",):
            parsed_text = resume_analyzer.extract_text_from_pdf(file_content)
        elif ext in ("docx", "doc"):
            parsed_text = resume_analyzer.extract_text_from_docx(file_content)
        else:
            try:
                parsed_text = file_content.decode('utf-8', errors='ignore')
            except Exception:
                parsed_text = str(file_content)

        contact_info = TextProcessor.extract_contact_info(parsed_text)
        contact_info = {k: (v if v is not None else "") for k, v in contact_info.items()}
        readability = TextProcessor.calculate_readability_score(parsed_text)

        processing_time = time.time() - start_time

        return AnalysisResponse(
            domain=analysis_result["domain"],
            confidence=analysis_result["confidence"],
            skills=analysis_result["skills"],
            secondary_domains=analysis_result.get("secondary_domains", []),
            contact_info=contact_info,
            readability=readability,
            processing_time=processing_time
        )

    except HTTPException:
        raise
    except Exception as e:
        Logger.log_error(f"Analysis failed: {str(e)}", {"filename": file.filename})
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/improve-resume", response_model=ImprovementResponse)
async def improve_resume(file: UploadFile = File(...), domain: Optional[str] = None):
    try:
        file_content = await file.read()
        validation_result = FileHandler.validate_file(file.filename, file_content)

        if not validation_result["valid"]:
            raise HTTPException(status_code=400, detail=validation_result["error"])

        file_ext = validation_result.get("extension", "txt")
        if file_ext == 'pdf':
            text = resume_analyzer.extract_text_from_pdf(file_content)
        elif file_ext in ['docx', 'doc']:
            text = resume_analyzer.extract_text_from_docx(file_content)
        elif file_ext == 'txt':
            text = file_content.decode('utf-8', errors='ignore')
        else:
            text = ''

        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from uploaded file")

        improvement_text = resume_improver.improve(text)
        suggestion_lines = [line.replace("- ", "").strip() for line in improvement_text.split("\n") if line.strip().startswith("-")]
        
        formatted_suggestions = [{"issue": "Missing Keyword/Context", "suggestion": s, "impact": "High"} for s in suggestion_lines]
        if not formatted_suggestions:
            formatted_suggestions = [{"issue": "General", "suggestion": "Your resume structure looks solid. Ensure you quantify your achievements.", "impact": "Medium"}]

        return ImprovementResponse(
            overall_score=85,
            suggestions=formatted_suggestions,
            categories_analyzed=["Content", "Keywords", "Impact"]
        )

    except HTTPException:
        raise
    except Exception as e:
        Logger.log_error(f"Improvement analysis failed: {str(e)}", {"filename": file.filename})
        raise HTTPException(status_code=500, detail=f"Improvement analysis failed: {str(e)}")

@app.post("/api/check-plagiarism", response_model=PlagiarismResponse)
async def check_plagiarism(file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        validation_result = FileHandler.validate_file(file.filename, file_content)

        if not validation_result["valid"]:
            raise HTTPException(status_code=400, detail=validation_result["error"])

        file_ext = validation_result.get("extension", "txt")
        extracted_text = ""

        try:
            if file_ext == 'pdf':
                from PyPDF2 import PdfReader
                from io import BytesIO
                reader = PdfReader(BytesIO(file_content))
                pages = [p.extract_text() or "" for p in reader.pages]
                extracted_text = "\n".join(pages)
            elif file_ext in ['docx', 'doc']:
                import docx
                from io import BytesIO
                doc = docx.Document(BytesIO(file_content))
                extracted_text = "\n".join([para.text for para in doc.paragraphs])
            else:
                extracted_text = file_content.decode('utf-8', errors='ignore')
        except Exception as te:
            Logger.log_error(f"Text extraction failed: {te}", {"filename": file.filename})
            extracted_text = file_content.decode('utf-8', errors='ignore')

        plagiarism_result = plagiarism_checker.check(extracted_text, corpus=[])

        return PlagiarismResponse(
            overall_score=plagiarism_result["similarity_score"] * 100, 
            matches=[{"source": "Internal Database", "similarity": plagiarism_result["similarity_score"]}] if plagiarism_result["plagiarized"] else [],
            total_matches=1 if plagiarism_result["plagiarized"] else 0,
            recommendations=["Consider rewriting matched sections in your own words."] if plagiarism_result["plagiarized"] else ["No significant plagiarism detected."]
        )

    except HTTPException:
        raise
    except Exception as e:
        Logger.log_error(f"Plagiarism check failed: {str(e)}", {"filename": file.filename})
        raise HTTPException(status_code=500, detail=f"Plagiarism check failed: {str(e)}")

@app.get("/api/companies/{domain}", response_model=CompanyResponse)
async def get_companies_by_domain(domain: str, limit: Optional[int] = 10):
    try:
        companies = company_matcher.get_matching_companies(domain)

        if limit:
            companies = companies[:limit]

        return CompanyResponse(
            companies=companies,
            total_count=len(companies),
            domain=domain
        )

    except Exception as e:
        Logger.log_error(f"Company matching failed: {str(e)}", {"domain": domain})
        raise HTTPException(status_code=500, detail=f"Company matching failed: {str(e)}")

@app.get("/api/domains")
async def get_available_domains():
    return {
        "domains": [
            "Software Engineering",
            "Data Science",
            "Marketing",
            "Finance",
            "Healthcare",
            "Education",
            "Linux Administrator"
        ]
    }

# ----------------- Exception Handlers -----------------

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=ResponseFormatter.format_error_response(exc.detail, "HTTP_ERROR")
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    Logger.log_error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=ResponseFormatter.format_error_response("Internal server error", "INTERNAL_ERROR")
    )

# ----------------- Startup & Shutdown -----------------
@app.on_event("startup")
async def startup_event():
    print("🚀 Resume Analyzer API started successfully!")
    print("📊 Models loaded:", {
        "resume_analyzer": resume_analyzer.model is not None,
        "plagiarism_checker": True,
        "resume_improver": True
    })

@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 Resume Analyzer API shutting down...")

# ----------------- Run -----------------
if __name__ == "__main__":
    import uvicorn
    Path("uploads").mkdir(exist_ok=True)
    Path("models").mkdir(exist_ok=True)

    print("🔥 Starting Resume Analyzer API...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
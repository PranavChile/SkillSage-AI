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
    # When running as a package
    from .models import ResumeAnalyzer, PlagiarismChecker, ResumeImprover
    from .utils import (
        FileHandler, TextProcessor, ResponseFormatter,
        CompanyMatcher, Logger
    )
except Exception:
    # When running from inside the backend folder (uvicorn reload may change CWD)
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
        "http://localhost:5173"
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
class AnalysisResponse(BaseModel):
    domain: str
    confidence: float
    skills: List[str]
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

        if "error" in analysis_result:
            raise HTTPException(status_code=422, detail=analysis_result["error"])

        # Extract info (demo mode)
        sample_text = "Sample resume text for demonstration"
        contact_info = TextProcessor.extract_contact_info(sample_text)
        # Normalize contact info values to strings to satisfy response model
        contact_info = {k: (v if v is not None else "") for k, v in contact_info.items()}
        readability = TextProcessor.calculate_readability_score(sample_text)

        processing_time = time.time() - start_time

        return AnalysisResponse(
            domain=analysis_result["domain"],
            confidence=analysis_result["confidence"],
            skills=analysis_result["skills"],
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

        # Demo text
        sample_text = """
        John Doe
        Software Developer
        I am a results-driven professional with excellent communication skills.
        I work well under pressure and am a team player.
        """

        if domain is None:
            domain = "Software Engineering"

        improvement_result = resume_improver.analyze_resume(sample_text, domain)

        if "error" in improvement_result:
            raise HTTPException(status_code=422, detail=improvement_result["error"])

        return ImprovementResponse(
            overall_score=improvement_result["overall_score"],
            suggestions=improvement_result["suggestions"],
            categories_analyzed=improvement_result["categories_analyzed"]
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

        # Extract text from uploaded file based on extension
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
                # Plain text fallback (txt/rtf/unknown)
                extracted_text = file_content.decode('utf-8', errors='ignore')
        except Exception as te:
            # If extraction fails, fall back to raw decoded text
            Logger.log_error(f"Text extraction failed: {te}", {"filename": file.filename})
            extracted_text = file_content.decode('utf-8', errors='ignore')

        plagiarism_result = plagiarism_checker.check_plagiarism(extracted_text)

        if "error" in plagiarism_result:
            raise HTTPException(status_code=422, detail=plagiarism_result["error"])

        return PlagiarismResponse(
            overall_score=plagiarism_result["overall_score"],
            matches=plagiarism_result["matches"],
            total_matches=plagiarism_result["total_matches"],
            recommendations=plagiarism_result["recommendations"]
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
            "Education"
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
    Path("models").mkdir(exist_ok=True)  # Ensure models folder exists

    print("🔥 Starting Resume Analyzer API...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")

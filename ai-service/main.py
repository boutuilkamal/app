from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Health Coaching Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AI Health Coaching Service",
        "version": "1.0.0"
    }

# ===== GENETIC REPORT PROCESSING =====

class GeneticAnalysisRequest(BaseModel):
    file_type: str
    content: Optional[str] = None

class GeneResult(BaseModel):
    gene_symbol: str
    variant: str
    risk_level: str

class GeneticAnalysisResponse(BaseModel):
    overall_score: float
    strengths: List[str]
    risks: List[str]
    gene_results: List[GeneResult]
    summary: str

@app.post("/api/v1/analyze/genetic", response_model=GeneticAnalysisResponse)
async def analyze_genetic_report(file: UploadFile = File(...)):
    """
    Analyze genetic report from PDF/CSV/TXT/Image
    Extract gene variants and provide risk analysis
    """
    try:
        content = await file.read()

        # OCR processing for images/PDFs
        extracted_text = await extract_text_from_file(content, file.content_type)

        # AI-powered gene extraction
        gene_results = await extract_gene_variants(extracted_text)

        # Calculate overall score and generate summary
        analysis = await generate_genetic_analysis(gene_results)

        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== BLOOD BIOMARKER PROCESSING =====

class BiomarkerResult(BaseModel):
    name: str
    value: float
    unit: str
    risk_level: str

class BloodAnalysisResponse(BaseModel):
    overall_score: float
    optimal_count: int
    borderline_count: int
    critical_count: int
    biomarker_results: List[BiomarkerResult]
    summary: str

@app.post("/api/v1/analyze/blood", response_model=BloodAnalysisResponse)
async def analyze_blood_report(file: UploadFile = File(...)):
    """
    Analyze blood test report from PDF/CSV/Image
    Extract biomarker values and provide risk analysis
    """
    try:
        content = await file.read()

        # OCR processing
        extracted_text = await extract_text_from_file(content, file.content_type)

        # AI-powered biomarker extraction
        biomarker_results = await extract_biomarker_values(extracted_text)

        # Calculate overall analysis
        analysis = await generate_blood_analysis(biomarker_results)

        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== AI COACHING =====

class AICoachRequest(BaseModel):
    user_id: str
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = []
    user_data: Optional[Dict[str, Any]] = None

class AICoachResponse(BaseModel):
    message: str
    suggestions: Optional[List[str]] = []

@app.post("/api/v1/ai-coach/chat", response_model=AICoachResponse)
async def ai_coach_chat(request: AICoachRequest):
    """
    AI Coach conversational interface
    Provides personalized advice based on genetic and blood data
    """
    try:
        response = await generate_ai_coach_response(
            request.message,
            request.conversation_history,
            request.user_data
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== PROGRAM GENERATION =====

class ProgramGenerationRequest(BaseModel):
    user_id: str
    program_type: str  # fitness, nutrition, supplement
    genetic_data: Optional[Dict[str, Any]] = None
    biomarker_data: Optional[Dict[str, Any]] = None
    preferences: Optional[Dict[str, Any]] = None

class ProgramGenerationResponse(BaseModel):
    program: Dict[str, Any]
    rationale: str

@app.post("/api/v1/generate/program", response_model=ProgramGenerationResponse)
async def generate_personalized_program(request: ProgramGenerationRequest):
    """
    Generate AI-powered personalized program
    Based on genetic and biomarker data
    """
    try:
        program = await ai_generate_program(
            request.program_type,
            request.genetic_data,
            request.biomarker_data,
            request.preferences
        )
        return program
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== UTILITY FUNCTIONS =====

async def extract_text_from_file(content: bytes, content_type: str) -> str:
    """Extract text from PDF, Image, or text file using OCR"""
    # Implementation would use pytesseract for images, PyPDF2 for PDFs
    # For now, returning placeholder
    return "Extracted text from file"

async def extract_gene_variants(text: str) -> List[GeneResult]:
    """Use AI to extract gene variants from text"""
    # Implementation would use OpenAI API to parse genetic data
    return []

async def generate_genetic_analysis(gene_results: List[GeneResult]) -> GeneticAnalysisResponse:
    """Generate comprehensive genetic analysis"""
    return GeneticAnalysisResponse(
        overall_score=0.0,
        strengths=[],
        risks=[],
        gene_results=gene_results,
        summary="Analysis summary"
    )

async def extract_biomarker_values(text: str) -> List[BiomarkerResult]:
    """Use AI to extract biomarker values from text"""
    return []

async def generate_blood_analysis(biomarker_results: List[BiomarkerResult]) -> BloodAnalysisResponse:
    """Generate comprehensive blood analysis"""
    return BloodAnalysisResponse(
        overall_score=0.0,
        optimal_count=0,
        borderline_count=0,
        critical_count=0,
        biomarker_results=biomarker_results,
        summary="Analysis summary"
    )

async def generate_ai_coach_response(
    message: str,
    history: List[Dict[str, str]],
    user_data: Optional[Dict[str, Any]]
) -> AICoachResponse:
    """Generate AI coach response using LLM"""
    # Implementation would use OpenAI API with context
    return AICoachResponse(
        message="AI coach response",
        suggestions=[]
    )

async def ai_generate_program(
    program_type: str,
    genetic_data: Optional[Dict[str, Any]],
    biomarker_data: Optional[Dict[str, Any]],
    preferences: Optional[Dict[str, Any]]
) -> ProgramGenerationResponse:
    """Generate personalized program using AI"""
    return ProgramGenerationResponse(
        program={},
        rationale="Program generation rationale"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

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

class GeneResult(BaseModel):
    gene_symbol: str
    gene_name: Optional[str] = None
    category: Optional[str] = None
    function: Optional[str] = None
    variant: str
    risk_level: str
    variant_description: Optional[str] = None
    recommendations: Optional[List[str]] = []

class KeyInsight(BaseModel):
    type: str
    category: str
    title: str
    description: str

class TopRecommendation(BaseModel):
    priority: int
    gene: str
    category: str
    recommendation: str
    risk_level: str

class TrafficLight(BaseModel):
    green: int
    orange: int
    red: int

class CategoryScore(BaseModel):
    optimal: int
    moderate: int
    highRisk: int
    total: int
    score: float

class GeneticAnalysisResponse(BaseModel):
    overall_score: float
    total_genes_analyzed: int
    strengths: List[str]
    risks: List[str]
    key_insights: List[KeyInsight]
    top_recommendations: List[TopRecommendation]
    gene_results: List[GeneResult]
    categories: Dict[str, List[GeneResult]]
    category_scores: Dict[str, CategoryScore]
    summary: str
    traffic_light: TrafficLight

@app.post("/api/v1/analyze/genetic")
async def analyze_genetic_report(file: UploadFile = File(...)):
    """
    Analyze genetic report from PDF/CSV/TXT/Image
    Extract gene variants and provide comprehensive risk analysis
    """
    try:
        from ocr.document_processor import DocumentProcessor
        from report_generator.gene_analyzer import GeneAnalyzer

        content = await file.read()

        # Extract text from document
        processor = DocumentProcessor()
        extracted_text = await processor.extract_text(content, file.content_type)

        # Analyze genetic variants
        analyzer = GeneAnalyzer()
        analysis = await analyzer.analyze_genetic_report(extracted_text)

        return analysis
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ===== BLOOD BIOMARKER PROCESSING =====

class BiomarkerResult(BaseModel):
    name: str
    value: float
    unit: str
    risk_level: str
    category: str

class BloodAnalysisResponse(BaseModel):
    overall_score: float
    optimal_count: int
    abnormal_count: int
    biomarker_results: List[BiomarkerResult]
    summary: str

@app.post("/api/v1/analyze/blood", response_model=BloodAnalysisResponse)
async def analyze_blood_report(file: UploadFile = File(...)):
    """
    Analyze blood test report from PDF/CSV/Image
    Extract biomarker values and provide risk analysis
    """
    try:
        from ocr.document_processor import DocumentProcessor
        from report_generator.biomarker_analyzer import BiomarkerAnalyzer

        content = await file.read()

        # Extract text from document
        processor = DocumentProcessor()
        extracted_text = await processor.extract_text(content, file.content_type)

        # Analyze biomarkers
        analyzer = BiomarkerAnalyzer()
        analysis = await analyzer.analyze_blood_report(extracted_text)

        return BloodAnalysisResponse(**analysis)
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

async def generate_ai_coach_response(message: str, history: List, user_data: Dict) -> AICoachResponse:
    """Generate AI coach response"""
    # Placeholder implementation
    return AICoachResponse(
        message="I'm your AI health coach. How can I help you today?",
        suggestions=["Tell me about your health goals", "Ask about your genetic results"]
    )

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

async def ai_generate_program(program_type: str, genetic_data: Dict, biomarker_data: Dict, preferences: Dict) -> ProgramGenerationResponse:
    """Generate personalized program"""
    # Placeholder implementation
    return ProgramGenerationResponse(
        program={"type": program_type, "weeks": 12},
        rationale="Program generated based on your genetic profile"
    )

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

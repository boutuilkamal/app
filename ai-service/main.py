from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
import io
import re

import pandas as pd
from PIL import Image
import pytesseract
from PyPDF2 import PdfReader

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
    ct = (content_type or "").lower()

    # Text/CSV
    if "text" in ct or "csv" in ct:
        try:
            return content.decode("utf-8", errors="ignore")
        except Exception:
            return content.decode(errors="ignore")

    # PDF
    if "pdf" in ct:
        try:
            reader = PdfReader(io.BytesIO(content))
            parts: List[str] = []
            for page in reader.pages:
                parts.append(page.extract_text() or "")
            return "\n".join(parts)
        except Exception:
            return ""

    # Images (PNG/JPG/etc)
    if "image" in ct or any(ext in ct for ext in ["png", "jpg", "jpeg", "webp"]):
        try:
            img = Image.open(io.BytesIO(content))
            return pytesseract.image_to_string(img)
        except Exception:
            # OCR requires the system tesseract binary; return empty if unavailable.
            return ""

    # Fallback
    try:
        return content.decode("utf-8", errors="ignore")
    except Exception:
        return ""

async def extract_gene_variants(text: str) -> List[GeneResult]:
    """Use AI to extract gene variants from text"""
    # MVP deterministic extraction: SYMBOL + VARIANT (CSV-like or "SYMBOL: VAR")
    by_symbol: Dict[str, str] = {}

    # CSV-style lines
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        delim = "\t" if "\t" in line else (";" if ";" in line else ",")
        parts = [p.strip() for p in line.split(delim) if p.strip()]
        if len(parts) >= 2:
            sym = parts[0].upper()
            var = parts[1].upper()
            if re.fullmatch(r"[A-Z0-9]{2,10}", sym) and len(var) >= 2:
                by_symbol[sym] = var

    # Regex fallback
    for m in re.finditer(r"\b([A-Z0-9]{2,10})\b\s*[:\-]?\s*([A-Z0-9/]{2,12})\b", text):
        sym = m.group(1).upper()
        var = m.group(2).upper()
        if sym not in by_symbol:
            by_symbol[sym] = var

    # We don't have the full 54-gene definition set in the AI service yet,
    # so risk_level is left as "unknown" for now.
    return [GeneResult(gene_symbol=sym, variant=var, risk_level="unknown") for sym, var in sorted(by_symbol.items())]

async def generate_genetic_analysis(gene_results: List[GeneResult]) -> GeneticAnalysisResponse:
    """Generate comprehensive genetic analysis"""
    # MVP scoring: unknown risk level, so score reflects extraction completeness only.
    detected = len(gene_results)
    overall_score = float(min(100.0, (detected / 54.0) * 100.0)) if detected > 0 else 0.0
    return GeneticAnalysisResponse(
        overall_score=overall_score,
        strengths=[],
        risks=[],
        gene_results=gene_results,
        summary=f"Extracted {detected} gene variants. Connect gene definitions for full traffic-light scoring."
    )

async def extract_biomarker_values(text: str) -> List[BiomarkerResult]:
    """Use AI to extract biomarker values from text"""
    out: Dict[str, BiomarkerResult] = {}

    # CSV-style parse: NAME, VALUE, UNIT?
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        delim = "\t" if "\t" in line else (";" if ";" in line else ",")
        parts = [p.strip() for p in line.split(delim) if p.strip()]
        if len(parts) < 2:
            continue
        name = parts[0]
        raw_value = parts[1].replace(",", ".")
        try:
            value = float(raw_value)
        except Exception:
            continue
        unit = parts[2] if len(parts) >= 3 else ""
        out[name.lower()] = BiomarkerResult(name=name, value=value, unit=unit, risk_level="unknown")

    # Regex fallback: "Marker: 1.23 unit"
    for m in re.finditer(
        r"\b([A-Za-z][A-Za-z0-9\-\s()\/]+?)\b\s*[:\-]\s*([0-9]+(?:[.,][0-9]+)?)\s*([A-Za-z/%μ\^0-9.\-]+)?",
        text,
    ):
        name = m.group(1).strip()
        raw_value = (m.group(2) or "").replace(",", ".")
        try:
            value = float(raw_value)
        except Exception:
            continue
        unit = (m.group(3) or "").strip()
        key = name.lower()
        if key not in out:
            out[key] = BiomarkerResult(name=name, value=value, unit=unit, risk_level="unknown")

    return list(out.values())

async def generate_blood_analysis(biomarker_results: List[BiomarkerResult]) -> BloodAnalysisResponse:
    """Generate comprehensive blood analysis"""
    detected = len(biomarker_results)
    overall_score = float(min(100.0, (detected / 40.0) * 100.0)) if detected > 0 else 0.0
    return BloodAnalysisResponse(
        overall_score=overall_score,
        optimal_count=0,
        borderline_count=0,
        critical_count=0,
        biomarker_results=biomarker_results,
        summary=f"Extracted {detected} biomarker values. Connect biomarker definitions for traffic-light scoring."
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

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Import Models & Services
from src.models.generation import GenerationRequest, GenerationResponse
from src.services.generation import GenerationService
from src.models.roi import ROIRequest, ROIResponse
from src.services.roi import ROIService
from src.models.tariff import TariffRequest, TariffResponse
from src.services.tariff import TariffService
from src.models.proposal import ProposalData, ProposalResponse
from src.services.proposal_generator import ProposalGenerator

# New Routers & Prisma
from src.routers.auth import router as auth_router
from src.routers.leads import router as leads_router
from src.routers.copilot import router as copilot_router
from src.routers.analytics import router as analytics_router
from src.prisma import prisma

app = FastAPI(title="Quarks OS Calculation Engine (Python Backend)", version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

# Mount Routers
app.include_router(auth_router, prefix="/api") 
app.include_router(leads_router, prefix="/api") 
app.include_router(copilot_router, prefix="/api") 
app.include_router(analytics_router, prefix="/api") 

@app.get("/")
def read_root():
    return {"message": "Quarks OS Python Backend Running"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "calc-engine"}

@app.post("/calculate/generation", response_model=GenerationResponse)
def calculate_generation(request: GenerationRequest):
    try:
        return GenerationService.calculate(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/calculate/roi", response_model=ROIResponse)
def calculate_roi(request: ROIRequest):
    try:
        return ROIService.calculate(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/calculate/tariff", response_model=TariffResponse)
def calculate_tariff(request: TariffRequest):
    try:
        return TariffService.get_tariff(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/proposal", response_model=ProposalResponse)
def generate_proposal(request: ProposalData):
    try:
        return ProposalGenerator.generate(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

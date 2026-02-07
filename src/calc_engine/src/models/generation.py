from pydantic import BaseModel, Field
from typing import List, Optional

class Locality(BaseModel):
    latitude: float
    longitude: float
    city: str
    state: str

class ConsumptionData(BaseModel):
    monthly_avg: float = Field(..., gt=0, description="Média mensal de consumo em kWh")
    history: Optional[List[float]] = Field(default=[], description="Histórico de 12 meses (opcional)")

class SystemParams(BaseModel):
    panel_power: float = Field(default=550, description="Potência do painel em Wp")
    performance_ratio: float = Field(default=0.75, description="Performance Ratio (perdas totais)")
    orientation: str = Field(default="NORTH", description="Orientação do telhado")

class GenerationRequest(BaseModel):
    consumption: ConsumptionData
    locality: Locality
    params: Optional[SystemParams] = None

class GenerationResponse(BaseModel):
    system_size_kwp: float
    panels_count: int
    estimated_generation_monthly: float
    area_required_m2: float

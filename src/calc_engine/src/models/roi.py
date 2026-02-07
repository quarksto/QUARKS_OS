from pydantic import BaseModel, Field
from typing import Optional

class ROIRequest(BaseModel):
    system_cost: float = Field(..., gt=0, description="Custo total do sistema em R$")
    monthly_savings: float = Field(..., gt=0, description="Economia mensal estimada em R$")
    energy_inflation: float = Field(default=0.06, description="Inflação energética anual (decimal, ex: 0.06)")
    tariff: float = Field(..., gt=0, description="Tarifa de energia (R$/kWh)")

class ROIResponse(BaseModel):
    payback_years: float
    payback_discounted_years: Optional[float] = None
    roi_percentage: float
    total_savings_25y: float
    monthly_savings_year1: float
    vpl: float = Field(..., description="Valor Presente Líquido (R$)")
    irr: float = Field(..., description="Taxa Interna de Retorno (decimal)")

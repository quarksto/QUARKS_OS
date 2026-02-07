from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class VoltageGroup(str, Enum):
    B = "B" # Baixa Tensão (Residencial/Comercial Pequeno)
    A = "A" # Alta Tensão

class TariffType(str, Enum):
    CONVENTIONAL = "CONVENTIONAL"
    WHITE = "WHITE" # Tarifa Branca

class Distributor(str, Enum):
    ENEL_SP = "ENEL_SP"
    CPFL_PAULISTA = "CPFL_PAULISTA"
    CEMIG = "CEMIG"
    LIGHT = "LIGHT"
    NEOENERGIA_PE = "NEOENERGIA_PE"
    DEFAULT = "DEFAULT"

class TaxRate(BaseModel):
    te: float = Field(..., description="Tarifa de Energia (R$/kWh)")
    tusd: float = Field(..., description="Tarifa de Uso do Sistema de Distribuição (R$/kWh)")
    icms_rate: float = Field(default=0.18, description="Alíquota de ICMS (decimal)")
    pis_cofins_rate: float = Field(default=0.0925, description="Alíquota PIS/COFINS (decimal)")

class TariffRequest(BaseModel):
    distributor: Distributor
    voltage_group: VoltageGroup = VoltageGroup.B
    consumption_kwh: float

class TariffResponse(BaseModel):
    distributor: Distributor
    total_rate_with_taxes: float
    components: TaxRate
    monthly_bill_estimated: float

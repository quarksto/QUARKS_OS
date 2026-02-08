from pydantic import BaseModel, Field
from typing import List, Optional
from .generation import GenerationResponse
from .roi import ROIResponse
from .tariff import TariffResponse

class Customer(BaseModel):
    name: str
    city: str
    state: str
    
class ProposalData(BaseModel):
    title: str = "Proposta de Energia Solar"
    customer: Customer
    generation: GenerationResponse
    financials: ROIResponse
    tariff: TariffResponse
    kit_name: str = "Kit Solar Premium 550W"
    integrator_name: str = "Quarks Solar Integrators"
    introduction: Optional[str] = None
    notes: Optional[str] = None
    payment_terms: Optional[str] = None
    
class ProposalResponse(BaseModel):
    html_content: str
    proposal_id: str
    status: str = "DRAFT"

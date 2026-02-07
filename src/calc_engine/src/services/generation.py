import math
from ..models.generation import GenerationRequest, GenerationResponse, SystemParams

# Constante de irradiação média (Mockada por enquanto, futura integração com NASA/INPE)
DEFAULT_HSP = 5.0  # Horas de Sol Pleno

class GenerationService:
    @staticmethod
    def calculate(request: GenerationRequest) -> GenerationResponse:
        params = request.params or SystemParams()
        
        # 1. Determinar Demanda Energética
        # Se tiver histórico, usa média, senão usa o valor informado
        target_generation = request.consumption.monthly_avg
        
        if request.consumption.history:
             target_generation = sum(request.consumption.history) / len(request.consumption.history)

        # 2. Fórmula Básica: E = P * H * PR * Days
        # P = E / (H * PR * 30)
        # Onde: E = Energia (kWh), P = Potência (kWp), H = HSP, PR = Performance Ratio
        
        required_kwp = target_generation / (DEFAULT_HSP * params.performance_ratio * 30)
        
        # 3. Número de Painéis
        # panel_power está em Wp, converter para kWp
        panel_kwp = params.panel_power / 1000
        panels_count = math.ceil(required_kwp / panel_kwp)
        
        # 4. Potência Real Instalada
        installed_kwp = panels_count * panel_kwp
        
        # 5. Geração Estimada Real
        generation_estimated = installed_kwp * DEFAULT_HSP * params.performance_ratio * 30
        
        # 6. Área Estimada (Aprox 2.2m² por painel de 550W)
        area_required = panels_count * 2.2

        return GenerationResponse(
            system_size_kwp=round(installed_kwp, 2),
            panels_count=panels_count,
            estimated_generation_monthly=round(generation_estimated, 2),
            area_required_m2=round(area_required, 2)
        )

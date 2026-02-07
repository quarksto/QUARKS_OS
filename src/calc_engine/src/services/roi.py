from ..models.roi import ROIRequest, ROIResponse

import numpy_financial as npf

class ROIService:
    @staticmethod
    def calculate(request: ROIRequest) -> ROIResponse:
        # 1. Payback Simples
        annual_savings = request.monthly_savings * 12
        payback = request.system_cost / annual_savings
        
        # 2. Fluxo de Caixa (25 anos)
        # Ano 0: Investimento Inicial (negativo)
        cash_flows = [-request.system_cost]
        
        current_annual_savings = annual_savings
        total_savings = 0
        
        for year in range(25):
            # Considerar degradação do painel? (0.5% a.a) - Opcional, mantendo simples por agora
            # Inflação energética
            cash_flows.append(current_annual_savings)
            total_savings += current_annual_savings
            current_annual_savings *= (1 + request.energy_inflation)
            
        # 3. Métricas Avançadas
        # VPL (Net Present Value) - Taxa mínima de atratividade (TMA) ex: 10% a.a
        tma = 0.10 
        vpl = npf.npv(tma, cash_flows)
        
        # TIR (Internal Rate of Return)
        irr = npf.irr(cash_flows)
        
        # Payback Descontado (Simulado)
        cumulative_discounted = -request.system_cost
        payback_discounted = None
        for i, cf in enumerate(cash_flows[1:], 1):
            discounted_cf = cf / ((1 + tma) ** i)
            cumulative_discounted += discounted_cf
            if cumulative_discounted >= 0 and payback_discounted is None:
                payback_discounted = i # Ano exato seria interpolação, mas int serve para MVP
                break

        # ROI Simples
        roi = ((total_savings - request.system_cost) / request.system_cost) * 100

        return ROIResponse(
            payback_years=round(payback, 2),
            payback_discounted_years=payback_discounted,
            roi_percentage=round(roi, 2),
            total_savings_25y=round(total_savings, 2),
            monthly_savings_year1=round(request.monthly_savings, 2),
            vpl=round(vpl, 2),
            irr=round(irr, 4)
        )

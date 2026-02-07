from ..models.tariff import TariffRequest, TariffResponse, TaxRate, Distributor

# Mock Database of Tariffs (In production this comes from DB/API)
TARIFF_DB = {
    Distributor.ENEL_SP: TaxRate(te=0.35, tusd=0.42, icms_rate=0.18),
    Distributor.CPFL_PAULISTA: TaxRate(te=0.32, tusd=0.39, icms_rate=0.18),
    Distributor.CEMIG: TaxRate(te=0.38, tusd=0.45, icms_rate=0.18), # High tax state usually
    Distributor.DEFAULT: TaxRate(te=0.30, tusd=0.30)
}

class TariffService:
    @staticmethod
    def get_tariff(request: TariffRequest) -> TariffResponse:
        # 1. Lookup Base Rates
        rates = TARIFF_DB.get(request.distributor, TARIFF_DB[Distributor.DEFAULT])
        
        # 2. Calculate Gross Up (Inside Invoice)
        # Formula simplified: Price = (TE + TUSD) / (1 - ICMS - PIS/COFINS)
        base_sum = rates.te + rates.tusd
        total_tax_rate = rates.icms_rate + rates.pis_cofins_rate
        
        final_rate = base_sum / (1 - total_tax_rate)
        
        # 3. Calculate Bill
        bill = final_rate * request.consumption_kwh

        return TariffResponse(
            distributor=request.distributor,
            total_rate_with_taxes=round(final_rate, 4),
            components=rates,
            monthly_bill_estimated=round(bill, 2)
        )

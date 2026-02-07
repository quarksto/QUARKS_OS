const BaseDomainAgent = require('../base');
const axios = require('axios');

class CalcDomainAgent extends BaseDomainAgent {
    constructor() {
        super('calc');
        this.engineUrl = process.env.CALC_ENGINE_URL || 'http://localhost:8000';
    }

    async execute(action, payload) {
        console.log(`[CalcDomain] Received action: ${action}`);

        switch (action) {
            case 'CALCULATE_GENERATION':
                return await this.calculateGeneration(payload.consumption);
            case 'CALCULATE_ROI':
                return await this.calculateROI(payload.systemCost, payload.generationMonthly, payload.tariffPrice);
            case 'GET_TARIFF':
                return await this.getTariff(payload.distributor, payload.state, payload.consumption);
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    async calculateGeneration(consumption) {
        try {
            // Real call to Python Service
            const response = await axios.post(`${this.engineUrl}/calculate/generation`, {
                consumption: { monthly_avg: parseFloat(consumption) },
                locality: { latitude: 0, longitude: 0, city: "Default", state: "BR" } // Mock locality for now
            });

            const data = response.data;
            return {
                consumption,
                systemSizeKwp: data.system_size_kwp,
                generationMonthly: data.estimated_generation_monthly,
                panelsCount: data.panels_count,
                areaRequired: data.area_required_m2
            };
        } catch (error) {
            console.error('[CalcDomain] Engine Error:', error.message);
            // Fallback or re-throw
            throw new Error('Calculation Engine Unavailable');
        }
    }

    async calculateROI(systemCost, generationMonthly, tariffPrice) {
        try {
            console.log(`[CalcDomain] Calculating ROI: Cost=${systemCost}, Gen=${generationMonthly}, Tariff=${tariffPrice}`);
            // Calculate estimated monthly savings in R$ to match Python API contract
            const savings = parseFloat(generationMonthly) * parseFloat(tariffPrice);

            const response = await axios.post(`${this.engineUrl}/calculate/roi`, {
                system_cost: parseFloat(systemCost),
                monthly_savings: savings,
                tariff: parseFloat(tariffPrice)
            });
            // Normalized return
            return {
                ...response.data,
                monthly_savings: savings
            };
        } catch (error) {
            console.error('[CalcDomain] ROI Error:', error.message);
            if (error.response) console.error('Detail:', error.response.data);
            throw new Error('ROI Calculation Failed');
        }
    }

    async getTariff(distributor, state, consumption) {
        try {
            console.log(`[CalcDomain] Fetching Tariff: ${distributor}-${state}`);
            // Map 'state' to 'distributor' logic if needed, or normalize distributor
            // Simple mapping for now
            let distEnum = 'DEFAULT';
            if (distributor && ['ENEL_SP', 'CPFL_PAULISTA', 'CEMIG', 'LIGHT', 'NEOENERGIA_PE'].includes(distributor)) {
                distEnum = distributor;
            } else if (distributor && distributor.includes('CEMIG')) {
                distEnum = 'CEMIG';
            }

            const response = await axios.post(`${this.engineUrl}/calculate/tariff`, {
                distributor: distEnum,
                voltage_group: "B", // Fixed for now
                consumption_kwh: parseFloat(consumption)
            });

            // Map Python Response to Node Domain Interface
            return {
                price_kwh: response.data.total_rate_with_taxes,
                components: response.data.components,
                distributor: response.data.distributor
            };
        } catch (error) {
            console.error('[CalcDomain] Tariff Error:', error.message);
            if (error.response) console.error('Detail:', error.response.data);

            // Fallback to average Brazil tariff if service fails
            return { price_kwh: 0.95, flags: {} };
        }
    }
}

module.exports = new CalcDomainAgent();

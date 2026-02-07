const axios = require('axios');

async function debugProxy() {
    const payload = {
        customer: { name: 'João Silva', city: 'Campinas', state: 'SP' },
        generation: {
            system_size_kwp: 4.5,
            estimated_generation_monthly: 600,
            panels_count: 8,
            area_required_m2: 20, // Check if required by Pydantic
            location: { city: 'Campinas', state: 'SP' } // Extra fields ignored usually
        },
        financials: {
            payback_years: 3.5,
            payback_discounted_years: 4.0, // Optional field
            roi_percentage: 250,
            total_savings_25y: 150000,
            monthly_savings_year1: 550,
            vpl: 50000,
            irr: 0.05
        },
        tariff: {
            distributor: 'CPFL_PAULISTA',
            total_rate_with_taxes: 0.92,
            components: { te: 0.4, tusd: 0.4, icms_rate: 0.18, pis_cofins_rate: 0.09 },
            monthly_bill_estimated: 100
        },
        kit_name: "Kit Solar Max 600W",
        integrator_name: "Integrador Solar Tech"
    };

    console.log('Sending payload to Python:', JSON.stringify(payload, null, 2));

    try {
        const res = await axios.post('http://127.0.0.1:8000/generate/proposal', payload);
        console.log('✅ Python Response:', res.status);
    } catch (e) {
        console.error('❌ Python Error:', e.message);
        if (e.response) {
            console.error('Data:', JSON.stringify(e.response.data, null, 2));
        }
    }
}

debugProxy();

const axios = require('axios');

async function testFullStackProposal() {
    try {
        console.log('Testing Frontend -> Node -> Python Proxy...');

        // Payload matching exactly what ProposalPage.jsx sends
        const fullPayload = {
            customer: { name: 'João Silva', city: 'Campinas', state: 'SP' },
            generation: { system_size_kwp: 4.5, estimated_generation_monthly: 600, panels_count: 8 },
            financials: {
                payback_years: 3.5,
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

        const response = await axios.post(
            'http://localhost:3001/orchestrate/preview-proposal',
            fullPayload
        );

        console.log('✅ Proxy Success!');
        const data = response.data;

        if (data.html_content && data.html_content.includes('<html>')) {
            console.log(`✅ HTML Content Received (${data.html_content.length} chars)`);
            console.log('Preview ID:', data.proposal_id);
        } else {
            console.error('❌ Invalid Response Format:', data);
        }

    } catch (error) {
        console.error('❌ Proxy Failed:', error.message);
        if (error.response) console.error(error.response.data);
    }
}

testFullStackProposal();

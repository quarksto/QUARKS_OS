const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:3001/api';

async function verifyProposalLogic() {
    console.log('=== Verifying Proposal Dynamic Pricing ===');

    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'master@quarks.solar',
            password: 'master123'
        });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create a Lead (in MG for example, to test State rules if any, default SP)
        console.log('\n2. Creating Test Lead...');
        const leadRes = await axios.post(`${API_URL}/leads`, {
            name: 'Proposal Test Lead',
            email: `prop.test.${Date.now()}@test.com`,
            phone: '11999999999',
            state: 'SP'
        }, { headers });
        const leadId = leadRes.data.id;
        console.log(`   Lead Created: ${leadId} (SP)`);

        // 3. Ensure we have a Kit (Using the one from previous test or find one)
        console.log('\n3. Fetching Kits...');
        const kitsRes = await axios.get(`${API_URL}/inventory/kits`, { headers });
        const kit = kitsRes.data[0];
        if (!kit) throw new Error('No kits found. Run verify_kits.js first.');
        console.log(`   Using Kit: ${kit.name} (ID: ${kit.id})`);

        // 4. Create Proposal (Draft)
        console.log('\n4. Creating Draft Proposal...');
        const proposalPayload = {
            leadId: leadId,
            kitId: kit.id,
            calculation: {
                system_size: 5.5, // 5.5 kWp
                estimated_generation: 600,
                monthly_savings: 550
            },
            notes: 'Automated Test Proposal'
        };
        console.log('   Payload:', JSON.stringify(proposalPayload, null, 2));

        const proposalRes = await axios.post(`${API_URL}/proposals/draft`, proposalPayload, { headers });
        console.log('   Response received!');

        const proposal = proposalRes.data;
        console.log(`   Proposal Created: ${proposal.id}`);
        console.log(`   Total Price: R$ ${proposal.totalPrice}`);

        // 5. Inspect Pricing Details
        if (proposal.pricingDetails) {
            console.log('\n   [Pricing Breakdown]');
            console.log(`   - Equipment Cost: R$ ${proposal.pricingDetails.equipmentCost}`);
            console.log(`   - Services Cost:  R$ ${proposal.pricingDetails.servicesCost}`);
            console.log(`   - Total Cost:     R$ ${proposal.pricingDetails.totalCost}`);
            console.log(`   - Target Margin:  ${(proposal.pricingDetails.targetMargin * 100).toFixed(1)}%`);
            console.log(`   - Tax Rate:       ${(proposal.pricingDetails.taxRate * 100).toFixed(1)}%`);
            console.log(`   - Final Price:    R$ ${proposal.pricingDetails.finalPrice.toFixed(2)}`);

            console.log('\n   - Services Applied:');
            proposal.pricingDetails.services.forEach(s => {
                console.log(`     * ${s.name}: R$ ${s.cost.toFixed(2)}`);
            });
        } else {
            console.error('❌ Missing pricingDetails in response!');
        }

        console.log('\n=== Verification Complete ===');

    } catch (error) {
        console.error('Verification Failed:', error.response?.data || error.message);
    }
}

verifyProposalLogic();

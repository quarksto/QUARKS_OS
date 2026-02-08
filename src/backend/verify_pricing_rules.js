const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function verifyPricingRules() {
    console.log('=== Verifying Pricing Rules ===');

    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'master@quarks.solar',
            password: 'master123'
        });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        console.log('   Logged in.');

        // 2. Create Rule
        console.log('\n2. Creating High Power Rule...');
        const ruleRes = await axios.post(`${API_URL}/pricing-rules`, {
            name: 'Usina Solo 75kW+',
            minPower: 75,
            maxPower: 500,
            targetMargin: 0.15, // 15%
            taxRate: 0.10 // 10%
        }, { headers });
        const ruleId = ruleRes.data.id;
        console.log(`   Rule Created: ${ruleId} (Margin: 15%)`);

        // 3. Match Rule (Should find it)
        console.log('\n3. Matching logic (100kWp)...');
        const matchRes = await axios.get(`${API_URL}/pricing-rules/match?kWp=100`, { headers });
        console.log(`   Matched: ${matchRes.data.name} (Margin: ${matchRes.data.targetMargin * 100}%)`);

        if (matchRes.data.id !== ruleId) console.error('   ❌ Mismatched rule!');
        else console.log('   ✅ Correct rule matched.');

        // 4. Match Rule (Small system - should fail/default)
        console.log('\n4. Matching logic (5kWp)...');
        try {
            const smallRes = await axios.get(`${API_URL}/pricing-rules/match?kWp=5`, { headers });
            console.log(`   Matched: ${smallRes.data.name} (isDefault: ${smallRes.data.isDefault})`);
        } catch (e) {
            console.log(`   Fallback/Error: ${e.response?.data?.error || e.message}`);
        }

        console.log('\n=== Verification Complete ===');

    } catch (error) {
        console.error('Verification Failed:', error.response?.data || error.message);
    }
}

verifyPricingRules();

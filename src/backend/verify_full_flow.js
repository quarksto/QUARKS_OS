const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'quarks_secret_key_123'; // Fallback matching common dev default

async function runTest() {
    try {
        // 1. Generate Token
        const token = jwt.sign(
            { userId: 'admin', role: 'ADMIN', name: 'Admin User' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Token generated.');

        // 2. Call Orchestration Endpoint
        console.log('Sending request to Orchestrator...');
        const response = await axios.post(
            'http://localhost:3001/orchestrate/create-proposal',
            {
                leadId: 'test-lead-1',
                consumption: 600 // High consumption to test calc
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        console.log('✅ Orchestration Success!');
        console.log('Proposal Data:', JSON.stringify(response.data, null, 2));

        // Verify specific fields coming from Python
        const proposal = response.data.proposal;
        if (proposal.systemSizeKwp && proposal.panelsCount) {
            console.log('✅ Python Engine Integration Verified');
        } else {
            console.error('❌ Python Engine Data Missing');
        }

    } catch (error) {
        console.error('❌ Verification Failed:', error.response ? error.response.data : error.message);
    }
}

runTest();

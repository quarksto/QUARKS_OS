const axios = require('axios');

async function testFrontendPreviewIntegration() {
    try {
        console.log('🧪 Testing Frontend <-> Backend Preview Flow...');

        const payload = {
            customer: { name: 'João Frontend', city: 'Campinas', state: 'SP' },
            consumption: 650,
            distributor: 'CPFL_PAULISTA'
        };

        console.log('Sending Payload:', payload);

        // Call the Node.js Server Endpoint directly (mocking what Frontend does)
        const response = await axios.post('http://localhost:3001/orchestrate/preview-proposal', payload);

        console.log('✅ Response Status:', response.status);
        if (response.data.html_content) {
            console.log('✅ Success: Received HTML Content');
            if (response.data.html_content.includes('Kit Solar')) {
                console.log('✅ Verified: HTML contains Kit info');
            }
        } else {
            console.error('❌ Failed: No HTML content returned');
        }

    } catch (error) {
        console.error('❌ Integration Test Failed:', error.message);
        if (error.response) console.error('Data:', error.response.data);
    }
}

testFrontendPreviewIntegration();

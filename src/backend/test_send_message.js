const axios = require('axios');

async function testSendMessage() {
    try {
        // First, login to get a valid token
        console.log('1. Logging in...');
        const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
            email: 'admin@quarks.com',
            password: 'admin123'
        });

        const token = loginRes.data.token;
        console.log('✅ Login successful\n');

        // Get a lead ID
        console.log('2. Getting leads...');
        const leadsRes = await axios.get('http://localhost:3001/api/leads', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const leadId = leadsRes.data.leads[0].id;
        console.log(`✅ Got lead: ${leadsRes.data.leads[0].name} (${leadId.substring(0, 8)}...)\n`);

        // Send a test message
        console.log('3. Sending test message...');
        const messageRes = await axios.post('http://localhost:3001/api/messages', {
            leadId,
            content: 'Esta é uma mensagem de teste enviada via API'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Message sent successfully!');
        console.log('Response:', JSON.stringify(messageRes.data, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

testSendMessage();

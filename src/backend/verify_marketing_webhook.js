const axios = require('axios');

async function testWebhook() {
    try {
        console.log('Testing Facebook Ads Webhook...');

        // Simulate Facebook Payload
        const payload = {
            entry: [{
                changes: [{
                    value: {
                        form_id: "FORM_12345",
                        leadgen_id: "LEAD_FB_TEST_" + Date.now(),
                        created_time: new Date().toISOString(),
                        field_data: [
                            { name: "full_name", values: ["Lead de Teste via Webhook"] },
                            { name: "email", values: ["teste.webhook@quarks.com"] },
                            { name: "phone_number", values: ["+5511999998888"] },
                            { name: "city", values: ["São Paulo"] }
                        ]
                    }
                }]
            }]
        };

        const response = await axios.post(
            'http://localhost:3001/api/marketing/webhook/facebook_ads',
            payload
        );

        console.log('✅ Webhook Success!');
        console.log('Response:', response.data);

    } catch (error) {
        console.error('❌ Webhook Failed:', error.response ? error.response.data : error.message);
    }
}

testWebhook();

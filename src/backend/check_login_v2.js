const axios = require('axios');

async function testLogin() {
    console.log('Testing login...');
    try {
        const res = await axios.post('http://localhost:3001/api/auth/login', {
            email: 'master@quarks.solar',
            password: 'master123'
        });
        console.log('✅ LOGIN SUCCESS!');
        console.log('Token:', res.data.token.substring(0, 20) + '...');
        console.log('User:', res.data.user);
    } catch (e) {
        console.error('❌ LOGIN FAILED');
        if (e.response) {
            console.error('Status:', e.response.status);
            console.error('Data:', e.response.data);
        } else {
            console.error('Error:', e.message);
        }
    }
}

testLogin();

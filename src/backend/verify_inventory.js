const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
// Assuming we have a way to get a token or we test in dev mode where auth might be bypassed or we login first.
// For this script, we'll try to login as admin first.

async function verifyInventory() {
    console.log('=== Verifying Inventory & Services ===');

    try {
        // 1. Login
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'master@quarks.solar',
            password: 'master123'
        });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        console.log('   Logged in successfully.');

        // 2. Create Product
        console.log('\n2. Creating Product...');
        const productData = {
            sku: `TEST-${Date.now()}`,
            name: 'Test Inverter 5kW',
            type: 'INVERTER',
            costPrice: 2500.00,
            supplier: 'GoodWe'
        };
        const productRes = await axios.post(`${API_URL}/inventory/products`, productData, { headers });
        const productId = productRes.data.id;
        console.log(`   Product Created: ${productId} (${productRes.data.sku})`);

        // 3. List Products
        console.log('\n3. Listing Products...');
        const listRes = await axios.get(`${API_URL}/inventory/products`, { headers });
        const found = listRes.data.find(p => p.id === productId);
        if (found) console.log('   Product found in list.');
        else console.error('   Product NOT found in list!');

        // 4. Create Service
        console.log('\n4. Creating Service...');
        const serviceData = {
            name: 'Instalação Básica',
            type: 'INSTALLATION',
            description: 'Instalação em telhado cerâmico'
        };
        const serviceRes = await axios.post(`${API_URL}/services`, serviceData, { headers });
        const serviceId = serviceRes.data.id;
        console.log(`   Service Created: ${serviceId}`);

        // 5. Add Service Price
        console.log('\n5. Adding Service Price...');
        const priceData = {
            serviceId,
            priceType: 'PER_WATT',
            priceValue: 0.80,
            minPower: 0,
            maxPower: 10
        };
        const priceRes = await axios.post(`${API_URL}/services/prices`, priceData, { headers });
        console.log(`   Price Added: ${priceRes.data.id} (R$ ${priceRes.data.priceValue}/Wp)`);

        console.log('\n=== Verification Complete ===');

    } catch (error) {
        console.error('Verification Failed:', error.response?.data || error.message);
    }
}

verifyInventory();

const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function verifyKits() {
    console.log('=== Verifying Kits & Assembly ===');

    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'master@quarks.solar',
            password: 'master123'
        });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        console.log('   Logged in.');

        // 2. Create Products for the Kit
        console.log('\n2. Creating Products...');
        const p1 = await axios.post(`${API_URL}/inventory/products`, {
            sku: `MOD-550-${Date.now()}`,
            name: 'Módulo 550W Test',
            type: 'MODULE',
            costPrice: 500,
            supplier: 'TestSupplier'
        }, { headers });
        console.log(`   Created Module: ${p1.data.id} (Cost: 500)`);

        const p2 = await axios.post(`${API_URL}/inventory/products`, {
            sku: `INV-5KW-${Date.now()}`,
            name: 'Inversor 5kW Test',
            type: 'INVERTER',
            costPrice: 2500,
            supplier: 'TestSupplier'
        }, { headers });
        console.log(`   Created Inverter: ${p2.data.id} (Cost: 2500)`);

        // 3. Create Kit
        console.log('\n3. Creating Kit (1 Inverter + 10 Modules)...');
        const kitRes = await axios.post(`${API_URL}/inventory/kits`, {
            name: 'Kit 5.5kWp Teste',
            description: 'Kit de teste automatizado',
            items: [
                { productId: p2.data.id, quantity: 1 }, // 2500 * 1 = 2500
                { productId: p1.data.id, quantity: 10 } // 500 * 10 = 5000
            ]
        }, { headers });

        const kitId = kitRes.data.id;
        console.log(`   Kit Created: ${kitId}`);

        // 4. Verify Kit Details & Cost
        console.log('\n4. Verifying Kit Cost...');
        const getKitRes = await axios.get(`${API_URL}/inventory/kits/${kitId}`, { headers });
        const kit = getKitRes.data;

        const expectedCost = (2500 * 1) + (500 * 10); // 7500
        console.log(`   Total Cost from API: ${kit.totalCost}`);
        console.log(`   Expected Cost: ${expectedCost}`);

        if (kit.totalCost !== expectedCost) {
            console.error('❌ Cost Mismatch!');
        } else {
            console.log('✅ Cost Verified Correctly.');
        }

        if (kit.items.length !== 2) console.error('❌ Item Count Mismatch!');
        else console.log('✅ Item Count Verified.');

        console.log('\n=== Verification Complete ===');

    } catch (error) {
        console.error('Verification Failed:', error.response?.data || error.message);
    }
}

verifyKits();

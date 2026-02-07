const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCopilot() {
    console.log('Testing Copilot API at http://localhost:3001/copilot/chat');

    try {
        // 1. Get User
        const user = await prisma.user.findUnique({ where: { email: 'copilot_tester@example.com' } });
        if (!user) throw new Error('Test user not found. Run seed_test_user.js first.');

        console.log(`Using User: ${user.id}`);

        // 2. Test Chat
        console.log('\n[Test 1] Sending "Oi" to Copilot...');
        const res1 = await axios.post('http://localhost:3001/copilot/chat', {
            message: 'Oi, sou o analista',
            userId: user.id,
            sessionId: 'session-' + Date.now() // New session
        });
        console.log('Response:', res1.data);

        if (res1.data.role !== 'model') throw new Error('Invalid response role');
        console.log('✅ Chat Test Passed');

    } catch (err) {
        const errorLog = {
            message: err.message,
            response: err.response ? err.response.data : null,
            stack: err.stack
        };
        require('fs').writeFileSync('verification_error.json', JSON.stringify(errorLog, null, 2));
        console.error('❌ Test Failed. Error written to verification_error.json');
    } finally {
        await prisma.$disconnect();
    }
}

testCopilot();

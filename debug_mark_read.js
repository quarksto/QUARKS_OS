const messageAgent = require('./src/backend/src/agents/message-domain');
const { maestro } = require('./src/backend/src/orchestrator/maestro');

async function testMarkRead() {
    console.log('--- Testing Mark Read Logic ---');

    // 1. Test with a non-existent lead ID (should still succeed at agent level, but update 0 rows)
    try {
        console.log('Testing with random leadId...');
        const result = await messageAgent.execute('MARK_READ', { leadId: '00000000-0000-0000-0000-000000000000' });
        console.log('Result:', result);
    } catch (err) {
        console.error('FAILED: Random leadId test caught error:', err.message);
    }

    // 2. Test safety wrap (even if broadcast fails, agent should return success)
    // Note: In this standalone process, getIO() will definitely throw because it's not initialized
    try {
        console.log('\nTesting broadcast safety wrap (io not initialized)...');
        const result = await messageAgent.execute('MARK_READ', { leadId: 'any-id' });
        console.log('Result (expected success despite io error):', result);
    } catch (err) {
        console.error('CRITICAL FAILURE: Agent threw error despite safety wrap:', err.message);
    }
}

testMarkRead();

const http = require('http');

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log(`[E2E] Starting API Verification on ${BASE_URL}...\n`);

    // 1. Health Check
    try {
        const health = await request('GET', '/health');
        console.log(`[GET /health] Status: ${health.status} ${health.status === 200 ? '✅' : '❌'}`);
    } catch (e) { console.error('[GET /health] Failed:', e.message); }

    // 2. Analytics Dashboard
    try {
        const analytics = await request('GET', '/api/analytics/dashboard');
        const ok = analytics.status === 200 && analytics.data.activeLeads !== undefined;
        console.log(`[GET /api/analytics/dashboard] Status: ${analytics.status} ${ok ? '✅' : '❌'}`);
        if (!ok) console.log('Response:', analytics.data);
    } catch (e) { console.error('[GET /api/analytics] Failed:', e.message); }

    // 3. Leads Pipeline
    try {
        const leads = await request('GET', '/api/leads/pipeline');
        const ok = leads.status === 200 && leads.data['NEW'] !== undefined;
        console.log(`[GET /api/leads/pipeline] Status: ${leads.status} ${ok ? '✅' : '❌'}`);
    } catch (e) { console.error('[GET /api/leads] Failed:', e.message); }

    // 4. Copilot Chat (Text)
    try {
        const chat = await request('POST', '/api/copilot/chat', { message: 'Ping' });
        // Status might be 200 (OK) or 503 (if API Key missing), but route should exist (not 404).
        const routeExists = chat.status !== 404;
        const success = chat.status === 200;

        console.log(`[POST /api/copilot/chat] Status: ${chat.status} ${routeExists ? (success ? '✅' : '⚠️ (Route OK, Error content)') : '❌ (Route Not Found)'}`);
        if (!success) console.log('Response:', chat.data);
    } catch (e) { console.error('[POST /api/copilot] Failed:', e.message); }

    console.log('\n[E2E] Verification Complete.');
}

runTests();

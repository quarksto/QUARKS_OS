const fs = require('fs');

async function main() {
    console.log('--- Verifying Analytics Endpoints ---');
    const baseUrl = 'http://localhost:3001/api/analytics';

    // Helper to log error
    const logError = (name, text) => {
        console.error(`❌ ${name} Failed:`, text);
        fs.writeFileSync('error_response.json', text);
    }

    try {
        console.log('Fetching Dashboard Metrics...');
        const dashboardRes = await fetch(`${baseUrl}/dashboard`);
        if (!dashboardRes.ok) {
            const text = await dashboardRes.text();
            logError('Dashboard', text);
            throw new Error(text);
        }
        const metrics = await dashboardRes.json();
        console.log('✅ Metrics:', metrics);
        if (!metrics.hasOwnProperty('activeLeads')) throw new Error("Missing activeLeads");

    } catch (err) {
        // handled above
    }

    try {
        console.log('\nFetching Sales Funnel...');
        const funnelRes = await fetch(`${baseUrl}/funnel`);
        if (!funnelRes.ok) {
            const text = await funnelRes.text();
            logError('Funnel', text);
            throw new Error(text);
        }
        const funnel = await funnelRes.json();
        console.log('✅ Funnel:', funnel);
        if (!Array.isArray(funnel)) throw new Error("Funnel is not an array");

    } catch (err) {
        // handled above
    }
}

main();

const AnalyticsDomainAgent = require('./src/agents/analytics-domain');

async function main() {
    console.log("Debugging Analytics...");
    try {
        const analytics = new AnalyticsDomainAgent();
        const metrics = await analytics.getDashboardMetrics();
        console.log("Metrics Success:", metrics);

        const balance = await analytics.getEnergyBalance();
        console.log("Balance Success:", balance);
    } catch (error) {
        console.error("Caught Error:");
        console.error(error.message);
        console.error(JSON.stringify(error, null, 2));
    }
}

main();

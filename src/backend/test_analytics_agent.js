const AnalyticsAgent = require('./src/agents/analytics-domain');
const agent = new AnalyticsAgent();

async function testAnalytics() {
    try {
        console.log('Executing AnalyticsAgent.getDashboardMetrics()...');
        const metrics = await agent.execute('GET_DASHBOARD_METRICS', {});
        console.log('Metrics result:', JSON.stringify(metrics, null, 2));
    } catch (error) {
        console.error('Error in getDashboardMetrics:', error);
    } finally {
        process.exit(0);
    }
}

testAnalytics();

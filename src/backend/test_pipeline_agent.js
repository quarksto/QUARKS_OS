const leadAgent = require('./src/agents/lead-domain');

async function testPipeline() {
    try {
        console.log('Executing LeadDomainAgent.getPipeline()...');
        const pipeline = await leadAgent.getPipeline();
        console.log('Pipeline columns:', Object.keys(pipeline));
        console.log('NEW column count:', pipeline.NEW.length);
        console.log('CLOSED_WON column count:', pipeline.CLOSED_WON.length);
        // console.log('Sample Lead:', JSON.stringify(pipeline.NEW[0], null, 2));
    } catch (error) {
        console.error('Error in getPipeline:', error);
    } finally {
        // prisma is internal to agent, it might not be exported so we can't disconnect easily if it uses stay-open client
        process.exit(0);
    }
}

testPipeline();

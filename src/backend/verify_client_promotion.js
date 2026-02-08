const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const leadAgent = require('./src/agents/lead-domain');
const fs = require('fs');

function log(msg) {
    console.log(msg);
    fs.appendFileSync('verification_result.txt', msg + '\n');
}

async function verifyPromotion() {
    fs.writeFileSync('verification_result.txt', ''); // Clear file
    log('--- Starting Client Promotion Verification ---');

    // 1. Create a Test Lead
    const leadData = {
        name: 'Test Client Promotion 3',
        email: `test_client_3_${Date.now()}@example.com`,
        phone: '11999998888',
        consumption: 600,
        location: 'São Paulo, SP'
    };

    log('1. Creating Lead...');
    const lead = await leadAgent.createLead(leadData);
    log(`   Lead created: ${lead.id}`);

    // 2. Update Status to CLOSED_WON
    log('2. Updating Status to CLOSED_WON...');
    const updatedLead = await leadAgent.updateStatus(lead.id, 'CLOSED_WON');
    log(`   Lead status updated: ${updatedLead.status}`);

    // LeadDomain processing for promotion happens async/awaited inside updateStatus now, 
    // so we can check immediately.

    // 3. Verify Client Creation
    log('3. Verifying Client Creation...');
    const client = await prisma.client.findFirst({ where: { email: leadData.email } });

    if (client) {
        log(`   SUCCESS: Client found: ${client.id} - ${client.name}`);
    } else {
        log('   FAILURE: Client not created.');
    }

    // 4. Verify Lead Link
    log('4. Verifying Lead -> Client Link...');
    const leadCheck = await prisma.lead.findUnique({ where: { id: lead.id } });
    if (leadCheck.clientId === client?.id) {
        log(`   SUCCESS: Lead linked to Client: ${client?.id}`);
    } else {
        log(`   FAILURE: Lead not linked. ClientId: ${leadCheck.clientId}`);
    }

    // 5. Verify Project Creation
    log('5. Verifying Project Creation...');
    const project = await prisma.project.findFirst({ where: { leadId: lead.id } });
    if (project) {
        log(`   SUCCESS: Project created: ${project.id} - ${project.name}`);
        log(`            Project linked to Client: ${project.clientId === client?.id ? 'YES' : 'NO'}`);
    } else {
        log('   FAILURE: Project not created.');
    }

    log('--- Verification Complete ---');
}

verifyPromotion()
    .catch(e => {
        log('ERROR: ' + e.message);
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

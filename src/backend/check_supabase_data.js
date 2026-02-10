const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        const leads = await prisma.lead.findMany({
            select: {
                id: true,
                name: true,
                status: true,
                consumption: true,
                location: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log('=== LEADS NO BANCO DE DADOS ===');
        console.log(`Total: ${leads.length}`);
        leads.forEach((lead, idx) => {
            console.log(`\n${idx + 1}. ${lead.name}`);
            console.log(`   Status: ${lead.status}`);
            console.log(`   Consumo: ${lead.consumption} kWh`);
            console.log(`   Local: ${lead.location || 'N/A'}`);
            console.log(`   ID: ${lead.id.substring(0, 8)}...`);
        });

        const proposals = await prisma.proposal.findMany({
            select: {
                id: true,
                title: true,
                status: true,
                totalPrice: true,
                createdAt: true,
                lead: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log('\n\n=== PROPOSTAS NO BANCO DE DADOS ===');
        console.log(`Total: ${proposals.length}`);
        proposals.forEach((prop, idx) => {
            console.log(`\n${idx + 1}. ${prop.title}`);
            console.log(`   Cliente: ${prop.lead?.name || 'N/A'}`);
            console.log(`   Status: ${prop.status}`);
            console.log(`   Valor: R$ ${prop.totalPrice.toFixed(2)}`);
            console.log(`   ID: ${prop.id.substring(0, 8)}...`);
        });

    } catch (error) {
        console.error('Erro ao consultar banco:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');
    console.log('DEBUG: Using Prisma Client with default/hardcoded URL.');

    try {
        // 1. Ensure a default user exists
        let user = await prisma.user.findFirst({ where: { email: 'demo@quarks.solar' } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: 'Usuário Demo',
                    email: 'demo@quarks.solar',
                    password: 'hashed_password_mock',
                    role: 'INTEGRADOR'
                }
            });
            console.log('✅ Created Demo User');
        }

        // 2. Create Leads
        const leadsData = [
            { name: 'Padaria do João', consumption: 3500, status: 'NEGOTIATION', city: 'Campinas - SP' },
            { name: 'Sítio Recanto Feliz', consumption: 1200, status: 'PROPOSAL_SENT', city: 'Indaiatuba - SP' },
            { name: 'Residência Silva', consumption: 450, status: 'NEW', city: 'São Paulo - SP' },
            { name: 'Mercado Central', consumption: 8000, status: 'CONTACTED', city: 'Jundiaí - SP' },
            { name: 'Fazenda Sol Nascente', consumption: 15000, status: 'CLOSED_WON', city: 'Ribeirão Preto - SP' },
            { name: 'Casa de Praia', consumption: 300, status: 'CLOSED_LOST', city: 'Ubatuba - SP' },
            { name: 'Oficina Mecânica', consumption: 2100, status: 'NEGOTIATION', city: 'Sorocaba - SP' },
            { name: 'Academia Power', consumption: 5500, status: 'PROPOSAL_SENT', city: 'São Paulo - SP' }
        ];

        for (const l of leadsData) {
            // Upsert by name to avoid duplicates if run multiple times (though name isn't unique in schema, logic is simpler here)
            // actually schema doesn't force unique name. 
            // We'll just create. The DB is empty or we don't care about duplicates for this demo.

            const lead = await prisma.lead.create({
                data: {
                    name: l.name,
                    email: `contato@${l.name.replace(/\s+/g, '').toLowerCase()}.com`,
                    consumption: parseFloat(l.consumption),
                    location: l.city,
                    status: l.status,
                    ownerId: user.id
                }
            });
            console.log(`✅ Created Lead: ${l.name} (${l.status})`);

            if (['PROPOSAL_SENT', 'NEGOTIATION', 'CLOSED_WON'].includes(l.status)) {
                const value = l.consumption * 4.5;
                const status = l.status === 'CLOSED_WON' ? 'ACCEPTED' : (l.status === 'NEGOTIATION' ? 'VIEWED' : 'SENT');

                await prisma.proposal.create({
                    data: {
                        title: `Proposta Solar - ${l.name}`,
                        generationKwh: parseFloat(l.consumption),
                        systemSizeKwp: parseFloat(l.consumption / 120),
                        totalPrice: parseFloat(value),
                        paybackYears: 3.5,
                        savingsMonthly: parseFloat(l.consumption * 0.9),
                        status: status,
                        leadId: lead.id,
                        creatorId: user.id
                    }
                });
                console.log(`   📄 Created Proposal: R$ ${value.toFixed(2)}`);
            }
        }
        console.log('🎉 Seeding finished.');

    } catch (e) {
        console.error('❌ SEED ERROR:', e);
        // Log connection error details
        process.exit(1);
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });

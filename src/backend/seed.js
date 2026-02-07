const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create a default user (Integrator)
    const user = await prisma.user.create({
        data: {
            email: 'john@quarks.solar',
            name: 'John Doe',
            password: 'hashed_password_mock', // secure in prod
            role: 'INTEGRADOR'
        }
    });

    console.log(`👤 Created user: ${user.name}`);

    // 2. Create Leads (Spread across Kanban columns)
    const leadsData = [
        { name: 'Fazenda Bom Retiro', status: 'NEW', consumption: 1200, location: 'Ribeirão Preto, SP', value: 145000 },
        { name: 'Indústria MetalMax', status: 'CONTACTED', consumption: 4500, location: 'Joinville, SC', value: 450000 },
        { name: 'Mercado Central', status: 'PROPOSAL_SENT', consumption: 850, location: 'Vitória, ES', value: 32500 },
        { name: 'Residência Silva', status: 'NEGOTIATION', consumption: 450, location: 'Campinas, SP', value: 18000 },
        { name: 'AgroTech Sul', status: 'CLOSED_WON', consumption: 2100, location: 'Londrina, PR', value: 210000 },
        { name: 'Padaria do João', status: 'CLOSED_LOST', consumption: 600, location: 'São Paulo, SP', value: 25000 },
        { name: 'Condomínio Solar', status: 'NEW', consumption: 3500, location: 'Salvador, BA', value: 380000 },
        { name: 'Oficina Mecânica', status: 'CONTACTED', consumption: 550, location: 'Belo Horizonte, MG', value: 22000 },
    ];

    for (const lead of leadsData) {
        const createdLead = await prisma.lead.create({
            data: {
                name: lead.name,
                email: `contact@${lead.name.toLowerCase().replace(/\s/g, '')}.com`,
                consumption: lead.consumption,
                location: lead.location,
                status: lead.status, // Using the enum mapped string
                ownerId: user.id
            }
        });

        // 3. Create Proposal for relevant leads
        if (['PROPOSAL_SENT', 'NEGOTIATION', 'CLOSED_WON'].includes(lead.status)) {
            await prisma.proposal.create({
                data: {
                    title: `Proposta Solar - ${lead.name}`,
                    generationKwh: lead.consumption * 1.1, // 110% offset
                    systemSizeKwp: (lead.consumption / 120), // rough calc
                    totalPrice: lead.value,
                    paybackYears: 3.5,
                    savingsMonthly: lead.consumption * 0.95, // tariff mock
                    status: lead.status === 'CLOSED_WON' ? 'ACCEPTED' : 'SENT',
                    leadId: createdLead.id,
                    creatorId: user.id
                }
            });
        }
    }

    console.log('✅ Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

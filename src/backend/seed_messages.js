const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedMessages() {
    try {
        console.log('🌱 Seeding sample messages...\n');

        // Get all leads
        const leads = await prisma.lead.findMany({
            select: { id: true, name: true }
        });

        if (leads.length === 0) {
            console.log('⚠️  No leads found. Run seed_data.js first.');
            return;
        }

        // Get a user to be the sender
        const user = await prisma.user.findFirst();

        if (!user) {
            console.log('⚠️  No users found. Cannot create messages.');
            return;
        }

        // Sample conversation templates
        const conversationTemplates = [
            [
                { role: 'LEAD', content: 'Olá, gostaria de saber mais sobre energia solar.' },
                { role: 'USER', content: 'Olá! Fico feliz com seu interesse. Qual é o consumo médio mensal da sua residência?' },
                { role: 'LEAD', content: 'Minha conta vem em torno de R$ 450 por mês.' },
                { role: 'USER', content: 'Perfeito! Com esse consumo, podemos dimensionar um sistema que gere economia de até 95%. Vou preparar uma proposta personalizada para você.' },
            ],
            [
                { role: 'LEAD', content: 'Recebi a proposta. Quanto tempo leva a instalação?' },
                { role: 'USER', content: 'A instalação completa leva de 2 a 3 dias úteis após a aprovação do projeto pela concessionária.' },
                { role: 'LEAD', content: 'E a garantia dos painéis?' },
                { role: 'USER', content: 'Os painéis têm garantia de 25 anos de performance e 12 anos contra defeitos de fabricação.' },
            ],
            [
                { role: 'LEAD', content: 'Bom dia! Vi que vocês trabalham com financiamento.' },
                { role: 'USER', content: 'Sim! Temos parcerias com diversos bancos. As taxas começam em 1,49% ao mês.' },
                { role: 'LEAD', content: 'Interessante. Posso parcelar em quantas vezes?' },
                { role: 'USER', content: 'Até 120 meses. Vou enviar uma simulação para você analisar.' },
            ]
        ];

        let messageCount = 0;

        // Create messages for random leads
        for (let i = 0; i < Math.min(leads.length, 5); i++) {
            const lead = leads[i];
            const template = conversationTemplates[i % conversationTemplates.length];

            console.log(`Creating conversation for: ${lead.name}`);

            for (const msg of template) {
                try {
                    await prisma.message.create({
                        data: {
                            leadId: lead.id,
                            content: msg.content,
                            role: msg.role,
                            senderId: msg.role === 'USER' ? user.id : null,
                            isRead: true
                        }
                    });
                    messageCount++;
                } catch (err) {
                    console.error(`  ❌ Failed to create message for ${lead.name}:`, err.message);
                }
            }
        }

        console.log(`\n✅ Created ${messageCount} messages for ${Math.min(leads.length, 5)} leads`);
        console.log('\nSample messages:');

        const sampleMessages = await prisma.message.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                lead: { select: { name: true } }
            }
        });

        sampleMessages.forEach((m, idx) => {
            console.log(`${idx + 1}. [${m.role}] ${m.content.substring(0, 50)}... (Lead: ${m.lead.name})`);
        });

    } catch (error) {
        console.error('❌ Error seeding messages:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

seedMessages();

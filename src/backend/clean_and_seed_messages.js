const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAndSeed() {
    try {
        // Step 1: Delete ALL messages
        const deleted = await prisma.message.deleteMany();
        console.log(`✅ Deleted ${deleted.count} old messages\n`);

        // Step 2: Get leads
        const leads = await prisma.lead.findMany({
            select: { id: true, name: true }
        });

        if (leads.length === 0) {
            console.log('⚠️  No leads found.');
            return;
        }

        // Step 3: Get a user
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log('⚠️  No users found.');
            return;
        }

        // Step 4: Conversation templates
        const templates = [
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

        // Step 5: Create messages
        let count = 0;
        for (let i = 0; i < Math.min(leads.length, 5); i++) {
            const lead = leads[i];
            const template = templates[i % templates.length];

            console.log(`Creating conversation for: ${lead.name} (${lead.id.substring(0, 8)}...)`);

            for (const msg of template) {
                await prisma.message.create({
                    data: {
                        leadId: lead.id,
                        content: msg.content,
                        role: msg.role,
                        senderId: msg.role === 'USER' ? user.id : null,
                        isRead: true
                    }
                });
                count++;
            }
        }

        console.log(`\n✅ Created ${count} messages for ${Math.min(leads.length, 5)} leads`);

        // Step 6: Verify
        const verification = await prisma.message.groupBy({
            by: ['leadId'],
            _count: true
        });

        console.log('\n=== VERIFICATION ===');
        for (const v of verification) {
            const lead = leads.find(l => l.id === v.leadId);
            console.log(`${lead?.name || 'Unknown'}: ${v._count} messages`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

cleanAndSeed();

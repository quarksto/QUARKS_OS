const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMessages() {
    try {
        const totalMessages = await prisma.message.count();
        console.log('=== MENSAGENS NO BANCO ===');
        console.log(`Total: ${totalMessages}`);

        if (totalMessages > 0) {
            const sampleMessages = await prisma.message.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    lead: { select: { name: true } }
                }
            });

            console.log('\nÚltimas mensagens:');
            sampleMessages.forEach((m, idx) => {
                console.log(`\n${idx + 1}. ${m.role}: "${m.content.substring(0, 60)}..."`);
                console.log(`   Lead: ${m.lead?.name || 'N/A'}`);
                console.log(`   Data: ${new Date(m.createdAt).toLocaleString('pt-BR')}`);
            });
        } else {
            console.log('\n⚠️  Nenhuma mensagem encontrada no banco de dados.');
            console.log('O histórico de atendimento está vazio porque não há mensagens cadastradas.');
        }

    } catch (error) {
        console.error('Erro:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkMessages();

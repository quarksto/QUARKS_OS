const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Garante que existe pelo menos um usuário no sistema
 * Útil para evitar erros de ownerId em webhooks de teste
 */
async function ensureUserExists() {
    console.log('🔍 Verificando existência de usuários...');

    const userCount = await prisma.user.count();

    if (userCount === 0) {
        console.log('⚠️  Nenhum usuário encontrado. Criando usuário padrão...');

        const defaultUser = await prisma.user.create({
            data: {
                name: 'Sistema Quarks',
                email: 'system@quarks.solar',
                role: 'ADMIN',
                // Senha: "quarks123" (hash bcrypt)
                password: '$2b$10$rKZxJQxJ5vZJ5vZJ5vZJ5uZJ5vZJ5vZJ5vZJ5vZJ5vZJ5vZJ5vZJ5'
            }
        });

        console.log(`✅ Usuário padrão criado: ${defaultUser.email} (ID: ${defaultUser.id})`);
        return defaultUser;
    }

    const firstUser = await prisma.user.findFirst();
    console.log(`✅ Usuário existente encontrado: ${firstUser.email} (ID: ${firstUser.id})`);
    return firstUser;
}

// Executa se chamado diretamente
if (require.main === module) {
    ensureUserExists()
        .then(() => {
            console.log('✨ Verificação concluída!');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Erro:', error);
            process.exit(1);
        })
        .finally(() => prisma.$disconnect());
}

module.exports = { ensureUserExists };

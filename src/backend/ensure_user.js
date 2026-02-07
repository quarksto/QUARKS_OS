/**
 * ensure_user.js - Garante que existe um user padrão para webhooks
 * 
 * Pode ser chamado manualmente: node ensure_user.js
 * Ou importado e chamado no startup: require('./ensure_user')()
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function ensureDefaultUser() {
    const email = 'system@quarks.solar';

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {}, // Não atualiza nada se já existir
            create: {
                email,
                name: 'Sistema Quarks',
                password: 'hashed_system_password', // Em prod, usar hash real
                role: 'ADMIN'
            }
        });

        console.log(`✅ Default user ready: ${user.email} (ID: ${user.id})`);
        return user;
    } catch (error) {
        console.error('❌ Error ensuring default user:', error.message);
        throw error;
    }
}

// Se executado diretamente
if (require.main === module) {
    ensureDefaultUser()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = ensureDefaultUser;

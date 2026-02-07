const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
    const hashed = await bcrypt.hash('password123', 10);
    try {
        await prisma.user.update({ where: { email: 'demo@quarks.solar' }, data: { password: hashed } });
        console.log('Demo password updated');
    } catch (e) { console.error(e); }
}
main().finally(() => prisma.$disconnect());

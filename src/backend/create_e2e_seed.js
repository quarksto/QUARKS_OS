/**
 * Seed para testes E2E: cria o usuário Master (se não existir) e um lead de teste.
 * Uso: cd src/backend && node create_e2e_seed.js
 * Ver: docs/CREDENCIAIS_DESENVOLVIMENTO.md e e2e/README.md
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const MASTER_EMAIL = 'master@quarks.solar';
const MASTER_PASSWORD = 'master123';
const LEAD_NAME = 'Lead E2E Test';
const LEAD_EMAIL = 'lead-e2e@test.quarks.solar';

async function run() {
  console.log('🌱 E2E seed: Master user + 1 lead...\n');

  try {
    let user = await prisma.user.findUnique({ where: { email: MASTER_EMAIL } });
    if (!user) {
      const hashed = await bcrypt.hash(MASTER_PASSWORD, 10);
      user = await prisma.user.create({
        data: {
          email: MASTER_EMAIL,
          name: 'Master Admin',
          password: hashed,
          role: 'ADMIN',
        },
      });
      console.log('✅ Master user created:', user.email);
    } else {
      console.log('✅ Master user exists:', user.email);
    }

    const existing = await prisma.lead.findFirst({
      where: { ownerId: user.id, email: LEAD_EMAIL },
    });
    if (existing) {
      console.log('✅ Lead E2E already exists:', existing.id, existing.name);
      return;
    }

    const lead = await prisma.lead.create({
      data: {
        name: LEAD_NAME,
        email: LEAD_EMAIL,
        phone: '+5511999999999',
        consumption: 500,
        status: 'NEW',
        origin: 'E2E',
        ownerId: user.id,
      },
    });
    console.log('✅ Lead E2E created:', lead.id, lead.name);
    console.log('\n📌 Run E2E with: E2E_LOGIN_EMAIL=%s E2E_LOGIN_PASSWORD=%s npm run test:e2e', MASTER_EMAIL, MASTER_PASSWORD);
  } catch (e) {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();

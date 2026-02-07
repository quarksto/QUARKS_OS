/**
 * One-off: add size_kwp and price to kits table if missing.
 * Run: node prisma/add_kit_columns.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const client = prisma.$client;
  // Raw query to add columns (ignore error if already exist)
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "kits" ADD COLUMN "size_kwp" DOUBLE PRECISION;');
    console.log('Added column size_kwp');
  } catch (e) {
    if (e.code === '42701') console.log('Column size_kwp already exists');
    else throw e;
  }
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "kits" ADD COLUMN "price" DOUBLE PRECISION;');
    console.log('Added column price');
  } catch (e) {
    if (e.code === '42701') console.log('Column price already exists');
    else throw e;
  }
  console.log('Done.');
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

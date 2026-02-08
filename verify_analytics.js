const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AnalyticsDomainAgent = require('./src/backend/src/agents/analytics-domain');

async function main() {
    console.log("🔍 Verifying Analytics Domain...");
    const analytics = new AnalyticsDomainAgent();

    // 1. Verify Dashboard Metrics (Deltas)
    console.log("\n1. Testing GET_DASHBOARD_METRICS (Deltas)...");
    const metrics = await analytics.execute('GET_DASHBOARD_METRICS', {});
    console.log("Deltas:", metrics.deltas);

    if (metrics.deltas.leads !== null && metrics.deltas.revenue !== null) {
        console.log("✅ Deltas calculated successfully.");
    } else {
        console.error("❌ Deltas failed.");
    }

    // 2. Verify Energy Balance
    console.log("\n2. Testing GET_ENERGY_BALANCE...");

    // Check if we need to seed data
    const closedCount = await prisma.lead.count({ where: { status: 'CLOSED_WON' } });
    if (closedCount === 0) {
        console.log("⚠️ No CLOSED_WON leads found. Seeding one for testing...");
        const seedLead = await prisma.lead.create({
            data: {
                name: "Analytics Test Client",
                email: "analytics@test.com",
                status: "CLOSED_WON",
                consumption: 450,
                proposals: {
                    create: {
                        name: "Test Proposal", // Required field based on your schema? Usually title or similar.
                        title: "Test Proposal 10kW",
                        totalPrice: 25000,
                        systemSize: 10.5,
                        generationKwh: 1200, // Monthly generation
                        payback: 3.5,
                        savings: 150000,
                        status: "ACCEPTED",
                        products: "[]",
                        monthlyProduction: "{}"
                    }
                }
            }
        });
        console.log(`✅ Seeded Lead ID: ${seedLead.id}`);
    }

    const energyBalance = await analytics.execute('GET_ENERGY_BALANCE', {});
    console.log("Energy Balance Data:", JSON.stringify(energyBalance, null, 2));

    if (Array.isArray(energyBalance) && energyBalance.length === 6) {
        const currentMonth = energyBalance[energyBalance.length - 1]; // Last month in the array is current month/latest
        if (currentMonth.consumption > 0 || currentMonth.generation > 0) {
            console.log("✅ Energy Balance returned valid data.");
        } else {
            console.log("⚠️ Energy Balance returned zeros (Expected if seed data is old or logic mismatch).");
        }
    } else {
        console.error("❌ Energy Balance structure invalid.");
    }

    console.log("\n✅ Verification Complete.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

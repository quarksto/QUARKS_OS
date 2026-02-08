const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const lastProposal = await prisma.proposal.findFirst({
            orderBy: { createdAt: 'desc' },
            include: { lead: true }
        });

        if (lastProposal) {
            console.log('--- Last Proposal Found ---');
            console.log('ID:', lastProposal.id);
            console.log('Title:', lastProposal.title);
            console.log('Total Price:', lastProposal.totalPrice);
            console.log('Pricing Details (BOM):', JSON.stringify(lastProposal.pricingDetails, null, 2));
            console.log('Lead Name:', lastProposal.lead?.name);
            console.log('Lead State:', lastProposal.lead?.state);
        } else {
            console.log('No proposals found.');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();

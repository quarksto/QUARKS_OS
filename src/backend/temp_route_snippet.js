
// POST /api/proposals/draft - Create new draft proposal
router.post('/draft', authenticate, async (req, res) => {
    try {
        const ProposalDomain = require('../../agents/proposal-domain');
        // Accept leadId, kitId, customItems, calculation, etc.
        const { leadId, kitId, customItems, calculation, pricing, introduction, notes, paymentTerms } = req.body;

        const proposal = await ProposalDomain.createDraft(
            leadId,
            calculation,
            kitId,
            customItems,
            pricing,
            introduction,
            notes,
            paymentTerms
        );

        // Update creatorId to actual user
        const updated = await prisma.proposal.update({
            where: { id: proposal.id },
            data: { creatorId: req.user.id }
        });

        res.status(201).json(updated);
    } catch (error) {
        console.error('[Proposals] Error creating draft:', error.message);
        res.status(400).json({ error: error.message });
    }
});

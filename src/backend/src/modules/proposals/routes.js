/**
 * Proposals Routes - CRUD e Workflow de Propostas
 * 
 * Rotas:
 * - GET /api/proposals - Listar propostas (filter by leadId, status, creatorId)
 * - GET /api/proposals/:id - Detalhe com lead, kit, items
 * - PATCH /api/proposals/:id - Atualizar (status, discount, notes)
 * - DELETE /api/proposals/:id - Soft delete (status=EXPIRED)
 * - POST /api/proposals/:id/send - Enviar proposta
 * - POST /api/proposals/:id/view - Marcar como visualizada
 * - POST /api/proposals/:id/accept - Aceitar proposta
 * - POST /api/proposals/:id/reject - Rejeitar proposta
 * - POST /api/proposals/:id/generate-pdf - Gerar PDF
 */

const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../../middleware/auth');
const { sendProposalSentEmail } = require('../../services/emailService');

const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'proposals');
function ensureUploadsDir() {
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
}
function proposalDocumentPath(proposalId) {
    return path.join(UPLOADS_DIR, `${proposalId}.html`);
}

function generatePublicSlug() {
    return crypto.randomBytes(12).toString('base64url');
}

// ========== Public client link (no auth) - must be before /:id ==========
// GET /api/proposals/public/:slug - Get proposal by public slug (for client view)
router.get('/public/:slug', async (req, res) => {
    try {
        const proposal = await prisma.proposal.findFirst({
            where: { publicSlug: req.params.slug },
            include: { lead: { select: { name: true, location: true } }, kit: { select: { name: true } } }
        });
        if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
        res.json(proposal);
    } catch (error) {
        console.error('[Proposals] Error get public:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/proposals/public/:slug/view - Mark as viewed
router.post('/public/:slug/view', async (req, res) => {
    try {
        const proposal = await prisma.proposal.findFirst({
            where: { publicSlug: req.params.slug }
        });
        if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
        const updated = await prisma.proposal.update({
            where: { id: proposal.id },
            data: { status: 'VIEWED', viewedAt: new Date() }
        });
        res.json({ message: 'Proposal marked as viewed', proposal: updated });
    } catch (error) {
        console.error('[Proposals] Error view:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// POST /api/proposals/public/:slug/accept - Accept (client)
router.post('/public/:slug/accept', async (req, res) => {
    try {
        const proposal = await prisma.proposal.findFirst({
            where: { publicSlug: req.params.slug },
            include: { lead: true }
        });
        if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
        const updated = await prisma.proposal.update({
            where: { id: proposal.id },
            data: { status: 'ACCEPTED', acceptedAt: new Date() }
        });
        await prisma.lead.update({
            where: { id: proposal.leadId },
            data: { status: 'CLOSED_WON' }
        });
        res.json({ message: 'Proposal accepted', proposal: updated });
    } catch (error) {
        console.error('[Proposals] Error accept:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// POST /api/proposals/public/:slug/reject - Reject (client)
router.post('/public/:slug/reject', async (req, res) => {
    try {
        const { reason } = req.body;
        const proposal = await prisma.proposal.findFirst({
            where: { publicSlug: req.params.slug }
        });
        if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
        const updated = await prisma.proposal.update({
            where: { id: proposal.id },
            data: { status: 'REJECTED', rejectedAt: new Date(), rejectionReason: reason || null }
        });
        await prisma.lead.update({
            where: { id: proposal.leadId },
            data: { status: 'CLOSED_LOST' }
        });
        res.json({ message: 'Proposal rejected', proposal: updated });
    } catch (error) {
        console.error('[Proposals] Error reject:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// GET /api/proposals - List with filters
router.get('/', authenticate, async (req, res) => {
    try {
        const { leadId, status, creatorId, limit = 50 } = req.query;

        const where = {};
        if (leadId) where.leadId = leadId;
        if (status) where.status = status;
        if (creatorId) where.creatorId = creatorId;

        // Se não for ADMIN, só vê suas próprias propostas
        if (req.user.role !== 'ADMIN') {
            where.creatorId = req.user.id;
        }

        const proposals = await prisma.proposal.findMany({
            where,
            include: {
                lead: { select: { id: true, name: true, email: true, phone: true } },
                kit: { select: { id: true, name: true } },
                creator: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit)
        });

        res.json(proposals);
    } catch (error) {
        console.error('[Proposals] Error listing:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/proposals/:id/document - Serve persisted proposal document (HTML/PDF)
router.get('/:id/document', authenticate, async (req, res) => {
    try {
        const proposal = await prisma.proposal.findUnique({
            where: { id: req.params.id },
            select: { id: true, creatorId: true, pdfUrl: true }
        });
        if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
        if (req.user.role !== 'ADMIN' && proposal.creatorId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const filePath = proposalDocumentPath(proposal.id);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Document not generated yet' });
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `inline; filename="proposal-${proposal.id}.html"`);
        fs.createReadStream(filePath).pipe(res);
    } catch (error) {
        console.error('[Proposals] Error serving document:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/proposals/:id - Detail with relations
router.get('/:id', authenticate, async (req, res) => {
    try {
        const proposal = await prisma.proposal.findUnique({
            where: { id: req.params.id },
            include: {
                lead: true,
                kit: {
                    include: {
                        items: {
                            include: { product: true }
                        }
                    }
                },
                creator: { select: { id: true, name: true, email: true } }
            }
        });

        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        // Verificar permissão (ADMIN vê tudo, outros só suas propostas)
        if (req.user.role !== 'ADMIN' && proposal.creatorId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(proposal);
    } catch (error) {
        console.error('[Proposals] Error getting:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/proposals/:id - Update proposal
router.patch('/:id', authenticate, async (req, res) => {
    try {
        const allowed = [
            'title', 'totalPrice', 'discountPercent', 'discountAbsolute',
            'notes', 'expiresAt', 'status'
        ];
        const data = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                if (['totalPrice', 'discountPercent', 'discountAbsolute'].includes(key)) {
                    data[key] = parseFloat(req.body[key]);
                } else if (key === 'expiresAt') {
                    data[key] = new Date(req.body[key]);
                } else {
                    data[key] = req.body[key];
                }
            }
        }

        // Incrementar versão se preço mudar
        if (data.totalPrice || data.discountPercent || data.discountAbsolute) {
            data.version = { increment: 1 };
        }

        const proposal = await prisma.proposal.update({
            where: { id: req.params.id },
            data,
            include: { lead: true, kit: true }
        });

        res.json(proposal);
    } catch (error) {
        console.error('[Proposals] Error updating:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/proposals/:id - Soft delete (set status to EXPIRED)
router.delete('/:id', authenticate, authorize(['ADMIN', 'COMERCIAL']), async (req, res) => {
    try {
        await prisma.proposal.update({
            where: { id: req.params.id },
            data: { status: 'EXPIRED' }
        });

        res.status(204).send();
    } catch (error) {
        console.error('[Proposals] Error deleting:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// ========== Workflow Actions ==========

// POST /api/proposals/:id/send - Send proposal
router.post('/:id/send', authenticate, async (req, res) => {
    try {
        const existing = await prisma.proposal.findUnique({
            where: { id: req.params.id },
            include: { lead: { select: { email: true, name: true } } }
        });
        if (!existing) return res.status(404).json({ error: 'Proposal not found' });
        const publicSlug = existing.publicSlug || generatePublicSlug();
        const proposal = await prisma.proposal.update({
            where: { id: req.params.id },
            data: {
                status: 'SENT',
                sentAt: new Date(),
                publicSlug
            }
        });

        const emailSent = { sent: false };
        if (existing.lead?.email) {
            const result = await sendProposalSentEmail(
                existing.lead.email,
                existing.lead.name || undefined,
                publicSlug
            );
            emailSent.sent = result.sent;
            if (result.error) emailSent.error = result.error;
        }

        res.json({
            message: 'Proposal sent',
            proposal,
            clientLinkSlug: publicSlug,
            emailSent: emailSent.sent,
            emailError: emailSent.error || (existing.lead?.email ? undefined : 'Lead has no email')
        });
    } catch (error) {
        console.error('[Proposals] Error sending:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// POST /api/proposals/:id/view - Mark as viewed (can be public for client link)
router.post('/:id/view', async (req, res) => {
    try {
        const proposal = await prisma.proposal.update({
            where: { id: req.params.id },
            data: {
                status: 'VIEWED',
                viewedAt: new Date()
            }
        });

        res.json({ message: 'Proposal marked as viewed', proposal });
    } catch (error) {
        console.error('[Proposals] Error marking viewed:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// POST /api/proposals/:id/accept - Accept proposal
router.post('/:id/accept', async (req, res) => {
    try {
        const proposal = await prisma.proposal.update({
            where: { id: req.params.id },
            data: {
                status: 'ACCEPTED',
                acceptedAt: new Date()
            },
            include: { lead: true }
        });

        // Atualizar status do Lead para CLOSED_WON
        await prisma.lead.update({
            where: { id: proposal.leadId },
            data: { status: 'CLOSED_WON' }
        });

        res.json({ message: 'Proposal accepted', proposal });
    } catch (error) {
        console.error('[Proposals] Error accepting:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// POST /api/proposals/:id/reject - Reject proposal
router.post('/:id/reject', async (req, res) => {
    try {
        const { reason } = req.body;

        const proposal = await prisma.proposal.update({
            where: { id: req.params.id },
            data: {
                status: 'REJECTED',
                rejectedAt: new Date(),
                rejectionReason: reason || null
            },
            include: { lead: true }
        });

        // Atualizar status do Lead para CLOSED_LOST
        await prisma.lead.update({
            where: { id: proposal.leadId },
            data: { status: 'CLOSED_LOST' }
        });

        res.json({ message: 'Proposal rejected', proposal });
    } catch (error) {
        console.error('[Proposals] Error rejecting:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// POST /api/proposals/:id/generate-pdf - Generate PDF
router.post('/:id/generate-pdf', authenticate, async (req, res) => {
    try {
        const proposal = await prisma.proposal.findUnique({
            where: { id: req.params.id },
            include: {
                lead: true,
                kit: { include: { items: { include: { product: true } } } }
            }
        });

        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        // Chamar calc_engine para gerar HTML
        const axios = require('axios');
        const pythonUrl = process.env.PYTHON_ENGINE_URL || 'http://127.0.0.1:8000';

        const proposalData = {
            customer: {
                name: proposal.lead.name,
                city: proposal.lead.location?.split('-')[0]?.trim() || 'Cidade',
                state: proposal.lead.location?.slice(-2) || 'SP',
                consumption_avg: proposal.lead.consumption
            },
            generation: {
                system_size_kwp: proposal.systemSizeKwp,
                estimated_generation_monthly: proposal.generationKwh,
                panels_count: Math.ceil(proposal.systemSizeKwp / 0.55),
                area_required_m2: proposal.systemSizeKwp * 7
            },
            financials: {
                monthly_savings_year1: proposal.savingsMonthly,
                payback_years: proposal.paybackYears,
                total_savings_25y: proposal.savingsMonthly * 12 * 25,
                roi_percentage: 0,
                vpl: 0,
                irr: 0
            },
            tariff: {
                distributor: proposal.lead.distributor || 'Distribuidora',
                total_rate_with_taxes: 0.95
            },
            kit_name: proposal.kit?.name || 'Kit Sob Medida',
            integrator_name: 'Quarks Solar'
        };

        const response = await axios.post(`${pythonUrl}/generate/proposal`, proposalData);
        const html = response.data.html || '';

        ensureUploadsDir();
        const filePath = proposalDocumentPath(proposal.id);
        fs.writeFileSync(filePath, html, 'utf8');

        const stablePdfUrl = `/api/proposals/${proposal.id}/document`;
        await prisma.proposal.update({
            where: { id: req.params.id },
            data: { pdfUrl: stablePdfUrl }
        });

        res.json({
            message: 'PDF generated',
            pdfUrl: stablePdfUrl,
            html
        });
    } catch (error) {
        console.error('[Proposals] Error generating PDF:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

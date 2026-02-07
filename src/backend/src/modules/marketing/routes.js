const express = require('express');
const router = express.Router();
const AdapterFactory = require('./adapters');
const { maestro } = require('../../orchestrator/maestro'); // Using Maestro to route to LeadDomain
const logger = require('pino')();

// Webhook unificado — URL padronizada: POST /api/marketing/webhook/:source (source: facebook, google, tiktok)
router.post('/webhook/:source', async (req, res) => {
    const { source } = req.params;
    const payload = req.body;

    try {
        logger.info(`[Marketing] Received webhook from ${source}`);

        // 1. Selecionar Adaptador
        const adapter = AdapterFactory.getAdapter(source);

        // 2. Normalizar Dados
        const normalizedLead = adapter.normalize(payload);
        logger.info(`[Marketing] Normalized lead: ${normalizedLead.email}`);

        // 3. Enviar para LeadDomain via Maestro (ou direto se preferir)
        // Ação: CREATE_LEAD
        const result = await maestro.execute('CREATE_LEAD_WORKFLOW', normalizedLead);

        res.status(200).json({ success: true, id: result.id });
    } catch (error) {
        logger.error(`[Marketing] Error processing webhook: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

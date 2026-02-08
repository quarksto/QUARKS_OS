const express = require('express');
const router = express.Router();
const { maestro } = require('../../orchestrator/maestro');
const { authenticate, authorize } = require('../../middleware/auth');

// Agent Name: 'service' (Make sure to register this in Maestro/Server)

// GET /api/services
router.get('/', async (req, res) => {
    try {
        const services = await maestro.agents['service'].execute('LIST_SERVICES', {});
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
    try {
        const service = await maestro.agents['service'].execute('GET_SERVICE', { id: req.params.id });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/services (Admin)
router.post('/', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const service = await maestro.agents['service'].execute('CREATE_SERVICE', req.body);
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST /api/services/prices (Add Price Rule)
router.post('/prices', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const price = await maestro.agents['service'].execute('ADD_PRICE', req.body);
        res.status(201).json(price);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/services/prices/:id
router.delete('/prices/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        await maestro.agents['service'].execute('DELETE_PRICE', { id: req.params.id });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

/**
 * Inventory Routes - CRUD de Products e Kits
 * 
 * Rotas:
 * - GET /api/products - Listar produtos
 * - GET /api/products/:id - Detalhe do produto
 * - POST /api/products - Criar produto (ADMIN)
 * - PATCH /api/products/:id - Atualizar produto (ADMIN)
 * - DELETE /api/products/:id - Soft delete (ADMIN)
 * - GET /api/kits - Listar kits
 * - GET /api/kits/:id - Detalhe com items
 * - POST /api/kits - Criar kit (ADMIN)
 * - PATCH /api/kits/:id - Atualizar kit (ADMIN)
 * - DELETE /api/kits/:id - Soft delete (ADMIN)
 * - POST /api/kits/:id/items - Adicionar item ao kit (ADMIN)
 * - DELETE /api/kits/:id/items/:itemId - Remover item do kit (ADMIN)
 */

const express = require('express');
const router = express.Router();
const { maestro } = require('../../orchestrator/maestro');
const { authenticate, authorize } = require('../../middleware/auth');

// ========== Products ==========

// GET /api/products
router.get('/products', async (req, res) => {
    try {
        const { type, active } = req.query;
        const products = await maestro.agents['inventory'].execute('LIST_PRODUCTS', {
            type,
            active: active !== 'false'
        });
        res.json(products);
    } catch (error) {
        console.error('[Inventory] Error listing products:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/products/:id
router.get('/products/:id', async (req, res) => {
    try {
        const product = await maestro.agents['inventory'].execute('GET_PRODUCT', {
            id: req.params.id
        });
        res.json(product);
    } catch (error) {
        console.error('[Inventory] Error getting product:', error.message);
        res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
    }
});

// POST /api/products (protected - ADMIN only)
router.post('/products', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const product = await maestro.agents['inventory'].execute('CREATE_PRODUCT', req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('[Inventory] Error creating product:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// PATCH /api/products/:id (protected - ADMIN only)
router.patch('/products/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const product = await maestro.agents['inventory'].execute('UPDATE_PRODUCT', {
            id: req.params.id,
            data: req.body
        });
        res.json(product);
    } catch (error) {
        console.error('[Inventory] Error updating product:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/products/:id (protected - ADMIN only)
router.delete('/products/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        await maestro.agents['inventory'].execute('DELETE_PRODUCT', {
            id: req.params.id
        });
        res.status(204).send();
    } catch (error) {
        console.error('[Inventory] Error deleting product:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// ========== Kits ==========

// GET /api/kits
router.get('/kits', async (req, res) => {
    try {
        const { active } = req.query;
        const kits = await maestro.agents['inventory'].execute('LIST_KITS', {
            active: active !== 'false'
        });
        res.json(kits);
    } catch (error) {
        console.error('[Inventory] Error listing kits:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/kits/:id
router.get('/kits/:id', async (req, res) => {
    try {
        const kit = await maestro.agents['inventory'].execute('GET_KIT', {
            id: req.params.id
        });
        res.json(kit);
    } catch (error) {
        console.error('[Inventory] Error getting kit:', error.message);
        res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
    }
});

// POST /api/kits (protected - ADMIN only)
router.post('/kits', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const kit = await maestro.agents['inventory'].execute('CREATE_KIT', req.body);
        res.status(201).json(kit);
    } catch (error) {
        console.error('[Inventory] Error creating kit:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// PATCH /api/kits/:id (protected - ADMIN only)
router.patch('/kits/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const kit = await maestro.agents['inventory'].execute('UPDATE_KIT', {
            id: req.params.id,
            data: req.body
        });
        res.json(kit);
    } catch (error) {
        console.error('[Inventory] Error updating kit:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/kits/:id (protected - ADMIN only)
router.delete('/kits/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        await maestro.agents['inventory'].execute('DELETE_KIT', {
            id: req.params.id
        });
        res.status(204).send();
    } catch (error) {
        console.error('[Inventory] Error deleting kit:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// POST /api/kits/:id/items (protected - ADMIN only)
router.post('/kits/:id/items', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const item = await maestro.agents['inventory'].execute('ADD_KIT_ITEM', {
            kitId: req.params.id,
            productId: req.body.productId,
            quantity: req.body.quantity || 1
        });
        res.status(201).json(item);
    } catch (error) {
        console.error('[Inventory] Error adding kit item:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/kits/:id/items/:itemId (protected - ADMIN only)
router.delete('/kits/:id/items/:itemId', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        await maestro.agents['inventory'].execute('REMOVE_KIT_ITEM', {
            id: req.params.itemId
        });
        res.status(204).send();
    } catch (error) {
        console.error('[Inventory] Error removing kit item:', error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

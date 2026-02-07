/**
 * InventoryDomainAgent - CRUD de Products e Kits
 */

const BaseDomainAgent = require('../base');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class InventoryDomainAgent extends BaseDomainAgent {
    constructor() {
        super('inventory');
    }

    async execute(action, payload) {
        console.log(`[InventoryDomain] Received action: ${action}`);

        switch (action) {
            // Products
            case 'LIST_PRODUCTS':
                return await this.listProducts(payload);
            case 'GET_PRODUCT':
                return await this.getProduct(payload.id);
            case 'CREATE_PRODUCT':
                return await this.createProduct(payload);
            case 'UPDATE_PRODUCT':
                return await this.updateProduct(payload.id, payload.data);
            case 'DELETE_PRODUCT':
                return await this.deleteProduct(payload.id);

            // Kits
            case 'LIST_KITS':
                return await this.listKits(payload);
            case 'GET_KIT':
                return await this.getKit(payload.id);
            case 'CREATE_KIT':
                return await this.createKit(payload);
            case 'UPDATE_KIT':
                return await this.updateKit(payload.id, payload.data);
            case 'DELETE_KIT':
                return await this.deleteKit(payload.id);

            // Kit Items
            case 'ADD_KIT_ITEM':
                return await this.addKitItem(payload);
            case 'REMOVE_KIT_ITEM':
                return await this.removeKitItem(payload.id);

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    // ========== Products ==========

    async listProducts({ type, active = true } = {}) {
        const where = { active };
        if (type) where.type = type;

        return await prisma.product.findMany({
            where,
            orderBy: { name: 'asc' }
        });
    }

    async getProduct(id) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                kits: {
                    include: { kit: true }
                }
            }
        });
        if (!product) throw new Error(`Product not found: ${id}`);
        return product;
    }

    async createProduct(data) {
        const { sku, name, description, type, costPrice, supplier, specs } = data;

        if (!sku || !name || !type || costPrice === undefined) {
            throw new Error('Missing required fields: sku, name, type, costPrice');
        }

        return await prisma.product.create({
            data: {
                sku,
                name,
                description,
                type,
                costPrice: parseFloat(costPrice),
                supplier,
                specs: specs || null,
                active: true
            }
        });
    }

    async updateProduct(id, data) {
        const allowed = ['name', 'description', 'type', 'costPrice', 'supplier', 'specs', 'active'];
        const safe = {};
        for (const k of allowed) {
            if (data[k] !== undefined) {
                safe[k] = k === 'costPrice' ? parseFloat(data[k]) : data[k];
            }
        }

        return await prisma.product.update({
            where: { id },
            data: safe
        });
    }

    async deleteProduct(id) {
        // Soft delete
        return await prisma.product.update({
            where: { id },
            data: { active: false }
        });
    }

    // ========== Kits ==========

    async listKits({ active = true } = {}) {
        return await prisma.kit.findMany({
            where: { active },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { name: 'asc' }
        });
    }

    async getKit(id) {
        const kit = await prisma.kit.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
        if (!kit) throw new Error(`Kit not found: ${id}`);

        // Calcular custo total do kit
        const totalCost = kit.items.reduce((sum, item) => {
            return sum + (item.product.costPrice * item.quantity);
        }, 0);

        return { ...kit, totalCost };
    }

    async createKit(data) {
        const { name, description, items } = data;

        if (!name) {
            throw new Error('Missing required field: name');
        }

        // Criar kit com itens
        return await prisma.kit.create({
            data: {
                name,
                description,
                active: true,
                items: items ? {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity || 1
                    }))
                } : undefined
            },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
    }

    async updateKit(id, data) {
        const allowed = ['name', 'description', 'active'];
        const safe = {};
        for (const k of allowed) {
            if (data[k] !== undefined) safe[k] = data[k];
        }

        return await prisma.kit.update({
            where: { id },
            data: safe,
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
    }

    async deleteKit(id) {
        // Soft delete
        return await prisma.kit.update({
            where: { id },
            data: { active: false }
        });
    }

    // ========== Kit Items ==========

    async addKitItem({ kitId, productId, quantity = 1 }) {
        if (!kitId || !productId) {
            throw new Error('Missing required fields: kitId, productId');
        }

        return await prisma.kitItem.create({
            data: {
                kitId,
                productId,
                quantity
            },
            include: { product: true }
        });
    }

    async removeKitItem(id) {
        return await prisma.kitItem.delete({
            where: { id }
        });
    }
}

module.exports = new InventoryDomainAgent();

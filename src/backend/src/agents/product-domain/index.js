const BaseDomainAgent = require('../base');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductDomainAgent extends BaseDomainAgent {
    constructor() {
        super('product');
    }

    async execute(action, payload) {
        console.log(`[ProductDomain] Received action: ${action}`);

        switch (action) {
            case 'CREATE_PRODUCT':
                return await this.createProduct(payload);
            case 'LIST_PRODUCTS':
                return await this.listProducts(payload);
            case 'GET_PRODUCT':
                return await this.getProduct(payload.id);
            case 'FIND_BEST_KIT':
                return await this.findBestKit(payload);
            case 'QUERY_CATALOG':
                return await this.queryCatalog(payload);
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    async createProduct(data) {
        // Basic validation
        if (!data.sku || !data.name || !data.type || !data.costPrice) {
            throw new Error('Missing required product fields');
        }

        const product = await prisma.product.create({
            data: {
                sku: data.sku,
                name: data.name,
                description: data.description,
                type: data.type, // MODULE, INVERTER, etc.
                costPrice: parseFloat(data.costPrice),
                supplier: data.supplier,
                specs: data.specs || {},
                active: true
            }
        });

        console.log(`[ProductDomain] Created product: ${product.sku}`);
        return product;
    }

    async listProducts(filters = {}) {
        return await prisma.product.findMany({
            where: {
                active: true,
                ...filters
            }
        });
    }

    async getProduct(id) {
        return await prisma.product.findUnique({
            where: { id }
        });
    }

    async findBestKit(requiredKwp) {
        console.log(`[ProductDomain] Searching best kit for ${requiredKwp} kWp...`);

        // 1. Fetch all active kits with their items and product specs
        const kits = await prisma.kit.findMany({
            where: { active: true },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        // 2. Calculate Power for each kit (Sum of Modules)
        const ratedKits = kits.map(kit => {
            let powerW = 0;
            kit.items.forEach(item => {
                if (item.product.type === 'MODULE' && item.product.specs) {
                    // specs is JSON, e.g. { power: 550 }
                    const p = item.product.specs.power || 0;
                    powerW += p * item.quantity;
                }
            });
            return { ...kit, powerKwp: powerW / 1000 };
        });

        // 3. Filter valid kits (Power >= Required * 0.9) - allowing 10% undersizing
        // Then Sort by closeness to target
        const validKits = ratedKits.filter(k => k.powerKwp >= (requiredKwp * 0.9));

        validKits.sort((a, b) => a.powerKwp - b.powerKwp); // Sort ascending (smallest valid first)

        if (validKits.length === 0) {
            console.warn(`[ProductDomain] No kit found for ${requiredKwp} kWp. Returning largest available.`);
            // Fallback: return largest
            ratedKits.sort((a, b) => b.powerKwp - a.powerKwp);
            return ratedKits.length > 0 ? ratedKits[0] : null;
        }

        const best = validKits[0];
        console.log(`[ProductDomain] Selected Kit: ${best.name} (${best.powerKwp} kWp)`);
        return best;
    }

    /**
     * Returns product catalog summary for RAG-style questions (warranty, specs, etc.).
     * @param {Object} payload
     * @param {string} [payload.query] - Optional search term to filter products (e.g. "inversor", "garantia")
     */
    async queryCatalog({ query } = {}) {
        const products = await prisma.product.findMany({
            where: { active: true },
            include: { _count: { select: { kitItems: true } } }
        });

        const q = (query || '').toLowerCase();
        let filtered = products;
        if (q) {
            filtered = products.filter(p =>
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q)) ||
                (p.type && p.type.toLowerCase().includes(q)) ||
                (JSON.stringify(p.specs || {}).toLowerCase().includes(q))
            );
        }

        const items = (filtered.length > 0 ? filtered : products)
            .slice(0, 20)
            .map(p => ({
                id: p.id,
                sku: p.sku,
                name: p.name,
                type: p.type,
                description: p.description,
                specs: p.specs,
                supplier: p.supplier
            }));

        return { products: items, total: products.length };
    }
}

module.exports = new ProductDomainAgent();

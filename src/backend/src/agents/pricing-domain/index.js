const BaseDomainAgent = require('../base');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PricingDomainAgent extends BaseDomainAgent {
    constructor() {
        super('pricing');
    }

    async execute(action, payload) {
        console.log(`[PricingDomain] Received action: ${action}`);

        switch (action) {
            case 'CALCULATE_PRICE':
                return await this.calculatePrice(payload);
            case 'FIND_RULE':
                return await this.findRule(payload);
            case 'LIST_RULES':
                return await this.listRules(payload);
            case 'CREATE_RULE':
                return await this.createRule(payload);
            case 'UPDATE_RULE':
                return await this.updateRule(payload.id, payload.data);
            case 'DELETE_RULE':
                return await this.deleteRule(payload.id);
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    /**
     * Encontra a regra de pricing mais adequada baseada em state e kWp
     */
    async findRule({ state, kWp = 0 }) {
        const power = parseFloat(kWp);

        // Buscar regra que corresponde ao power range
        const rule = await prisma.pricingRule.findFirst({
            where: {
                active: true,
                minPower: { lte: power },
                maxPower: { gte: power }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (rule) {
            return rule;
        }

        // Fallback: regra padrão
        const defaultRule = await prisma.pricingRule.findFirst({
            where: { active: true },
            orderBy: { createdAt: 'desc' }
        });

        if (defaultRule) {
            return { ...defaultRule, isDefault: true };
        }

        // Retorna valores hardcoded como último fallback
        return {
            id: null,
            name: 'FALLBACK_HARDCODED',
            targetMargin: 0.20,
            taxRate: 0.12,
            minPower: 0,
            maxPower: 999,
            isDefault: true,
            isFallback: true
        };
    }

    async calculatePrice({ kit, state, kWp }) {
        if (!kit) throw new Error('Kit is required for pricing');

        const systemPower = kWp || kit.powerKwp || 0;
        console.log(`[PricingDomain] Calculating price for Kit: ${kit.name} | ${systemPower}kWp | State: ${state || 'Default'}`);

        // 1. Calculate Base Cost (Sum of all items cost)
        let totalCost = 0;

        if (!kit.items || kit.items.length === 0) {
            console.warn('[PricingDomain] Kit has no items. Using fallback cost.');
            return { totalPrice: 0, baseCost: 0, margin: 0, taxRate: 0 };
        }

        for (const item of kit.items) {
            if (item.product && item.product.costPrice) {
                totalCost += item.product.costPrice * item.quantity;
            }
        }

        console.log(`[PricingDomain] Base Hardware Cost: R$ ${totalCost.toFixed(2)}`);

        // 2. Fetch Pricing Rules (Margin & Tax)
        const rule = await this.findRule({ state, kWp: systemPower });

        const margin = rule.targetMargin || 0.20;
        const tax = rule.taxRate || 0.12;

        // 3. Mark-up Calculation
        // Price = Cost * (1 + Margin) / (1 - Tax)
        const priceWithMargin = totalCost * (1 + margin);
        const finalPrice = priceWithMargin / (1 - tax);

        console.log(`[PricingDomain] Rule: ${rule.name} (${rule.isDefault ? 'default' : 'matched'})`);
        console.log(`[PricingDomain] Applied: Margin ${(margin * 100).toFixed(1)}%, Tax ${(tax * 100).toFixed(1)}%`);
        console.log(`[PricingDomain] Final Price: R$ ${finalPrice.toFixed(2)}`);

        return {
            totalPrice: parseFloat(finalPrice.toFixed(2)),
            baseCost: totalCost,
            margin: margin,
            taxRate: tax,
            ruleId: rule.id,
            ruleName: rule.name,
            isDefaultRule: !!rule.isDefault,
            breakdown: {
                hardware: totalCost,
                grossMargin: priceWithMargin - totalCost,
                estimatedTaxes: finalPrice - priceWithMargin
            }
        };
    }

    // ========== CRUD Operations ==========

    async listRules({ active = true } = {}) {
        return await prisma.pricingRule.findMany({
            where: { active },
            orderBy: [{ minPower: 'asc' }, { createdAt: 'desc' }]
        });
    }

    async createRule(data) {
        const { name, minPower, maxPower, targetMargin, taxRate } = data;

        if (!name || targetMargin === undefined || taxRate === undefined) {
            throw new Error('Missing required fields: name, targetMargin, taxRate');
        }

        return await prisma.pricingRule.create({
            data: {
                name,
                minPower: parseFloat(minPower) || 0,
                maxPower: parseFloat(maxPower) || 999,
                targetMargin: parseFloat(targetMargin),
                taxRate: parseFloat(taxRate),
                active: true
            }
        });
    }

    async updateRule(id, data) {
        const allowed = ['name', 'minPower', 'maxPower', 'targetMargin', 'taxRate', 'active'];
        const safe = {};

        for (const key of allowed) {
            if (data[key] !== undefined) {
                if (['minPower', 'maxPower', 'targetMargin', 'taxRate'].includes(key)) {
                    safe[key] = parseFloat(data[key]);
                } else {
                    safe[key] = data[key];
                }
            }
        }

        return await prisma.pricingRule.update({
            where: { id },
            data: safe
        });
    }

    async deleteRule(id) {
        // Soft delete
        return await prisma.pricingRule.update({
            where: { id },
            data: { active: false }
        });
    }
}

module.exports = new PricingDomainAgent();


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
            case 'GET_RULE':
                return await this.getRule(payload.id);
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

    async getRule(id) {
        const rule = await prisma.pricingRule.findUnique({ where: { id } });
        if (!rule) throw new Error(`Rule not found: ${id}`);
        return rule;
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

    async calculateServices({ state, systemPower }) {
        console.log(`[PricingDomain] Calculating services for State: ${state || 'National'}, Power: ${systemPower}kWp`);

        // 1. Fetch active services (Installation, Engineering, Homologation, etc.)
        const services = await prisma.service.findMany({
            where: { active: true },
            include: {
                prices: {
                    where: {
                        active: true,
                        minPower: { lte: systemPower },
                        maxPower: { gte: systemPower },
                        OR: [
                            { state: state },       // Match State
                            { state: null }         // OR National (fallback)
                        ]
                    },
                    orderBy: { state: 'desc' } // Prefer State specific price over null
                }
            }
        });

        let totalServiceCost = 0;
        const breakdown = {};

        for (const service of services) {
            // Find best matching price (State specific > National)
            // Since we ordered by state desc, if we have both, the one with state will be first (string vs null)
            // Note: This logic assumes 'state' string comes before null in sort, or we explicitly check.
            // Better to filter manually to be safe.
            let priceRule = service.prices.find(p => p.state === state);
            if (!priceRule) priceRule = service.prices.find(p => p.state === null);

            if (!priceRule) {
                console.warn(`[PricingDomain] No price found for service: ${service.name} in context.`);
                continue;
            }

            let cost = 0;
            switch (priceRule.priceType) {
                case 'FIXED':
                    cost = priceRule.priceValue;
                    break;
                case 'PER_WATT':
                    cost = priceRule.priceValue * (systemPower * 1000); // Wp
                    break;
                case 'PERCENT':
                    // Percent needs Hardware Cost, passed as context? For now ignoring, implementing simple logic first.
                    console.warn('[PricingDomain] PERCENT service price not yet supported without context.');
                    break;
                default:
                    break;
            }

            totalServiceCost += cost;
            breakdown[service.type] = {
                name: service.name,
                cost: parseFloat(cost.toFixed(2)),
                rule: priceRule.priceType
            };
        }

        return {
            total: parseFloat(totalServiceCost.toFixed(2)),
            details: breakdown
        };
    }

    async calculatePrice({ kit, state, kWp }) {
        if (!kit) throw new Error('Kit is required for pricing');

        const systemPower = parseFloat(kWp) || kit.size_kwp || kit.powerKwp || 0;
        console.log(`[PricingDomain] Calculating price for Kit: ${kit.name} | ${systemPower}kWp | State: ${state || 'Default'}`);

        // 1. Calculate Base Hardware Cost
        let hardwareCost = 0;

        // Check if Kit has direct price or items
        if (kit.items && kit.items.length > 0) {
            for (const item of kit.items) {
                if (item.product && item.product.costPrice) {
                    hardwareCost += item.product.costPrice * item.quantity;
                }
            }
        } else if (kit.price) {
            // Fallback to kit base price if items not available
            hardwareCost = kit.price;
        } else {
            console.warn('[PricingDomain] Kit has no items and no base price. Using fallback cost.');
        }

        console.log(`[PricingDomain] Base Hardware Cost: R$ ${hardwareCost.toFixed(2)}`);

        // 2. Calculate Services Cost
        const services = await this.calculateServices({ state, systemPower });
        console.log(`[PricingDomain] Services Cost: R$ ${services.total.toFixed(2)}`);

        // 3. Fetch Pricing Rules (Margin & Tax)
        const rule = await this.findRule({ state, kWp: systemPower });
        const margin = rule.targetMargin || 0.20;
        const tax = rule.taxRate || 0.12;

        // 4. Mark-up Calculation
        // Total Base = Hardware + Services
        const totalBase = hardwareCost + services.total;

        // Price = TotalBase * (1 + Margin) / (1 - Tax)
        const priceWithMargin = totalBase * (1 + margin);
        const finalPrice = priceWithMargin / (1 - tax);

        console.log(`[PricingDomain] Base Total: R$ ${totalBase.toFixed(2)}`);
        console.log(`[PricingDomain] Rule: ${rule.name} (${rule.isDefault ? 'default' : 'matched'})`);
        console.log(`[PricingDomain] Final Price: R$ ${finalPrice.toFixed(2)}`);

        return {
            totalPrice: parseFloat(finalPrice.toFixed(2)),
            baseCost: totalBase,
            margin: margin,
            taxRate: tax,
            ruleId: rule.id,
            ruleName: rule.name,
            isDefaultRule: !!rule.isDefault,
            breakdown: {
                hardware: parseFloat(hardwareCost.toFixed(2)),
                services: services.total,
                servicesDetails: services.details,
                grossMargin: parseFloat((priceWithMargin - totalBase).toFixed(2)),
                estimatedTaxes: parseFloat((finalPrice - priceWithMargin).toFixed(2))
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


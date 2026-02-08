const EventEmitter = require('events');
const proposalAgent = require('../agents/proposal-domain');
const productAgent = require('../agents/product-domain');

class EventBus extends EventEmitter { }
const bus = new EventBus();

class MaestroAgent {
    constructor() {
        this.agents = {};
        this.bus = bus;

        // Register Core Agents
        this.registerAgent('lead', require('../agents/lead-domain'));
        this.registerAgent('calc', require('../agents/calc-domain'));
        this.registerAgent('proposal', proposalAgent);
        this.registerAgent('product', productAgent);
        this.registerAgent('pricing', require('../agents/pricing-domain'));
        const CopilotDomainAgent = require('../agents/copilot-domain');
        this.registerAgent('copilot', new CopilotDomainAgent(this));
        // Visual Design (Sprint 6)
        this.registerAgent('visual', require('../modules/visual-design'));
        // Analytics (Sprint 7)
        this.registerAgent('analytics', new (require('../agents/analytics-domain'))());
    }

    registerAgent(domain, agent) {
        this.agents[domain] = agent;
        console.log(`[Maestro] Registered agent: ${domain}`);
    }

    async execute(workflowName, payload) {
        console.log(`[Maestro] Starting workflow: ${workflowName}`);

        try {
            switch (workflowName) {
                case 'CREATE_PROPOSAL_WORKFLOW':
                    return await this.workflowCreateProposal(payload);
                case 'CREATE_LEAD_WORKFLOW':
                    return await this.workflowCreateLead(payload);
                case 'PREVIEW_PROPOSAL_WORKFLOW':
                    return await this.workflowPreviewProposal(payload);
                case 'GET_PROJECTS_SUMMARY':
                    return await this.agents['project'].execute('GET_PROJECTS', payload);
                case 'GET_PROJECT_DETAILS':
                    return await this.agents['project'].execute('GET_PROJECT', payload);
                default:
                    throw new Error(`Unknown workflow: ${workflowName}`);
            }
        } catch (error) {
            console.error(`[Maestro] Workflow failed: ${error.message}`);
            throw error;
        }
    }

    async workflowCreateLead(leadData) {
        if (!this.agents['lead']) throw new Error('Lead Agent not available');
        return await this.agents['lead'].execute('CREATE_LEAD', leadData);
    }

    async workflowCreateProposal({ leadId, consumption, introduction, notes, paymentTerms }) {
        // Fluxo integrado ao catálogo (spec 06): Products, Kits, PricingRules.
        // 1. Get Lead Data
        if (!this.agents['lead']) throw new Error('Lead Agent not available');
        const lead = await this.agents['lead'].execute('GET_LEAD', { id: leadId });

        // 2. Solar Calculation
        if (!this.agents['calc']) throw new Error('Calc Agent not available');
        const calculation = await this.agents['calc'].execute('CALCULATE_GENERATION', { consumption: consumption || lead.consumption });

        // 3. Kit Selection (NEW)
        if (!this.agents['product']) throw new Error('Product Agent not available');
        const bestKit = await this.agents['product'].execute('FIND_BEST_KIT', calculation.systemSizeKwp ?? calculation.system_size_kwp ?? 5);

        // 4. Pricing Calculation (NEW)
        if (!this.agents['pricing']) throw new Error('Pricing Agent not available');
        const pricing = await this.agents['pricing'].execute('CALCULATE_PRICE', {
            kit: bestKit,
            state: lead.location ? lead.location.slice(-2) : 'SP',
            kWp: calculation.systemSizeKwp ?? calculation.system_size_kwp ?? 5
        });

        // 5. Create Draft Proposal
        if (!this.agents['proposal']) throw new Error('Proposal Agent not available');
        const proposal = await this.agents['proposal'].execute('CREATE_DRAFT', {
            lead,
            calculation,
            kit: bestKit,
            pricing,
            introduction,
            notes,
            paymentTerms
        });

        return proposal;
    }

    async workflowPreviewProposal({ customer, consumption, distributor, kit, introduction, notes, paymentTerms }) {
        // 1. Calculate Generation (Python)
        if (!this.agents['calc']) throw new Error('Calc Agent not available');
        const calculation = await this.agents['calc'].execute('CALCULATE_GENERATION', { consumption: consumption });

        // 2. Select Kit (Node)
        if (!this.agents['product']) throw new Error('Product Agent not available');

        let selectedKit = reqPayload.kit;
        // If no custom kit passed, find best preset
        if (!selectedKit || (!selectedKit.id && !selectedKit.isCustom)) {
            selectedKit = await this.agents['product'].execute('FIND_BEST_KIT', calculation.systemSizeKwp ?? calculation.system_size_kwp ?? 5);
        }

        // 3. Pricing (Node)
        if (!this.agents['pricing']) throw new Error('Pricing Agent not available');
        const pricing = await this.agents['pricing'].execute('CALCULATE_PRICE', {
            kit: selectedKit,
            state: customer.state || 'SP',
            kWp: calculation.systemSizeKwp ?? calculation.system_size_kwp ?? 5
        });

        // 4. Tariff Real (Python) - Now using CalcDomain
        const tariffData = await this.agents['calc'].execute('GET_TARIFF', {
            distributor: distributor || 'CEMIG', // Default fallback
            state: customer.state || 'MG',
            consumption: consumption
        });

        // 5. ROI Real (Python) - Now using CalcDomain
        const safePrice = (pricing && pricing.totalPrice) ? pricing.totalPrice : 15000;
        const roiData = await this.agents['calc'].execute('CALCULATE_ROI', {
            systemCost: safePrice,
            generationMonthly: calculation.generationMonthly,
            tariffPrice: tariffData.price_kwh || 0.95
        });

        // 6. Structure Data for Python Generator (calc returns camelCase)
        const kwp = calculation.systemSizeKwp ?? calculation.system_size_kwp ?? 0;
        const proposalData = {
            customer: {
                name: customer.name || "Cliente",
                city: customer.city || "Cidade",
                state: customer.state || "SP",
                consumption_avg: consumption || 0
            },
            generation: {
                system_size_kwp: kwp,
                estimated_generation_monthly: calculation.generationMonthly ?? calculation.estimated_generation_monthly ?? 0,
                panels_count: calculation.panelsCount ?? calculation.panels_count ?? 0,
                area_required_m2: calculation.areaRequired ?? calculation.area_required_m2 ?? 0
            },
            financials: {
                monthly_savings_year1: roiData.monthly_savings,
                payback_years: roiData.payback_years,
                total_savings_25y: roiData.total_savings,
                roi_percentage: roiData.roi_percentage,
                vpl: 0, // Python engine currently doesn't return VPL in simple ROI endpoint yet
                irr: 0
            },
            tariff: {
                distributor: tariffData.distributor,
                total_rate_with_taxes: tariffData.price_kwh,
                components: tariffData.flags // Passing flags as components for now to match schema
            },
            kit_name: selectedKit ? selectedKit.name : "Kit Sob Medida",
            introduction: introduction,
            notes: notes,
            payment_terms: paymentTerms,
            integrator_name: "Quarks Solar (Full Stack)"
        };

        // 6. Generate HTML Preview (Python)
        const previewResult = await this.agents['proposal'].generatePreview(proposalData);

        // Return both HTML and Pricing Data
        return {
            html_content: previewResult.html_content || previewResult, // handles both raw string or obj
            pricing: {
                total: pricing.totalPrice,
                breakdown: pricing.breakdown
            }
        };
    }
}
const maestro = new MaestroAgent();
module.exports = { maestro, bus };

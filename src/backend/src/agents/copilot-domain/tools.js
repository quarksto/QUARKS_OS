/**
 * Tool Definitions for Gemini Function Calling
 */
const TOOLS = [
    {
        name: "get_lead_summary",
        description: "Returns a summary of a lead: name, consumption, status, temperature (Quente/Morno/Frio), score, and potential value.",
        parameters: {
            type: "OBJECT",
            properties: {
                leadId: { type: "STRING", description: "The unique ID of the lead" }
            },
            required: ["leadId"]
        }
    },
    {
        name: "get_lead_details",
        description: "Returns full details of a lead including messages, proposals, and all fields.",
        parameters: {
            type: "OBJECT",
            properties: {
                leadId: { type: "STRING", description: "The unique ID of the lead" }
            },
            required: ["leadId"]
        }
    },
    {
        name: "get_funnel_summary",
        description: "Returns the sales pipeline: count of leads per stage (NEW, CONTACTED, PROPOSAL_SENT, NEGOTIATION, CLOSED_WON, CLOSED_LOST).",
        parameters: { type: "OBJECT", properties: {} }
    },
    {
        name: "get_projects_summary",
        description: "Returns a summary of all active engineering projects, their current phases (Kanban stages), and assigned technicians.",
        parameters: { type: "OBJECT", properties: {} }
    },
    {
        name: "get_project_details",
        description: "Returns detailed technical information about a specific project, including customer info, technical notes, and activity history.",
        parameters: {
            type: "OBJECT",
            properties: {
                projectId: { type: "STRING", description: "The unique ID of the project" }
            },
            required: ["projectId"]
        }
    },
    {
        name: "create_proposal_preview",
        description: "Generates a comprehensive solar proposal preview based on customer consumption and location. Returns key financial metrics (price, payback, savings) and a link to the full proposal.",
        parameters: {
            type: "OBJECT",
            properties: {
                name: { type: "STRING", description: "Customer name" },
                consumption: { type: "NUMBER", description: "Monthly average consumption in kWh (e.g. 500)" },
                distributor: { type: "STRING", enum: ["CPFL_PAULISTA", "ENEL_SP", "CEMIG"], description: "Energy distributor name" },
                zipCode: { type: "STRING", description: "CEP format 00000-000" },
                city: { type: "STRING" },
                state: { type: "STRING", description: "UF (XY)" }
            },
            required: ["consumption", "distributor"]
        }
    },
    {
        name: "generate_image",
        description: "Generates a photorealistic image based on a description. Use for visualizing solar installations, roofs, or marketing material.",
        parameters: {
            type: "OBJECT",
            properties: {
                prompt: { type: "STRING", description: "Detailed visual description of the image to generate" }
            },
            required: ["prompt"]
        }
    },
    {
        name: "generate_video",
        description: "Generates a short video (Veo) based on a description. Use for site flyovers or dynamic demonstrations.",
        parameters: {
            type: "OBJECT",
            properties: {
                prompt: { type: "STRING", description: "Detailed description of the video movement and content" }
            },
            required: ["prompt"]
        }
    },
    {
        name: "get_proposal_summary",
        description: "Returns a summary of proposals for a lead. Use leadId to get proposals linked to that lead.",
        parameters: {
            type: "OBJECT",
            properties: {
                leadId: { type: "STRING", description: "The lead ID to fetch proposals for" }
            },
            required: ["leadId"]
        }
    },
    {
        name: "get_analytics_insight",
        description: "Returns contextual insight about the dashboard: metrics (active leads, conversion rate, proposals sent), deltas, and a suggested message.",
        parameters: { type: "OBJECT", properties: {} }
    },
    {
        name: "query_product_catalog",
        description: "Answers questions about products: warranty, specs, inverters, modules, kits. Use when user asks about product specifications, guarantees, or catalog.",
        parameters: {
            type: "OBJECT",
            properties: {
                query: { type: "STRING", description: "Optional search term to filter products (e.g. inversor, módulo, garantia)" }
            }
        }
    },
    {
        name: "calculate_dimensionamento",
        description: "Calculates solar system sizing: given consumption (kWh/month) and distributor, returns system size (kWp), panels, area, price, payback.",
        parameters: {
            type: "OBJECT",
            properties: {
                consumption: { type: "NUMBER", description: "Monthly average consumption in kWh" },
                distributor: { type: "STRING", description: "Energy distributor (CPFL_PAULISTA, ENEL_SP, CEMIG, etc.)" },
                state: { type: "STRING", description: "State UF (SP, MG, etc.)" }
            },
            required: ["consumption"]
        }
    },
    {
        name: "switch_mode",
        description: "Switches the application mode (Sales, Management, Projects).",
        parameters: {
            type: "OBJECT",
            properties: {
                mode: { type: "STRING", enum: ["sales", "manage", "projects"], description: "The mode to switch to" }
            },
            required: ["mode"]
        }
    }
];

/**
 * Executes the tool invoked by the LLM
 * @param {object} maestro - The Maestro Agent instance
 * @param {string} name - Tool name
 * @param {object} args - Tool arguments
 */
const executeTool = async (maestro, name, args) => {
    console.log(`[Copilot] Executing tool: ${name}`, args);

    try {
        switch (name) {
            case 'get_lead_summary': {
                if (!maestro.agents['lead']) return { error: "Lead Agent not available" };
                const lead = await maestro.agents['lead'].execute('GET_LEAD', { id: args.leadId });
                return {
                    success: true,
                    data: {
                        id: lead.id,
                        name: lead.name,
                        consumption: lead.consumption,
                        status: lead.status,
                        temperature: lead.temperature,
                        score: lead.score,
                        potential: lead.potential
                    }
                };
            }

            case 'get_lead_details': {
                if (!maestro.agents['lead']) return { error: "Lead Agent not available" };
                const details = await maestro.agents['lead'].execute('GET_LEAD_FULL', { id: args.leadId });
                return { success: true, data: details };
            }

            case 'get_funnel_summary': {
                if (!maestro.agents['lead']) return { error: "Lead Agent not available" };
                const pipeline = await maestro.agents['lead'].execute('GET_PIPELINE', {});
                const summary = {};
                for (const [stage, leads] of Object.entries(pipeline)) {
                    summary[stage] = Array.isArray(leads) ? leads.length : 0;
                }
                return { success: true, data: summary };
            }

            case 'get_projects_summary': {
                const projects = await maestro.execute('GET_PROJECTS_SUMMARY', {});
                return { success: true, data: projects };
            }

            case 'get_project_details': {
                const details = await maestro.execute('GET_PROJECT_DETAILS', { id: args.projectId });
                return { success: true, data: details };
            }

            case 'create_proposal_preview': {
                // Map tool args to Maestro Payload
                const payload = {
                    customer: {
                        name: args.name || "Cliente",
                        zip: args.zipCode || "13000-000",
                        city: args.city || "Campinas",
                        state: args.state || "SP"
                    },
                    consumption: args.consumption,
                    distributor: args.distributor
                };

                const result = await maestro.execute('PREVIEW_PROPOSAL_WORKFLOW', payload);

                // Return simplified summary to LLM
                return {
                    success: true,
                    data: {
                        systemSize: result.proposal.systemSizeKwp,
                        totalPrice: result.proposal.totalPrice,
                        monthlySavings: result.proposal.savingsMonthly,
                        payback: result.proposal.paybackYears,
                        kit: result.kit.name,
                        previewUrl: `http://localhost:5173/proposta/${result.proposal.id}` // Mock URL logic
                    }
                };
            }

            case 'generate_image': {
                if (!maestro.agents['visual']) return { error: "Visual Agent not available" };
                const imgResult = await maestro.agents['visual'].generateImage(args.prompt);
                return {
                    success: true,
                    data: {
                        url: imgResult.url,
                        preview: `![Image](${imgResult.url})` // Markdown for frontend
                    }
                };
            }

            case 'generate_video': {
                if (!maestro.agents['visual']) return { error: "Visual Agent not available" };
                const vidResult = await maestro.agents['visual'].generateVideo(args.prompt);
                return {
                    success: true,
                    data: {
                        url: vidResult.url,
                        preview: `[VIDEO GENERATED](${vidResult.url})`
                    }
                };
            }

            case 'get_proposal_summary': {
                if (!maestro.agents['proposal']) return { error: "Proposal Agent not available" };
                const proposals = await maestro.agents['proposal'].execute('LIST_PROPOSALS', { leadId: args.leadId, limit: 10 });
                const summary = proposals.map(p => ({
                    id: p.id,
                    status: p.status,
                    totalPrice: p.totalPrice,
                    leadName: p.lead?.name,
                    kitName: p.kit?.name
                }));
                return { success: true, data: summary };
            }

            case 'get_analytics_insight': {
                if (!maestro.agents['analytics']) return { error: "Analytics Agent not available" };
                const [insight, metrics] = await Promise.all([
                    maestro.agents['analytics'].execute('GET_INSIGHT', {}),
                    maestro.agents['analytics'].execute('GET_DASHBOARD_METRICS', {})
                ]);
                return {
                    success: true,
                    data: {
                        message: insight,
                        activeLeads: metrics.activeLeads,
                        conversionRate: metrics.conversionRate,
                        proposalsSent: metrics.proposalsSent,
                        revenue: metrics.revenue
                    }
                };
            }

            case 'query_product_catalog': {
                if (!maestro.agents['product']) return { error: "Product Agent not available" };
                const catalog = await maestro.agents['product'].execute('QUERY_CATALOG', { query: args.query });
                return { success: true, data: catalog };
            }

            case 'calculate_dimensionamento': {
                const result = await maestro.execute('DIMENSIONAMENTO', {
                    consumption: args.consumption,
                    distributor: args.distributor || 'CEMIG',
                    state: args.state || 'SP'
                });
                return { success: true, data: result };
            }

            case 'switch_mode': {
                // O broadcaster vai emitir um evento que o frontend ouve para mudar o modo
                const broadcaster = require('../../services/realtime/broadcaster');
                broadcaster.broadcastModeSwitch(args.mode);
                return {
                    success: true,
                    data: {
                        message: `Modo alterado para ${args.mode}`,
                        mode: args.mode
                    }
                };
            }

            default:
                return { error: `Tool ${name} not implemented` };
        }
    } catch (err) {
        console.error(`[Copilot] Tool execution failed:`, err);
        return { error: err.message };
    }
}

module.exports = { TOOLS, executeTool };

const { GoogleGenerativeAI } = require("@google/generative-ai");
const sessionService = require('./session');
const { TOOLS, executeTool } = require('./tools');
const fileManager = require('./file-manager');

const SYSTEM_INSTRUCTION = `
You are the Quarks Solar Copilot, an expert solar assistant powered by Gemini 3.
You are the central brain of Quarks OS.

CAPABILITIES:
1. Create Proposals: Gather consumption (kWh), distributor, and location to generate a preview.
2. Analyze Bills: Extract data from uploaded energy bill images.
3. Site Survey & Engineering: 
   - Analyze video/images of roofs identifying shading, orientation, and structural obstacles.
   - Help manage the 'Projects' board (PLANNED -> SURVEYING -> TECHNICAL_STUDY -> APPROVED -> INSTALLING -> COMPLETED).
   - Provide technical insights on solar installation best practices.
4. Mode Management: You can switch between 'Sales', 'Management', and 'Projects' modes using tools.
5. Context Insight: You explain where the user is and what they can do in each mode.

MODES:
- Sales (Vendas): Focused on leads, chat, and quick navigation. Inbox-style.
- Management (Gestão): Dashboard, funnel, reports, and CRM management.
- Projects (Projetos): Engineering workspace. Technical files, site surveys, and installation schedule.

TONE: Professional, technical but accessible, and efficient. Speak Portuguese (pt-BR).

RULES:
- When in 'Projects' mode, focus on technical feasibility, safety, and project milestones.
- Use the 'switch_mode' tool whenever the user wants to go to a specific module or asks for technical project management help.
`;

function buildContextBlock(context) {
    if (!context) return '';
    const type = (context.type || '').toUpperCase();
    const name = context.name || context.lead?.name;
    const leadId = context.leadId || context.id;
    if (type === 'LEAD' && leadId) {
        return `\n\nCURRENT CONTEXT: The user is viewing lead "${name || leadId}" (ID: ${leadId}). Use get_lead_summary or get_lead_details with leadId "${leadId}" to fetch data when relevant.`;
    }
    if (type === 'PROPOSAL' && (context.proposalId || context.id)) {
        const pid = context.proposalId || context.id;
        return `\n\nCURRENT CONTEXT: The user is viewing proposal ${pid}. Use create_proposal_preview or proposal-related tools when relevant.`;
    }
    return '';
}

class CopilotDomainAgent {
    constructor(maestro) {
        this.maestro = maestro;
        this._ai = null; // Lazy init so server can start without GOOGLE_API_KEY
    }

    get ai() {
        if (this._ai) return this._ai;
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('GOOGLE_API_KEY not set. Configure in backend .env');
        }
        this._ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        return this._ai;
    }

    async execute(action, payload) {
        switch (action) {
            case 'CHAT':
                return await this.handleChat(payload);
            case 'CHAT_STREAM':
                return await this.handleChatStream(payload);
            default:
                throw new Error(`Copilot Action ${action} not supported`);
        }
    }

    async handleChatStream(payload) {
        const { sessionId, userId, message, file, context, onSessionReady } = payload;
        const broadcaster = require('../../services/realtime/broadcaster');

        // 1. Setup Session
        let session = await sessionService.getOrCreateSession(userId);
        const activeSessionId = sessionId || session.id;

        // 1b. Notify gateway to join socket to room (critical when sessionId was null)
        if (onSessionReady) onSessionReady(activeSessionId);

        // 2. Add User Message
        await sessionService.addMessage(activeSessionId, 'USER', message);

        // 3. Prepare SDK History
        const dbHistory = await sessionService.getHistory(activeSessionId);
        const historyForSdk = dbHistory.slice(0, -1).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: typeof msg.parts[0] === 'string' ? msg.parts[0] : (msg.parts[0].text || '') }]
        }));

        try {
            const systemText = SYSTEM_INSTRUCTION + buildContextBlock(context);
            // 4. Iniciar Stream
            const model = this.ai.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: systemText,
                tools: [{ functionDeclarations: TOOLS }]
            });

            const chat = model.startChat({
                history: historyForSdk
            });

            const result = await chat.sendMessageStream(message);

            let fullAssistantText = "";
            let chunkIndex = 0;
            let toolCalls = [];

            // 5. Iterar Chunks e Emitir via WebSocket
            for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                    fullAssistantText += text;
                    broadcaster.broadcastCopilotChunk(activeSessionId, text, chunkIndex++);
                }

                // Capturar Tool Calls se houver
                const calls = chunk.functionCalls();
                if (calls) {
                    toolCalls.push(...calls);
                }
            }

            // 6. Executar Tools se detectadas
            if (toolCalls.length > 0) {
                for (const call of toolCalls) {
                    const toolResult = await executeTool(this.maestro, call.name, call.args);
                    const toolFeedback = `\n[Tool Executed: ${call.name}] Result: ${JSON.stringify(toolResult.data)} `;
                    fullAssistantText += toolFeedback;
                    // Emitir o feedback da ferramenta como um chunk final
                    broadcaster.broadcastCopilotChunk(activeSessionId, toolFeedback, chunkIndex++);
                }
            }

            // 7. Salvar Resposta Completa no DB
            await sessionService.addMessage(activeSessionId, 'ASSISTANT', fullAssistantText);

            return {
                sessionId: activeSessionId,
                role: 'model',
                content: fullAssistantText,
                streamed: true
            };

        } catch (error) {
            console.error('[Copilot] Stream Error:', error);
            broadcaster.broadcastCopilotChunk(activeSessionId, `Erro: ${error.message} `, -1);
            throw error;
        }
    }

    async handleChat({ sessionId, userId, message, file, context }) {
        let session = await sessionService.getOrCreateSession(userId);

        // 1. Add User Message to Persistent DB
        let userContentForDb = message;
        if (file) userContentForDb += ` [File: ${file.originalname}]`;
        await sessionService.addMessage(session.id, 'USER', userContentForDb);

        // 2. Prepare History/Context
        const dbHistory = await sessionService.getHistory(session.id);
        const historyForSdk = dbHistory.slice(0, -1).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: typeof msg.parts[0] === 'string' ? msg.parts[0] : (msg.parts[0].text || '') }]
        }));

        // 3. Prepare Current Message Content
        const contentParts = [];
        if (message) contentParts.push({ text: message });

        if (file) {
            contentParts.push({
                inlineData: {
                    mimeType: file.mimetype,
                    data: file.buffer.toString("base64")
                }
            });
        }

        try {
            const systemText = SYSTEM_INSTRUCTION + buildContextBlock(context);
            const model = this.ai.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: systemText,
                tools: [{ functionDeclarations: TOOLS }]
            });

            const chat = model.startChat({
                history: historyForSdk
            });

            const result = await chat.sendMessage(contentParts);
            const response = result.response;

            let finalText = response.text();
            let toolCalls = response.functionCalls();

            // 6. Execute Tools
            if (toolCalls && toolCalls.length > 0) {
                for (const call of toolCalls) {
                    const toolResult = await executeTool(this.maestro, call.name, call.args);
                    finalText += `\n[Tool Executed: ${call.name}] Result: ${JSON.stringify(toolResult.data)} `;
                }
            }

            // 7. Save Assistant Message
            await sessionService.addMessage(session.id, 'ASSISTANT', finalText);

            return {
                sessionId: session.id,
                role: 'model',
                content: finalText
            };

        } catch (error) {
            console.error('[Copilot] Gemini Error:', error);
            return {
                sessionId: session.id,
                role: 'model',
                content: `Erro ao processar: ${error.message} `
            };
        }
    }
}

module.exports = CopilotDomainAgent;

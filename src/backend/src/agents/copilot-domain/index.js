const { GoogleGenAI } = require("@google/genai");
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
        this._ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
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
        const { sessionId, userId, message, file } = payload;
        const broadcaster = require('../../services/realtime/broadcaster');

        // 1. Setup Session
        let session = await sessionService.getOrCreateSession(userId);
        const activeSessionId = sessionId || session.id;

        // 2. Add User Message
        await sessionService.addMessage(activeSessionId, 'USER', message);

        // 3. Prepare SDK History
        const dbHistory = await sessionService.getHistory(activeSessionId);
        // O último elemento pode ser a mensagem que acabamos de adicionar, 
        // mas o getHistory retorna tudo. Precisamos garantir que não duplicamos.
        // O SDK do Gemini lida bem com a história passada na chamada.

        try {
            // 4. Iniciar Stream
            const stream = await this.ai.models.generateContentStream({
                model: "gemini-3-flash-preview",
                contents: [
                    ...dbHistory.slice(0, -1), // Hitórico anterior
                    { role: "user", parts: [{ text: message }] } // Mensagem atual
                ],
                config: {
                    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                    tools: [{ functionDeclarations: TOOLS }]
                }
            });

            let fullAssistantText = "";
            let chunkIndex = 0;
            let toolCalls = [];

            // 5. Iterar Chunks e Emitir via WebSocket
            for await (const chunk of stream) {
                const text = chunk.text;
                if (text) {
                    fullAssistantText += text;
                    broadcaster.broadcastCopilotChunk(activeSessionId, text, chunkIndex++);
                }

                // Capturar Tool Calls se houver
                const candidate = chunk.candidates?.[0];
                if (candidate?.content?.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.functionCall) {
                            toolCalls.push(part.functionCall);
                        }
                    }
                }
            }

            // 6. Executar Tools se detectadas
            if (toolCalls.length > 0) {
                for (const call of toolCalls) {
                    const result = await executeTool(this.maestro, call.name, call.args);
                    const toolFeedback = `\n[Tool Executed: ${call.name}] Result: ${JSON.stringify(result.data)}`;
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
            broadcaster.broadcastCopilotChunk(activeSessionId, `Erro: ${error.message}`, -1);
            throw error;
        }
    }

    async handleChat({ sessionId, userId, message, file }) {
        // ai getter throws if GOOGLE_API_KEY not set
        let session = sessionId
            ? await sessionService.getOrCreateSession(userId)
            : await sessionService.getOrCreateSession(userId);

        // 1. Add User Message to Persistent DB
        let userContentForDb = message;
        if (file) userContentForDb += ` [File: ${file.originalname}]`;
        await sessionService.addMessage(session.id, 'USER', userContentForDb);

        // 2. Prepare History/Context
        // The new SDK likely has a specific ChatSession object.
        // We'll fetch history from DB and map it.
        const dbHistory = await sessionService.getHistory(session.id);

        // Map DB history to SDK format
        // SDK expects: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
        const historyForSdk = dbHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts[0].text }]
        }));

        // 3. Prepare Current Message Content
        const contentParts = [];
        if (message) contentParts.push({ text: message });

        if (file) {
            // Determine if we should use Inline Data (Base64) or File API (URI)
            // Limit for Inline: 20MB (safe margin, Gemini limit is higher but payload size matters)
            const INLINE_SIZE_LIMIT = 20 * 1024 * 1024;
            const isVideo = file.mimetype.startsWith('video/');
            const isAudio = file.mimetype.startsWith('audio/');

            // IF video/audio OR size > limit -> Use File API
            if (isVideo || isAudio || file.size > INLINE_SIZE_LIMIT) {
                console.log(`[Copilot] Uploading large file/media (${file.size} bytes) to Gemini File API...`);

                try {
                    const uploadResult = await fileManager.uploadFile(
                        file.buffer,
                        file.mimetype,
                        file.originalname
                    );

                    // For Video, we might need to wait for processing to be ACTIVE.
                    // Simple polling for video
                    if (isVideo) {
                        let state = 'PROCESSING';
                        console.log('[Copilot] Waiting for video processing...');
                        while (state === 'PROCESSING') {
                            await new Promise(r => setTimeout(r, 2000));
                            const fileStatus = await fileManager.getFile(uploadResult.name);
                            state = fileStatus.state;
                            if (state === 'FAILED') throw new Error('Video processing failed by Gemini');
                        }
                        console.log('[Copilot] Video ready for inference.');
                    }

                    // Push fileData (URI)
                    contentParts.push({
                        fileData: {
                            fileUri: uploadResult.fileUri,
                            mimeType: uploadResult.mimeType
                        }
                    });

                } catch (uploadErr) {
                    console.error('[Copilot] File API upload failed:', uploadErr);
                    throw new Error('Falha ao processar arquivo grande/mídia com Gemini.');
                }

            } else {
                // Use Inline Data (Base64) for images/PDFs < 20MB
                contentParts.push({
                    inlineData: {
                        mimeType: file.mimetype,
                        data: file.buffer.toString("base64")
                    }
                });
            }
        }

        try {
            // 4. Generate Content (Chat)
            // Using the new 'chats.create' or direct 'generateContent' with history?
            // The docs showed 'client.models.generateContent', but for chat we usually want a session.
            // Let's assume ai.chats.create() exists or similar.
            // IF NOT, we pass history in the request.

            // Checking the snippet: "client.models.generateContent" was shown.
            // Let's look for Chat capability. If uncertain, we use generateContent with system_instruction + history.

            const response = await this.ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [
                    ...historyForSdk,
                    { role: "user", parts: contentParts }
                ],
                config: {
                    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                    tools: [{ functionDeclarations: TOOLS }]
                }
            });

            // 5. Process Response & Tool Calls
            // The response structure in new SDK might be distinct.
            // response.candidates[0].content.parts...

            // NOTE: The snippet showed `response.text` shortcut.
            let finalText = "";
            let toolCalls = [];

            // Safely access parts
            const candidate = response.candidates?.[0];
            if (candidate?.content?.parts) {
                for (const part of candidate.content.parts) {
                    if (part.text) finalText += part.text;
                    if (part.functionCall) {
                        toolCalls.push(part.functionCall);
                    }
                }
            } else if (response.text) {
                // Fallback if SDK creates a convenience getter
                finalText = response.text;
            }

            // 6. Execute Tools
            if (toolCalls.length > 0) {
                for (const call of toolCalls) {
                    // call.name, call.args (might be object already)
                    const result = await executeTool(this.maestro, call.name, call.args);
                    finalText += `\n[Tool Executed: ${call.name}] Result: ${JSON.stringify(result.data)}`;
                    // In a real multi-turn, we'd send this back. For MVP, we stop here.
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
            // Fallback for user
            return {
                sessionId: session.id,
                role: 'model',
                content: `Erro ao processar: ${error.message}`
            };
        }
    }
}

module.exports = CopilotDomainAgent;

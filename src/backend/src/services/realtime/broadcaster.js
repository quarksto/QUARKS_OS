const { getIO } = require('../../websocket/gateway');
const pino = require('pino');
const logger = pino({ transport: { target: 'pino-pretty' } });

/**
 * Utilitário para broadcast de eventos real-time
 */
const broadcaster = {
    /**
     * Envia atualização de lead para todos os interessados
     */
    broadcastLeadUpdate: (leadId, data) => {
        try {
            const io = getIO();

            // Envia para quem está na sala do lead específico
            io.to(`lead:${leadId}`).emit('lead:updated', { leadId, changes: data });

            // Envia para quem está ouvindo todos os leads (ex: Dashboard analítico)
            io.to('all_leads').emit('lead:updated', { leadId, changes: data });

            logger.info(`[Broadcaster] Lead update sent for: ${leadId}`);
        } catch (err) {
            logger.error('[Broadcaster] Error sending lead update:', err.message);
        }
    },

    /**
     * Notifica a criação de um novo lead
     */
    broadcastLeadCreated: (lead) => {
        try {
            const io = getIO();
            io.to('all_leads').emit('lead:created', { lead });
            logger.info(`[Broadcaster] New lead broadcasted: ${lead.id}`);
        } catch (err) {
            logger.error('[Broadcaster] Error broadcasting new lead:', err.message);
        }
    },

    /**
     * TransmiteChunks do Copilot (Streaming)
     */
    broadcastCopilotChunk: (sessionId, chunk, index) => {
        try {
            const io = getIO();
            // Assume-se que o socket do usuário entrou na sala da sessão
            io.to(`copilot:${sessionId}`).emit('copilot:stream_chunk', { sessionId, chunk, index });
        } catch (err) {
            logger.error('[Broadcaster] Error broadcasting copilot chunk:', err.message);
        }
    },

    /**
     * Notifica mudança de modo global (Fase 3)
     */
    broadcastModeSwitch: (mode) => {
        try {
            const io = getIO();
            io.emit('app:mode_switch', { mode });
        } catch (err) {
            logger.error('[Broadcaster] Error broadcasting mode switch:', err.message);
        }
    }
};

module.exports = broadcaster;

const { Server } = require('socket.io');
const pino = require('pino');
const logger = pino({ transport: { target: 'pino-pretty' } });
const { initRedisAdapter } = require('./pubsub');
const { wsAuthenticate } = require('./auth');

let io;

const origins = process.env.WS_CORS_ORIGIN ? process.env.WS_CORS_ORIGIN.split(',') : '*';

const initWebSocket = async (server) => {
    io = new Server(server, {
        cors: {
            origin: origins,
            methods: ['GET', 'POST'],
            credentials: true
        },
        pingInterval: 25000,
        pingTimeout: 60000
    });

    // Authentication Middleware
    io.use(wsAuthenticate);

    io.on('connection', (socket) => {
        logger.info(`[WS] New client connected: ${socket.id}`);

        socket.on('disconnect', (reason) => {
            logger.info(`[WS] Client disconnected: ${socket.id} (Reason: ${reason})`);
        });

        // Subscrições
        socket.on('subscribe:lead', ({ leadId }) => {
            if (leadId) {
                socket.join(`lead:${leadId}`);
                logger.info(`[WS] Client ${socket.id} joined room: lead:${leadId}`);
            }
        });

        socket.on('unsubscribe:lead', ({ leadId }) => {
            if (leadId) {
                socket.leave(`lead:${leadId}`);
                logger.info(`[WS] Client ${socket.id} left room: lead:${leadId}`);
            }
        });

        socket.on('subscribe:all_leads', () => {
            socket.join('all_leads');
            logger.info(`[WS] Client ${socket.id} joined room: all_leads`);
        });

        // Copilot Phase 2: Streaming Handlers
        socket.on('subscribe:copilot', ({ sessionId }) => {
            if (sessionId) {
                socket.join(`copilot:${sessionId}`);
                logger.debug(`[WS] Client ${socket.id} subscribed to copilot stream: ${sessionId}`);
            }
        });

        socket.on('copilot:message', async ({ sessionId, message, context }) => {
            const { maestro } = require('../orchestrator/maestro');
            try {
                const userId = socket.user?.id || 'anonymous';

                logger.info(`[WS] Copilot message from ${userId} (session: ${sessionId})`);

                // Callback para garantir que o socket entre na sala antes de receber chunks
                // (quando sessionId é null, o backend cria sessão e precisa juntar o socket à sala)
                const onSessionReady = (newSessionId) => {
                    socket.join(`copilot:${newSessionId}`);
                    socket.emit('copilot:session', { sessionId: newSessionId });
                    logger.debug(`[WS] Socket ${socket.id} joined copilot:${newSessionId}`);
                };

                maestro.agents['copilot'].execute('CHAT_STREAM', {
                    sessionId,
                    userId,
                    message,
                    context,
                    onSessionReady
                }).catch(err => {
                    logger.error(`[WS] Copilot stream error: ${err.message}`);
                    socket.emit('copilot:error', { message: err.message });
                });

            } catch (err) {
                logger.error(`[WS] Error in copilot:message handler: ${err.message}`);
                socket.emit('copilot:error', { message: 'Internal assistant error' });
            }
        });

        // Chat Typing Handlers
        socket.on('chat:typing', ({ leadId, isTyping }) => {
            if (leadId) {
                // Broadcast para os outros na mesma sala do lead
                socket.to(`lead:${leadId}`).emit('chat:typing', {
                    leadId,
                    isTyping,
                    userId: socket.user?.id
                });
            }
        });

        // Eventos básicos de teste
        socket.on('ping', () => {
            socket.emit('pong', { timestamp: new Date().toISOString() });
        });
    });

    // Initialize Redis Adapter (Async)
    await initRedisAdapter(io);

    logger.info('[WS] WebSocket Gateway initialized');
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('WebSocket not initialized. Call initWebSocket(server) first.');
    }
    return io;
};

module.exports = {
    initWebSocket,
    getIO
};

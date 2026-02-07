const app = require('./src/server');
const pino = require('pino');
const logger = pino({ transport: { target: 'pino-pretty' } });
const { initWebSocket } = require('./src/websocket/gateway');
const ensureDefaultUser = require('./ensure_user');

const PORT = process.env.PORT || 3001;

async function start() {
    try {
        await ensureDefaultUser();
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server started on port ${PORT}`);
        });
        initWebSocket(server);

        server.on('error', (err) => {
            console.error('SERVER ERROR:', err);
        });

    } catch (err) {
        console.error('STARTUP ERROR:', err);
    }
}

start();

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

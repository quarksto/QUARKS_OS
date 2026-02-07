const Redis = require('ioredis');
const { createAdapter } = require('@socket.io/redis-adapter');
const pino = require('pino');
const logger = pino({ transport: { target: 'pino-pretty' } });

let pubClient;
let subClient;

const initRedisAdapter = async (io) => {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        logger.warn('[REDIS] REDIS_URL not found. Skipping Redis adapter (Falling back to default memory adapter).');
        return null;
    }

    try {
        pubClient = new Redis(redisUrl);
        subClient = pubClient.duplicate();

        pubClient.on('error', (err) => logger.error('[REDIS] Pub Client Error:', err));
        subClient.on('error', (err) => logger.error('[REDIS] Sub Client Error:', err));

        io.adapter(createAdapter(pubClient, subClient));

        logger.info('[REDIS] Redis adapter initialized for Socket.io');
        return { pubClient, subClient };
    } catch (err) {
        logger.error('[REDIS] Failed to initialize Redis adapter:', err);
        return null;
    }
};

module.exports = {
    initRedisAdapter
};

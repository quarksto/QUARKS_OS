const jwt = require('jsonwebtoken');
const pino = require('pino');
const logger = pino({ transport: { target: 'pino-pretty' } });

const wsAuthenticate = (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
        logger.warn(`[WS Auth] Connection rejected: No token provided (Socket: ${socket.id})`);
        return next(new Error('Authentication error: No token provided'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        logger.info(`[WS Auth] User authenticated: ${decoded.email} (Socket: ${socket.id})`);
        next();
    } catch (err) {
        logger.warn(`[WS Auth] Connection rejected: Invalid token (Socket: ${socket.id})`);
        return next(new Error('Authentication error: Invalid token'));
    }
};

module.exports = {
    wsAuthenticate
};

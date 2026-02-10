const { io } = require('socket.io-client');
const axios = require('axios');
require('dotenv').config({ path: 'src/backend/.env' });

const API_URL = 'http://localhost:3001';
const WS_URL = 'http://localhost:3001';

async function testSocket() {
    console.log('--- Testing WebSocket Connectivity ---');

    // 1. Get a token (Login as default user)
    let token;
    try {
        const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
            email: 'admin@quarks.os',
            password: 'admin'
        });
        token = loginRes.data.token;
        console.log('✅ Login successful, token obtained.');
    } catch (err) {
        console.error('❌ Login failed:', err.message);
        return;
    }

    // 2. Connect to WebSocket
    const socket = io(WS_URL, {
        auth: { token }
    });

    socket.on('connect', () => {
        console.log('✅ Socket connected successfully! ID:', socket.id);

        // 3. Test ping
        socket.emit('ping');
    });

    socket.on('pong', (data) => {
        console.log('✅ Pong received:', data);

        // 4. Test Copilot subscription
        console.log('Testing Copilot message...');
        socket.emit('copilot:message', {
            sessionId: 'test-session',
            message: 'Hello from test script'
        });
    });

    socket.on('copilot:session', (data) => {
        console.log('✅ Copilot session received:', data);
    });

    socket.on('copilot:stream_chunk', (data) => {
        console.log('✅ Copilot chunk received:', data.chunk);
        // Success!
        process.exit(0);
    });

    socket.on('copilot:error', (data) => {
        console.error('❌ Copilot error:', data.message);
        process.exit(1);
    });

    socket.on('connect_error', (err) => {
        console.error('❌ Socket connection error:', err.message);
        process.exit(1);
    });

    // Timeout
    setTimeout(() => {
        console.error('❌ Test timed out');
        process.exit(1);
    }, 10000);
}

testSocket();

console.log('Starting Quarks OS Backend...');
try {
    require('./src/server.js');
} catch (e) {
    console.error('Failed to start server:', e);
}

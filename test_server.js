const express = require('express');
const app = express();
const PORT = 3002;

app.get('/', (req, res) => res.send('ok'));

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => server.close());

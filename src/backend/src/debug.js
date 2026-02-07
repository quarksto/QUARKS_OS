console.log('Node.js is working correctly in this directory.');
const fs = require('fs');
console.log('Directory listing:', fs.readdirSync(__dirname));
try {
    const app = require('./app.js');
    console.log('Successfully required app.js');
} catch (e) {
    console.error('Error requiring app.js:', e);
}

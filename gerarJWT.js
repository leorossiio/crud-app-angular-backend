const crypto = require('crypto');

// Gera uma chave secreta aleatória
const JWT_SECRET = crypto.randomBytes(32).toString('hex');

console.log(JWT_SECRET);
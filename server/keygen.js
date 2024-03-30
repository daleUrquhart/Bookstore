const crypto = require('crypto');

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

console.log('Generated Secret Key:', secretKey);


//d8992cab1566f94df3a10256697622d435cc1e28361cbf68d83e2fcf3c5aa9f2
const fs = require('fs');
const path = require('path');
const process = require('process');

const readStream = fs.createReadStream(path.join(__dirname, './text.txt'), 'utf-8');

let data = '';

readStream.on('data', chunk => data += chunk);
readStream.on('end', () => process.stdout.write(data));
readStream.on('error', error => console.log('Error', error.message));

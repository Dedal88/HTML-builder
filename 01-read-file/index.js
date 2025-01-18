const fs = require('fs');
const path = require('path');
const dirPath = path.dirname(__filename);
const pathTotal = path.join(dirPath, 'text.txt');
const readStream = fs.createReadStream(pathTotal, 'utf-8');
readStream.on('data', (chunk) => console.log(chunk));

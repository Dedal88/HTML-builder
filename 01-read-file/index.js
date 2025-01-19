// запрашиваем необходимые модули
const fs = require('fs');
const path = require('path');
// получаем пути
const dirPath = path.dirname(__filename);
const pathTotal = path.join(dirPath, 'text.txt');
// считываем файл и выводим результат
const readStream = fs.createReadStream(pathTotal, 'utf-8');
readStream.on('data', (chunk) => console.log(chunk));

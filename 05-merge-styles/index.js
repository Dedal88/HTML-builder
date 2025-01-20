// запрашиваем необходимые модули
const path = require('path');
const promis = require('fs/promises');
const fs = require('fs');
// создаём необходимые пути
const dirPath = path.dirname(__filename);
const pathStyles = path.join(dirPath, 'styles');
const pathNewFileTemp = path.join(dirPath, 'project-dist');
const pathNewFile = path.join(pathNewFileTemp, 'bundle.css');
// создание итогового файла, чтение и запись стилей в него
promis.writeFile(pathNewFile, '');
const writeStream = fs.createWriteStream(pathNewFile);
const files = promis.readdir(pathStyles, { withFileTypes: true });
files.then((data) => {
  for (let i of data) {
    const extFile = path.extname(i.name);
    if (i.isFile() && extFile === '.css') {
      const pathFileStyle = path.join(pathStyles, i.name);
      const readStream = fs.createReadStream(pathFileStyle, 'utf-8');
      readStream.on('data', (chunk) => writeStream.write(chunk));
    }
  }
});

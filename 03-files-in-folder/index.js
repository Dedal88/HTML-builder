// зпрашиваем необходимые модули
const path = require('path');
const promis = require('fs/promises');
// создаём пути, считываем файлы
const dirPath = path.dirname(__filename);
const pathTotal = path.join(dirPath, 'secret-folder');
const files = promis.readdir(pathTotal, { withFileTypes: true });
// обрабатываем промис с объектами считанных файлов и выводим результат
files.then((data) => {
  for (let i of data) {
    const extFile = path.extname(i.name).slice(1);
    if (i.isFile()) {
      const pathFile = path.join(pathTotal, i.name);
      const pathObj = path.parse(pathFile);
      const fileName = pathObj.name;
      const stats = promis.stat(pathFile);
      stats.then((data) => {
        console.log(`${fileName} - ${extFile} - ${data.size / 1000}kb`);
      });
    }
  }
});

// запрашиваем необходимые модули
const path = require('path');
const promis = require('fs/promises');
const fs = require('fs');
// создаём необходимые пути
const dirPath = path.dirname(__filename);
const pathDirDist = path.join(dirPath, 'project-dist');
const pathIndexHtml = path.join(pathDirDist, 'index.html');
const pathTemplate = path.join(dirPath, 'template.html');
const pathComponents = path.join(dirPath, 'components');
const pathStylesFile = path.join(pathDirDist, 'style.css');
const pathStyles = path.join(dirPath, 'styles');
const pathAssets = path.join(dirPath, 'assets');
const pathAssetsCopy = path.join(pathDirDist, 'assets');
// создаём каталог для копий файлов
promis.mkdir(pathDirDist, { recursive: true });
// считываем шаблон
let holder = '';
const readStream = fs.createReadStream(pathTemplate, 'utf-8');
readStream.on('data', (chunk) => (holder += chunk));
// заполняем шаблон содержимым файлов componets
readStream.on('end', async () => {
  const files = await promis.readdir(pathComponents, { withFileTypes: true });
  // создаём,запускаем и ожидаем выполнения массива промисов для чтения файлов
  const promises = files.map(async (file) => {
    const extFile = path.extname(file.name);
    if (file.isFile() && extFile === '.html') {
      const pathFile = path.join(pathComponents, file.name);
      const pathObj = path.parse(pathFile);
      const fileName = pathObj.name;
      let holdHtmlOne = '';
      const readStream = fs.createReadStream(pathFile, 'utf-8');
      return new Promise((resolve) => {
        readStream.on('data', (chunk) => (holdHtmlOne += chunk));
        readStream.on('end', () => {
          holder = holder.replace(`{{${fileName}}}`, holdHtmlOne);
          resolve();
        });
      });
    }
  });
  // ожидание выполнения всех промисов из массива
  await Promise.all(promises);
  //создаём index.html и заполняем его
  promis.writeFile(pathIndexHtml, '');
  const writeStream = fs.createWriteStream(pathIndexHtml);
  writeStream.write(holder);
});
// создаём файл стилей и заполняем его
promis.writeFile(pathStylesFile, '');
const writeStream = fs.createWriteStream(pathStylesFile);
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

// Создаём каталог assets
promis.mkdir(pathAssetsCopy, { recursive: true });

//удаляем прошлые копии файлов используя acync/await
//чтобы точно успеть удалить перед созданием новых копий
async function deleteFiles() {
  const files = await promis.readdir(pathAssetsCopy, { withFileTypes: true });
  for (let file of files) {
    const filePath = path.join(pathAssetsCopy, file.name);
    if (file.isDirectory()) {
      await promis.rm(filePath, { recursive: true });
    } else {
      await promis.unlink(filePath);
    }
  }
}
deleteFiles();

// создаём копию assets при помощи дополнительной функции
async function copyAssets(src, dest) {
  const items = await promis.readdir(src, { withFileTypes: true });
  for (let item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      promis.mkdir(destPath, { recursive: true });
      await copyAssets(srcPath, destPath);
    } else {
      promis.copyFile(srcPath, destPath);
    }
  }
}
copyAssets(pathAssets, pathAssetsCopy);

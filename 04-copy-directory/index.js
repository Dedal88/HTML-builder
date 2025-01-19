function copyDir() {
  // запрашиваем необходимые модули
  const path = require('path');
  const promis = require('fs/promises');
  // создаём пути
  const dirPath = path.dirname(__filename);
  const pathTotal = path.join(dirPath, 'files');
  const copyPathTemp = path.join(dirPath, 'files-copy');
  // создаём каталог для копий файлов
  promis.mkdir(copyPathTemp, { recursive: true });
  //удаляем прошлые копии файлов используя acync/await
  //чтобы точно успеть удалить перед созданием новых копий
  async function deleteFiles() {
    const delFiles = promis.readdir(copyPathTemp);
    await delFiles.then((data) => {
      for (i of data) {
        const filePath = path.join(copyPathTemp, i);
        promis.unlink(filePath);
      }
    });
  }
  deleteFiles();
  // считываем файлы, создаём копии
  const files = promis.readdir(pathTotal, { withFileTypes: true });
  files.then((data) => {
    for (let i of data) {
      if (i.isFile()) {
        const pathFile = path.join(pathTotal, i.name);
        const copyPath = path.join(copyPathTemp, i.name);
        promis.copyFile(pathFile, copyPath);
      }
    }
  });
}

copyDir();

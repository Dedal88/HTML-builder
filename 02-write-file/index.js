// импортируем и создаём всё необходимое
const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const dirPath = path.dirname(__filename);
const pathTotal = path.join(dirPath, 'text.txt');
const writeStream = fs.createWriteStream(pathTotal);
// запись пользовательского ввода
stdout.write('Hello ! Write anything, please.\n');
stdin.on('data', (data) => {
  const input = data.toString().trim();
  // обрабатываем ввод фразы "exit"
  if (input === 'exit') {
    stdout.write('Thank you, bye !\n');
    writeStream.end();
    process.exit();
  }
  writeStream.write(data);
});
// обрабатываем событие нажатия ctrl + C
process.on('SIGINT', () => {
  stdout.write('Thank you, bye !\n');
  writeStream.end();
  process.exit();
});

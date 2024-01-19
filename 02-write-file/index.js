const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'text.txt');
const ws = fs.createWriteStream(filePath, 'utf-8');

process.stdout.write('Hello, I am waiting for input \n');

process.stdin.on('data', (chank) => {
  if ('exit' === chank.toString().trim().toLowerCase()) {
    process.exit();
  }
  ws.write(chank);
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  console.log('Thanks, see you later');
});

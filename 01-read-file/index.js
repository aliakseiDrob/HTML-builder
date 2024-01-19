const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'text2.txt');
const rs = fs.createReadStream(filePath, 'utf-8');

rs.on('data', (data) => {
  console.log(data);
});

rs.on('error', (error) => {
  console.log(error.message);
});

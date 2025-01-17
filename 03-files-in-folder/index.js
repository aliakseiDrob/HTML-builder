const { readdir } = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

const folderPath = path.join(__dirname, 'secret-folder');

readdir(folderPath, { withFileTypes: true })
  .then((files) => {
    files
      .filter((file) => file.isFile())
      .forEach((file) => {
        const filePath = path.join(file.path, file.name);
        const fileExt = path.parse(filePath).ext.slice(1);
        const fileName = path.parse(filePath).name;

        fs.stat(filePath, (err, stats) => {
          if (err) {
            throw Error(err);
          }
          const fileSize = (stats.size / 1024).toFixed(3);
          console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
        });
      });
  })
  .catch((err) => {
    console.log(err.message);
  });

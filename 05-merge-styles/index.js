const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const source = path.join(__dirname, 'styles');
  const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
  const writeStream = fs.createWriteStream(bundle);
  try {
    const files = await fsPromises.readdir(
      source,
      { withFileTypes: true },
      (files) => {
        return files;
      },
    );
    files.forEach(async (file) => {
      const filePath = path.join(source, file.name);
      const fileName = path.basename(filePath);
      if ('.css' === path.extname(filePath)) {
        fs.createReadStream(path.join(source, fileName)).on('data', (data) => {
          writeStream.write(data.toString() + '\n');
        });
      }
    });
  } catch (error) {
    process.stdout(error);
  }
})();

const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(sourcePath, { withFileTypes: true }, (error, files) => {
  if (error) console.log(error.message);

  const writeStream = fs.createWriteStream(bundleFile);

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(sourcePath, file.name);
      const fileExtension = path.extname(filePath);
      if (fileExtension === '.css') {
        const readStream = fs.createReadStream(filePath, 'utf-8');

        readStream.pipe(writeStream);
      }
    }
  });
});

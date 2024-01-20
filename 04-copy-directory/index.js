const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const source = path.join(__dirname, 'files');
  const dest = path.join(__dirname, 'files-copy');
  try {
    await fs.rm(dest, { force: true, recursive: true });
    await fs.mkdir(dest, { recursive: true });
    const files = await fs.readdir(source, { withFileTypes: true }, (files) => {
      return files;
    });
    files.forEach((file) => {
      const fileSourse = path.join(source, file.name);
      const fileDest = path.join(dest, file.name);
      fs.copyFile(fileSourse, fileDest);
    });
  } catch (error) {
    process.stdout(error);
  }
})();

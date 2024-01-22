const fsPromisses = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  /*--------------Create root folder -------------- */
  const dest = path.join(__dirname, 'project-dist');
  await fsPromisses.rm(dest, { force: true, recursive: true });
  await fsPromisses.mkdir(dest, { recursive: true });
  /*--------------/Create root folder -------------- */
  try {
    const map = await createComponentsMap();
    await CreateHtmlFile(map);
    await crereCssFile();
    const srcPath = path.join(__dirname, 'assets');
    const distPath = path.join(__dirname, 'project-dist', 'assets');
    await copyAssets(srcPath, distPath);
  } catch (error) {
    console.log(error);
  }
})();

const createComponentsMap = async () => {
  const files = await fsPromisses.readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });
  const componentsMap = new Map();
  for (let i = 0; i < files.length; i += 1) {
    const filePath = path.join(__dirname, 'components', files[i].name);
    if ('.html' === path.extname(filePath)) {
      const sourceHtml = await fsPromisses.readFile(filePath);
      const component =
        '{{' +
        path.basename(filePath).replace(path.extname(filePath), '') +
        '}}';
      componentsMap.set(component, sourceHtml.toString());
    }
  }
  return componentsMap;
};

async function CreateHtmlFile(map) {
  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'index.html'),
  );
  let sourceHtml = await fsPromisses.readFile(
    path.join(__dirname, 'template.html'),
    'utf8',
  );
  for (let [key, value] of map) {
    sourceHtml = sourceHtml.replace(key, value);
  }
  writeStream.write(sourceHtml);
  return sourceHtml;
}

async function crereCssFile() {
  const source = path.join(__dirname, 'styles');
  const style = path.join(__dirname, 'project-dist', 'style.css');
  const writeStream = fs.createWriteStream(style);
  try {
    const files = await fsPromisses.readdir(
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
}

async function copyAssets(srcPath, distPath) {
  await fsPromisses.mkdir(distPath, {
    recursive: true,
  });
  const files = await fsPromisses.readdir(srcPath, { withFileTypes: true });
  files.forEach((file) => {
    if (!file.isFile()) {
      copyAssets(path.join(srcPath, file.name), path.join(distPath, file.name));
    } else {
      fsPromisses.copyFile(
        path.join(srcPath, file.name),
        path.join(distPath, file.name),
      );
    }
  });
}

const fsPromisses = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

async function generatePage() {
  /*--------------Create root folder -------------- */
  const dest = path.join(__dirname, 'project-dist');
  await fsPromisses.rm(dest, { force: true, recursive: true });
  await fsPromisses.mkdir(dest, { recursive: true });
  /*--------------/Create root folder -------------- */
  try {
    /*--------------Read tamplate HTML -------------- */
    const sourceHtml = await fsPromisses.readFile(
      path.join(__dirname, 'template.html'),
    );
    //  console.log(sourceHtml.toString());
    /*--------------/Read tamplate HTML -------------- */
    const map = await createComponentsMap();
    const html = await CreateHtmlFile(map);
  } catch (error) {
    console.log(error);
  }
}

generatePage();

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

const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const copyFile = fsPromises.copyFile;

(function initDir() {
  console.log(``);
  const folder = path.join(__dirname, './project-dist');
  fs.rm(folder, { recursive:true, force:true }, (err) => {
    if (err) {
      console.error(err.message);
    }

    createDir()
    .then((resolve) => {
      createDir('./assets')
      .then((resolve) => {
        copyAssets()
        .then((resolve) => {
          mergeStyles()
          .then((resolve) => {
            buildHTML()
          });
        });
      });
    });
  });
})();


async function createDir(dir = '') {
  const folder = path.join(__dirname, './project-dist', dir);
  let output = (dir) ? dir : './project-dist';
  console.log(`Folder "${output.slice(2)}" created successfully`);

  fs.mkdir(folder, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  })
}

async function copyAssets() {
  fsPromises.readdir(path.join(__dirname, './assets'), { withFileTypes: true }).then(files => {
    files.forEach(file => {
      const fileFrom = path.join(__dirname, './assets', file.name);
      const fileTo = path.join(__dirname, './project-dist', './assets', file.name);

      if (file.isFile()) {
        copyFile(fileFrom, fileTo);
      } else {
        fsPromises.readdir(fileFrom, { withFileTypes: true }).then(subDir => {
          createDir(`./assets/${file.name}`);
          subDir.forEach(subFile => {
            const subFileFrom = path.join(fileFrom, subFile.name);
            const subFileTo = path.join(fileTo, subFile.name);
            copyFile(subFileFrom, subFileTo);
            console.log(`  File "${subFile.name}" copied successfully`);
          });
        });
      }
    });
  });
};

async function mergeStyles() {
  const stylesDir = path.join(__dirname, './styles');
  const writeStream = fs.createWriteStream(path.join(__dirname, './project-dist', './style.css'), 'utf-8');
  fsPromises.readdir(stylesDir, { withFileTypes: true }).then(files => {
    files.forEach(file => {
      const filePath = path.join(stylesDir, file.name);
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath);

      if (file.isFile() && fileExt == '.css') {
        const readStream = fs.createReadStream(path.join(stylesDir, fileName), 'utf-8');
        readStream.on('data', data => {
          writeStream.write(data + '\n');
        });
      }
    });
    console.log(`Bundle style.css compiled successfully`);
  });
}

async function buildHTML() {
  const folder = path.join(__dirname, './project-dist');
  const templateHTML = path.join(__dirname, './template.html');
  const componentsDir = path.join(__dirname, './components');

  let contentHTML = await fsPromises.readFile(templateHTML, 'utf8');

  fsPromises.readdir(componentsDir, { withFileTypes: true }).then(files => {
    files.forEach(file => {
      const filePath = path.join(componentsDir, file.name);
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath);
      const componentName = path.parse(filePath).name;

      if (file.isFile() && fileExt == '.html') {
        const writeStream = fs.createWriteStream(path.join(folder, './index.html'), 'utf-8');
        const readStream = fs.createReadStream(path.join(componentsDir, fileName), 'utf-8');
        readStream.on('data', data => {
          contentHTML = contentHTML.replace(`{{${componentName}}}`, data);
          writeStream.write(contentHTML);
        });
      }
    });
    console.log(`Bundle index.html compiled successfully`);
    console.log(`HTML-build compiled successfully`)
  });
}

const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const stylesDir = path.join(__dirname, './styles');
const writeStream = fs.createWriteStream(path.join(__dirname, './project-dist', './bundle.css'), 'utf-8');

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
  process.stdout.write(`\nbundle.css compiled successfully!\n`)
});
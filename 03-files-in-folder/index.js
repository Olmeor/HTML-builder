const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const process = require('process');

fsPromises.readdir(path.join(__dirname, './secret-folder'), { withFileTypes: true }).then(files => {
  process.stdout.write('\nFiles in directory:\n');
  files.forEach(file => {
    if (file.isFile()) {
      const dirName = path.join(__dirname, './secret-folder', file.name);
      const name = path.parse(dirName).name;
      const ext = path.extname(dirName).slice(1);
      fsPromises.stat(dirName).then(result => {
        process.stdout.write(`${name} - ${ext} - ${(result.size / 1024).toFixed(3)}kb\n`);
      })
    }
  })
})

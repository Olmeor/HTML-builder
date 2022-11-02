const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const process = require('process');
const copyFile = fsPromises.copyFile;

(function copyDir() {
  process.stdout.write(`\n`)
  fs.rm(path.join(__dirname, 'files-copy'), { force:true, recursive:true, }, (err) => {
    if (err) {
      throw err;
    }

    fs.mkdir(path.join(__dirname, './files-copy'), { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    })

    fsPromises.readdir(path.join(__dirname, './files'), { withFileTypes: true }).then(files => {
      files.forEach(file => {
        const dirFrom = path.join(__dirname, './files', file.name);
        const dirTo = path.join(__dirname, './files-copy', file.name);
        copyFile(dirFrom, dirTo);
        process.stdout.write(`File ${file.name} copied successfully\n`)
      });
    });
  });
})();


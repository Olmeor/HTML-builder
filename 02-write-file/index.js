const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const writeStream = fs.createWriteStream(path.join(__dirname, './text.txt'), 'utf-8');
const rl = readline.createInterface({ input, output });

output.write('\nPlease, enter text (type "exit" or press "Ctrl + C" for quit):\n\n');

rl.on('line', (text) => {
  if (text.trim() === 'exit') {
    rl.close()
  } else {
    writeStream.write(text + '\n')
  }
});

rl.on('close', () => {
  output.write('\nBye!\n');
  writeStream.close();
});

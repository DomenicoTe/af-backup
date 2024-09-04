const fs = require('fs');
const package = require('../package.json');
//D.0. numero di 3 cifre esadecimale
package.version = process.argv[2] ? "v" + process.argv[2] : "D.0." + Math.floor(Math.random() * 0xFFF).toString(16);
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
console.log('Version updated to ' + package.version);
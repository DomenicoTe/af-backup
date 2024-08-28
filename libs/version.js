const fs = require('fs');
const package = require('../package.json');
//Modifica il file package.json con la versione corrente come process argv
package.version = process.argv[2];
//salva il file package.json
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
console.log("git tag v" + package.version);
console.log("git push origin v" + package.version);
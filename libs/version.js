const fs = require('fs');
const package = require('../package.json');
package.version = process.argv[2] ? "v" + process.argv[2] : Math.random().toString(16).slice(2, 8);
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));

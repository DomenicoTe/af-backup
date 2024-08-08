const package = require('../package.json');
console.log("git tag v" + package.version);
console.log("git push origin v" + package.version);
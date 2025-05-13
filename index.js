const main = require('./src/index.js');
console.debug = require('./src/libs/utils').debug
const { scheduler } = require('./src/libs/utils')
const { version } = require('./package.json');
console.debug.log(`Agile Factory Backup ${version} started`);

scheduler(main)
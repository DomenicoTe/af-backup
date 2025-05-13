const main = require('./src/index.js');
console.debug = require('./src/libs/utils').debug
const scheduler = require('./src/libs/utils')
scheduler(main)
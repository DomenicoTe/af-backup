const main = require('./src/index.js');
const config = require('./config.js');
console.debug = require('./src/libs/utils').debug
const { version } = require('./package.json');
(async () => {
    console.debug.log(`Agile Factory v${version} started`);
    await main(config);
})()
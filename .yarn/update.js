const fs = require('fs');
const package = require('../package.json');
let version = package.version.slice(1).split('-')[0].split('.');
let buildID = ''


switch (process.argv[2]) {
    case 'major':
        version[0] = Number(version[0]) + 1;
        version[1] = 0;
        version[2] = 0;
        break;
    case 'minor':
        version[1] = Number(version[1]) + 1;
        version[2] = 0;
        break;
    case 'patch':
        version[2] = Number(version[2]) + 1;
        break;
    case 'debug':
        buildID = `-${process.argv[3] ?? 'dev'}`;
        break;
    default: console.log('Usage: yarn update [major|minor|patch]'); process.exit(1);
}

let newVersion = `v${version.join('.')}${buildID}`
console.log(`Current version: ${package.version}`)
console.log(`New version: ${newVersion}`)
fs.writeFileSync('./package.json', JSON.stringify({ ...package, version: newVersion }, null, 2).replace(/\r?\n/g,'\n'), 'utf-8')
console.log(`Version updated to ${newVersion}`)
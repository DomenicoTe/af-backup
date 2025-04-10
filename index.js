const fs = require('fs');
const config = require('./config');
const mongo = require('./libs/mongo/dump.js');
const minio = require('./libs/minio');
const vsftp = require('./libs/vsftp');
const cpenv = require('./libs/cpenv.js');
const { version } = require('./package.json');
const { debug, scheduler, FileName, report } = require('./libs/utils/main');
console.debug = debug;
console.debug.info('Backup service started', version);

(async () => { scheduler(main); })();
async function main() {
    console.debug.log('Backup started');
    const filepath = new FileName(config.root).toString();
    fs.mkdirSync(filepath, { recursive: true });
    let mongo, minio, bkp, sftp
    if (config.mode === 'dev') await dev(filepath)
    if (config.mode === 'release') {
        const result = await release(filepath)
        mongo = result.mongo;
        minio = result.minio;
    }
    bkp = fs.readdirSync(filepath).length !== 0 && ok(mongo) && ok(minio)
    bkp ?
        console.debug.log('Backup doable') :
        console.debug.error('Backup with Error')

    sftp = await vsftp(filepath, config.ftp)
    await report(config.ftp.user, ok(sftp), ok(mongo), ok(minio))
}

function ok(value) {
    switch (value) {
        case null: return false;
        case undefined: return true;
        default: return value;
    }
}
async function dev(path) {
    console.debug.info('Dev mode');
    fs.writeFileSync(`${path}/test.txt`, 'test');
}
async function release(path) {
    console.debug.info('Release mode');
    const result = {
        env: cpenv(path, config.environment, config.includes),
        mongo: await mongo(path, config.mongo, config.mongodb),
        minio: await minio(path, config.minio),
    }
    return result;
}

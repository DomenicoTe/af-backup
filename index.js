const fs = require('fs');
const config = require('./config');
const { version } = require('./package.json');
const mongo = require('./libs/mongo');
const minio = require('./libs/minio');
const vsftp = require('./libs/vsftp');
const cpenv = require('./libs/cpenv.js');
const { scheduler, retries, filename, report } = require('./libs/utils/main');

console.log(new Date(), 'Backup service started', version);

setImmediate(async () => { await retries(main, process.argv[2] || 1); scheduler(main, config.schedule); });

async function main() {
    console.log(new Date(), 'Backup started');
    const path = `./${filename()}`;
    let mongo_ok = false, minio_ok = false;

    fs.mkdirSync(path, { recursive: true });

    if (config.mode === 'dev') {
        fs.writeFileSync(`${path}/test.txt`, 'test');
    } else if (config.mode === 'release') {
        mongo_ok = await mongo(path, config.mongo, config.mongodb);
        minio_ok = await minio(path, config.minio);
        cpenv(path, config.environment);
    }

    const backup_ok = fs.readdirSync(path).length !== 0 && await vsftp(path, config.ftp);

    console.log(new Date(), backup_ok ? 'Backup completed' : 'Backup failed');
    await report(config.ftp.user, backup_ok, mongo_ok, minio_ok);
}

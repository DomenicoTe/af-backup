const fs = require('fs');
const { filename, checkout, report } = require('./libs/utils')

const config = require('../config.js');
const copy = require('./libs/copy/index.js');
const minio = require('./libs/minio/index.js');
const mongo = require('./libs/mongo/index.js');
const vsftp = require('./libs/vsftp/index.js');
module.exports = async function () {
    console.debug.info(config.mode.toUpperCase(), 'mode');
    const folder = filename(config.root);
    let check = { minio: false, mongo: false, files: false }, ftp;
    console.debug.debug(`Folder name: ${folder}`);
    config.mode === "dev" && await dev()
    config.mode === "release" && await release()
    console.debug.debug(`Backup ${checkout(check)}`)
    ftp = await vsftp(folder, config.backup)
    await report(config.backup.user, check, ftp)
    async function dev() {
        check.minio = true;
        check.mongo = true;
        fs.writeFileSync(`${folder}/test.txt`, 'test');
        check.files = Boolean(fs.readdirSync(folder).length)

    }
    async function release() {
        check.minio = await minio(folder, config.minio);
        check.mongo = await mongo(folder, config.mongo);
        check.files = await copy(folder, config);

    }



}


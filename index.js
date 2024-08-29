const fs = require('fs')
const config = require('./config')
const mongo = require('./libs/mongo')
const minio = require('./libs/minio')
const vsftp = require('./libs/vsftp')
const cpenv = require('./libs/cpenv.js')
const { scheduler, retries, filename, report } = require('./libs/utils/main')

setImmediate(async () => { await retries(main, process.argv[2] || 1); scheduler(main, config.schedule) })

async function main() {
    console.log(new Date(), 'Backup started')

    const path = `./${filename()}`
    var mongo_ok = false, minio_ok = false, backup_ok = false

    fs.mkdirSync(path, { recursive: true })

    switch (config.mode) {
        case 'dev': fs.writeFileSync(`${path}/test.txt`, 'test'); console.log("DEV"); break
        case 'release':
            mongo_ok = await mongo(path, config.mongo, config.mongodb)
            minio_ok = await minio(path, config.minio)
            env_ok =  cpenv(path, config.environment)
            break
    }
    if (fs.readdirSync(path).length === 0) backup_ok = false
    else backup_ok = await vsftp(path, config.ftp)

    console.log(new Date(), backup_ok ? 'Backup completed' : 'Backup failed')

    await report(config.ftp.user, backup_ok, mongo_ok, minio_ok)

    fs.rmSync(path, { recursive: true, force: true })

}
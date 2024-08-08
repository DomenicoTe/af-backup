const fs = require('fs')
const config = require('./config')
const mongo = require('./libs/mongo')
const minio = require('./libs/minio')
const vsftp = require('./libs/vsftp')
const filename = require('./libs/utils/filename.js')
const scheduler = require('./libs/utils/scheduler.js')
setImmediate(async () => { await main() })
scheduler(main, config.schedule)

// setInterval(async () => { await main()}, 24 * 60 * 60 * 1000)

async function main() {
    const path = `./${filename()}`
    fs.mkdirSync(path, { recursive: true })
    console.log(new Date(), 'Backup started')
    switch (config.mode) {
        case 'release':
            await mongo(path, config.mongo, config.mongodb)
            await minio(path, config.minio)
            break
        case 'dev':
            fs.writeFileSync(`${path}/test.txt`, 'test')
            if(config.mongodb) console.log('MongoDB backup disabled')
            else console.log(config.mongo,config.mongodb)
            break
    }
    if (fs.readdirSync(path).length === 0) console.log(new Date(), 'Backup failed')
    else {
        await vsftp(path, config.ftp)
        console.log(new Date(), 'Backup complete')
    }
    fs.rmSync(path, { recursive: true, force: true })

}
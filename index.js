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
    try {
        console.log(new Date(), 'Backup started')
        switch (config.mode) {
            case 'release':
                await mongo(path, config.mongo, config.silent)
                await minio(path, config.minio, config.silent)
                break
            case 'dev':
                fs.writeFileSync(`${path}/test.txt`, 'test')
                break
        }
        await vsftp(path, config.ftp, config.silent)
        console.log(new Date(), 'Backup complete')
    } catch (error) {
        console.log(error)
    }
    fs.rmSync(path, { recursive: true, force: true })

}
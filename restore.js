const config = require('./config')
const ftpGet = require('./libs/vsftp').ftpGet
const exec = require('./libs/utils/main').exec
setImmediate(async () => { await get(process.argv[2]) })
async function get(date) {
    if (!date) throw new Error('Date not provided for restore')
    console.log(new Date(), 'Restore started')
    await ftpGet(date, config.environment, config.ftp).catch(e => console.log(e.toString()))
    await exec(`tar -xjf ${config.environment}/${date}.tar.bz2`).catch(e => console.log(e.toString()))
    await exec(`rm ${config.environment}/${date}.tar.bz2`).catch(e => console.log(e.toString()))
    console.log(new Date(), 'Restore completed')
}

const config = require('./config')
const ftpGet = require('./libs/vsftp').ftpGet
setImmediate(async () => { await get(process.argv[2]) }) 
async function get(date) {
    if (!date) throw new Error('Date not provided for restore')
    console.log(new Date(), 'Restore started')
    await ftpGet(date, config.ftp).catch(e => console.log(e.toString()))
    console.log(new Date(), 'Restore completed')    
}

const { quiet } = require('../../config')
const { exec } = require('../utils/main')
module.exports = async function (path, url, db = 'agile-factory') {
    try {
        console.debug.info('Dumping Mongo')
        const command = `mongodump --host ${url} --port 27017 --archive=${path}/mongo.gz --gzip --db ${db}`
        await exec(quiet ? `${command} --quiet` : command)
        console.debug.log('Mongo complete')
        return true
    }
    catch (e) {
        console.debug.error("Mongo failed", + e.message);
        return false
    }
}


//	mongorestore --archive=dump-node.gz --gzip --nsFrom='agile-factory.*' --nsTo='af-leo.*' --host localhost --port 27017

const { execute } = require('../utils')
module.exports = async function (path, {url, db = 'agile-factory'}) {
    try {
        console.debug.info('Dumping Mongo')
        const command = `mongodump --host ${url} --port 27017 --archive=${path}/mongo.gz --gzip --db ${db}`
        await execute(`${command} --quiet`)
        console.debug.success('Mongo complete')
        return true
    }
    catch (e) {
        console.debug.err("Mongo failed", + e.message);
        return false
    }
}


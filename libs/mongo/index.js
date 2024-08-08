const exec = require('../utils/exec')
const { quiet } = require('../../config')
module.exports = async function (path, url, db = 'agile-factory') {
    try {
        if(!quiet) console.log('Dumping Mongo')
        if(quiet) await exec(`mongodump --host ${url} --port 27017 --archive=${path}/mongo.gz --gzip --db ${db} --quiet`)
        else await exec(`mongodump --host ${url} --port 27017 --archive=${path}/mongo.gz --gzip --db ${db}`)
        console.log('Mongo complete')
    }
    catch (e) { console.log("Mongo failed") }
}


//	mongorestore --archive=dump-node.gz --gzip --nsFrom='agile-factory.*' --nsTo='af-leo.*' --host localhost --port 27017

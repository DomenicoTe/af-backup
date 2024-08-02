const exec = require('../utils/exec')

module.exports = async function (path, url, db='agile-factory') {
    try {
        //Non voglio i log di mongodump
        await exec(`mongodump --host ${url} --port 27017 --archive=${path}/mongo.gz --gzip --db ${db} --quiet`)
        console.log('Mongo complete')
    }
    catch (e) { console.log("Mongo failed") }
}


//	mongorestore --archive=dump-node.gz --gzip --nsFrom='agile-factory.*' --nsTo='af-leo.*' --host localhost --port 27017

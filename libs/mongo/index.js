const exec = require('../utils/exec')

module.exports = async function (path, url) {
    try {
        //Non voglio i log di mongodump
        await exec(`mongodump --host ${url} --port 27017 --archive=${path}/mongo.gz --gzip --db agile-factory --quiet`)
        console.log('Mongo complete')
    }
    catch (e) { console.log(e.toString()) }
}


//	mongorestore --archive=dump-node.gz --gzip --nsFrom='agile-factory.*' --nsTo='af-leo.*' --host localhost --port 27017

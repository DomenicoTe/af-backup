const Minio_Client = require('./class.js');
const exec = require('../utils/exec.js')
const fs = require('fs')
const { quiet } = require('../../config')

module.exports = async function (path, config) {
    try {
        const minio = new Minio_Client(config)
        const list = await minio.list()

        if (!fs.existsSync(`${path}/minio`)) fs.mkdirSync(`${path}/minio`, { recursive: true })
        for (const bucket in list) {
            for (const object of list[bucket]) {
                if (!quiet) console.log(`Downloading ${object} from ${bucket}`)
                await minio.download(object, `${path}/minio/${object}`, bucket)
            }
        }
        //Fai un tar bz2 di tutto il contenuto della cartella minio
        await exec(`tar -cjf ${path}/minio.tar.bz2 ${path}/minio`)

        fs.rmSync(`${path}/minio`, { recursive: true, force: true })
        console.log('Minio complete')
        return true
    } catch (error) {
        console.log("Minio failed")
        console.log(error.toString())
        return false
    }
}

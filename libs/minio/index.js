const fs = require('fs')
const Minio_Client = require('./class');
const { exec } = require('../utils/main')
const { quiet } = require('../../config')

module.exports = async function (path, config) {
    try {
        const minio = new Minio_Client(config)
        const list = await minio.list()
        
        if (!fs.existsSync(`${path}/minio`))
            fs.mkdirSync(`${path}/minio`, { recursive: true })
        if (!list.length) {
            console.debug.warning('No files found in minio')
            return true
        }
        for (const bucket of list) {
            for (const object of bucket.files) {
                if (!quiet)
                    console.debug.info(`Downloading ${object} from ${bucket.name} to ${path}/minio/${object}`)
                await minio.download(object, `${path}/minio/${object}`, bucket.name)
            }
        }
        await exec(`tar -cjf ${path}/minio.tar.bz2 ${path}/minio`)

        fs.rmSync(`${path}/minio`, { recursive: true, force: true })
        console.debug.log('Minio complete')
        return true
    } catch (error) {
        console.debug.error("Minio failed", error.message)
        return false
    }
    finally {
        fs.rmSync(`${path}/minio`, { recursive: true, force: true })
    }
}

const { existsSync, mkdirSync, rmSync, } = require('fs')
const Minio_Client = require('./class.js');
const { execute } = require('../utils');

module.exports = async function (path, config) {
    try {
        console.debug.info('Minio backup started')
        let client = new Minio_Client(config)
        let buckets = await client.list()
        !existsSync(`${path}/minio`) && mkdirSync(`${path}/minio`, { recursive: true })

        if (!buckets.length) { console.debug.warn('No files found in minio'); return true }
        for (let bucket of buckets) {
            for (let item of bucket.files) await client.download(item, `${path}/minio/${item}`, bucket.name)
        }
        console.debug.success('Minio complete', path)
        await execute(`tar -cjf ${path}/minio.tar.bz2 -C ${path}/minio/ .`)
        return true
    }
    catch (error) { console.debug.err("Minio failed", error.message); return false }
    finally { rmSync(`${path}/minio`, { recursive: true, force: true }) }
}

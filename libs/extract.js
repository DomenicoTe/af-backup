const fs = require('fs');
const path = require('path');
const tar = require('tar');
const bz2 = require('unbzip2-stream');
module.exports = async function (file) {
    const dir = path.dirname(file)
    const filename = path.basename(file).replace('.tar.bz2', '')
    const folder = path.join(dir, filename)
    fs.mkdirSync(folder, { recursive: true })
    await tarbz2(file, folder)
    const extractDir = path.join(folder, fs.readdirSync(folder)[0])
    console.log("Extracted", extractDir)
    fs.mkdirSync(path.join(extractDir, 'minio'), { recursive: true })
    fs.mkdirSync(folder, { recursive: true })
    const minio = path.join(extractDir,'minio.tar.bz2')
    await tarbz2(minio, path.join(extractDir, 'minio'))
}
function tarbz2(file, folder) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(bz2()).pipe(tar.x({ cwd: folder }))
            .on('error', (e) => reject(e))
            .on('finish', () => resolve());
    })
}
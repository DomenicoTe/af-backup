const fs = require('fs');
const path = require('path');
const tar = require('tar');
const bz2 = require('unbzip2-stream');

path.join = (...args) => args.join('/')
module.exports = async function (filePATH) {
    let downPATH = path.dirname(filePATH)
    console.log("Extracting", filePATH)
    let itemPATH = path.basename(filePATH).replace('.tar.bz2', '')
    console.log("Extracting to", itemPATH)
    let execPATH = path.join(downPATH, itemPATH)
    console.log("Extracting to", execPATH)
    fs.mkdirSync(execPATH, { recursive: true })
    await tarbz2(filePATH, execPATH)
    let miniPATH = path.join(execPATH, 'minio.tar.bz2')
    console.log("Extracting minio", miniPATH)
    fs.mkdirSync(path.join(execPATH, 'minio'), { recursive: true })
    await tarbz2(miniPATH, path.join(execPATH, 'minio'))
    console.log("Extracted minio to", path.join(execPATH, 'minio'))
    fs.rmSync(miniPATH, { recursive: true, force: true })
    console.log("Removed minio tar")
    return execPATH
}
function tarbz2(file, folder) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(bz2()).pipe(tar.x({ cwd: folder }))
            .on('error', (e) => reject(e))
            .on('finish', () => resolve());
    })
}
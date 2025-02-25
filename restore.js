const config = require('./config.js')
const { scan, get } = require('./libs/vsftp');
const extract = require('./libs/extract.js')
const prompt = require('prompt-sync')();
(async () => {
    console.log("Welcome to the restore service wait a moment")
    const list = (await scan(config.ftp))
    console.log(list.map((file, index) => `${index} -\t${file}`).join('\n'))
    console.log("Choose the file to restore ")
    const file = prompt("File(enter the number): ")
    const filename = list[file]
    console.log("Downloading file", filename)
    const downpath = await get(config.ftp, filename)
    console.log("Restore service finished")
    await extract(downpath)

    return
})();

function map(file) {
    if (Array.isArray(file)) { return file.map(item => map(item)) }
    return file.name
}
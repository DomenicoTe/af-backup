const { scan, get } = require('./libs/vsftp');
const extract = require('./libs/extract.js')
const prompt = require('prompt-sync')();
const ftp = {
    server: "94.72.143.145",
    user: process.argv[2],
    pass: process.argv[3],
};

(async () => {
    console.log("Welcome to the restore service wait a moment")
    const list = (await scan(ftp))
    console.log(list.map((file, index) => `${index} -\t${file}`).join('\n'))
    console.log("Choose the file to restore ")
    const file = prompt("File(enter the number): ")
    const filename = list[file]
    console.log("Downloading file", filename)
    const downpath = await get(ftp, filename)
    console.log("Restore service finished")
    const gzip = await extract(downpath)
    console.log("Now Run")
    console.log(`mongorestore --archive=${gzip}/mongo.gz --gzip --nsFrom='agile-factory.*' --nsTo='agile-factory.*' --host localhost --port 27017`)
    return
})();

function map(file) {
    if (Array.isArray(file)) { return file.map(item => map(item)) }
    return file.name
}
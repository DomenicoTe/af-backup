const fs = require('fs');
const prompt = require('prompt-sync')();
const extract = require('./libs/extract.js')
const { scan, get } = require('./src/libs/vsftp');
const downPATH = "./Download"
const ftpOPTION = { server: "94.72.143.145", user: process.argv[2], pass: process.argv[3] };

console.debug = require('./src/libs/utils').debug;

// Check if the Download folder exists, if not create it
if (!fs.existsSync(downPATH)) fs.mkdirSync(downPATH, { recursive: true });

(async () => {
    console.debug.debug("Welcome to the restore service wait a moment");
    const list = await scan(ftpOPTION);
    if (!Boolean(list?.length)) return console.log("No files found");
    let strList = list.map((file, index) => `${index} -\t${file}`).join('\n')
    console.debug.log("Choose the file to restore ")
    console.log(strList)
    const file = 0 //prompt("File(enter the number): ")
    const filename = list[file]
    console.debug.log("Downloading file", filename)
    const downpath = await get(ftpOPTION, filename)
    console.debug.success("Restore service finished")
    const gzip = await extract(downpath)
    console.debug.log("Now Run")
    console.debug.log(`mongorestore --archive=${gzip}/mongo.gz --gzip --nsFrom='agile-factory.*' --nsTo='agile-factory.*' --host localhost --port 27017`)
    return
})();


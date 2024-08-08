const { exec } = require('child_process');
const { quiet } = require('../../config')
module.exports = function (command) {
    if (!quiet) console.log(command)
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(error)
            if (stderr) reject(stderr)
            resolve()
        })
    })
}
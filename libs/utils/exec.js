const { exec, spawn } = require('child_process');
module.exports = function (command) {
    return new Promise((resolve, reject) => {
        spawn(command, { shell: true, stdio: 'inherit' })
            .on('exit', code => {
                if (code !== 0) reject(new Error(`Command failed with code ${code}`))
                resolve()
            })
    })
}

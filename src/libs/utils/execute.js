const { exec, spawn } = require('child_process');
module.exports = function (command) {
    // return new Promise((resolve, reject) => {
    //     spawn(command, { shell: true, stdio: 'inherit' })
    //         .on('exit', code => {
    //             code != 0 ? reject(new Error(code)) : resolve()
    //         })
    // })
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
}

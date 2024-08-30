const { exec } = require('child_process');
const { WebClient } = require('@slack/web-api');
// const decrypt = require('./crypt.js')
const slack_token = require('./config.js')

module.exports.scheduler = function (callback, time) {
    var now = new Date();
    var firstSave = new Date(now.toDateString() + " " + time);
    var timeUntilNext = firstSave - now > 0 ? firstSave - now : firstSave - now + 86400000;
    console.log("Scheduler: Midnight Scheduler set at ", firstSave.toLocaleTimeString(), "(local time)");
    setTimeout(() => { callback(); setInterval(callback, 86400000); }, timeUntilNext);
}

module.exports.retries = async function (callback, time) {
    //Do the callback a number of times
    if (time > 1) console.log("Debug mode for af-backup")
    for (let i = 0; i < time; i++) { await callback() }
}

module.exports.filename = function () {
    const date = new Date()
    var month = date.getMonth() + 1
    month = month.toString()
    month = month.padStart(2, "0")
    var day = date.getDate()
    day = day.toString()
    day = day.padStart(2, "0")
    return `${date.getFullYear()}_${month}_${day}`
}
module.exports.exec = function (command, quiet = true) {
    if (!quiet) console.log(command)
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(error)
            if (stderr) reject(stderr)
            resolve()
        })
    })
}

module.exports.report = async function (nome, bkp, mongo, minio) {
    const slackClient = new WebClient(slack_token);
    const channel = 'C0529SU3EMQ';
    var bkp_ok = bkp_bool(bkp)
    if (!(bkp_ok && minio && mongo)) {
        var message = `*${nome.toUpperCase()}* _Backup_ ${bkp_resolve(bkp)}\n_Minio_ ${minio ? 'OK' : 'KO'} _MongoDB_ ${mongo ? 'OK' : 'KO'}`
        await slackClient.chat.postMessage({ channel: channel, text: message }).catch(e => console.log(nome, e.toString()))
    }
}

function bkp_resolve(bkp) {
    if (bkp === true) return 'OK'; if (bkp === false) return 'KO'
    return bkp
}
function bkp_bool(bkp) {
    //Se bkp = true, allora è andato tutto bene
    if (bkp === true) return true
    if (typeof bkp === 'string') return false
    return bkp
}
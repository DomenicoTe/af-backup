const { exec } = require('child_process');
const { WebClient } = require('@slack/web-api');
const { version } = require('../../package.json')
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
    var bkp_ok = bkp_bool(bkp)
    if (!(bkp_ok && minio && mongo)) {
        await slackClient.chat.postMessage(message('C0529SU3EMQ', version, nome, bkp, minio, mongo)).catch(e => console.log(nome, e.toString()))
    }
}

function bkp_bool(bkp) {
    //Se bkp = true, allora è andato tutto bene
    if (bkp === true) return true
    if (typeof bkp === 'string') return false
    return bkp
}
function message(channel, v, customer, backup, mongo, minio) {
    const text = `Backup ${customer} ${backup ? 'KO' : 'OK'}, MongoDB ${mongo ? 'OK' : 'KO'}, Minio ${minio ? 'OK' : 'KO'}`
    const attachments = [{
        //SE backup è false, il colore è rosso, altrimenti se mongo o minio sono false, il colore è giallo, altrimenti il colore è verde
        color: backup ? (mongo && minio ? '#00FF00' : '#FFD700') : '#FF0000',
        fallback: text,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Description*: ${customer}: backup\n:${backup ? "white_check_mark" : "warning"}: Backup ${backup ? 'OK' : 'KO'}\n:${minio ? "white_check_mark" : "warning"}: Minio ${minio ? 'OK' : 'KO'}\n:${mongo ? "white_check_mark" : "warning"}: MongoDB ${mongo ? 'OK' : 'KO'}`,
                }
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'image',
                        image_url: 'https://ca.slack-edge.com/T011KCAT087-U07JT2P0UE9-b4a8e2536dca-512',
                        alt_text: 'Backup Icon'
                    },
                    {
                        type: 'mrkdwn',
                        text: `Backup ${v} Oggi alle ${new Date().toLocaleTimeString()}`
                    },
                ],
            }
        ]
    }]
    return {
        channel,
        attachments
    }
}
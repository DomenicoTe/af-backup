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
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}_${month}_${day}`;
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

module.exports.report = async function (name, bkp, mongo, minio) {
    const client = new WebClient(slack_token);
    if (!(bkp_bool(bkp) && minio && mongo)) {
        try { await client.chat.postMessage(message('C0529SU3EMQ', version, name, bkp, minio, mongo)) }
        catch (e) { console.log(name, e.toString()) }
    }
}

function bkp_bool(bkp) { return bkp === true ? true : typeof bkp !== 'string' && bkp; }
function message(channel, v, customer, backup, mongo, minio) {

    const status = (s) => s ? "OK" : "KO";
    const icon = (s) => s ? "white_check_mark" : "warning";
    const attachments = [{
        color: backup ? (mongo && minio ? '#00FF00' : '#FFD700') : '#FF0000',
        fallback: `Backup ${customer} ${status(backup)}, MongoDB ${status(mongo)}, Minio ${status(minio)}`,
        blocks: [
            {
                type: 'section',
                text: { type: 'mrkdwn', text: `*Description*: ${customer}: backup\n:${icon(backup)}: Backup ${status(backup)}\n:${icon(minio)}: Minio ${status(minio)}\n:${icon(mongo)}: MongoDB ${status(mongo)}` }
            },
            {
                type: 'context',
                elements: [
                    { type: 'image', image_url: 'https://ca.slack-edge.com/T011KCAT087-U07JT2P0UE9-b4a8e2536dca-512', alt_text: 'Backup Icon' },
                    { type: 'mrkdwn', text: `Backup ${v} Oggi alle ${new Date().toLocaleTimeString()}` }
                ]
            }
        ]
    }];

    return { channel, attachments };
}
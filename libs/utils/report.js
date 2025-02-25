const { WebClient } = require('@slack/web-api');
const { token } = require('../../config');
const { version } = require('../../package.json')
module.exports = async function (name, bkp, mongo, minio) {
    const client = new WebClient(token);
    if (!(bkp && minio && mongo)) {
        try { await client.chat.postMessage(message('C0529SU3EMQ', version, name, bkp, minio, mongo)) }
        // try { await client.chat.postMessage(message('C07RS72LUF2', version, name, bkp, minio, mongo)) }
        catch (e) { console.log(name, e.toString()) }
    }
    else console.debug.log('Backup:', bkp ? "OK" : "KO", "MongoDB:", mongo ? "OK" : "KO", "Minio:", minio ? "OK" : "KO")
}
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
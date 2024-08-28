//Connect to slack and send a message to the channel
const { WebClient } = require('@slack/web-api');
const crypt = require('./crypt.js')
const slackClient = new WebClient(crypt());
// ID del canale Slack o nome del canale
const channel = 'C0529SU3EMQ';
(async () => { await report() })()
// Funzione per inviare un messaggio su Slack
module.exports = async function (nome, minio, mongo, token) {
    const token = decript(nome, token)
    var message
    if (minio && mongo) return
    else message = `${nome} Backup: Minio ${minio ? 'OK' : 'KO'}, MongoDB ${mongo ? 'OK' : 'KO'}`
    try {
        const result = await slackClient.chat.postMessage({
            channel: channel,
            text: message
        });
        console.log(`Messaggio inviato: ${result.ts}`);
    } catch (error) {
        console.error(error);
    }
}

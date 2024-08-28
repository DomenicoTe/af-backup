//Connect to slack and send a message to the channel
const { WebClient } = require('@slack/web-api');
const decrypt = require('./crypt.js')
// Funzione per inviare un messaggio su Slack
module.exports = async function (nome, minio, mongo) {
    const slackClient = new WebClient(decrypt());
    const channel = 'C0529SU3EMQ';
    var message
    if (minio && mongo) return console.log('Backup completato con successo')
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

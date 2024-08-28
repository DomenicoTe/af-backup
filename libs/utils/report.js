//Connect to slack and send a message to the channel
const { WebClient } = require('@slack/web-api');
// Inizializza il client Slack con il token del bot
const token = "xoxp-1053418918279-4378466435137-7664515302608-059a85ec58d204cec9ab9285fd65114c"
const slackClient = new WebClient(token);

// ID del canale Slack o nome del canale
const channel = 'C07K8ATKTG9';

// Funzione per inviare un messaggio su Slack
module.exports = async function (nome, minio, mongo) {
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

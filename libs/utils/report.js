const axios = require('axios');
const { version } = require('../../package.json')
module.exports = async function (name, bkp, mongo, minio) {
    if (!(bkp && minio && mongo)) {
        try { await post('https://hooks.slack.com/services/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', text(name, version, bkp, mongo, minio)) }
        catch (e) { console.log(name, e.toString()) }
    }
    else console.debug.log('Backup:', bkp ? "OK" : "KO", "MongoDB:", mongo ? "OK" : "KO", "Minio:", minio ? "OK" : "KO")
}
function text(name,vers,_bkp,_mongo,_minio){
    const status = (s) => s ? "OK" : "KO";
    const icon = (s) => s ? "white_check_mark" : "warning";
    return {
        "attachments": [
            {
                "color": _bkp ? (_mongo && _minio ? '#00FF00' : '#FFD700') : '#FF0000',
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `*Description*: ${name}: backup\n:${icon(_bkp)}: Backup ${status(_bkp)}\n:${icon(_minio)}: Minio ${status(_minio)}\n:${icon(_mongo)}: MongoDB ${status(_mongo)}`
                        }
                    },
                    {
                        "type": "context",
                        "elements": [
                            { "type": "image", "image_url": "https://ca.slack-edge.com/T011KCAT087-U07JT2P0UE9-b4a8e2536dca-512", "alt_text": "Backup Icon" },
                            { "type": "mrkdwn", "text": `Backup ${vers} Oggi alle ${new Date().toLocaleTimeString()}` }
                        ]
                    }
                ]
            }
        ]
    }
}
function post (url, data) {
    return new Promise((rs, rj) => {
        axios.post(url, data).then((res) => rs(res.data)).catch((e) => rj(e))
    })
}
const axios = require('axios');
const { version } = require('../../../package.json');
// const channel = "https://hooks.slack.com/services/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"
const { hook: channel } = require('../../../config.js') 
module.exports = async function (name, { minio, mongo, files }, ftp) {
    if ((!ftp || !mongo || !minio || !files) && channel != "NO")
        await post(channel, attachment(name, files, mongo, minio, ftp));
    else
        console.debug[ftp ? 'success' : 'err'](name, log(files, mongo, minio, ftp, '\t'));
}

const log = (files, mongo, minio, ftp, _ = '\n') => `Backup ${ftp ? `Success` : `Failed`}${_}${mongo ? "🟩" : "🟥"} MongoDB\t${minio ? "🟩" : "🟥"} Minio\t${files ? "🟩" : "🟥"} File`

function attachment(name, files, mongo, minio, ftp) {
    return {
        "text": `Backup ${name} ${ftp ? "OK" : "KO"}`,
        "attachments": [
            {
                "color": ftp ? "#00FF00" : "#FF0000",
                "blocks": [
                    {
                        type: "section",
                        text: {
                            "type": "mrkdwn",
                            "text": `*Description*: ${name} ${log(name, files, mongo, minio, ftp)}`
                        }
                    },
                    {
                        "type": "context",
                        "elements": [
                            { "type": "image", "image_url": "https://ca.slack-edge.com/T011KCAT087-U07JT2P0UE9-b4a8e2536dca-512", "alt_text": "Backup Icon" },
                            { "type": "mrkdwn", "text": `Backup ${version} Oggi alle ${new Date().toLocaleTimeString()}` }
                        ]
                    }
                ],
            }
        ]
    }
}


async function post(url, data) {
    try {
        await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } })
    }
    catch (e) { console.debug.err(e.message); }
}
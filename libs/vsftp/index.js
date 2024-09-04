const FTP_Client = require('./class')
const { exec } = require('../utils/main')
const credentials = require('./credentials.json')

module.exports = async function (path, ftp_info) {
    const ftp = new FTP_Client(ftp_info.server, ftp_info.user, password(ftp_info.user))
    var bkp_res
    try {
        // Fai un tar del path escludendo il file bin-opcua
        await exec(`tar -cjf ${path}.tar.bz2 ${path}`)
        await ftp.Connect()
        var ftp_response_tar = await ftp.Upload(`/home/${ftp_info.user}/ftp/files/${path}.tar.bz2`, `${path}.tar.bz2`).catch(e => console.log(e))

        if (ftp_response_tar.code == 226) bkp_res = true
        else bkp_res = ftp_response_tar.message

    }
    catch (error) { console.log(ftp_info.user, error.toString()); bkp_res = false }
    finally { await ftp.Close(); return bkp_res }
}
module.exports.ftpGet = async function (file, save, ftp_info) {
    const ftp = new FTP_Client(ftp_info.server, ftp_info.user, password(ftp_info.user))
    try {
        await ftp.Connect()
        await ftp.Download(`/home/${ftp_info.user}/ftp/files/${file}.tar.bz2`, `${save}/${file}.tar.bz2`)
    }
    catch (error) { console.log(ftp_info.user, error.toString()); }
    finally { await ftp.Close(); }

}

function password(user) { const pass = credentials[user]; if (!pass) throw new Error('Password not found'); else return pass }
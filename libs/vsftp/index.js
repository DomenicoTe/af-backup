const FTP_Client = require('./class')
const { exec } = require('../utils/main')
const credentials = require('./credentials.json')

module.exports = async function (path, ftp_info) {
    const ftp = new FTP_Client(ftp_info.server, ftp_info.user, password(ftp_info.user))
    var backup_ok
    try {
        // Fai un tar del path escludendo il file bin-opcua
        await exec(`tar -cjf ${path}.tar.bz2 --exclude=${path}/bin-opcua ${path}`)
        await ftp.Connect()
        var ftp_response_tar = await ftp.Upload(`/home/${ftp_info.user}/ftp/files/${path}.tar.bz2`, `${path}.tar.bz2`).catch(e => console.log(e))
        var ftp_response_opc = await ftp.Upload(`/home/${ftp_info.user}/ftp/files/${path}/bin-opcua`, `${path}/bin-opcua`).catch(e => console.log(e))
        
        if (ftp_response_tar.code == 226 && ftp_response_opc.code == 226) backup_ok = true
        else if(ftp_response_tar.code != 226) backup_ok = ftp_response_tar.message
        else if(ftp_response_opc.code != 226) backup_ok = ftp_response_opc.message
        else backup_ok = false

    }
    catch (error) { backup_ok = false }
    finally { await ftp.Close(); return backup_ok }
}
function password(user) { const pass = credentials[user]; if (!pass) throw new Error('Password not found'); else return pass }
const FTP_Client = require('./class')
const { exec } = require('../utils/main')
const credentials = require('./credentials.json')

module.exports = async function (path, ftp_info) {
    const ftp = new FTP_Client(ftp_info.server, ftp_info.user, password(ftp_info.user))
    var backup_ok
    try {
        await exec(`tar -cjf ${path}.tar.bz2 ${path}`)
        await ftp.Connect()
        var ftp_response = await ftp.Upload(`/home/${ftp_info.user}/ftp/files/${path}.tar.bz2`, `${path}.tar.bz2`)
        if(ftp_response.code == 226) backup_ok = true
        else backup_ok = ftp_response.message
    } 
    catch (error) { backup_ok = false }
    finally { await ftp.Close(); return backup_ok }
}
function password(user) { const pass = credentials[user]; if (!pass) throw new Error('Password not found'); else return pass }
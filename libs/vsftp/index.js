const exec = require('../utils/exec')
const FTP_Client = require('./class.js')
module.exports = async function (path, ftp_info,silent = false) {
    let ftp = new FTP_Client(ftp_info.server, ftp_info.user, ftp_info.password)
    try {
        await ftp.Connect()
        await exec(`tar -cjf ${path}.tar.bz2 ${path}`)
        await ftp.Upload(`/home/${ftp_info.user}/ftp/files/${path}.tar.bz2`, `${path}.tar.bz2`)
        silent && console.log('FTP complete')
        await ftp.Close()
        
    } catch (error) {
        console.log('FTP failed')
        await ftp.Close()
        throw error
    }
}
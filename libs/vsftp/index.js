const { quiet } = require('../../config.js')
const exec = require('../utils/exec')
const FTP_Client = require('./class.js')
const credentials = require('./credentials.json')
module.exports = async function (path, ftp_info) {
    const password = credentials[ftp_info.user]
    if (!password) throw new Error('Password not found')
    const ftp = new FTP_Client(ftp_info.server, ftp_info.user, password)
    try {
        await ftp.Connect()
        await exec(`tar -cjf ${path}.tar.bz2 ${path}`)
        await ftp.Upload(`/home/${ftp_info.user}/ftp/files/${path}.tar.bz2`, `${path}.tar.bz2`)
        quiet && console.log('FTP complete')
        await ftp.Close()

    } catch (error) {
        console.log('FTP failed')
        await ftp.Close()
    }
}
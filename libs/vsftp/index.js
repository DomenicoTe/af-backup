const path = require('path')
const FTP_Client = require('./class')
const exec = require('../utils/exec')
const credentials = require('./credentials.json')
const fs = require('fs')
module.exports = async function (dump, { server, user, pass }) {
    let resolve
    const ftp = new FTP_Client(server, user, pass || password(user))
    const tar = `${dump}.tar.bz2`
    const tarfile = path.basename(`${dump}.tar.bz2`);

    const remote = `/home/${user}/ftp/files/${tarfile}`.replaceAll("./", "")
    try {
        await exec(`tar -cjf "${dump}.tar.bz2" "${dump}"`)
        await ftp.Connect()
        if (!ftp.isConnected) throw new Error('FTP not connected')
        const ftp_response_tar = await ftp.Upload(remote, dump + ".tar.bz2")
        resolve = ftp_response_tar.code == 226
        fs.unlinkSync(tar)
        fs.rmSync(dump, { recursive: true })
    }
    catch (error) {
        console.debug.error("Upload", user, error.message)
        resolve = false
    }
    finally {
        await ftp.Close();
        return resolve
    }


}
function password(user) { const pass = credentials[user]; if (!pass) throw new Error('Password not found'); else return pass }
module.exports.scan = async function ({ server, user, pass }) {
    const ftp = new FTP_Client(server, user, pass || password(user))
    try {
        await ftp.Connect()
        if (!ftp.isConnected) throw new Error('FTP not connected')
        return push(await ftp.List('ftp/files'))
    }
    catch (error) {
        console.log("List", user, error.message)
        return []
    }
    finally {
        await ftp.Close();
    }
}

function push(lista) {
    let list = []
    for (let i = 0; i < lista.length; i++) {
        if (Array.isArray(lista[i])) { list.push(...push(lista[i])) }
        else list.push(lista[i].name)
    }
    return list
}
module.exports.get = async function ({ server, user, pass }, file) {
    const ftp = new FTP_Client(server, user, pass || password(user))
    const remote = `${file}`
    try {
        if (!ftp.isConnected) await ftp.Connect()
        const ftp_response = await ftp.Get(remote)
        if (ftp_response.code == 226) return `Download/${path.basename(remote)}`
        else throw new Error('Download failed ' + ftp_response.code)
    }
    catch (error) {
        console.error("Download", user, error.message, error.stack)
        return false
    }
    finally {
        await ftp.Close();
    }
}
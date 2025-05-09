const FTP_Client = require('./client.js');
const credentials = require('../credentials.json');
const { execute, path } = require('../utils');
const { unlinkSync, rmSync } = require('fs');
module.exports = async function (folder, { user, pass, server }) {
    const client = new FTP_Client(server, user, pass || password(user))
    const archive = `${folder}.tar.bz2`
    const remote = `/home/${user}/ftp/files/${path.basename(archive)}`;
    let resolve = false;
    console.debug.log(`Dumping ${folder} to ${remote}`);
    await execute(`tar -cjf "${archive}" -C "${folder}" .`);
    try {
        await client.Connect()
        if (!client.isConnected) throw new Error('Failed to connect');
        resolve = await client.Upload(remote, archive) == 226;
    }
    catch (e) { console.debug.err(e.message); }
    finally { await client.Close(); }

    unlinkSync(archive);
    rmSync(folder, { recursive: true, force: true });

    return resolve;

}
const password = (user) => {
    const password = credentials[user]
    if (!password) throw new Error(`No ${user}`);
    return password
}

module.exports.scan = async function ({ server, user, pass }) {
    const ftp = new FTP_Client(server, user, pass)
    try {
        await ftp.Connect()
        if (!ftp.isConnected) throw new Error('FTP not connected')
        return push(await ftp.List('ftp/files'))
    }
    catch (error) { return console.log("List", user, error.message) }
    finally { await ftp.Close(); }
}

function push(lista) {
    let list = []
    for (let e of lista) if (Array.isArray(e)) list.push(...push(e)); else list.push(e.name)
    return list
}
module.exports.get = async function ({ server, user, pass }, file) {
    const ftp = new FTP_Client(server, user, pass)
    const remote = `${file}`
    try {
        if (!ftp.isConnected) await ftp.Connect()
        const { code } = await ftp.Get(remote)
        if (code == 226) return `./Download/${path.basename(remote)}`
        else throw new Error(`Failed to download ${remote} with code ${code}`)
    }
    catch (error) { return console.debug.err(`${user} Download Error: ${error.message}`) }
    finally { await ftp.Close(); }
}
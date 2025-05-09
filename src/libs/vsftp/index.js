const FTP_Client = require('./client.js');
const credentials = require('./credentials.json');
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
    finally { await client.Close();}

    unlinkSync(archive);
    rmSync(folder, { recursive: true, force: true });

    return resolve;

}
const password = (user) => {
    const password = credentials[user]
    if (!password) throw new Error(`No ${user}`);
    return password
}
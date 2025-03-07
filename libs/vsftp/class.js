const { existsSync, mkdirSync } = require('fs');
const ftp = require('basic-ftp');
const path = require('path');
module.exports = class FtpClient {
    constructor(host, user, password, port = 21) {
        this.options = { host, user, password, port };
        this.isWorking = false;
        this.isConnected = false;
        this.client = new ftp.Client();
    }
    async Connect() {
        let connection_status = await this.client.access(this.options)
        if (connection_status.code == 220) this.isConnected = true;
        return connection_status.code == 220;
    }
    async Close() {
        if (this.isWorking) return console.debug.warning(this.options.user, 'Already working');
        if (!this.isConnected) return console.debug.warning(this.options.user, 'Not connected');
        this.client.close();
        if (!this.client.closed) return console.debug.error(this.options.user, 'Failed to close');
        this.isConnected = false;
        this.isWorking = false;
    }
    async Upload(remote, local) {
        if (!this.isConnected) throw new Error('Not connected');
        console.debug.info("Uploading", local, "to", remote)
        let ftp_response = await this.client.uploadFrom(local, remote, 0)
        console.debug.log("Uploaded", local, "to", remote, "with code", ftp_response.code)
        return ftp_response;
    }
    async Download(remote, local) {
        if (!this.isConnected) throw new Error('Not connected');
        console.debug.info("Downloading", remote)
        let ftp_response = await this.client.downloadTo(local, remote, 0)
        console.debug.log("Downloaded", ftp_response.code == 226 ? "success" : "failed")
        return ftp_response;
    }

    async List(remote, isChild = false) {
        if (!this.isConnected) throw new Error('Not connected');
        let lista = await this.client.list(remote);
        for (let i = 0; i < lista.length; i++) {
            if (lista[i].type == 2) {
                let root = `${remote}/${lista[i].name}`
                lista[i] = await this.List(root, true)

            }
            else {
                lista[i].name = `${remote}/${lista[i].name}`
            }
        }
        return lista;
    }
    async Get(remote) {
        if (!this.isConnected) throw new Error('Not connected');
        if (!existsSync('Download')) mkdirSync('Download', { recursive: true })
        let list = await this.List(path.dirname(remote))
        list = list.map(item => item.name)
        console.log(remote,list)
        
        console.log("Restoring file", list.includes(remote) ? remote : "not found")
        let savePoint = `Download/${path.basename(remote)}`
        console.log("Downloading", remote)
        let result = await this.client.downloadTo(savePoint, `/home/${this.options.user}/${remote}`, 0)
        return result;
    }
}
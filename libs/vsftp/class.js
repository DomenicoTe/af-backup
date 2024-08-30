const ftp = require('basic-ftp');
module.exports = class FtpClient {
    constructor(host, user, password, port = 21) {
        this.options = { host: host, user: user, password: password, port: port };
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
        if (this.isWorking) return console.log(this.name, 'Already working');
        if (!this.isConnected) throw new Error('Not connected');
        this.client.close();
        if (!this.client.closed) throw new Error("FTP Connection Close Error");
        this.isConnected = false;
        this.isWorking = false;
    }
    async Upload(remote, local) {
        if (!this.isConnected) throw new Error('Not connected');
        console.log("Uploading", local, "to", remote)
        let ftp_response = await this.client.uploadFrom(local, remote, 0)
        console.log(local, "uploaded to", remote, "with code", ftp_response.code)
        return ftp_response;
    }
}
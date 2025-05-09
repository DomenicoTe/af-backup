const Minio = require("minio");

module.exports = class {
    /** @param {object} settings - {url, options, bucket, domain} */
    constructor({ url, options, bucket }) {
        
        if (!url) throw new Error("URL is required");
        if (!bucket) throw new Error("Bucket name is required");
        if (!options) throw new Error("Options are required");
        this.url = url;
        this.option = options;
        this.bucket = bucket;
        this.client = new Minio.Client(this.option);
    }
    download(filename, destination, bucket = this.bucket) {
        if (!filename) throw new Error("Filename is required");
        if (!destination) throw new Error("Destination is required");
        return new Promise((resolve, reject) => {
            this.client.fGetObject(bucket, filename, destination, (err) => {
                if (err) reject(err);
                else { resolve(destination); }
            });
        })
    }
    list() {
        //get all buckets
        return new Promise((resolve, reject) => {
            this.client.listBuckets(async (err, buckets) => {
                if (err) reject(err);
                else {
                    for (let i = 0; i < buckets.length; i++) {
                        buckets[i].files = await this.listObjects(buckets[i].name);
                    }
                    resolve(buckets);
                }
            });
        });
    }
    listObjects(bucketName) {
        return new Promise((resolve, reject) => {
            const list = [];
            const stream = this.client.listObjects(bucketName, '', true);
            stream.on('data', function (obj) {
                list.push(obj.name);
            });
            stream.on('error', function (err) {
                reject(err);
            });
            stream.on('end', function () {
                resolve(list);
            });
        });
    }


    // Remove(fileName) {
    //     if (!fileName) throw new Error("Filename is required");
    //     console.log("Removing file: %s from %s", fileName, this.bucket);
    //     return client.removeObject(this.bucket, fileName).catch((error) => { throw new Error(error); });
    // }
    // List() {

    //  }
}
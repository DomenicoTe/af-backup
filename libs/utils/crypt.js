
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from('13d9e09fafd820cfee7f831b67365e0372eda4a494cb591c2e01fc6fc40abfbd', 'hex');
const config = require('./config.js');
module.exports = function () { return decrypt(config.secret_data, config.secret_iv) }

function decrypt(encryptedData, iv) {
    let ivBuffer = Buffer.from(iv, 'hex');
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivBuffer);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
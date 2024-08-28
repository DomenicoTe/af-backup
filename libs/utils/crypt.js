
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const config = require('./config.js');
const key = Buffer.from(config.secret_key, 'hex');
module.exports = function () { return decrypt(config.secret_data, config.secret_iv) }

function decrypt(encryptedData, iv) {
    let ivBuffer = Buffer.from(iv, 'hex');
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivBuffer);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
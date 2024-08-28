
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from('13d9e09fafd820cfee7f831b67365e0372eda4a494cb591c2e01fc6fc40abfbd', 'hex');
const encryptedData = {
    iv: '4a05e16ae919238015240deef31f62dc',
    encryptedData: '0f40e4b7a60d982bb4b44dfd7d5bd3def1bd61811c9a12b0f48856bde1d55b64379a0648ed7ae78ba73c27478cec1a1a7c6f49ec9dc3f9b36fdcd8304c60ef65'
}
module.exports = function () { return decrypt(encryptedData.encryptedData, encryptedData.iv) }
// var data = decrypt(encryptedData.encryptedData, encryptedData.iv) 
// console.log(data)
// console.log("xoxb-1053418918279-7639091028485-pqCcuOOnoXQCcIrsjN3S2Qh7")
// console.log(data === "xoxb-1053418918279-7639091028485-pqCcuOOnoXQCcIrsjN3S2Qh7")
// // const key = crypto.randomBytes(32); // Chiave segreta
// // const iv = crypto.randomBytes(16);  // Vettore di inizializzazione

// // function encrypt(text) {
// //     let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
// //     let encrypted = cipher.update(text);
// //     encrypted = Buffer.concat([encrypted, cipher.final()]);
// //     return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
// // }

function decrypt(encryptedData, iv) {
    let ivBuffer = Buffer.from(iv, 'hex');
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivBuffer);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
// // console.log(key)
// // console.log(iv.toString('hex'))
// // console.log(encrypt("xoxb-1053418918279-7639091028485-pqCcuOOnoXQCcIrsjN3S2Qh7"))
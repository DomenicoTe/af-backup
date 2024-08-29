const fs = require('fs')
const path = require('path')

module.exports = function (dir, environment) {
    const files = fs.readdirSync(environment).filter(file => file.endsWith('.env'))
    if (files.length === 0) { console.log('No .env files found'); return false }
    // files.forEach(file => fs.copyFileSync(path.join(environment, file), path.join(dir, file)))
    for (const file of files) fs.copyFileSync(path.join(environment, file), path.join(dir, file))
    const opcua = fs.readdirSync(path.join(environment, "bin"))[0]
    fs.copyFileSync(path.join(environment, "bin", opcua), path.join(dir, opcua))
    return true

}

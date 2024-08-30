const fs = require('fs')
const path = require('path')

module.exports = function (dir, environment) {
    const files = fs.readdirSync(environment).filter(file => file.endsWith('.env'))
    if (files.length === 0) { console.log('No .env files found'); return false }
    // Copy all the .env files
    for (const file of files) fs.copyFileSync(path.join(environment, file), path.join(dir, file))
    // Copy the opcua binary
    const opcua = fs.readdirSync(path.join(environment, "bin"))[0]; console.log(opcua)
    fs.copyFileSync(path.join(environment, "bin", opcua), path.join(dir, "bin-opcua"))
    return true
}

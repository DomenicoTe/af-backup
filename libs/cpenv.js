const fs = require('fs')
const path = require('path')

module.exports = function (dir, env, extensions) {
    if (!fs.existsSync(env)) {
        console.debug.warning('No .env directory found');
        return false
    }
    const files = fs.readdirSync(env)
        .filter(file => check(file, extensions))
    if (files.length === 0) {
        console.debug.warning('No .env files found');
        return false
    }
    for (const file of files) {
        console.debug.info(`Copying ${file} to ${dir}`);
        fs.copyFileSync(path.join(env, file), path.join(dir, file))
    }
    return true
}
function check(file, extensions) {
    //togli le cartelle che iniziano per .nomecartella
    // if (file.startsWith('.')) return false;
    const x = extensions.some(ext => file.endsWith(ext));
    console.log(extensions)
    return extensions.some(ext => file.endsWith(ext));
}
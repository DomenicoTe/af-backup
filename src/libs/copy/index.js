const fs = require("fs"); const path = require("path");
module.exports = async function (folder, { env, include }) {
    try {
        console.debug.info("Copying files started");
        for (let items of include) {
            if (items[0] == "/") {
                console.log(items, path.join(folder, path.basename(items)))
                fs.copyFileSync(items, path.join(folder, path.basename(items)));
            }
            else {
                let files = fs.readdirSync(env).filter(item => item.endsWith(items)).map(item => path.join(env, item));
                if (!files.length) { console.debug.warn(`No files found in ${items}`); continue; }
                for (let file of files) {
                    console.debug.debug(`Copying ${file} to ${folder}`);
                    fs.copyFileSync(file, path.join(folder, path.basename(file)));
                    console.debug.success(`Copied ${file} to ${folder}`);
                }
            }
        }
        return true;
    }
    catch (error) {
        console.debug.err("Copying files failed", error.message);
        return false;
    }

}
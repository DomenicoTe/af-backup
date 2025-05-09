const {mkdirSync, existsSync} = require("fs");
const filename = (root) => `${root}/${datetime()}`
const datetime = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}_${month}_${day}`;
}
module.exports = function (root) { 
    const folder = filename(root);
    existsSync(folder) || mkdirSync(folder, { recursive: true });
    // existsSync('./dump') || mkdirSync('./dump', { recursive: true });
    return folder;
}
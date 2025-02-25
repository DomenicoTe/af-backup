const {
    red, gray, blue, yellow, cyan
} = require("colors");
const time = () => `[${new Date().toLocaleString()}]`;
module.exports.log = (...args) => console.log(time().blue, "✔️ ", ...args)
module.exports.error = (...args) => console.error(time().red, "❌", ...args)
module.exports.warning = (...args) => console.warn(time().yellow, "⚠️ ", ...args)
module.exports.info = (...args) => console.info(time().gray, "⚙️ ", ...args)
module.exports.dlog = (...args) => console.debug(time().cyan, "⬇️ ", ...args)
const { red, gray, blue, yellow, magenta, green } = require('colors')
const time = () => `[${new Date().toLocaleString()}]`;

module.exports = {
    log: (...args) => print("🟦", ...args),
    err: (...args) => print("🟥", ...args),
    warn: (...args) => print("🟨", ...args),
    info: (...args) => print("⬜", ...args),
    debug: (...args) => print("🟪", ...args),
    success: (...args) => print("🟩", ...args),
}
const colorMAP = {
    "🟥": { color: red, icon: "❌ " },
    "⬜": { color: gray, icon: "⚙️  " },
    "🟦": { color: blue, icon: " ✔ " },
    "🟩": { color: green, icon: " ✔ " },
    "🟨": { color: yellow, icon: "⚠️  " },
    "🟪": { color: magenta, icon: "ℹ️  " },
}
const print = (item, ...args) => {
    let { color, icon } = colorMAP[item];
    console.log(`${color(time())} ${color(icon)} ${args.join(" ")}`);
}
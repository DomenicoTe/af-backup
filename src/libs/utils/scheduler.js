async function main(_function) {
    await _function();
    console.debug.info(cinderella.toString())
    setTimeout(async () => { await main(_function) }, cinderella())
}
module.exports = function (func) {
    setTimeout(async () => { await main(func) }, 1000)
}
const cinderella = () => new Date().setHours(24, 0, 0, 0) - new Date()
cinderella.toString = () => { let time = cinderella(); return `Time left until next run: ${Math.floor(time / 3600000)} hours, ${Math.floor((time % 3600000) / 60000)} minutes and ${Math.floor((time % 60000) / 1000)} seconds` }

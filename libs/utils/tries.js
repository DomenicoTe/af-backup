module.exports = async function (callback, time) {
    //Do the callback a number of times
    for (let i = 0; i < time; i++) { console.log("Debug mode for af-backup");  await callback() }
}

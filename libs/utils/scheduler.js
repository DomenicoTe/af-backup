module.exports = function (callback, time) {
    var now = new Date();
    var firstSave = new Date(now.toDateString() + " " + time);
    var timeUntilNext = firstSave - now > 0 ? firstSave - now : firstSave - now + 86400000;
    console.log("Scheduler: Midnight Scheduler set at ", firstSave.toLocaleTimeString(), "(local time)");
    setTimeout(() => { callback(); setInterval(callback, 86400000); }, timeUntilNext);
}

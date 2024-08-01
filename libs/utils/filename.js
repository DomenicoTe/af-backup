module.exports = function () {
    const date = new Date()
    var month = date.getMonth() + 1
    month = month.toString()
    month = month.padStart(2, "0")
    var day = date.getDate()
    day = day.toString()
    day = day.padStart(2, "0")
    return `${date.getFullYear()}_${month}_${day}`
}
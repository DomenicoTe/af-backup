module.exports = function (check) {
    let ok = [], ko = []
    Object.entries(check).forEach(([key, value]) => value ? ok.push(key) : ko.push(key));
    if (ko.length === 3) return "Failed";
    if (ok.length === 3) return "Success";
    return `Partial, OK: ${ok.join(", ")}, Failed: ${ko.join(", ")}`;
}
// module.exports.icon = 
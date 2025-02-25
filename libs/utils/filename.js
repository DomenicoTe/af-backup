module.exports = class {
    constructor(root) {
        this.root = root;
        this.date = new Date();
        this.month = String(this.date.getMonth() + 1).padStart(2, "0");
        this.day = String(this.date.getDate()).padStart(2, "0")
    }
    toString() {
        return `./${this.root}/${this.date.getFullYear()}_${this.month}_${this.day}`;
    }
}
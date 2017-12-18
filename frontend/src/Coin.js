module.exports = function(name, price) {
    this.name = name;
    this.price = price;
    this.getName = function() {
        return this.name;
    };
    this.getPrice = function() {
        return this.price;
    };
};

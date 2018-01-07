module.exports = function(currency) {
    if (currency === "USD") {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
            // the default value for minimumFractionDigits depends on the currency
            // and is usually already 2
        });
    }
    if (currency === "PLN") {
        return new Intl.NumberFormat("pl-PL", {
            style: "currency",
            currency: "PLN",
            minimumFractionDigits: 2
            // the default value for minimumFractionDigits depends on the currency
            // and is usually already 2
        });
    }
};

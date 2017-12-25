var express = require("express");
var router = express.Router();
/* GET list of supported currencies */

router.get("/", function(req, res, next) {
    var investments = [
        {
            id: "bitcoin",
            name: "Bitcoin",
            amount: "0.19",
            price_usd: 16000,
        },
        {
            id: "ethereum",
            name: "Ethereum",
            amount: "46",
            price_usd: 715
        }
    ];
    res.json(investments);
});

module.exports = router;

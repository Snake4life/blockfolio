var express = require('express');
var router = express.Router();
var request = require('request');

/* GET list of supported currencies */

router.get('/', function(req, res, next) {
    request('https://api.coinmarketcap.com/v1/ticker/', function (error, response, body) {
        var data = JSON.parse(body);
        var coins = data.map(el => {
            return {
                name: el.name,
                price_usd: el.price_usd,
                market_cap_usd: el.market_cap_usd
            }
        })
        //data.map((key)=> {
        //    return { "name":data[key].name, "price":data[key].price_usd };
        //});
        res.send(coins);
    });
});

module.exports = router;
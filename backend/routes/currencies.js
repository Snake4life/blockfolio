var express = require('express');
var router = express.Router();
var request = require('request');

/* GET list of supported currencies */

router.get('/', function(req, res, next) {
    request('https://api.coinmarketcap.com/v1/ticker/', function (error, response, body) {
        try {
            var data = JSON.parse(body);

            var coins = data.map(el => {
                return {
                    name: el.name,
                    price_usd: el.price_usd,
                    market_cap_usd: el.market_cap_usd,
                    percent_change_24h: el.percent_change_24h,
                    percent_change_7d: el.percent_change_7d,
                    percent_change_1h: el.percent_change_1h
                }
            });

            res.send(coins);

        } catch(e) {
            res.sendStatus(500);
        }        
    });
});

module.exports = router;
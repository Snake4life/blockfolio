var express = require("express");
var router = express.Router();
var request = require("request");
var Currency = require("../Currency");
var winston = require("winston");

router.get("/list", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    winston.debug("Getting a list of all currencies");

    // TODO update the list from coinmarketcap API in the background

    Currency.getAll()
        .then(response => {
            winston.info("Got a list of "+response.length+" currencies,");
            res.json(response);
        })
        .catch(e => {
            winston.error("Error getting currencies. " + e);
            res.sendStatus(500);
        });
});
router.get("/fullSnapshot/:currencyId", (req, res, next) => {
    // store the data in the database
    // check if its older than one hour, if so update it from CC
    request("https://www.cryptocompare.com/api/data/CoinSnapshotFullById/?id="+req.params.currencyId, (err, response, body) => {
            if (err) throw new Error(err);
            res.send(body);
    });
    
});
router.get("/mine", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    winston.debug("Getting a list of currencies for user");

    // TODO update the list from coinmarketcap API in the background

    Currency.getByUser(req.user.user_id)
        .then(response => {
            winston.info("Got a list of "+response.length+" currencies.");
            res.json(response);
        })
        .catch(e => {
            winston.error("Error getting currencies. " + e);
            res.sendStatus(500);
        });
});

router.get("/currency/:symbol", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);
    
    winston.debug("Getting currency details for "+req.params.symbol);

    Currency.getBySymbol(req.params.symbol)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            winston.error("Unable to retrieve currency '"+req.params.symbol+"'. "+err);
        });

    //res.json(investments);
});

module.exports = router;

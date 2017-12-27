var express = require("express");
var router = express.Router();
var request = require("request");
var Currency = require("../Currency");
var winston = require("winston");

router.get("/list", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    winston.info("Getting a list of all currencies");

    // TODO update the list from coinmarketcap API in the background

    Currency.getAll()
        .then(response => {
            winston.info(response);
            res.json(response);
        })
        .catch(e => {
            winston.error("Error getting currencies. " + e);
            res.sendStatus(500);
        });
});

module.exports = router;

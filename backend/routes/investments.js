var express = require("express");
var router = express.Router();
var Investment = require("../Investment");
var Currency = require("../Currency");
var winston = require("winston");

router.get("/", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    Investment.getByUser(req.user.user_id)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            winston.error("Unable to retrieve investments. "+err);
        });

    //res.json(investments);
});

router.get("/currency/:symbol", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    winston.info("Fetching currency details for "+req.params.symbol);
    Currency.getBySymbol(req.params.symbol).then(currency=> {
        Investment.getByUserAndCurrencyIdWithBalance(req.user.user_id, currency.currency_id)
        .then(investments => {
            res.json({currency:currency, investments:investments});
        })
        .catch(err => {
            winston.error("Unable to retrieve investments. "+err);
        });
    }).catch(err => {
        winston.error("Unable to fetch currency. "+err);
    });

});

router.get("/investment/:investmentId", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    winston.info("Fetching currency details for "+req.params.investmentId);

    Investment.getByUserAndInvestment(req.user.user_id, req.params.investmentId)
        .then(investment => {
            Currency.getById(investment.currency_id).then(currency => {
                res.json({ currency: currency, investment: investment});
            }).catch(err => {
                winston.error("Unable to retrieve currency. "+err);
                res.sendStatus(404);
            });
            
        })
        .catch(err => {
            winston.error("Unable to retrieve investment. "+err);
            res.sendStatus(404);
        });

});

router.get("/delete/:investmentId", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    winston.info("Deleting investment "+req.params.investmentId+" for user "+req.user.user_id);

    Investment.delete(req.params.investmentId, req.user.user_id)
        .then(response => {
            res.sendStatus(200);
        })
        .catch(err => {
            winston.error("Unable to delete investment. "+err);
            res.sendStatus(500);
        });

});

router.get("/growth", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    Investment.getGrowthOverTime(req.user.user_id)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            winston.error("Unable to retrieve investment growth. "+err);
        });
});


router.get("/total", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    Investment.getSummaryForUser(req.user.user_id)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            winston.error("Unable to retrieve investment growth. "+err);
        });

    //res.json(investments);
});

router.post("/add", function(req, res, next) {
    if(req.user == null) return res.sendStatus(401);

    winston.info("Adding investment, currency: "+req.body.symbol+", amount: "+req.body.amount + " user: "+req.user.user_id + ", datetime: "+req.body.datetime);

    Investment.add(req.user.user_id, req.body.symbol, req.body.amount, req.body.datetime).then(response => {
        winston.info("Succesfully added investment.");
    }).catch(err => {
        winston.error("Unable to add investment. "+err);
    });

    res.sendStatus(200);
});

module.exports = router;

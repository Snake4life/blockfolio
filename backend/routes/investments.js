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

router.get("/details/:currencyId", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    winston.info("Fetching currency details for "+req.params.currencyId);

    Investment.getByUserAndCurrency(req.user.user_id, req.params.currencyId)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            winston.error("Unable to retrieve investments. "+err);
        });

    //res.json(investments);
});

router.get("/delete/:investmentId", function(req, res, next) {
    if (req.user == null) return res.sendStatus(401);

    winston.info("Deleting investment "+req.params.investmentId+" for user "+req.user.user_id);

    Investment.delete(req.params.investmentId, req.user.user_id)
        .then(response => {
            res.sendStatus(200);
        })
        .catch(err => {
            winston.error("Unable to retrieve investments. "+err);
        });

    //res.json(investments);
});

router.post("/add", function(req, res, next) {
    if(req.user == null) return res.sendStatus(401);

    winston.info("Adding investment, currency: "+req.body.currencyId+", amount: "+req.body.amount + " user: "+req.user.user_id + ", date: "+req.body.date);

    Investment.add(req.user.user_id, req.body.currencyId, req.body.amount, req.body.date).then(response => {
        winston.info("Succesfully added investment.");
    }).catch(err => {
        winston.error("Unable to add investment. "+err);
    });

    res.sendStatus(200);
});

module.exports = router;

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

router.post("/add", function(req, res, next) {
    if(req.user == null) return res.sendStatus(401);

    winston.info("Adding investment of "+req.body.currencyId+" with amount "+req.body.amount + " for user "+req.user.user_id);
    
    Investment.add(req.user.user_id, req.body.currencyId, req.body.amount).then(response => {
        winston.info("Succesfully added investment.");
    }).catch(err => {
        winston.error("Unable to add investment. "+err);
    });

    res.sendStatus(200);
});

module.exports = router;

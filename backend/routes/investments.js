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

module.exports = router;

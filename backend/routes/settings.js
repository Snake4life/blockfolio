var express = require("express");
var router = express.Router();
var User = require("../User");
var winston = require("winston");

router.get("/", (req, res, next) => {
    if (req.user == null) return res.sendStatus(401);
    try {
        res.json({
            investments_view: req.user.investments_view,
        });
    } catch (err) {
        winston.error(err);
    }
});


module.exports = router;

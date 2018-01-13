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

router.post("/", (req, res, next) => {
    var settings = req.body.settings;

    winston.info("Changing settings for user " + req.user.username);

    User.updateSettings(req.user.user_id, settings).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        winston.error("Error while updating settings. "+err);
        res.sendStatus(500);
    })

});

module.exports = router;

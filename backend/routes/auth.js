var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var User = require("../User");
var crypto = require("crypto");
var Session = require("../Session");

router.post("/signIn", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    User.authenticate(username, password)
        .then(row => {
            User.generateToken(row.user_id)
                .then(json => {
                    res.json({
                        session: json
                    });
                })
                .catch(err => {
                    res.sendStatus(err);
                });
        })
        .catch(err => {
            res.sendStatus(err);
        });
});

router.get("/extend", (req, res, next) => {
    Session.extend("");
});

module.exports = router;

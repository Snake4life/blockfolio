var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var User = require("../User");
var crypto = require("crypto");
var Session = require("../Session");
var winston = require("winston");

router.post("/signIn", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    winston.info("Signing in user " + username);

    User.authenticate(username, password)
        .then(row => {
            winston.info(
                "User authenticated, generating a new session token for user_id " +
                    row.user_id
            );

            User.generateToken(row.user_id)
                .then(json => {
                    winston.info(
                        "A new session created with id " + json.session_id
                    );

                    res.json({
                        session: json
                    });
                })
                .catch(err => {
                    winston.error(
                        "There was an error creating new session: " + err
                    );

                    res.sendStatus(err);
                });
        })
        .catch(err => {
            winston.error("There was an error authenticating user: " + err);

            res.sendStatus(err);
        });
});

router.get("/signOut", (req, res, next) => {
    if (req.user == null) return res.sendStatus(401);

    if (req.cookies.session == undefined) {
        winston.error("No session to sign out");
        res.sendStatus(401);
    } else {
        var session = JSON.parse(req.cookies.session);
        Session.terminate(session.session_id)
            .then(() => {
                winston.info(
                    "Session " + session.session_id + " signed out."
                );
                res.sendStatus(200);
            })
            .catch(err => {
                winston.error(
                    "There was an error signing out session " +
                        session.session_id +
                        ": " +
                        err
                );
                res.sendStatus(500);
            });
    }
});

router.get("/extend", (req, res, next) => {
    if (req.user == null) return res.sendStatus(401);

    // session automatically extended in the authenticate middleware
    res.send(200);
});

router.get("/info", (req, res, next) => {
    if (req.user == null) return res.sendStatus(401);
    try {
        res.json({
            user: req.user,
            session: req.session
        });
    } catch (err) {
        winston.error(err);
    }
});

module.exports = router;

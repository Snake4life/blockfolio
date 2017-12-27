var winston = require("winston");
var Session = require("./Session");
var User = require("./User");
var config = require("./config");

module.exports = function(req, res, next) {
    winston.info("Checking if the user is authenticated");

    if (req.cookies.session == undefined) {
        winston.info("No session specified in the cookie");
        req.user = null;
        return next();
        //return res.sendStatus(401);
    }

    var session = JSON.parse(req.cookies.session);

    winston.info(
        " Checking if the session " + session.session_id + " is still valid..."
    );

    Session.getSession(session.session_id)
        .then(session => {
            // TODO redundancy; this is duplicated in User.js, find a common solution so the code does not repeat
            var timestamp = Math.floor(Date.now() / 1000);
            var expires = timestamp + config.session.expires;

            winston.info(
                "Setting expiry date of session " +
                    session.session_id +
                    " to " +
                    expires
            );

            Session.extend(session.session_id, expires)
                .then(session => {
                    User.findOne(session.user_id)
                        .then(user => {
                            // add the user to the request object so that it is available for later request handlers
                            req.user = user;
                            next();
                        })
                        .catch(err => {
                            winston.error("Error finding user: " + err);
                            req.user = null;
                            next();
                        });
                })
                .catch(err => {
                    winston.error("Error extending session: " + err);
                    req.user = null;
                    next();
                });
        })
        .catch(err => {
            winston.info("Error getting session. "+err);
            req.user = null;
            next();
        });
};

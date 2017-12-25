var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var index = require("./routes/index");
var config = require("./config");
var currencies = require("./routes/currencies");
var investments = require("./routes/investments");
var auth = require("./routes/auth");
var profile = require("./routes/profile");
var Session = require("./Session");
var User = require("./User");
var app = express();
var winston = require('winston');
var logger = require('./logger');
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));




function isAuthenticated(req, res, next) {
    var session = JSON.parse(req.cookies.session);

    winston.info(
        " Checking if the session " + session.session_id + " is still valid..."
    );

    Session.getSession(session.session_id)
        .then(session => {
            // TODO this is duplicated in User.js, find a common solution so the code does not repeat
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
                            winston.error("Error finding user: "+err);
                            res.sendStatus(err);
                        });
                })
                .catch(err => {});
            // get the user for this session
        })
        .catch(err => {
            winston.info(
                "The session is invalid, error: " + err + ", returning 401"
            );
            // the session does not exist, return 401 error
            res.sendStatus(401);
        });
}

app.use("/api", index);
app.use("/api/auth", auth);
app.use("/api/profile", isAuthenticated, profile);
app.use("/api/currencies", isAuthenticated, currencies);
app.use("/api/investments", isAuthenticated, investments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;

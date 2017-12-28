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
var authenticate = require("./authenticate");
var app = express();
var winston = require("winston");
var logger = require("./logger");
var mysql = require("./mysql-connection");

var Currency = require("./Currency");

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

app.use("/api", index);
app.use("/api/auth", authenticate, auth);
app.use("/api/profile", authenticate, profile);
app.use("/api/currencies", authenticate, currencies);
app.use("/api/investments", authenticate, investments);

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

var winston = require("winston");
var strftime = require("strftime");
var config = require("./config");

var formatter = function(options) {
    // Return string will be passed to winston.
    return (
        options.timestamp() +
        " " +
        options.level.toUpperCase() +
        " " +
        options.message
    );
};

var timestamp = function() {
    return strftime("%F %T.%L");
};

winston.remove(winston.transports.Console); // remove the default options
winston.add(winston.transports.Console, {
    // and substitute these
    timestamp: timestamp,
    formatter: formatter,
    level: config.logger.level
});
winston.add(winston.transports.File, {
    filename: "combined.log",
    timestamp: timestamp,
    formatter: formatter,
    level: config.logger.level
});

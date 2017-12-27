var mysql = require("mysql");
var config = require("./config");
var winston = require("winston");

var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: 3306
});

setInterval(() => {
    winston.info("Polling MySQL server to keep the connection alive.");
    connection.query("SELECT 1");
}, 1000 * 60 * 15);

module.exports = connection;
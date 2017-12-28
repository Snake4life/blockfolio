var express = require("express");
var winston = require("winston");
var request = require("request");
var mysql = require("./mysql-connection");

module.exports = {
    getByUser: function(userId) {
        return new Promise((resolve, reject) => {
            winston.info("Getting investments for user "+userId);
            mysql.query("SELECT * FROM `investments`  LEFT JOIN currencies ON currencies.currency_id = investments.currency_id WHERE user_id = ?", [userId], (err, rows, fields) => {
                if(err) {
                    winston.error("Error while retrieving investments. "+err)
                    return reject(err);
                }
                else {
                    winston.info("Retrieved investments: "+rows.length+" row(s).");
                    return resolve(rows);
                }
            });
        });
    },
};
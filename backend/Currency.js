var express = require("express");
var mysql = require("./mysql-connection");
var winston = require("winston");
var request = require("request");

module.exports = {
    findOne: function(currencyId) {
        return new Promise((resolve, reject) => {
            mysql.query(
                "SELECT * FROM currencies WHERE currency_id = ?",
                [currencyId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    }
                    if (rows != undefined && rows.length > 0) {
                        resolve(rows[0]);
                        return;
                    } else {
                        reject(404);
                        return;
                    }
                }
            );
        });
    },
    getAll: function() {
        return new Promise((resolve, reject) => {
            winston.debug("Querying database for the list of currencies.");
            mysql.query(
                "SELECT * FROM currencies_cryptocompare ORDER BY sort_order ASC",
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    } else {
                        resolve(rows);
                        return;
                    }
                }
            );
        });
    }
};

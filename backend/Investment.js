var express = require("express");
var winston = require("winston");
var request = require("request");
var mysql = require("./mysql-connection");

module.exports = {
    getByUser: function(userId) {
        return new Promise((resolve, reject) => {
            winston.info("Getting investments for user " + userId);
            mysql.query(
                "SELECT * FROM `investments`  LEFT JOIN currencies ON currencies.currency_id = investments.currency_id WHERE user_id = ? ORDER BY investments.date",
                [userId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(
                            "Error while retrieving investments. " + err
                        );
                        return reject(err);
                    } else {
                        winston.info(
                            "Retrieved investments: " + rows.length + " row(s)."
                        );
                        return resolve(rows);
                    }
                }
            );
        });
    },

    getByUserAndCurrency: function(userId, currencyId) {
        return new Promise((resolve, reject) => {
            winston.info(
                "Getting investments of " + currencyId + " for user " + userId
            );
            mysql.query(
                "SELECT * FROM `investments` LEFT JOIN currencies ON currencies.currency_id = investments.currency_id WHERE investments.user_id = ? AND investments.currency_id = ? ORDER BY investments.date",
                [userId, currencyId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(
                            "Error while retrieving investments. " + err
                        );
                        return reject(err);
                    } else {
                        if (rows.length > 0) {
                            winston.info("Retrieved investments.");
                            return resolve(rows);
                        } else {
                            winston.info("No investments found.");
                            return resolve(404);
                        }
                    }
                }
            );
        });
    },

    add: function(userId, currencyId, amount, date) {
        return new Promise((resolve, reject) => {
            winston.info(
                "Adding investment of " +
                    amount +
                    " amount of " +
                    currencyId +
                    " for user " +
                    userId + 
                    " date " + 
                    date
            );

            mysql.query(
                "INSERT INTO investments (user_id, currency_id, amount, date) VALUES (?, ?, ?, ?)",
                [userId, currencyId, amount, date],
                (err, rows, fields) => {
                    if (err) {
                        winston.error("Error while adding investment. " + err);
                        return reject(err);
                    } else {
                        winston.info("Added investment.");
                        return resolve();
                    }
                }
            );
        });
    },
    delete: function(investmentId, userId) {
        return new Promise((resolve, reject)=> {
            winston.info("Deleting investment "+investmentId+" for user "+userId);

            mysql.query("DELETE FROM investments WHERE investment_id = ? AND user_id = ?", [investmentId, userId], (err, rows, fields)=>{
                if(err) {
                    winston.error("Error while deleting an investment");
                } else {
                    return resolve();
                }
            });

       });
    }
};

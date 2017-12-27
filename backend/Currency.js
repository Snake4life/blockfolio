var express = require("express");
var mysql = require("mysql");
var config = require("./config");
var winston = require("winston");
var request = require("request");

var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: 3306
});

module.exports = {
    insert: function(data) {
        return new Promise((resolve, reject) => {
            winston.info("Inserting/updating currencies for " + data.id);
        });
    },

    fetch() {
        return new Promise((resolve, reject) => {
            request(
                "https://api.coinmarketcap.com/v1/ticker/?limit=0",
                function(error, response, body) {
                    try {
                        var data = JSON.parse(body);

                        var coins = data.map(el => {
                            connection.query(
                                "REPLACE INTO currencies (currency_id, name, symbol, rank, price_usd, price_btc, 24h_volume_usd, market_cap_usd, available_supply, total_supply, max_supply, percent_change_1h, percent_change_24h, percent_change_7d, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ",
                                [
                                    el.id,
                                    el.name,
                                    el.symbol,
                                    el.rank,
                                    el.price_usd,
                                    el.price_btc,
                                    el["24h_volume_usd"],
                                    el.market_cap_usd,
                                    el.available_supply,
                                    el.total_supply,
                                    el.max_supply,
                                    el.percent_change_1h,
                                    el.percent_change_24h,
                                    el.percent_change_7d,
                                    el.last_updated
                                ],
                                (err, rows) => {
                                    if (err) {
                                        winston.error(err);
                                        reject(err);
                                    }
                                }
                            );
                        });
                        resolve();
                    } catch (err) {
                        winston.error(err);
                        reject(err);
                    }
                }
            );
        });
    },
    findOne: function(currencyId) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM currencies WHERE currency_id = ?",
                [currencyId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                    }
                    if (rows != undefined && rows.length > 0) {
                        resolve(rows[0]);
                    } else reject(404);
                }
            );
        });
    },
    getAll: function() {
        return new Promise((resolve, reject) => {
            winston.info("QUerying database for currencies");
            connection.query(
                "SELECT * FROM currencies ORDER BY rank ASC LIMIT 10",
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                    } else resolve(rows);
                }
            );
        });
    }
};

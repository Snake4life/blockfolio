var express = require("express");
var mysql = require("./mysql-connection");
var winston = require("winston");
var request = require("request");

module.exports = {
    fetchAll() {
        return new Promise((resolve, reject) => {
            request(
                "https://api.coinmarketcap.com/v1/ticker/?limit=0",
                function(error, response, body) {
                    try {
                        var data = JSON.parse(body);

                        var coins = data.map(el => {
                            mysql.query(
                                // I should not be using replace as it removes the row and adds new ones, which causes foreign keys (e.g. investments) to cascade
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
                                        return;
                                    }
                                }
                            );
                        });
                        resolve();
                        return;
                    } catch (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    }
                }
            );
        });
    },
    fetchOne: function(currencyId) {
        return new Promise((resolve, reject) => {
            
            winston.info("Querying coinmarketcap API for currency details...");

            request(
                "https://api.coinmarketcap.com/v1/ticker/" + currencyId,
                function(error, response, body) {
                    try {
                        var data = JSON.parse(body);


                        mysql.query(
                            "UPDATE currencies SET name = ?, symbol = ?, rank = ?, price_usd = ?, price_btc = ?, 24h_volume_usd = ?, market_cap_usd = ?, available_supply = ?, total_supply = ?, max_supply = ?, percent_change_1h = ?, percent_change_24h = ?, percent_change_7d = ?, last_updated = ? WHERE currency_id = ?",
                            [
                                data[0].name,
                                data[0].symbol,
                                data[0].rank,
                                data[0].price_usd,
                                data[0].price_btc,
                                data[0]["24h_volume_usd"],
                                data[0].market_cap_usd,
                                data[0].available_supply,
                                data[0].total_supply,
                                data[0].max_supply,
                                data[0].percent_change_1h,
                                data[0].percent_change_24h,
                                data[0].percent_change_7d,
                                data[0].last_updated,
                                data[0].id
                            ],
                            (err, rows) => {
                                if (err) {
                                    winston.error(err);
                                    reject(err);
                                    return;
                                }
                                else {
                                    winston.info("Succesfully updated row for "+data[0].id);
                                    return resolve(data[0]);
                                }
                            }
                        );
                    } catch (err) {
                        winston.error(err);
                        return reject(err);
                    }
                }
            );
        });
    },
    findOne: function(currencyId) {
        return new Promise((resolve, reject) => {
            mysql.query(
                "SELECT * FROM currencies WHERE currency_id = ?",
                [currencyId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        returnl;
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
                "SELECT * FROM currencies ORDER BY rank ASC",
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

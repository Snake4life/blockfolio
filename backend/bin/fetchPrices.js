var mysql = require("mysql");
var config = require("../config");
var request = require("request");

var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: 3306,
    timezone: "+00:00"
});

function fetchPrices() {
    return new Promise((resolve, reject) => {
        console.log("Fetching prices from cryptocompare API...");

        var fsyms = [];

        connection.query(
            "SELECT symbol FROM currencies_cryptocompare WHERE 1",
            (err, rows, fields) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }

                rows.forEach(el => {
                    fsyms.push(el.symbol);
                });

                var urls = [];

                for (var i = 0; i < fsyms.length; i += 50) {
                    let fsymsSlice = fsyms.slice(i, i + 50);

                    var url =
                        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" +
                        fsymsSlice.join() +
                        "&tsyms=USD,EUR,BTC";

                    urls.push(url);
                }

                var requestedUrls = 0;
                var prices = {};

                urls.forEach(url => {
                    request(url, (err, response, body) => {
                        requestedUrls++;
                        prices = Object.assign(prices, JSON.parse(body));

                        if (requestedUrls == urls.length) {
                            resolve(prices);
                        }
                    });
                });
            }
        );
    });
}

// request(url, function(error, response, body) {

//                     });

fetchPrices()
    .then(prices => {
        var processedKeys = 0;
        Object.keys(prices).forEach(key => {
            connection.query(
                "UPDATE currencies_cryptocompare SET price_usd = ?, price_eur = ?, price_btc = ?, price_last_updated=CURRENT_TIMESTAMP WHERE symbol = ?",
                [prices[key].USD, prices[key].EUR, prices[key].BTC, key],
                (err) => {
                    if(err) throw new Error(err);
                    console.log("Updated price for "+key);
                    processedKeys++;
                    if(processedKeys==Object.keys(prices).length) {
                        connection.end();
                    }
                }
            );
        });
        
    })
    .catch(err => {
        console.error(err);
    });

// try {
//     if (error) throw err;
//     var data = JSON.parse(body);
//     for (el in data) {
//         console.log("Updating price for " + el);

//     resolve(prices);
// } catch (err) {
//     console.error(err);
// }

var mysql = require("mysql");
var config = require("../config");
var request = require("request");

var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: 3306
});

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

function getInvestmentCurrencies() {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT T.currency_id, T.mindate, currencies_cryptocompare.symbol \
            FROM ( SELECT * , MIN( DATE ) AS mindate FROM investments GROUP BY investments.currency_id ORDER BY mindate ASC ) AS T \
            JOIN currencies_cryptocompare ON T.currency_id = currencies_cryptocompare.currency_id",
            (err, rows, fields) => {
                var currencies = [];
                if (err) reject(err);
                rows.forEach(el => {
                    currencies.push({
                        symbol: el.symbol,
                        currency_id: el.currency_id,
                        mindate: el.mindate
                    });
                });

                resolve(currencies);
            }
        );
    });
}

function addPrices(requests) {
    var req = requests.shift();
    var date = req.date;
    var url = req.url;
    var currency = req.currency;

    // console.log(currency.symbol+" on "+date+", querying "+url);
    if (url != undefined) {
        request(url, (err, response, body) => {
            if(err) throw new Error(err);

            var data = JSON.parse(body);

            connection.query(
                "INSERT INTO prices_history (currency_id, date, price_usd, price_eur, price_btc) VALUES (?, ?, ?, ?, ?)",
                [
                    currency.currency_id,
                    date,
                    data[currency.symbol].USD,
                    data[currency.symbol].EUR,
                    data[currency.symbol].BTC
                ],
                (err, rows, fields) => {
                    if (err) reject(new Error(err));
                    // console.log(
                    //     "Added price for " + currency.symbol + " on " + date
                    // );
                    if (requests.length > 0) {

                        // check limits
                        request("https://min-api.cryptocompare.com/stats/rate/second/limit", (err, response, body) => {
                            var body = JSON.parse(body);
                            if(body["CallsLeft"]==0) setTimeout(addPrices(requests), 1);
                            else addPrices(requests);
                        });
                        
                    }
                    else {
                        connection.end();
                    }
                }
            );
        });
    }
}

function getUrlToQuery(currency, date) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM prices_history WHERE currency_id = ? AND date = ?",
            [currency.currency_id, date],
            (err, rows, fields) => {
                if (err) reject(err);
                if (rows.length == 0) {
                    // console.log(
                    //     "Not found prices for currency " +
                    //         currency.symbol +
                    //         " on date " +
                    //         date
                    // );
                    resolve(
                        "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" +
                            currency.symbol +
                            "&tsyms=BTC,USD,EUR&ts=" +
                            date.getTime() / 1000
                    );
                } else {
                    resolve(null);
                }
            }
        );
    });
}


// get the currencies from investments table
getInvestmentCurrencies()
    .then(currencies => {
        var requests = [];
        var currenciesProcessed = 0;
        currencies.forEach(currency => {
            // console.log(
            //     "Finding dates for which there are no prices for currency " +
            //         currency.symbol
            // );
            // for all those currencies, get dates between then and now
            var dates = getDates(currency.mindate, new Date());
            var datesProcessed = 0;
            // for each date, see if there is a price already for this coin, if no, add a url to query
            
            dates.forEach(date => {
                // console.log(
                //     "Finding dates for which there are no prices for currency " +
                //         currency.symbol +
                //         " and date " +
                //         date
                // );
                
                getUrlToQuery(currency, date)
                    .then(url => {
                        
                        if (url != null) requests.push({ url:url, currency:currency, date:date });
                        
                        datesProcessed++;
                        if (datesProcessed == dates.length) {
                            currenciesProcessed++;
                            if (currenciesProcessed == currencies.length) {
                                // for those prices which do not exist, make a request to cryptocompare
                                // console.log("All fetching done, time to query cryptocompare");
                                // console.log(requests);
                                if(requests) addPrices(requests);
                            }
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
        });
    })
    .catch(err => {
        console.error(err);
    });
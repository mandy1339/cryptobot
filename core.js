////////////////////////////////////////////////////////////
// 
//  Author: Armando L. Toledo
//  Last Updated: 08/22/2017
//
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// Imports
require('dotenv').config();                 // env var support
var twitconfig = require('./twitconfig');   // config object for twit
var Twit = require('twit');                 // twitter support
var request = require('request');           // http request support
var mailer = require('nodemailer');         // email support
var db = require('mysql');                  // mysql support

var ethVal;             // Hold the value of eth in USD
var btcVal;             // Hold the value of btc in USD
var traders = [];       // This will be a vector of trader objects






// SET UP TWITTER
//==================================================================
//==================================================================
var T = new Twit(twitconfig);               // start twit object

// // Example twit (getting 1 twit)
// T.get('statuses/user_timeline', {screen_name: "PGANVACentralCh", count: 1}, function(err, data, response){
//     console.log('\n\n\ntwitter data:\n');
//     console.log(data[0].text);
//     console.log('\n\n\n\n');
// })






// SET UP EMAIL
//==================================================================
//==================================================================
var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
    }
});

// Example nodemailer usage
// var mail = {
//     from: "Armando Toledo <mandybot1339@gmail.com>",
//     to: "mandy1339@gmail.com",
//     subject: "Send Email Using Node.js",
//     text: "Node.js New world for me",
//     html: "<b>Node.js New world for me</b>"
// }

// smtpTransport.sendMail(mail, function(error, response){
//     if(error){
//         console.log(error);
//     }else{
//         console.log("Message sent to: " + response.accepted);
//     }
// });






// SET UP DATABASE
//==================================================================
//==================================================================
var connection = db.createConnection({
  host:process.env.DB_HOSTNAME,
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
  port:process.env.DB_PORT
})


// // Example mysql usage
// var queryAddTrader = `SELECT * FROM trader WHERE email = 'mandy1339@gmail.com';`;
// connection.query(queryAddTrader, function(error, rows, columns) {
//     if(error){console.log(error); return;}; // if error return immediatelly
//     console.log('\n\n\nquery result rows: ',rows);
//     console.log('\n\n\nquery result columns: ',columns);
// });






//REQUEST
//
//
// request.get('http://192.168.1.5/api/3MWz5lzDLxmE3b-CEBB93hBgyiP2DuERszBLWjDf/groups/1', function (error, response, body){
//     console.log('error:', error);
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
//     hueNow = parseFloat(JSON.stringify(response.action.hue))
// });





// ENTRY POINT (MAIN)
//==================================================================
//==================================================================
function scanAlert() {
   



    // Get eth val
    request.get('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YourApiKeyToken', function(error, response, body) {
        if(error) {console.log('error: \n', error); return}
        parsedBody = JSON.parse(body);
        console.log('ETH: ', parsedBody.result.ethusd);
        ethVal = parsedBody.result.ethusd;
    });
    
    // Get btc Val
    request.get('https://api.coinbase.com/v2/exchange-rates?currency=BTC', function(error, response, body) {
        if(error) {console.log('error: \n', error); return}
        parsedBody = JSON.parse(body);
        console.log('BTC:', parsedBody.data.rates.USD);
        btcVal = parsedBody.data.rates.USD;
    });

    // Get traders from db
    var queryGetTraders = `SELECT * FROM trader;`;
    connection.query(queryGetTraders, function(error, rows, columns) {
        if(error) {console.log(error); return;}     //  stop if you get errors
        traders = rows;                             // put traders in the array
    })








    // Perform scan
    setTimeout(delayed, 1000);
    function delayed() {
        
        traders.forEach(function(trader, index, array) {
            if(trader.ethlow && ethVal < trader.ethlow) {
                alertUserEthLow(trader);
            }
            else if(trader.ethhigh && ethVal > trader.ethhigh) {
                alertUserEthHigh(trader);
            }
            if(trader.btclow && btcVal < trader.btclow) {
                alertUserBtcLow(trader);
            }
            else if(trader.btchigh && btcVal > trader.btchigh) {
                alertUserBtcHigh(trader);
            }
        })
    }
    





// // Example mysql usage
// var queryAddTrader = `SELECT * FROM trader WHERE email = 'mandy1339@gmail.com';`;
// connection.query(queryAddTrader, function(error, rows, columns) {
//     if(error){console.log(error); return;}; // if error return immediatelly
//     console.log('\n\n\nquery result rows: ',rows);
//     console.log('\n\n\nquery result columns: ',columns);
// });





}

setInterval(scanAlert, 60000)





// ALERT FUNCTIONS

// ALERT USER ETH LOW()
function alertUserEthLow(trader) {
    console.log('alerting user about eth low: ', trader);
    if(trader.twit_acc) {       // twit user
        
    }
    if(trader.phone) {          // sms user
        
    }
    if(trader.cool == 'Y') {    // email user
        // prepare email
        var mail = {
            from: "Crypto Alert <mandybot1339@gmail.com>",
            to: trader.email,
            subject:  'eth price down',
            text: "Ethereum went down in price to your threshold of " + trader.ethlow + 'your threshold is being reset now',
            html: "<b>Ethereum went down in price to your threshold of " + trader.ethlow + 'your threshold is being reset now</b>',
        }
        // send email
        smtpTransport.sendMail(mail, function(error, response){
            if(error) { console.log(error); }
            else { console.log("Message sent to: " + response.accepted);}
        });

        // reset user ethlow to null
        setTimeout(function () {
            var queryReset = `UPDATE trader SET ethlow=NULL WHERE email='${trader.email}';`;
            connection.query(queryReset, function(error, rows, columns) {
                if(error) {console.log(error); return;}     //  stop if you get errors
                console.log('rows: ', rows);
            })

        }, 5000)
    }
}

// ALERT USER ETH HIGH()
function alertUserEthHigh(trader) {
    console.log('alerting user about eth high: ', trader);
        if(trader.twit_acc) {       // twit user
        
    }
    if(trader.phone) {          // sms user
        
    }
    if(trader.cool == 'Y') {    // email user
        // prepare email
        var mail = {
            from: "Crypto Alert <mandybot1339@gmail.com>",
            to: trader.email,
            subject:  'eth price up',
            text: "Ethereum went up in price to your threshold of " + trader.ethhigh + 'your threshold is being reset now',
            html: "<b>Ethereum went up in price to your threshold of " + trader.ethhigh + 'your threshold is being reset now</b>',
        }
        // send email
        smtpTransport.sendMail(mail, function(error, response){
            if(error) { console.log(error); }
            else { console.log("Message sent to: " + response.accepted);}
        });

        // reset user ethhigh to null
        setTimeout(function () {
            var queryReset = `UPDATE trader SET ethhigh=NULL WHERE email='${trader.email}';`;
            connection.query(queryReset, function(error, rows, columns) {
                if(error) {console.log(error); return;}     //  stop if you get errors
                console.log('rows: ', rows);
            })
        }, 5000)
    }
}

// ALERT USER BTC LOW()
function alertUserBtcLow(trader) {
    console.log('alerting user about btc low: ', trader);
    if(trader.twit_acc) {       // twit user
        
    }
    if(trader.phone) {          // sms user
        
    }
    if(trader.cool == 'Y') {    // email user
        // prepare email
        var mail = {
            from: "Crypto Alert <mandybot1339@gmail.com>",
            to: trader.email,
            subject:  'btc price down',
            text: "Bitcoin went down in price to your threshold of " + trader.btclow + 'your threshold is being reset now',
            html: "<b>Bitcoin went down in price to your threshold of " + trader.btclow + 'your threshold is being reset now</b>',
        }
        // send email
        smtpTransport.sendMail(mail, function(error, response){
            if(error) { console.log(error); }
            else { console.log("Message sent to: " + response.accepted);}
        });

        // reset user btclow to null
        setTimeout(function () {
            var queryReset = `UPDATE trader SET btclow=NULL WHERE email='${trader.email}';`;
            connection.query(queryReset, function(error, rows, columns) {
                if(error) {console.log(error); return;}     //  stop if you get errors
                console.log('rows: ', rows);
            })
        }, 5000)
    }
}

// ALERT USER BTC HIGH
function alertUserBtcHigh(trader) {
    console.log('alerting user about btc high: ', trader);
    if(trader.twit_acc) {       // twit user
        
    }
    if(trader.phone) {          // sms user
        
    }
    if(trader.cool == 'Y') {    // email user
        // prepare email
        var mail = {
            from: "Crypto Alert <mandybot1339@gmail.com>",
            to: trader.email,
            subject:  'btc price up',
            text: "Bitcoin went up in price to your threshold of " + trader.btchigh + 'your threshold is being reset now',
            html: "<b>Bitcoin went up in price to your threshold of " + trader.btchigh + 'your threshold is being reset now</b>',
        }
        // send email
        smtpTransport.sendMail(mail, function(error, response){
            if(error) { console.log(error); }
            else { console.log("Message sent to: " + response.accepted);}
        });
        
        // reset user btchigh to null
        setTimeout(function () {
            var queryReset = `UPDATE trader SET btchigh=NULL WHERE email='${trader.email}';`;
            connection.query(queryReset, function(error, rows, columns) {
                if(error) {console.log(error); return;}     //  stop if you get errors
                console.log('rows: ', rows);
            })
        }, 5000)
    }
}
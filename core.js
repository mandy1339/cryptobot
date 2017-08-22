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

console.log('\n-\n-\ntwitter config: ', twitconfig,'\n-\n-\n')




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

console.log(process.env.DB_HOSTNAME);

// // Example mysql usage
// var queryAddTrader = `SELECT * FROM trader WHERE email = 'mandy1339@gmail.com';`;
// connection.query(queryAddTrader, function(error, rows, columns) {
//     if(error){console.log(error); return;}; // if error return immediatelly
//     console.log('\n\n\nquery result rows: ',rows);
//     console.log('\n\n\nquery result columns: ',columns);
// });






// ENTRY POINT (MAIN)
//==================================================================
//==================================================================
function scanAlert() {
    console.log('ROUND # 1');
}

//setTimeout
//setTimeout(scanAlert, 6000)
scanAlert();

// get the current eth and btc price



// query get all the rows


// for every row, compare prices



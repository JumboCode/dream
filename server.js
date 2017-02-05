// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var firebase       = require('firebase');
var jsforce        = require('jsforce');

// configuration ===========================================


// config files
var db = require('./config/db');
// set our port
var port = process.env.PORT || 8080; 
// connect to our firebase database 
firebase.initializeApp({
	serviceAccount: "./dream-4d75cc9d0c05.json",
	databaseURL: "https://dream-ca566.firebaseio.com"
})

//*************************************
// get all data/stuff of the body (POST) parameters
// parse application/json 

app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location - /node_modules/angular will be /angular for front end
app.use('/static', express.static('node_modules')); 
app.use('/', express.static('public')); 

// Set default routes for mentee
app.use('/app.module.js',express.static('public/app.module.js'));
app.use('/app.routes.js',express.static('public/app.routes.js'));
app.use('/shared/NavTop',express.static('public/shared/NavTop'));
// Routes for chair 
//app.use('/app.module.js',express.static('public/chair/app.module.chair.js'));
//app.use('/app.routes.js',express.static('public/chair/app.routes.chair.js'));
//app.use('/shared/NavTop',express.static('public/chair/shared/NavTop'));



// auth ==================================================
require('./app/firebase')(firebase); // auth logic
require('./app/salesforce')(jsforce); // commented out because of wrapper issues 

// routes ==================================================
require('./app/routes')(app,express); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;
exports = module.exports = firebase; 
//exports = module.exports = salesforce; commmented out because of wrapper issues

console.log("TEST ", process.env.TEST);
console.log("USER_SECRET ", process.env.USER_SECRET);

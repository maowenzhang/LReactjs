const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const result = require('dotenv').config();
const dataApi = require('./data/data-api.js');

var cookieSession = require('cookie-session');

// ------------------------------------------
// express app settings
// 
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
// app.use(require('express-session')(
//   { secret: 'keyboard cat', resave: false, saveUninitialized: false }
// ));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

var passport = require('passport');
var passportUtil = require('./passport-util.js')(passport);

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ------------------------------------------
// AWS
// 
var AWS = require('aws-sdk');

// AWS.config.region = process.env.REGION

// var ddb = new AWS.DynamoDB();

// var ddbTable =  'career-test-user';

// var addUser = function(req, res) {
//   var item = {
//       'email': {'S': req.body.email},
//       'name': {'S': req.body.name},
//       'password': {'S': req.body.password},
//       'admin': {'S': false} // check
//   };

//   ddb.putItem({
//       'TableName': ddbTable,
//       'Item': item,
//       'Expected': { email: { Exists: false } }        
//   }, function(err, data) {
//       if (err) {
//           var returnStatus = 500;

//           if (err.code === 'ConditionalCheckFailedException') {
//               returnStatus = 409;
//           }

//           res.status(returnStatus).end();
//           console.log('DDB Error: ' + err);
//       } else {
//         // Send welcome email to do test

//       }
//   });
// }

var addTestResult = function(req, res) {

}

// ------------------------------------------
// Auth & LogIn
// 
var auth = function(req, res, next) {
  res.send("log in submitted");
}

app.get('/oauth/callback', function(req, res) {
	  res.render('pages/index');
});

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    var userEmail = '';
    if (req.user) {
      userEmail = req.user.email;
    }
    res.render('index', { user: userEmail });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local-login', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/signup',
  function(req, res){
    res.render('signup');
  });

app.post('/signup', 
  passport.authenticate('local-signup', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

// ------------------------------------------
// Data API
// 
app.get('/api', function(req, res) {
    let info = dataApi.getTableInfo(function(tableRows) {
      res.send(JSON.stringify(tableRows));
    });
  });

app.get('/api/test/disc', function(req, res) {
    res.redirect('/static/test/disc-test.json');
  });


// ------------------------------------------
// Start Server
// 
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

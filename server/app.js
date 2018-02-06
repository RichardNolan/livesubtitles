require('dotenv').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var watson = require('./watson')
var watson  = require('watson-developer-cloud');
// const vcapServices = require('vcap_services');
const cors = require('cors')

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use('/', index);
app.use('/users', users);



// // on bluemix, enable rate-limiting and force https
// if (process.env.VCAP_SERVICES) {
//   // enable rate-limiting
//   const RateLimit = require('express-rate-limit');
//   app.enable('trust proxy'); // required to work properly behind Bluemix's reverse proxy

//   const limiter = new RateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     delayMs: 0 // disable delaying - full speed until the max limit is reached
//   });

//   //  apply to /api/*
//   app.use('/api/', limiter);

//   // force https - microphone access requires https in Chrome and possibly other browsers
//   // (*.mybluemix.net domains all have built-in https support)
//   const secure = require('express-secure-only');
//   app.use(secure());
// }

var sttAuthService = new watson.AuthorizationV1(
  // Object.assign(
    {
      username: process.env.WATSONUSERNAME, 
      password: process.env.WATSONPASSWORD
    }//,
    // vcapServices.getCredentials('speech_to_text') 
  // )
);

app.use('/api/speech-to-text/token', function(req, res) {
  sttAuthService.getToken(
    {
      url: watson.TextToSpeechV1.URL
    },
    function(err, token) {
      if (err) {
        console.log('Error retrieving token: ', err);
        res.status(500).send('Error retrieving token');
        return;
      }
      res.send(token);
    }
  );
});
// if (!process.env.VCAP_SERVICES) {
  const fs = require('fs');
  const https = require('https');
  const HTTPS_PORT = 3002;

  const options = {
    key: fs.readFileSync(__dirname + '/keys/localhost.pem'),
    cert: fs.readFileSync(__dirname + '/keys/localhost.cert')
  };
  https.createServer(options, app).listen(HTTPS_PORT, function() {
    console.log('Secure server live at https://localhost:%s/', HTTPS_PORT);
  });
// }

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

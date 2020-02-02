
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

console.log("================================= WELCOME TO THE CRYPTOCURRENCY API ========================================");


app.use(logger('dev'));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(cookieParser());

let tron = require('./routes/tronroutes');
let ripple = require('./routes/rippleroutes');
let block = require('./routes/blockroutes');
app.use('/', tron);

app.use('/ripple', ripple);
app.use('/block', block);

app.listen(3000, () => console.log('App running on port 3000'));   // START THE EXPRESS SERVER ON THE PORT 3000
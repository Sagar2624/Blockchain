var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();
var route = require('./routes/apiRoutes');
var verifyRequest = require('./routes/auth');


app.use(verifyRequest());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/cardano', route);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//For Swagger
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger({
  swaggerDefinition: {
     info: {
      title: process.env.SWAGGER_TITLE,
      description: process.env.SWAGGER_DESCRIPTION,
      version: process.env.SWAGGER_VERSION,
    },
    host: process.env.SWAGGER_API_HOST,
    consumes: [
      "application/json"
    ],
    produces: [
      "application/json"
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      "Basic Auth": {
        "type": "basic",
        "name": "authorization",
        "in": "header"
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: [
    './routes/*.js'
 ]
 });

module.exports = app;



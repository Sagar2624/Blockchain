const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/txroute')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/api/block', apiRoutes)
var env = require('dotenv').config();


app.listen(3000, () => console.log(`Server Started 3000`))
module.exports = {
  app
}
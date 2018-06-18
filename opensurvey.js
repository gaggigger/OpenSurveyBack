const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const rLogin = require('./routes/login');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/', rLogin);

app.listen(3000, () => {});
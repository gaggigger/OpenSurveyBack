const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const rLogin = require('./routes/login');
const Response = require('./helpers/response');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/login', Response.apiHeaders);
app.use('/', rLogin);

app.listen(3000, () => {});
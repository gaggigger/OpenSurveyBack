const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const rLogin = require('./routes/login');
const rEvent = require('./routes/event');
const Response = require('./helpers/response');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/login', Response.apiHeaders);
app.use('/login', rLogin);

app.use('/event', Response.apiHeaders);
app.use('/event', rEvent);

app.listen(3001, () => {});
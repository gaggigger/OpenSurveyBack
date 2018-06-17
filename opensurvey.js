const express = require('express');
const app = express();

const rLogin = require('./routes/login');

app.use('/', rLogin);

app.listen(3000, () => {});
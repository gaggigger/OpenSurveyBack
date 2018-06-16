const express = require('express');
const app = express();

const rLogin = require('./routes/login');

app.use('/', rLogin);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

const Response = require('./helpers/response');
const Config = require('./config');
const Socket = require('./services/socket');

const rLogin = require('./routes/login');
const rEvent = require('./routes/event');
const rQuiz = require('./routes/quiz');
const rQa = require('./routes/qa');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(Response.apiHeaders);
app.use(Response.inject('io', io));

//app.use('/login', Response.apiHeaders);

app.use('/login', rLogin);
app.use('/event', rEvent);
app.use('/quiz', rQuiz);
app.use('/qa', rQa);

server.listen(Config.serverPort);

// Socket event
Socket.onConnection(io);

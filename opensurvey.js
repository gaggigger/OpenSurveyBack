const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

const rLogin = require('./routes/login');
const rEvent = require('./routes/event');
const rQuiz = require('./routes/quiz');
const Response = require('./helpers/response');
const Config = require('./config');
const Socket = require('./services/socket');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(Response.apiHeaders);

//app.use('/login', Response.apiHeaders);
app.use('/login', rLogin);

//app.use('/event', Response.apiHeaders);
app.use('/event', rEvent);

//app.use('/quiz', Response.apiHeaders);
app.use('/quiz', rQuiz);

server.listen(Config.serverPort);

// Socket event
Socket.onConnection(io);

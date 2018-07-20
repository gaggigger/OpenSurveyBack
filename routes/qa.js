const Express = require('express');
const Router = Express.Router();
const Question = require('../services/qa');
const Response = require('../helpers/response');
const Socket = require('../services/socket');

Router.post('/', Response.apiToken, async function(req, res, next) {
    try {
        const question = await Question.add(req.connectedUser.name, req.body.event, req.body.question);
        Socket.emit(req.inject.io, question.event, 'event-question-added', question);
        res.status(200).json(question);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/', Response.apiToken, async function(req, res, next) {
    try {
        const questions = await Question.getAll(req.query.event);
        res.status(200).json(questions);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.post('/:questionid/like', Response.apiToken, async function(req, res, next) {
    try {
        const question = await Question.like(req.connectedUser.login, req.params.questionid);
        Socket.emit(req.inject.io, question.event, 'event-question-like', question);
        res.status(200).json(question);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.post('/:questionid/answered', Response.apiToken, Response.notGuest, async function(req, res, next) {
    try {
        const question = await Question.answered(req.connectedUser._id, req.params.questionid);
        res.status(200).json(question);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

module.exports = Router;

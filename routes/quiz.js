const Express = require('express');
const Router = Express.Router();
const Quiz = require('../services/quiz');
const QuizRun = require('../services/quiz-run');
const Response = require('../helpers/response');
const Socket = require('../services/socket');

Router.post('/', Response.apiToken, Response.notGuest, async function(req, res, next) {
    try {
        const quiz = await Quiz.add(req.body.name, req.body.event, req.connectedUser._id);
        res.status(200).json(quiz);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/', Response.apiToken, Response.notGuest, async function(req, res, next) {
    try {
        const quizs = await Quiz.getByUserAndEvent(req.connectedUser._id, req.query.event);
        const quizsWithRun = await QuizRun.addQuizRunInformation(quizs);
        res.status(200).json(quizsWithRun);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/:quizuid', Response.apiToken, Response.notGuest, async function(req, res, next) {
    try {
        const quiz = await Quiz.getByUserAndId(req.connectedUser._id, req.params.quizuid);
        res.status(200).json(Quiz.serialize(quiz));
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.post('/:quizuid', Response.apiToken, Response.notGuest, async function(req, res, next) {
    try {
        const quiz = await Quiz.update(
            req.connectedUser._id,
            req.params.quizuid,
            Object.assign({}, req.body)
        );
        res.status(200).json(Quiz.serialize(quiz));
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.post('/:quizuid/start', Response.apiToken, Response.notGuest, async function(req, res, next) {
    try {
        const quizRun = await QuizRun.run(req.connectedUser._id, req.body.event, req.params.quizuid);
        QuizRun.startProcess(req.inject.io, quizRun._id);
        res.status(200).json(quizRun);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

module.exports = Router;

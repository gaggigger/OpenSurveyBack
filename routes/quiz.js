const Express = require('express');
const Router = Express.Router();
const Quiz = require('../services/quiz');
const QuizRun = require('../services/quiz-run');
const Response = require('../helpers/response');
const Event = require('../services/event');

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
        const quizWithRun = await QuizRun.addQuizRunInformation(quiz);
        res.status(200).json(Quiz.serialize(quizWithRun));
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
        const quiz = await Quiz.getByUserAndId(req.connectedUser._id, req.params.quizuid);

        // restrict event
        const event = Event.getByUid(quiz.event);
        Event.isAvailable(event);

        const quizRun = await QuizRun.run(quiz);
        QuizRun.startProcess(req.inject.io, quizRun._id);
        res.status(200).json(quizRun);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.post('/:quizuid/stop', Response.apiToken, Response.notGuest, async function(req, res, next) {
    try {
        const quiz = await Quiz.getByUserAndId(req.connectedUser._id, req.params.quizuid);
        const result = await QuizRun.stopProcess(req.inject.io, quiz);
        res.status(200).json(result);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

module.exports = Router;

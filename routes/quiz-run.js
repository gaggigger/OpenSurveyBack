const Express = require('express');
const Router = Express.Router();
const Quiz = require('../services/quiz');
const QuizRun = require('../services/quiz-run');
const QuizResponse = require('../services/quiz-response');
const Response = require('../helpers/response');
const ClientException = require('../exceptions/ClientException');

Router.get('/:eventuid/:quizuid', Response.apiToken, async function(req, res, next) {
    try {
        const quizRuns = await QuizRun.findByEventAndQuiz(req.connectedUser._id, req.params.eventuid, req.params.quizuid);
        res.status(200).json(quizRuns);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/:eventuid/:quizuid/:quizrunuid', Response.apiToken, Response.notGuest, async function(req, res, next) {
    try {
        const quiz = await Quiz.getByUserAndId(req.connectedUser._id, req.params.quizuid);
        if(!quiz) throw new ClientException.ForbiddenException();
        const quizRun = await QuizRun.find(req.params.quizrunuid);
        const responses = await QuizResponse.findByEventQuizAndQuizRun(req.params.eventuid, req.params.quizuid, req.params.quizrunuid);
        res.status(200).json({
            quizrun: quizRun,
            responses: responses
        });
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/:eventuid/:quizrunuid/step', Response.apiToken, async function(req, res, next) {
    try {
        const quizRun = await QuizRun.getCurrentQuestion(req.params.eventuid, req.params.quizrunuid);
        res.status(200).json(quizRun);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

module.exports = Router;

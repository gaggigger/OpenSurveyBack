const Express = require('express');
const Router = Express.Router();
const Quiz = require('../services/quiz');
const QuizRun = require('../services/quiz-run');
const Response = require('../helpers/response');
const ClientException = require('../exceptions/ClientException');

Router.get('/:eventuid/:quizid', Response.apiToken, async function(req, res, next) {
    try {
        const quizRuns = await QuizRun.findByEventAndQuiz(req.connectedUser._id, req.params.eventuid, req.params.quizid);
        res.status(200).json(quizRuns);
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

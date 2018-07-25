const Express = require('express');
const Router = Express.Router();
const QuizRun = require('../services/quiz-run');
const Response = require('../helpers/response');
const Socket = require('../services/socket');

Router.get('/:eventuid/:quizrunuid/step', Response.apiToken, async function(req, res, next) {
    try {
        const quizRun = await QuizRun.findByEventAndUid(req.params.eventuid, req.params.quizrunuid);
        res.status(200).json(quizRun);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

module.exports = Router;

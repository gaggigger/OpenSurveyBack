const Express = require('express');
const Router = Express.Router();
const QuizResponse = require('../services/quiz-response');
const Response = require('../helpers/response');

Router.post('/:eventuid/:quizrunuid/respond', Response.apiToken, async function(req, res, next) {
    try {
        const quizRun = await QuizResponse.respond(
            req.connectedUser,
            req.params.eventuid,
            req.params.quizrunuid,
            req.body.current_question,
            req.body.response
        );
        res.status(200).json(quizRun);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

module.exports = Router;

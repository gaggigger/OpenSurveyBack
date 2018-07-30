const Express = require('express');
const Router = Express.Router();
const QuizResponse = require('../services/quiz-response');
const Response = require('../helpers/response');
const Event = require('../services/event');

Router.post('/:eventuid/:quizrunuid/respond', Response.apiToken, async function(req, res, next) {
    try {
        const event = Event.getByUid(req.params.eventuid);
        // restrict event
        Event.isAvailable(event);

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

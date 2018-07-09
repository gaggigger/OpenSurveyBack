const Express = require('express');
const Router = Express.Router();
const Quiz = require('../services/quiz');
const Response = require('../helpers/response');

Router.post('/', Response.apiToken, async function(req, res, next) {
    try {
        const quiz = await Quiz.add(req.body.name, req.body.event, req.connectedUser._id);
        res.status(200).json(quiz);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/', Response.apiToken, async function(req, res, next) {
    try {
        const quizs = await Quiz.getByUserAndEvent(req.connectedUser._id, req.query.event);
        res.status(200).json(Quiz.serialize(quizs));
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/:quizuid', Response.apiToken, async function(req, res, next) {
    try {
        const quiz = await Quiz.getByUserAndId(req.connectedUser._id, req.params.quizuid);
        res.status(200).json(Quiz.serialize(quiz));
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.post('/:quizuid', Response.apiToken, async function(req, res, next) {
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

module.exports = Router;

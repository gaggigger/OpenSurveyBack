const Express = require('express');
const Router = Express.Router();
const Event = require('../services/event');
const Response = require('../helpers/response');

Router.post('/', Response.apiToken, async function(req, res, next) {
    try {
        const event = await Event.add(req.body.name, req.connectedUser._id);
        res.status(200).json(event);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/', Response.apiToken, async function(req, res, next) {
    try {
        const events = await Event.getByUser(req.connectedUser._id);
        res.status(200).json(events);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/:eventuid', Response.apiToken, async function(req, res, next) {
    try {
        const event = await Event.getByUserAndId(req.connectedUser._id, req.params.eventuid);
        res.status(200).json(event);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

module.exports = Router;

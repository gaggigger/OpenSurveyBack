const Express = require('express');
const Router = Express.Router();
const Event = require('../services/event');
const Response = require('../helpers/response');

Router.post('/', Response.apiToken, Response.notGuest, async function(req, res, next) {
    try {
        const event = await Event.add(req.body.name, req.connectedUser._id);
        res.status(200).json(event);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/find/', async function(req, res, next) {
    try {
        const event = await Event.findByName(req.query.eventname);
        res.status(200).json(event);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/', Response.apiToken, Response.notGuest, async function(req, res, next) {
    try {
        const events = await Event.getByUser(req.connectedUser._id);
        res.status(200).json(Event.serialize(events));
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.get('/:eventuid', Response.apiToken, Response.notGuest,async function(req, res, next) {
    try {
        const event = await Event.getByUserAndId(req.connectedUser._id, req.params.eventuid);
        res.status(200).json(Event.serialize(event));
    } catch(e) {
        return Response.sendError(res, e);
    }
});

Router.post('/:eventuid', Response.apiToken, Response.notGuest,async function(req, res, next) {
    try {
        const event = await Event.update(
            req.connectedUser._id,
            req.params.eventuid,
            Object.assign({}, req.body)
        );
        res.status(200).json(Event.serialize(event));
    } catch(e) {
        return Response.sendError(res, e);
    }
});

module.exports = Router;

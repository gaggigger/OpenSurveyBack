const Express = require('express');
const Router = Express.Router();
const Event = require('../services/event');
const Response = require('../helpers/response');

Router.post('/', Response.apiHeaders, async function(req, res, next) {
    try {
        const event = await Event.add(req.body.name);
        console.log(event);
        res.status(200).json(event);
    } catch(e) {
        return Response.sendError(res, e);
    }
});

module.exports = Router;

const httpHelper = require('../helpers/http');
const Config = require('../config');
const ClientException = require('../exceptions/ClientException');
const Event = require('../services/event');

module.exports = {
    getpayload : async function (username) {
        const event = await Event.findByName(eventname);
        const eventid = event? event._id : null;
        return {
            login: username,
            name: username,
            avatar: '',
            event: eventid,
            provider: 'guest'
        };
    }
};
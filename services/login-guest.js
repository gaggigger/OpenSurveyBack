const httpHelper = require('../helpers/http');
const Config = require('../config');
const ClientException = require('../exceptions/ClientException');
const Event = require('../services/event');

module.exports = {
    getpayload : async function (username, eventname) {
        const event = await Event.findByName(eventname);
        return {
            login: token,
            name: token,
            avatar: '',
            provider: 'guest'
        };
    }
};
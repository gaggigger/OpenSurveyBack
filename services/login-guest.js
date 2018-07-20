const httpHelper = require('../helpers/http');
const Config = require('../config');
const ClientException = require('../exceptions/ClientException');
const Event = require('../services/event');

module.exports = {
    getpayload : async function (username) {
        return {
            login: Math.random().toString(36).substr(2),
            name: username,
            avatar: '',
            provider: 'guest'
        };
    }
};
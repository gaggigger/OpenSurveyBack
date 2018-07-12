const httpHelper = require('../helpers/http');
const Config = require('../config');
const ClientException = require('../exceptions/ClientException');

module.exports = {
    getpayload : async function (token) {
        return {
            login: token,
            name: token,
            avatar: '',
            provider: 'guest'
        };
    }
};
const httpHelper = require('../helpers/http');
const ClientException = require('../exceptions/ClientException');

module.exports = {
    getpayload : async function (userId, token) {
        const userInfo = await httpHelper.fetch('https://graph.facebook.com/' + userId, {
            'access_token': token
        }, 'GET', {
            'Accept': 'application/json'
        }).catch(e => {
            throw new ClientException.ForbiddenException();
        });
        return {
            login: userInfo.id,
            name: userInfo.name,
            avatar: '',
            provider: 'facebook'
        };
    }
};
const httpHelper = require('../helpers/http');
const Config = require('../config');
const ClientException = require('../exceptions/ClientException');

module.exports = {
    getpayload : async function (token) {
        const payload = await httpHelper.fetch('github.com/login/oauth/access_token', {
            'client_id': Config.github.client_id,
            'client_secret': Config.github.client_secret,
            'code': token
        }, 'POST', {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }).catch(e => {
            throw new ClientException.ForbiddenException();
        });
        const userInfo = await httpHelper.fetch('https://api.github.com/user', {
            'access_token': payload.access_token
        }, 'GET', {
            'Accept': 'application/json'
        }).catch(e => {
            throw new ClientException.ForbiddenException();
        });
        return {
            login: userInfo.login,
            name: userInfo.name,
            avatar: userInfo.avatar_url,
            provider: 'github'
        };
    }
};
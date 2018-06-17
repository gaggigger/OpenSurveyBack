const httpHelper = require('../helpers/http');
const Config = require('../config');

module.exports = {
    getpayload : async function (token) {
        const payload = await httpHelper.fetch('github.com/login/oauth/access_token', {
            'client_id': Config.github.client_id,
            'client_secret': Config.github.client_secret,
            'code': token
        }, 'POST', {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        const userInfo = await httpHelper.fetch('https://api.github.com/user', {
            'access_token': payload.access_token
        }, 'GET', {
            'Accept': 'application/json'
        });
        return {
            login: userInfo.login,
            name: userInfo.name,
            avatar: userInfo.avatar_url,
            provider: 'github'
        }
    }
};
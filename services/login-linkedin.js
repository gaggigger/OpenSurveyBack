const httpHelper = require('../helpers/http');
const Config = require('../config');

module.exports = {
    getpayload : async function (token, redirectUri) {
        const payload = await httpHelper.fetch('www.linkedin.com/oauth/v2/accessToken', {
            'grant_type': 'authorization_code',
            'code': token,
            'redirect_uri': redirectUri,
            'client_id': Config.linkedin.client_id,
            'client_secret': Config.linkedin.client_secret
        }, 'POST', {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        const userInfo = await httpHelper.fetch('https://api.linkedin.com/v1/people/~?format=json', {}, 'GET', {
            'Authorization': 'Bearer ' + payload.access_token
        });
        return {
            login: userInfo.id,
            name: userInfo.firstName + ' ' + userInfo.lastName,
            avatar: '',
            provider: 'linkedin'
        };
    }
};
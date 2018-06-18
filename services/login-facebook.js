const httpHelper = require('../helpers/http');
const Config = require('../config');

module.exports = {
    getpayload : async function (userId, token) {
        const userInfo = await httpHelper.fetch('https://graph.facebook.com/' + userId, {
            'access_token': token
        }, 'GET', {
            'Accept': 'application/json'
        });
        console.log(userInfo);
        return {
            login: userInfo.id,
            name: userInfo.name,
            avatar: '',
            provider: 'facebook'
        };
    }
};
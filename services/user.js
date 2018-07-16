const Db = require('../services/database');
const Jwt = require('jsonwebtoken');
const Config = require('../config');

module.exports = {
    add: async function(userInfo) {
        return await Db.addOrUpdate('users', userInfo, {
            login: userInfo.login
        });
    },

    generateToken: function(user, eventName) {
        return new Promise((resolv, reject) => {
            Jwt.sign(user, Config.api.secret, {expiresIn: 60 * 60 * 24}, (err, token) => {
                if (err) {
                    reject(err);
                }
                resolv(token);
            });
        });
    }
};
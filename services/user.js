const Db = require('../services/database');
const Jwt = require('jsonwebtoken');
const Config = require('../config');

module.exports = {
    find: function(userInfo) {
        return new Promise(async (resolv, reject) => {
            const db = await Db.connect();
            const collection = db.collection('users');
            collection.find({
                login: userInfo.login,
                provider: userInfo.provider
            }).toArray((err, users) => {
                if (users.length === 1) {
                    resolv(users[0]);
                } else if (users.length === 0) {
                    resolv(null);
                } else {
                    reject(users);
                }
            });
        });
    },

    add: function(userInfo) {
        return new Promise(async (resolv, reject) => {
            const db = await Db.connect();
            const collection = db.collection('users');
            collection.insert(userInfo, async (err, result) => {
                const u = await this.find(userInfo);
                resolv(u);
            });
        });
    },

    update: function(userInfo) {
        return new Promise(async (resolv, reject) => {
            const db = await Db.connect();
            const collection = db.collection('users');
            collection.updateOne({
                login: userInfo.login
            }, { $set: userInfo }, async (err, result) => {
                const u = await this.find(userInfo);
                resolv(u);
            });
        });
    },

    addOrUpdate: async function(userInfo) {
        const user = await this.find(userInfo);
        if (user === null) {
            return await this.add(userInfo);
        } else {
            return await this.update(userInfo);
        }
    },

    generateToken: function(user) {
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
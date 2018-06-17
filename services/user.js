const Db = require('../services/database');

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
            collection.insert(userInfo, (err, result) => {
                resolv(result);
            });
        });
    },

    update: function(userInfo) {
        return new Promise(async (resolv, reject) => {
            const db = await Db.connect();
            const collection = db.collection('users');
            collection.updateOne({
                login: userInfo.login
            }, { $set: userInfo }, (err, result) => {
                resolv(result);
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
    }
};
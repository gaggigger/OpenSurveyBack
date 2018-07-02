const Db = require('../services/database');

module.exports = {
    add: async function(name, owner) {
        return await Db.addOrUpdate('events', {
            name: name,
            owner: owner
        });
    },
    getByUser: async function(userId) {
        return await Db.findAll('events', {
            'owner': userId
        });
    }
};

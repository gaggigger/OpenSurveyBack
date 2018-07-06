const Db = require('../services/database');
const Mongo = require('mongodb');

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
        }, {
            inserted_at: 1
        });
    },
    getByUserAndId: async function(userId, eventUid) {
        return await Db.find('events', {
            'owner': userId,
            '_id': new Mongo.ObjectID(eventUid)
        }, {
            inserted_at: 1
        });
    }
};

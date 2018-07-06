const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');

module.exports = {
    add: async function(name, owner) {
        name = name.toLowerCase().trim();
        if(name === '') throw new ClientException.BadRequestException();
        const existingEvent = await Db.find('events', {
            name: name
        });
        if(existingEvent === null) {
            return await Db.addOrUpdate('events', {
                name: name,
                owner: owner
            });
        } else {
            throw new ClientException.ForbiddenException();
        }
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
            '_id': eventUid
        }, {
            inserted_at: 1
        });
    }
};

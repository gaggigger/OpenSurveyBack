const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');
const ObjectHelpers = require('../helpers/object');

module.exports = {
    serialize: function(event) {
        if(event.map) {
            return event.map(item => this.formatEvent(item));
        }
        return this.formatEvent(event);
    },
    formatEvent: function(event) {
        return ObjectHelpers.clone(event);
        // if(event.datestart) event.datestart = DateHelpers.isoFromTimestamp(event.datestart);
        // if(event.dateend) event.dateend = DateHelpers.isoFromTimestamp(event.dateend);
        // return event;
    },
    add: async function(name, owner) {
        name = name.trim().replace(/[^0-9a-z_@&]/ig, '');
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
    update: async function(userId, eventUid, data) {
        return await Db.update('events', {
            owner: userId,
            _id: eventUid
        }, ObjectHelpers.clone(data));
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

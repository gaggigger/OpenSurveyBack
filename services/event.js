const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');
const ObjectHelpers = require('../helpers/object');

module.exports = {
    key: 'events',
    getUnikName: function(name) {
        return name.trim().replace(/[^0-9a-z_@&]/ig, '').toLowerCase();
    },
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
    findByName: async function(name) {
        const unikname = this.getUnikName(name);
        return await Db.find(this.key, {
            unique_name: unikname
        });
    },
    add: async function(name, owner) {
        name = name.trim();
        const unikname = this.getUnikName(name);
        if(unikname === '') throw new ClientException.BadRequestException();
        const existingEvent = await this.findByName(name);
        if(existingEvent === null) {
            return await Db.addOrUpdate(this.key, {
                name: name,
                unique_name: unikname,
                owner: owner
            });
        } else {
            throw new ClientException.ForbiddenException();
        }
    },
    update: async function(userId, eventUid, data) {
        return await Db.update(this.key, {
            owner: userId,
            _id: eventUid
        }, ObjectHelpers.clone(data));
    },
    getByUser: async function(userId) {
        return await Db.findAll(this.key, {
            'owner': userId
        }, {
            inserted_at: 1
        });
    },
    getByUserAndId: async function(userId, eventUid) {
        return await Db.find(this.key, {
            'owner': userId,
            '_id': eventUid
        }, {
            inserted_at: 1
        });
    }
};

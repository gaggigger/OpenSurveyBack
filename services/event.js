const Db = require('../services/database');

module.exports = {
    key: 'events',
    add: async function(name) {
        return await Db.addOrUpdate('events', {
            name: name
        });
    }
};
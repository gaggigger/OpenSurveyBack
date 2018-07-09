const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');
const ObjectHelpers = require('../helpers/object');

module.exports = {
    key: 'quizs',
    serialize: function(quiz) {
        if(quiz.map) {
            return quiz.map(item => this.formatQuiz(item));
        }
        return this.formatQuiz(quiz);
    },
    formatQuiz: function(quiz) {
        return ObjectHelpers.clone(quiz);
    },
    add: async function(name, event, owner) {
        name = name.toLowerCase().trim();
        if(name === '') throw new ClientException.BadRequestException();
        const existingQuiz = await Db.find(this.key, {
            name: name,
            owner: owner
        });
        if(existingQuiz === null) {
            return await Db.add(this.key, {
                name: name,
                owner: owner,
                event: [event]
            });
        } else {
            throw new ClientException.ForbiddenException();
        }
    },
    update: async function(userId, quizUid, data) {
        return await Db.update(this.key, {
            owner: userId,
            _id: quizUid
        }, ObjectHelpers.clone(data));
    },
    getByUser: async function(userId) {
        return await Db.findAll(this.key, {
            'owner': userId
        }, {
            inserted_at: 1
        });
    },
    getByUserAndId: async function(userId, quizUid) {
        return await Db.find(this.key, {
            'owner': userId,
            '_id': quizUid
        }, {
            inserted_at: 1
        });
    },
    getByUserAndEvent: async function(userId, eventUid) {
        return await Db.findAll(this.key, {
            'owner': userId,
            'event': { $in : [eventUid]  }
        }, {
            name: -1
        });
    }
};

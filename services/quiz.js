const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');
const ObjectHelpers = require('../helpers/object');
const Socket = require('../services/socket');

module.exports = {
    key: 'quizs',
    serialize(quiz) {
        if(quiz.map) {
            return quiz.map(item => this.formatQuiz(item));
        }
        return this.formatQuiz(quiz);
    },
    formatQuiz(quiz) {
        return ObjectHelpers.clone(quiz);
    },
    async add(name, event, owner) {
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
    async update(userId, quizUid, data) {
        return await Db.update(this.key, {
            owner: userId,
            _id: quizUid
        }, ObjectHelpers.clone(data));
    },
    async getByUser(userId) {
        return await Db.findAll(this.key, {
            'owner': userId
        }, {
            inserted_at: 1
        });
    },
    async getByUserAndId(userId, quizUid) {
        return await Db.find(this.key, {
            'owner': userId,
            '_id': quizUid
        });
    },
    async getByUserAndEvent(userId, eventUid) {
        return await Db.findAll(this.key, {
            'owner': userId,
            'event': { $in : [eventUid]  }
        }, {
            name: -1
        });
    }
};

const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');
const Event = require('../services/event');

module.exports = {
    key: 'questions',
    add: async function(userId, eventId, question) {
        if(! question) throw new ClientException.BadRequestException();
        const event = await Event.getByUid(eventId);
        if(! event) throw new ClientException.NotFoundException();
        return await Db.add(this.key, {
            question: question,
            event: eventId,
            owner: userId
        });
    },
    getAll: async function(eventId) {
        if(!eventId) throw new ClientException.BadRequestException();
        return await Db.findAll(this.key, {
            'event': eventId
        }, {
            inserted_at: -1
        });
    },
    like: async function(userName, questionId) {
        if(!questionId) throw new ClientException.BadRequestException();
        const question = await Db.find(this.key, {
            '_id': questionId
        });
        if(! question.likes) {
            question.likes = [];
        }
        if(!question.likes.includes(userName)) {
            question.likes.push(userName);
        }
        return await Db.update(this.key, { '_id': questionId }, question);
    },
    answered: async function(userId, questionId) {
        if(!questionId) throw new ClientException.BadRequestException();
        const question = await Db.find(this.key, {
            '_id': questionId
        });
        const event = await Event.getByUserAndId(userId, question.event);
        if(event) {
            return await Db.update(this.key, { '_id': questionId }, {
                answered: true
            });
        }
        return question;
    }
};

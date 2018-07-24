const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');
const ObjectHelpers = require('../helpers/object');
const Quiz = require('../services/quiz');

module.exports = {
    key: 'quiz-run',
    async findByEventAndQuiz(eventUid, quizUid) {
        return await Db.find(this.key, {
            quiz: quizUid,
            event: eventUid
        });
    },
    async add(eventUid, quizUid) {
        const quizRun = await this.findByEventAndQuiz(eventUid, quizUid);
        if(quizRun !== null && quizRun.finished === false) {
            return quizRun;
        }
        return await Db.add(this.key, {
            quiz: quizUid,
            event: eventUid,
            started: true,
            finished: false,
            started_at: (new Date()).getTime(),
            finished_at: null
        });
    },
    async run(userId, eventUid, quizUid) {
        const quiz = await Quiz.getByUserAndId(userId, quizUid);
        return await this.add(eventUid, quiz._id);
    }
};

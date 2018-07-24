const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');
const ObjectHelpers = require('../helpers/object');
const Quiz = require('../services/quiz');
const Socket = require('../services/socket');

module.exports = {
    key: 'quiz-run',
    async find(quizUid) {
        return await Db.find(this.key, {
            _id: quizUid
        });
    },
    async findByEventAndQuiz(eventUid, quizUid) {
        return await Db.find(this.key, {
            quiz: quizUid,
            event: eventUid
        });
    },
    async add(eventUid, quizUid) {
        if(typeof quizUid === 'object') quizUid = quizUid.toString();
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
            finished_at: null,
            current_question: 0
        });
    },
    async run(userId, eventUid, quizUid) {
        const quiz = await Quiz.getByUserAndId(userId, quizUid);
        return await this.add(eventUid, quiz._id);
    },
    startProcess(socket, qrId) {
        return new Promise(async (resolv, reject) => {
            const quizRun = await this.find(qrId);
            Socket.emit(socket, quizRun.event, 'event-quiz-run', quizRun);
            const quiz = await Quiz.find(quizRun.quiz);
        });
    }
};

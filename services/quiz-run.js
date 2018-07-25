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
    async findByEventAndUid(eventUid, quizrunUid) {
        return await Db.find(this.key, {
            event: eventUid,
            _id: quizrunUid
        });
    },
    async findCurrentRunByEventAndQuiz(eventUid, quizUid) {
        try {
            return await Db.find(this.key, {
                event: eventUid,
                quiz: quizUid,
                started: true,
                finished: false
            });
        } catch(e) {
            // Close all previous run
            this.closeAllRun(eventUid, quizUid);
            return null;
        }
    },
    async closeAllRun(eventUid, quizUid) {
        return new Promise(async (resolv, reject) => {
            const runs = await Db.findAll(this.key, {
                event: eventUid,
                quiz: quizUid,
                started: true,
                finished: false
            });
            const promises = [];
            runs.forEach(run => {
                promises.push(Db.update(this.key, {
                    _id: run._id.toString()
                }, {
                    finished: false
                }));
            });
            Promise.all(promises).then(() => {
                resolv(true);
            }).catch(err => {
                resolv(true);
            });
        });
    },
    async add(eventUid, quizUid) {
        if(typeof quizUid === 'object') quizUid = quizUid.toString();
        const quizRun = await this.findCurrentRunByEventAndQuiz(eventUid, quizUid);
        if(quizRun !== null) {
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
            // Emit start
            Socket.emit(socket, quizRun.event, 'event-quiz-run', quizRun);
            // Emit current question after 5 secs
            setTimeout(async () => {
                const quiz = await Quiz.find(quizRun.quiz);
                this.startQuestion(socket, quiz, quizRun);
            }, 5000);
        });
    },
    startQuestion(socket, quiz, quizRun) {
        return new Promise(async (resolv, reject) => {
            const question = quiz.questions[quizRun.current_question];
            if (question) {
                Socket.emit(socket, quizRun.event, 'event-quiz-question', {
                    event: quizRun.event,
                    quizrun: quizRun._id.toString(),
                    question: question
                });
            }
        });
    }
};

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
    async incrementCurrentQuestion(quiz, quizRun) {
        // Update current question
        if (quiz.questions[quizRun.current_question + 1]) {
            return await Db.update(this.key, {
                _id: quizRun._id.toString()
            }, {
                current_question: quizRun.current_question + 1
            });
        }
        return false;
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
                console.log(quizRun.event);
                Socket.emit(socket, quizRun.event, 'event-quiz-question', {
                    event: quizRun.event,
                    quizrun: quizRun._id.toString(),
                    question: question
                });
                setTimeout(async () => {
                    const qr = await this.incrementCurrentQuestion(quiz, quizRun);
                    if(qr) {
                        this.startQuestion(socket, quiz, qr);
                    } else {
                        // TODO close quizrun
                    }
                }, 10000);
            }
        });
    },
    async getCurrentQuestion(eventUid, quizRunUid) {
        const res = {};
        const quizRun = await this.findByEventAndUid(eventUid, quizRunUid);
        if(quizRun === null) return {
            question: {
                name: '',
                response: []
            }
        };
        const quiz = await Quiz.find(quizRun.quiz);
        res.quizrun = quizRun._id;
        res.current_question = quizRun.current_question;
        if(quiz.questions[quizRun.current_question]) {
            res.question = quiz.questions[quizRun.current_question];
            // Shuffle response
            if(res.question.response && res.question.response.length > 0) {
                res.question.response = res.question.response
                    .map(item => {
                        delete item.correct_answer;
                        item.current_question = quizRun.current_question;
                        return item;
                    })
                    .sort(() => Math.random() - 0.5);
            }
        }
        return res;
    }
};

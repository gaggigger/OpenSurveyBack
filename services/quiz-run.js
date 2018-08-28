const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');
const Quiz = require('../services/quiz');
const Socket = require('../services/socket');

module.exports = {
    key: 'quiz-run',
    async find(quizrunUid) {
        return await Db.find(this.key, {
            _id: quizrunUid
        });
    },
    async findByEventAndQuiz(owner, eventUid, quizUid) {
        return await Db.findAll(this.key, {
            quiz: quizUid,
            event: eventUid,
            owner: owner
        });
    },
    async findByEventAndUid(eventUid, quizrunUid) {
        return await Db.find(this.key, {
            event: eventUid.toString(),
            _id: quizrunUid.toString()
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
        } catch (e) {
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
    async add(eventUid, quiz) {
        if (!quiz.questions || quiz.questions.length === 0) throw new ClientException.ForbiddenException();
        let quizUid = quiz._id;
        if (typeof quizUid === 'object') quizUid = quizUid.toString();
        const quizRun = await this.findCurrentRunByEventAndQuiz(eventUid, quizUid);
        if (quizRun !== null) {
            return quizRun;
        }
        return await Db.add(this.key, {
            quiz: quizUid,
            event: eventUid,
            started: true,
            finished: false,
            started_at: (new Date()).getTime(),
            finished_at: null,
            owner: quiz.owner,
            current_question: 0
        });
    },
    async run(quiz) {
        // const quiz = await Quiz.getByUserAndId(userId, quizUid);
        return await this.add(quiz.event[0], quiz);
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
    async closeQuestion(quizRunId) {
        return await Db.update(this.key, {
            _id: quizRunId
        }, {
            finished: true,
            finished_at: (new Date()).getTime(),
            current_question: 0
        });
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
            if (quiz && quiz.questions && quiz.questions[quizRun.current_question]) {
                const question = await this.getCurrentQuestion(
                    quizRun.event.toString(),
                    quizRun._id.toString()
                );
                Socket.emit(socket, quizRun.event.toString(), 'event-quiz-question', question);

                // Update timestamp question
                quizRun = await this.updateQuestionTimestamp(quizRun);

                setTimeout(async () => {
                    const qr = await this.incrementCurrentQuestion(quiz, quizRun);
                    if (qr) {
                        this.startQuestion(socket, quiz, qr);
                    } else {
                        // close quizrun
                        this.closeQuestion(quizRun._id.toString());
                        Socket.emit(socket, quizRun.event.toString(), 'event-quiz-question-end', quizRun);
                    }
                }, question.duration ? parseInt(question.duration) * 1000 : 10000);
            }
            resolv(true);
        });
    },
    async updateQuestionTimestamp(quizRun) {
        if (!quizRun.response_timestamp) {
            quizRun.response_timestamp = {};
        }
        quizRun.response_timestamp[quizRun.current_question] = (new Date()).getTime();
        return await Db.update(this.key, {
            _id: quizRun._id.toString()
        }, {
            response_timestamp: quizRun.response_timestamp
        });
    },
    async getCurrentQuestion(eventUid, quizRunUid) {
        const res = {};
        const quizRun = await this.findByEventAndUid(eventUid, quizRunUid);
        if (quizRun === null || quizRun.finished === true) return {
            question: {
                name: '',
                response: []
            }
        };
        const quiz = await Quiz.find(quizRun.quiz);
        res.quizrun = quizRun._id;
        res.event = eventUid;
        res.quiz = quiz._id.toString();
        res.current_question = quizRun.current_question;
        if (quiz.questions[quizRun.current_question]) {
            res.question = quiz.questions[quizRun.current_question];
            // Shuffle response
            if (res.question.response && res.question.response.length > 0) {
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
    },
    async addQuizRunInformation(q) {
        let quizs = [];
        let isSingle = false;
        if (!Array.isArray(q)) {
            isSingle = true;
            quizs = [q];
        } else {
            quizs = [...q];
        }
        return new Promise(async (resolv, reject) => {
            for (let i in quizs) {
                const qr = await this.findCurrentRunByEventAndQuiz(quizs[i].event[0], quizs[i]._id.toString());
                if (qr) {
                    quizs[i].quizrun = qr;
                }
            }
            if (isSingle) {
                resolv(quizs[0]);
            } else {
                resolv(quizs);
            }
        });
    },
    stopProcess(socket, quiz) {
        return new Promise(async (resolv, reject) => {
            const quizRun = await this.findCurrentRunByEventAndQuiz(quiz.event.toString(), quiz._id.toString());
            if (quizRun) {
                await this.closeQuestion(quizRun._id.toString());
            }
            Socket.emit(socket, quizRun.event.toString(), 'event-quiz-question-end', quizRun);
            const result = await this.closeAllRun(quizRun.event, quizRun.quiz);
            resolv(result);
        });
    }
};

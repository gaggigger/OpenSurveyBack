const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');
const QuizRun = require('../services/quiz-run');
const Socket = require('../services/socket');

module.exports = {
    key: 'quiz-response',
    async findAnsweredQuestionByUserAndQuestionIndex(user, eventUid, quizRunUid, questionIdx) {
        return await Db.find(this.key, {
            user: user,
            event: eventUid.toString(),
            quizrun: quizRunUid.toString(),
            question_index: questionIdx
        });
    },
    async add(user, eventUid, quizRun, questionIdx, response) {
        return await Db.add(this.key, {
            user: user,
            quiz: quizRun.quiz.toString(),
            event: eventUid.toString(),
            quizrun: quizRun._id.toString(),
            question_index: questionIdx,
            response: response
        });
    },
    async respond(user, eventUid, quizRunUid, questionIdx, response) {
        const quizRun = await QuizRun.findByEventAndUid(eventUid, quizRunUid);
        const quizRunResponse = await QuizRun.getCurrentQuestion(eventUid, quizRunUid);
        if(quizRunResponse.current_question !== questionIdx) {
            throw new ClientException.ForbiddenException();
        }
        let answer = await this.findAnsweredQuestionByUserAndQuestionIndex(user, eventUid, quizRunUid, questionIdx);
        if(answer) throw ClientException.ForbiddenException();
        return await this.add(user, eventUid, quizRun, questionIdx, response);
    }
};

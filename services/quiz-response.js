const Db = require('../services/database');
const ClientException = require('../exceptions/ClientException');
const QuizRun = require('../services/quiz-run');
const Quiz = require('../services/quiz');

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
        const quiz = await Quiz.find(quizRun.quiz.toString());
        if(!quiz.questions[questionIdx]) {
            throw new ClientException.ForbiddenException();
        }
        const question = quiz.questions[questionIdx];
        const resp = question.response.filter(item => item.uid === response);
        if(! resp[0]) {
            throw new ClientException.ForbiddenException();
        }
        let responseDuration = (new Date()).getTime() - quizRun.started_at;
        if(quizRun.response_timestamp && quizRun.response_timestamp[questionIdx]) {
            responseDuration = (new Date()).getTime() - quizRun.response_timestamp[questionIdx]
        }
        return await Db.add(this.key, {
            user: user,
            quiz: quizRun.quiz.toString(),
            event: eventUid.toString(),
            quizrun: quizRun._id.toString(),
            question_index: questionIdx,
            // response_timestamp: (new Date()).getTime(),
            response_duration: responseDuration,
            response: response,
            correct: resp[0].correct_answer
        });
    },
    async respond(user, eventUid, quizRunUid, questionIdx, response) {
        const quizRun = await QuizRun.findByEventAndUid(eventUid, quizRunUid);
        const quizRunResponse = await QuizRun.getCurrentQuestion(eventUid, quizRunUid);
        if(quizRunResponse.current_question !== questionIdx) {
            throw new ClientException.ForbiddenException();
        }
        let answer = await this.findAnsweredQuestionByUserAndQuestionIndex(user, eventUid, quizRunUid, questionIdx);
        if(answer) throw new ClientException.ForbiddenException();
        return await this.add(user, eventUid, quizRun, questionIdx, response);
    }
};

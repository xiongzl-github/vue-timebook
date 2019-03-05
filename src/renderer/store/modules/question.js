import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as questionUtil from "@/utils/questionUtil";
import * as answerUtil from "@/utils/answerUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    question: {
        tabName: "question-list",
        animated: false,
        questionModal: false,
        questionStr: "",
        operType: 1,
        questions: [],
        id: 0,
        index: 0
    },
    answer: {
        curDateTime: new Date(),
        answers: [],
    }
};

const getters = {
    question(state) {
        return state.question;
    },
    answer(state) {
        return state.answer;
    }
};

const actions = {
    addQuestion({ commit, state }, param) {
        let result = questionUtil.addQuestion(state.question, param.thisObj);
        if (result) {
            commit(types.ADDQUESTION);
        }
    },
    queryQuestions({ commit, state }, param) {
        let questions = questionUtil.queryQuestions(
            state.question,
            param.thisObj
        );
        commit(types.QUERYQUESTIONS, questions);
    },
    deleteQuestion({ commit, state }, param) {
        let result = questionUtil.deleteQuestion(
            state.question,
            param.thisObj,
            param.id
        );
        if (result) {
            commit(types.DELETEQUESTION, param.index);
        }
    },
    updateQuestion({ commit, state }, param) {
        let result = questionUtil.updateQuestion(state.question, param.thisObj);
        if (result) {
            commit(types.UPDATEQUESTION);
        }
    },
    showQuestionModal({ commit, state }, param) {
        commit(types.SHOWQUESTIONMODAL, param);
    },
    queryAnswersByDate({ commit, state }, param) {
        let answers = answerUtil.queryAnswersByDate(
            state.answer,
            param.thisObj
        );
        commit(types.QUERYANSWERSBYDATE, answers);
    },
    addAnswers({ commit, state }, param) {
        answerUtil.addAnswers(state.answer, param.thisObj);
    }
};

const mutations = {
    [types.QUERYANSWERSBYDATE](state, answers) {
        // let answer = state.answer;
        state.answer.answers.splice(0, state.answer.answers.length);
        state.answer.answers = answers;
    },
    [types.UPDATEQUESTION](state) {
        let question = state.question;
        question.questions[question.index].questionStr = question.questionStr;
        question.index = 0;
        question.questionStr = "";
        question.operType = 1;
        question.id = 0;
        question.questionModal = false;
    },
    [types.SHOWQUESTIONMODAL](state, param) {
        let question = state.question;
        let questionObj = param.questionObj;
        question.index = param.index;
        question.questionStr = questionObj.questionStr;
        question.operType = 2;
        question.id = questionObj.id;
        question.questionModal = true;
    },
    [types.DELETEQUESTION](state, index) {
        let question = state.question;
        question.questions.splice(index, 1);
    },
    [types.QUERYQUESTIONS](state, questions) {
        let question = state.question;
        question.questions = questions;
    },
    [types.ADDQUESTION](state) {
        let question = state.question;
        question.questionStr = "";
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as workUtil from "@/utils/workUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    work: {
        tabName: "weekly-report",
        animated: false,
        weekArr: [],
        weekReport: []
    }
};

const getters = {
    work(state) {
        return state.work;
    }
};

const actions = {
    getWeekRange({ commit, state }, param) {
        let weekArr = util.getWeekRange(param.date);
        commit(types.GETWEEKRANGE, weekArr);
    },
    getWeekReport({ commit, state }, param) {
        let weekReport = workUtil.getWeekReport(state.work, param.thisObj);
        commit(types.GETWEEKREPORT, weekReport);
    }
};

const mutations = {
    [types.GETWEEKREPORT](state, weekReport) {
        let work = state.work;
        work.weekReport.splice(0, work.weekReport.length);
        work.weekReport = weekReport;
    },
    [types.GETWEEKRANGE](state, weekArr) {
        let work = state.work;
        work.weekArr.splice(0, work.weekArr.length);
        work.weekArr = weekArr;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

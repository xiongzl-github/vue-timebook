import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as todoListUtil from "@/utils/todolistUtil";
import * as mottoUtil from "@/utils/mottoUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    home: {
        isRouterAlive: true,
        activeName: "TimeMachine",
        mottos: [],
        user: null
    }
};

const getters = {
    home(state) {
        return state.home;
    }
};

const actions = {
    test({ commit }, obj) {
        commit(types.TEST);
    },
    queryAllMottos({ commit }, param) {
        let resultList = mottoUtil.queryAllMottos();
        commit(types.QUERYALLMOTTOS, resultList);
    }
};

const mutations = {
    [types.QUERYALLMOTTOS](state, resultList) {
        state.home.mottos.splice(0, state.home.mottos.length);
        state.home.mottos = resultList;
    },
    [types.TEST](state) {}
};

export default {
    state,
    getters,
    actions,
    mutations
};

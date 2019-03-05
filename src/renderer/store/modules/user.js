import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as userUtil from "@/utils/userUtil";
import path from "path";

const state = {
    user: {
        id: 0,
        username: "",
        password: "",
        remenber: true,
        syncStatus: 0,
        status: 1
    }
};

const getters = {
    user(state) {
        return state.user;
    }
};

const actions = {
    register({ commit, state }, param) {
        let result = userUtil.register(state.user, param.thisObj);
        if (result) {
            param.thisObj.$router.push("/home");
            param.thisObj.$store.state.home.home.activeName = "TimeMachine";
        }
    },
    login({ commit, state }, param) {
        let result = userUtil.login(state.user, param.thisObj);
        if (result) {
            param.thisObj.$router.push("/home");
            param.thisObj.$store.state.home.home.activeName = "TimeMachine";
        }
    },
    updateUserLoginStatu({ commit, state }, param) {
        userUtil.updateUserLoginStatu(param.user, param.thisObj, param.autoLogin);
    }
};

const mutations = {
    [types.TEST](state) {}
};

export default {
    state,
    getters,
    actions,
    mutations
};

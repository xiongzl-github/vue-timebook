import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as targetUtil from "@/utils/targetUtil";
import { url } from "inspector";

const state = {
    target: {
        curDateTime: new Date(),
        target: "",
        type: 1,
        syncStatus: 0,
        status: 1,
        userId: 1,
        targets: [],
        endDate: "",
        complete:'',
        id: 0,
        style: "primary",
        doneStyle: "ghost",
        projection: "",
        projectionList: [{
                label: "立即执行",
                value: 1
            },
            {
                label: "想做...",
                value: 2
            }
        ]
    }
};

const getters = {
    target(state) {
        return state.target;
    }
};

const actions = {
    resetTarget({ commit, state }, obj) {
        commit(types.RESETTARGET, obj.timeMachine);
    },
    updateTarget({ commit, state }, obj) {
        targetUtil.updateTarget(state.target, obj.timeMachine, obj.thisObj);
        commit(types.UPDATETARGET, obj);
    },
    setTargetInfo({ commit, state }, obj) {
        commit(types.SETTARGETINFO, obj);
    },
    deleteTargetById({ commit, state }, obj) {
        let resultList = targetUtil.deleteTargetById(obj.id, obj.thisObj);
    },
    queryAllTarget({ commit, state }, obj) {
        let resultList = targetUtil.queryTargets(obj.status);
        commit(types.QUERYALLTARGET, resultList);
    },
    submitTarget({ commit, state }, obj) {
        targetUtil.submitTarget(state.target, obj.timeMachine, obj.thisObj);
    }
};

const mutations = {
    [types.RESETTARGET](state, timeMachine){
        let target = state.target;
        target.target = "";
        timeMachine.tags.splice(0, timeMachine.tags.length);
        target.type = 1;
        target.endDate = "";
        target.complete = "";
        target.projection = "";
    },
    [types.UPDATETARGET](state, data) {
        state.target.type = 1;
    },
    [types.QUERYALLTARGET](state, data) {
        state.target.targets = data;
    },
    [types.SETTARGETINFO](state, data) {
        let index = data.index;
        let timeMachine = data.timeMachine;
        let target = state.target;
        let targetObj = target.targets[index];
        target.target = targetObj.target;
        timeMachine.tags.splice(0, timeMachine.tags.length);
        targetObj.tags.forEach(element => {
            timeMachine.tags.push(element.tagName);
        });
        target.id = targetObj.id;
        target.type = 2;
        target.endDate = targetObj.endDate;
        target.complete = targetObj.complete;
        target.projection = parseInt(targetObj.projection);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

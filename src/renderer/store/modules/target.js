import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as targetUtil from "@/utils/targetUtil";
import { url } from "inspector";

const state = {
    childTarget:{
        id: 0,
        userId: 0,
        theme: '',
        target: '',
        period: 1,
        planning: '1',
        priority: '1',
        availableTime: 0,
        pid: 0,
        consumeTime: 0,
        totalTime: 0,
        deadline: '',
        isCompleted: 0,
        curDateTime: new Date(),
        updateTime: '',
        syncStatus: 0,
        status: 1,
        show: 1
    },
    childTargets:[],
    target: {
        childTargetsModal:false,
        doingStyle:'primary',
        todoStyle:'ghost',
        doneStyle:'ghost',
        current: 0,
        id: 0,
        userId: 0,
        theme: '',      // 主题
        target: '',     // 目标
        period: 1,      // 期数
        planning: '1',    // 规划
        priority: '1',    // 优先级
        availableTime: 0,   // 可利用时间
        pid: 0,             // 父 ID
        consumeTime: 0,     // 耗费时间
        totalTime: 0,       // 总耗时
        deadline: '',       // 截止时间
        isCompleted: '0',     // 是否完成
        curDateTime: new Date(),    // 当前时间
        updateTime: '',             // 更新时间
        syncStatus: 0,              // 同步状态
        status: 1,                  // 状态
        show: 1,                    // 是否显示
        childTargets:[]
    }
};

const getters = {
    target(state) {
        return state.target;
    },
    childTarget(state) {
        return state.childTarget;
    },
    childTargets(state){
        return state.childTargets;
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
    },
    addChildTarget({commit, state}, obj) {
        commit(types.ADDCHILDTARGET, obj);
    },
    addCheckPoint({commit, state}, obj) {
        commit(types.ADDCHECKPOINT, obj);
    },
    deleteCheckPoint({commit, state}, obj) {
        commit(types.DELETECHECKPOINT, obj);
    },
    viewCheckPointDetail({commit, state}, obj) {
        commit(types.VIEWCHECKPOINTDETAIL, obj);
    },
    showChildTargetModal({commit, state}, obj) {
        commit(types.SHOWCHILDTARGETMODAL, obj);
    },
    resetChildTarget({commit, state}, obj) {
        commit(types.RESETCHILDTARGET);
    },
    viewChildTargetDetail({commit, state}, obj) {
        commit(types.VIEWCHILDTARGETDETAIL);
    },
    addTarget({commit, state}, obj){
        targetUtil.addTarget(state.target, obj.thisObj);
    },
    queryDoingTarget({commit, state}, obj){
        targetUtil.queryDoingTarget(state.target, obj.thisObj);
        // commit(types.ADDTARGET);
    }
};

const mutations = {
    [types.ADDTARGET](state){
        let target = state.target;
        console.log(target);
    },
    [types.ADDCHILDTARGET](state, data){
        let target = state.target;
        let childTarget = state.childTarget;
        target.childTargets.push(JSON.parse(JSON.stringify(childTarget)));
    },
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

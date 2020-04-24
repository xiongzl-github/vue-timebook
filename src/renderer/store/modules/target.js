import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as targetUtil from "@/utils/targetUtil";
import { url } from "inspector";

const state = {
    theme: {
        id: 0,
        userId: 0,
        theme: '',
        target: '',
        curDateTime: new Date(),
        updateTime: '',
        syncStatus: 0,
        status: 1,
        childTargetsModal:false,
        doingStyle:'primary',
        todoStyle:'ghost',
        doneStyle:'ghost',
        current: 0,
    },
    period: {
        id: 0,
        userId: 0,
        period: 1,
        planning: '1',
        priority: '1',
        availableTime: 0,
        themeId: 0,
        deadline: new Date(),
        isCompleted: '0',
        curDateTime: new Date(),
        updateTime: '',
        syncStatus: 0,
        status: 1,
        doingTargets:[],
        todoTargets:[],
        doneTargets:[],
        
    },
    periodTarget: {
        id: 0,
        userId: 0,
        targetId: 0,
        periodId: 0,
        curDateTime: new Date(),
        updateTime: '',
        syncStatus: 0,
        status: 1
    },
    childTarget:{
        id: 0,
        userId: 0,
        target: '',     // 目标
        themeId: 0,             // 父 ID
        consumeTime: 0,     // 耗费时间
        totalTime: 0,       // 总耗时
        curDateTime: new Date(),    // 当前时间
        updateTime: '',             // 更新时间
        syncStatus: 0,              // 同步状态
        status: 1,                  // 状态
        show: 1,                    // 是否显示
        childTargets:[]
    },
    childTargets:[],
    target: {
        id: 0,
        userId: 0,
        target: '',     // 目标
        themeId: 0,             // 父 ID
        consumeTime: 0,     // 耗费时间
        totalTime: 0,       // 总耗时
        curDateTime: new Date(),    // 当前时间
        updateTime: '',             // 更新时间
        syncStatus: 0,              // 同步状态
        status: 1,                  // 状态
        show: 1,                    // 是否显示
        childTargets:[]
    }
};

const getters = {
    theme(state) {
        return state.theme;
    },
    period(state) {
        return state.period;
    },
    periodTarget(state) {
        return state.periodTarget;
    },
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
        targetUtil.addTarget(state, obj.thisObj);
    },
    queryDoingTarget({commit, state}, obj){
        let resultList = targetUtil.queryDoingTarget(state.target, obj.thisObj);
        commit(types.QUERYDOINGTARGET, resultList);
    }
};

const mutations = {
    [types.QUERYDOINGTARGET](state, data){
        state.target.doingTargets = data;
    },
    [types.ADDTARGET](state){
        // let target = state.target;
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

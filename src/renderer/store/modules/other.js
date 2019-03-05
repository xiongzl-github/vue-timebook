import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as memoUtil from "@/utils/memoUtil";
import * as mottoUtil from "@/utils/mottoUtil";
import * as apiUtil from "@/utils/apiUtil";
import * as lanUtil from "@/utils/lanUtil";
import * as toolUtil from "@/utils/toolUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    memo: {
        searchStr: "",
        memoModal: false,
        memos: [],
        totalNum: 1,
        curPageNum: 1,
        pageSize: 15,
        subject: "",
        content: "",
        isLocked: "1",
        password: "",
        memoContentTags: [],
        memoObj: {},
        memoDetailModal: false,
        confirmPassword: "",
        operType: 1,
        id: null
    },
    motto: {
        searchStr: "",
        mottoModal: false,
        totalNum: 1,
        curPageNum: 1,
        pageSize: 9,
        author: "",
        mottoStr: "",
        operType: 1,
        mottos: [],
        id: null
    },
    api: {
        id: 0,
        searchStr: "",
        apiModal: false,
        apis: [],
        totalNum: 1,
        curPageNum: 1,
        pageSize: 15,
        lanId: "",
        toolId: "",
        lanStr: "",
        toolStr: "",
        lanChange: false,
        toolChange: false,
        apiLanModal: false,
        apiMethodModal: false,
        methodIntro: "",
        methodName: "",
        method: "",
        operType: 1,
        apiDetailModal: false,
        lan: {
            lanStr: "",
            apiLanModal: false,
            apiLanCategorys: []
        },
        tool: {
            toolStr: "",
            apiToolModal: false,
            apiToolCategorys: []
        }
    },
    other: {
        tabName: "other-memo",
        animated: false
    }
};

const getters = {
    memo(state) {
        return state.memo;
    },
    other(state) {
        return state.other;
    },
    api(state) {
        return state.api;
    },
    motto(state) {
        return state.motto;
    }
};

const actions = {
    addMemoContentTag({ commit, state }, param) {
        commit(types.ADDMEMOCONTENTTAG);
    },
    deleteMemoContentTag({ commit, state }, param) {
        commit(types.DELETEMEMOCONTENTTAG, param.index);
    },
    addMemo({ commit, state }, param) {
        let result = memoUtil.addMemo(state.memo, param.thisObj);
        if (result) {
            commit(types.ADDMEMO);
        }
    },
    queryMemos({ commit, state }, param) {
        let resultList = memoUtil.queryMemos(state.memo, param.thisObj);
        let totalNum = memoUtil.queryTotalMemoNum(state.memo, param.thisObj);
        let resultObj = {
            memos: resultList,
            totalNum: totalNum
        };
        commit(types.QUERYMEMOS, resultObj);
    },
    showMemoDetail({ commit, state }, param) {
        commit(types.SHOWMEMODETAIL, param.index);
    },
    showMemoModal({ commit, state }, param) {
        commit(types.SHOWMEMOMODAL, param.index);
    },
    updateMemo({ commit, state }, param) {
        let result = memoUtil.updateMemo(state.memo, param.thisObj);
        if (result) {
            commit(types.UPDATEMEMO);
        }
    },
    deleteMemo({ commit, state }, param) {
        memoUtil.deleteMemo(state.memo, param.thisObj, param.id);
    },
    closeMemoModal({ commit, state }, param) {
        commit(types.CLOSEMOMOMODAL);
    },
    addMotto({ commit, state }, param) {
        let result = mottoUtil.addMotto(state.motto, param.thisObj);
        if (result) {
            commit(types.ADDMOTTO);
        }
    },
    queryMottos({ commit, state }, param) {
        let mottos = mottoUtil.queryMottos(state.motto, param.thisObj);
        let totalNum = mottoUtil.queryTotalMottoNum(state.motto, param.thisObj);
        let resultObj = {
            mottos: mottos,
            totalNum: totalNum
        };
        commit(types.QUERYMOTTOS, resultObj);
    },
    deleteMotto({ commit, state }, param) {
        mottoUtil.deleteMotto(state.motto, param.thisObj, param.id);
    },
    showMottoModal({ commit, state }, param) {
        commit(types.SHOWMOTTOMODAL, param.index);
    },
    updateMotto({ commit, state }, param) {
        let result = mottoUtil.updateMotto(state.motto, param.thisObj);
        if (result) {
            commit(types.UPDATEMOTTO);
        }
    },
    closeMottoModal({ commit, state }, param) {
        commit(types.CLOSEMOTTOMODAL);
    },
    addLan({ commit, state }, param) {
        let result = lanUtil.addLan(state.api, param.thisObj);
        if (result) {
            commit(types.ADDLAN);
        }
    },
    queryAllLanCategory({ commit, state }, param) {
        let result = lanUtil.queryAllLanCategory(state.api, param.thisObj);
        if (null != result) {
            commit(types.QUERYALLLANCATEGORY, result);
        }
    },
    deleteApiLanCategory({ commit, state }, param) {
        let result = lanUtil.deleteApiLanCategory(
            state.api,
            param.thisObj,
            param.id
        );
    },
    addTool({ commit, state }, param) {
        let result = toolUtil.addTool(state.api, param.thisObj);
        if (result) {
            commit(types.ADDTOOL);
        }
    },
    queryAllToolCategory({ commit, state }, param) {
        let result = toolUtil.queryAllToolCategory(state.api, param.thisObj);
        if (null != result) {
            commit(types.QUERYALLTOOLCATEGORY, result);
        }
    },
    deleteApiToolCategory({ commit, state }, param) {
        let result = toolUtil.deleteApiToolCategory(
            state.api,
            param.thisObj,
            param.id
        );
    },
    addApi({ commit, state }, param) {
        let result = apiUtil.addApi(state.api, param.thisObj);
        // if (result) {
        //     commit(types.ADDAPI);
        // }
    },
    queryApis({ commit, state }, param) {
        let apis = apiUtil.queryApis(state.api, param.thisObj);
        let totalNum = apiUtil.queryTotalApiNum(state.motto, param.thisObj);
        let resultObj = {
            apis: apis,
            totalNum: totalNum
        };
        commit(types.QUERYAPIS, resultObj);
    },
    showApiModal({ commit, state }, param) {
        commit(types.SHOWAPIMODAL, param.apiObj);
    },
    updateApi({ commit, state }, param) {
        apiUtil.updateApi(state.api, param.thisObj);
        commit(types.UPDATEAPI);
    },
    showApiDetail({ commit, state }, param) {
        commit(types.SHOWAPIDETAIL, param.apiObj);
    },
    closeApiDetailModal({ commit, state }, param) {
        commit(types.CLOSEAPIDETAILMODAL);
    },
    deleteApi({ commit, state }, param) {
        apiUtil.deleteApi(state.api, param.thisObj, param.id);
    }
};

const mutations = {
    [types.CLOSEAPIDETAILMODAL](state) {
        let api = state.api;
        api.lanId = "";
        api.lanStr = "";
        api.toolStr = "";
        api.toolId = "";
        api.methodName = "";
        api.methodIntro = "";
        api.method = "";
        api.apiDetailModal = false;
    },
    [types.SHOWAPIDETAIL](state, apiObj) {
        let api = state.api;
        api.lanStr = apiObj.lanStr;
        api.toolStr = apiObj.toolStr;
        api.methodName = apiObj.methodName;
        api.methodIntro = apiObj.methodIntro;
        api.method = apiObj.method;
        api.apiDetailModal = true;
    },
    [types.UPDATEAPI](state) {
        let api = state.api;
        api.lanStr = "";
        api.lanId = "";
        api.lanChange = false;
        api.toolStr = "";
        api.toolId = "";
        api.toolChange = false;
        api.methodName = "";
        api.methodIntro = "";
        api.method = "";
        api.id = 0;
        api.operType = 1;
        api.apiModal = false;
    },
    [types.SHOWAPIMODAL](state, apiObj) {
        let api = state.api;
        api.lanId = apiObj.lanStr;
        api.lanStr = apiObj.lanStr;
        api.toolId = apiObj.toolStr;
        api.toolStr = apiObj.toolStr;
        api.methodName = apiObj.methodName;
        api.methodIntro = apiObj.methodIntro;
        api.method = apiObj.method;
        api.id = apiObj.id;
        api.operType = 2;
    },
    [types.QUERYAPIS](state, resultObj) {
        let api = state.api;
        api.apis.splice(0, api.apis.length);
        api.apis = resultObj.apis;
        api.totalNum = resultObj.totalNum;
    },
    [types.ADDAPI](state) {
        let api = state.api;
        api.lanId = "";
        api.toolId = "";
        api.methodName = "";
        api.methodIntro = "";
        api.method = "";
    },
    [types.QUERYALLTOOLCATEGORY](state, result) {
        let api = state.api;
        api.tool.apiToolCategorys.splice(0, api.tool.apiToolCategorys.length);
        api.tool.apiToolCategorys = result;
    },
    [types.QUERYALLLANCATEGORY](state, result) {
        let api = state.api;
        api.lan.apiLanCategorys.splice(0, api.lan.apiLanCategorys.length);
        api.lan.apiLanCategorys = result;
    },
    [types.ADDLAN](state) {
        let api = state.api;
        api.lan.lanStr = "";
    },
    [types.ADDTOOL](state) {
        let api = state.api;
        api.tool.toolStr = "";
    },
    [types.CLOSEMOTTOMODAL](state, index) {
        let motto = state.motto;
        motto.author = "";
        motto.mottoStr = "";
        motto.mottoModal = false;
        motto.id = null;
        motto.operType = 1;
    },
    [types.UPDATEMOTTO](state, index) {
        let motto = state.motto;
        motto.author = "";
        motto.mottoStr = "";
        motto.mottoModal = false;
        motto.id = null;
        motto.operType = 1;
    },
    [types.SHOWMOTTOMODAL](state, index) {
        let motto = state.motto;
        let mottoObj = motto.mottos[index];
        motto.author = mottoObj.author;
        motto.mottoStr = mottoObj.mottoStr;
        motto.mottoModal = true;
        motto.id = mottoObj.id;
        motto.operType = 2;
    },
    [types.QUERYMOTTOS](state, resultObj) {
        let motto = state.motto;
        motto.mottos.splice(0, motto.mottos.length);
        motto.mottos = resultObj.mottos;
        motto.totalNum = resultObj.totalNum;
    },
    [types.ADDMOTTO](state) {
        let motto = state.motto;
        motto.author = "";
        motto.mottoStr = "";
    },
    [types.CLOSEMOMOMODAL](state) {
        let memo = state.memo;
        memo.id = null;
        memo.subject = "";
        memo.memoContentTags = [];
        memo.isLocked = "1";
        memo.password = "";
        memo.operType = 1;
    },
    [types.UPDATEMEMO](state) {
        let memo = state.memo;
        memo.id = null;
        memo.subject = "";
        memo.memoContentTags = [];
        memo.isLocked = "1";
        memo.password = "";
        memo.operType = 1;
        memo.memoModal = false;
    },
    [types.SHOWMEMOMODAL](state, index) {
        let memo = state.memo;
        let memoObj = memo.memos[index];
        memo.memoModal = true;
        memo.id = memoObj.id;
        memo.subject = memoObj.subject;
        memo.memoContentTags = memoObj.memoContentTags;
        memo.isLocked = memoObj.isLocked;
        memo.password = memoObj.password;
        memo.operType = 2;
    },
    [types.SHOWMEMODETAIL](state, index) {
        let memo = state.memo;
        let memoObj = memo.memos[index];
        let memoEle = {
            subject: memoObj.subject,
            memoContentTags: memoObj.memoContentTags
        };
        memo.memoObj = memoEle;
        memo.memoDetailModal = true;
    },
    [types.QUERYMEMOS](state, resultObj) {
        let memo = state.memo;
        memo.memos.splice(0, memo.memos.length);
        memo.memos = resultObj.memos;
        memo.totalNum = resultObj.totalNum;
    },
    [types.ADDMEMO](state) {
        let memo = state.memo;
        memo.subject = "";
        memo.content = "";
        memo.memoContentTags.splice(0, memo.memoContentTags.length);
        memo.isLocked = "1";
        memo.password = "";
    },
    [types.DELETEMEMOCONTENTTAG](state, index) {
        let memo = state.memo;
        memo.memoContentTags.splice(index, 1);
    },
    [types.ADDMEMOCONTENTTAG](state) {
        let memo = state.memo;
        memo.memoContentTags.push(memo.content);
        memo.content = "";
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

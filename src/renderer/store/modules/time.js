import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as timeUtil from "@/utils/timeUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    time: {
        coverIndex: 0,
        coverId: 0,
        coverPage: 0,
        timebookIndex: 0,
        
        timebookShareModal: false,
        dateType: 1,
        totalTempArr: [24],
        tempArr: [],
        type: "timeMachine",
        curDateTime: null,
        totalNum: 0,
        curPageNum: 1,
        pageSize: 15,
        allTimeOfDays: [],
        editTimeModal: false,
        timeMachineCheckbox: false,
        knowledgeCheckbox: false,
        timeMachineList: [],
        knowledgeList: [],
        noteModal: false,
        note: "",
        title: "",
        targetList: [],
        targetCheckbox: false,
        consumeList: [],
        consumeCheckbox: false,
        summaryList: [],
        summaryCheckbox: false,
        voiceList: [],
        voiceCheckbox: false,
        picList: [],
        picCheckbox: false,
        videoList: [],
        videoCheckbox: false,
        index: 0,
        timebookCoverModal: false,
        timebookModal: false,
        pageNumOfSlider: 1,
        minPageNumOfSlider: 1,
        dicList: [],
        pageDetailList: [],
        timebookCurPageNum: 0,
        timeBookTotalPageNum: 0,
        totalPageNum: 1,
        tempArr: [],
        blankList: [],
        typeArr: [],
        playStatus: 1,
        timebookImgList: [],
        directoryList: [],
        nextDirectoryList: [],
        flag: false,
        timeObjList: [],
        toolbars: {
            bold: true, // 粗体
            italic: true, // 斜体
            header: true, // 标题
            underline: true, // 下划线
            strikethrough: true, // 中划线
            mark: true, // 标记
            superscript: false, // 上角标
            subscript: false, // 下角标
            quote: true, // 引用
            ol: true, // 有序列表
            ul: true, // 无序列表
            link: true, // 链接
            imagelink: true, // 图片链接
            code: true, // code
            table: true, // 表格
            // fullscreen: true, // 全屏编辑
            readmodel: true, // 沉浸式阅读
            // htmlcode: true, // 展示html源码
            help: true, // 帮助
            /* 1.3.5 */
            undo: true, // 上一步
            redo: true, // 下一步
            trash: true, // 清空
            save: true, // 保存（触发events中的save事件）
            /* 1.4.2 */
            navigation: true, // 导航目录
            /* 2.1.8 */
            alignleft: true, // 左对齐
            aligncenter: true, // 居中
            alignright: true, // 右对齐
            /* 2.2.1 */
            subfield: true, // 单双栏模式
            preview: true // 预览
        }
    }
};

const getters = {
    time(state) {
        return state.time;
    }
};

const actions = {
    querySummaryListByDate({ state, commit }, param) {
        let result = timeUtil.querySummaryListByDate(param, state.time);
        param.result = result;
        commit(types.QUERYSUMMARYLISTBYDATE, param);
    },
    queryAllTime({ state, commit }, param) {
        let result = timeUtil.queryAllTime(param.thisObj, state.time);
        commit(types.QUERYALLTIME, result);
    },
    queryAllTimeNum({ state, commit }, param) {
        let result = timeUtil.queryAllTimeNum(param.thisObj, state.time);
        commit(types.QUERYALLTIMENUM, result);
    },
    queryVoiceListByDate({ state, commit }, param) {
        let result = timeUtil.queryVoiceListByDate(
            param.thisObj,
            state.time,
            param.index
        );
        commit(types.QUERYVOICELISTBYDATE, result);
    },
    queryPicListByDate({ state, commit }, param) {
        let result = timeUtil.queryPicListByDate(
            param.thisObj,
            state.time,
            param.index
        );
        commit(types.QUERYPICLISTBYDATE, result);
    },
    queryVideoListByDate({ state, commit }, param) {
        let result = timeUtil.queryVideoListByDate(
            param.thisObj,
            state.time,
            param.index
        );
        commit(types.QUERYVIDEOLISTBYDATE, result);
    },

    saveTimeSetting({ state, commit }, param) {
        let result = timeUtil.saveTimeSetting(param.thisObj, state.time);
        // commit(types.SAVETIMESETTING, result);
    },

    queryTimeMachineListByDate({ state, commit }, param) {
        let result = timeUtil.queryTimeMachineListByDate(
            param.thisObj,
            state.time,
            param.index,
            param.timeMachine
        );
        commit(types.QUERYTIMEMACHINELISTBYDATE, result);
    },
    queryKnowledgesByDate({ state, commit }, param) {
        let result = timeUtil.queryKnowledgesByDate(
            param.thisObj,
            state.time,
            param.index,
            param.knowledge
        );
        commit(types.QUERYKNOWLEDGESBYDATE, result);
    },
    queryTargetListByDate({ state, commit }, param) {
        let result = timeUtil.queryTargetListByDate(
            param.thisObj,
            state.time,
            param.index,
            param.dashboard
        );
        commit(types.QUERYTARGETLISTBYDATE, result);
    },
    queryConsumesByDate({ state, commit }, param) {
        let result = timeUtil.queryConsumesByDate(
            param.thisObj,
            state.time,
            param.index,
            param.consume
        );
        commit(types.QUERYCONSUMESBYDATE, result);
    },

    showTimeBook({ state, commit }, param) {
        let result = timeUtil.showTimeBook(param, state.time);
        state.time.timebookIndex = param.index;
        commit(types.SHOWTIMEBOOK, result);
    },
    openTimebookCoverModal({ state, commit }, param) {
        commit(types.OPENTIMEBOOKCOVERMODAL, param);
    },
    chooseCover({ state, commit }, param) {
        commit(types.CHOOSECOVER, param.id);
    }
};

const mutations = {
    [types.CHOOSECOVER](state, id) {
        state.time.coverIndex = id;
    },
    [types.OPENTIMEBOOKCOVERMODAL](state, param) {
        state.time.coverId = param.id;
        state.time.coverPage = param.coverPage;
        state.time.timebookCoverModal = true;
    },
    [types.SHOWTIMEBOOK](state, resultObj) {
        state.time.pageDetailList.splice(0, state.time.pageDetailList.length);
        state.time.pageDetailList = resultObj.pageDetailList;
        state.time.dicList.splice(0, state.time.dicList.length);
        state.time.dicList = resultObj.dicList;
        state.time.nextDirectoryList.splice(
            0,
            state.time.nextDirectoryList.length
        );
        state.time.directoryList.splice(0, state.time.directoryList.length);

        state.time.timeObjList.splice(0, state.time.timeObjList.length);

        state.time.timeBookTotalPageNum = resultObj.timeBookTotalPageNum;
        state.time.timebookModal = true;
    },
    [types.QUERYCONSUMESBYDATE](state, result) {
        state.time.consumeList.splice(0, state.time.consumeList.length);
        state.time.consumeList = result;
    },
    [types.QUERYTARGETLISTBYDATE](state, result) {
        state.time.targetList.splice(0, state.time.targetList.length);
        state.time.targetList = result;
    },
    [types.QUERYKNOWLEDGESBYDATE](state, result) {
        state.time.knowledgeList.splice(0, state.time.knowledgeList.length);
        state.time.knowledgeList = result;
    },
    [types.QUERYTIMEMACHINELISTBYDATE](state, result) {
        state.time.timeMachineList.splice(0, state.time.timeMachineList.length);
        state.time.timeMachineList = result;
    },
    [types.QUERYVIDEOLISTBYDATE](state, result) {
        state.time.videoList.splice(0, state.time.videoList.length);
        state.time.videoList = result;
    },
    [types.QUERYPICLISTBYDATE](state, result) {
        state.time.picList.splice(0, state.time.picList.length);
        state.time.picList = result;
    },
    [types.QUERYVOICELISTBYDATE](state, result) {
        state.time.voiceList.splice(0, state.time.voiceList.length);
        state.time.voiceList = result;
    },
    [types.QUERYSUMMARYLISTBYDATE](state, param) {
        let oriCurTime = param.dashboard.curDateTime;
        state.time.summaryList.splice(0, state.time.summaryList.length);
        state.time.summaryList = param.result;
        param.dashboard.curDateTime = oriCurTime;
    },
    [types.QUERYALLTIME](state, result) {
        state.time.allTimeOfDays.splice(0, state.time.allTimeOfDays.length);
        state.time.allTimeOfDays = result;
    },
    [types.QUERYALLTIMENUM](state, result) {
        state.time.totalNum = result;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

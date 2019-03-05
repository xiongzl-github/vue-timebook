import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as timeMachineUtil from "@/utils/timeMachineUtil";
import path from "path";
import { remote } from "electron";
import Datastore from "nedb";
import { url } from "inspector";

var tag = {
    id: "",
    userId: 1,
    tagName: "",
    updateTime: {},
    syncStatus: 0
};

const state = {
    timeMachine: {
        id: "",
        userId: 1,
        timeSlot: "",
        doWhat: "",
        tagId: "",
        consumeTime: 30,
        curTime: "",
        updateTime: "",
        syncStatus: "",
        timeSlotStart: "00:00",
        timeSlotEnd: "",
        lastSubmitTimeSlot: "",
        tagName: "",
        timeMachineOneModal: false,
        dropdownTagShow: false,
        curIndex: -1,
        originalTagName: "",
        todoListId: "",
        tagModal: false,
        loadingTagStatus: false,
        progress: 10,
        review: true,
        progressStatus: 0,
        remark: "",
        consume: 0,
        income: 0,
        showConsume: false,
        note: "",
        function: true,
        basicFuntion: true,
        editModal: false,
        settingModal: false,
        codeStyle: "googlecode",
        type: 1, // 用于区分是添加还是更新
        leftCurTime: new Date(),
        rightCurTime: new Date(),
        remindCycle: 60,
        remindCycleStatus: false,
        applyCategory: true,
        status: 1,
        tags: [],
        taskList: [],
        timeSlotStartArr: [],
        timeSlotEndArr: [],
        searchedTags: [],
        allTags: [],
        uploadList: [],
        timeList: [],
        switchChange: false,
        categorySetting: {
            id: "",
            userId: "",
            categoryId: "",
            updateTime: "",
            syncStatus: 0,
            status: 1,
            doWhatStatus: true,
            tagStatus: true,
            progressStatus: true,
            noteStatus: false,
            remarkStatus: true,
            attachStatus: true,
            consumeStatus: false,
            incomeStatus: false
        },
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
    //loading: false
};

const getters = {
    timeMachine(state) {
        if (state.timeMachine.progress != 100) {
            state.timeMachine.progressStatus = 0;
        } else {
            state.timeMachine.progressStatus = 1;
        }
        //state.timeMachine.consumeTime = timeMachineUtil.getConsumeTime(state.timeMachine);
        return state.timeMachine;
    },
    loading(state) {
        return state.loading;
    }
};

const actions = {
    test() {},
    saveSetting({ commit, state }, obj) {
        timeMachineUtil.saveSetting(state.timeMachine, obj.thisObj);
        commit(types.SAVESETTING);
    },
    addRemindCycleSetting({ commit, state }) {
        let res = timeMachineUtil.addRemindCycleSetting(state.timeMachine);
        commit(types.ADDREMINDCYCLESETTING, res);
    },
    todolistChange({ commit, state }, obj) {
        let todolistId = state.timeMachine.todoListId;
        let categoryId = "";
        // taskList
        state.timeMachine.taskList.forEach(element => {
            if (element.todolist.id == todolistId) {
                categoryId = element.todolist.categoryId;
            }
        });
        let res = timeMachineUtil.queryCategorySetting(categoryId);
        let ele = timeMachineUtil.getTimeMachineDetailByTodolistId(
            state.timeMachine
        );
        let resultObj = {
            res: res,
            ele: ele
        };
        commit(types.TODOLISTCHANGE, resultObj);
    },
    queryCategoryByType({ commit }, obj) {
        let res = timeMachineUtil.queryCategoryByType(obj.category);
        commit(types.QUERYCATEGORYBYTYPE, res);
    },
    queryTaskByDate({ commit, state }, obj) {
        let result = timeMachineUtil.queryTaskByDate(
            state.timeMachine.rightCurTime,
            obj.thisObj
        );
        commit(types.QUERYTASKBYDATE, result);
    },
    updateTimeMachine({ commit, state }, obj) {
        timeMachineUtil.updateTimeMachine(state.timeMachine, obj.thisObj);
        commit(types.UPDATETIMEMACHINE);
    },
    queryLastSubmitTimeSlot({ commit, state }) {
        let res = timeMachineUtil.queryLastSubmitTimeSlot(
            state.timeMachine.rightCurTime
        );
        commit(types.QUERYLASTSUBMITTIMESLOT, res);
    },
    setTimeMachineInfo({ commit }, obj) {
        commit(types.SETTIMEMACHINEINFO, obj.index);
    },
    deleteTimeMachineById({ commit }, obj) {
        timeMachineUtil.deleteTimeMachineById(obj.id, obj.thisObj, null);
    },
    queryTimeListByDate({ commit, state }, obj) {
        let res = timeMachineUtil.queryTimeListByDate(
            state.timeMachine,
            obj.thisObj
        );
        commit(types.QUERYTIMELISTBYDATE, res);
    },
    getConsumeTime({ commit, state }) {
        let res = timeMachineUtil.getConsumeTime(state.timeMachine);
        commit(types.GETCONSUMETIME, res);
    },
    deleteTag({ commit }, obj) {
        let res = timeMachineUtil.deleteTag(obj);
        commit(types.DELETETAG, res);
    },
    submitTimeMachine({ commit, state }, obj) {
        timeMachineUtil.submitTimeMachine(obj.thisObj, state.timeMachine, null);
        commit(types.SUBMITTIMEMACHINE);
    },
    initTimeSlot({ commit, state }) {
        commit(types.INITTIMESLOT);
    },
    queryTags({ commit, state }, obj) {
        let res = timeMachineUtil.queryTags(obj.query);
        commit(types.QUERYTAGS, res);
    },
    queryAllTags({ commit, state }, obj) {
        let res = timeMachineUtil.queryAllTags();
        commit(types.QUERYALLTAGS, res);
    },
    addTag({ commit, state }, obj) {
        let res = timeMachineUtil.addTag(state.timeMachine, obj.thisObj);
        if (res == types.SUCCESS) {
            commit(types.ADDTAG);
        }
    },
    test({ commit }, obj) {
        commit(types.TEST);
    },
    dealWithTimeSlot({ commit }) {
        var timeSlotArr = util.getTimeSlot().split("~");
        commit(types.DEALWITHTIMESLOT, timeSlotArr);
    },
    handleTimeSlotSelect({ commit }, obj) {
        let timeSlot = parseInt(obj.timeSlot.slice(0, 2));
        let temp = "";
        if (timeSlot < 9) {
            temp = "0" + ++timeSlot + ":00";
        } else if (timeSlot == 23) {
            temp = "00:00";
        } else {
            temp = ++timeSlot + ":00";
        }
        commit(types.HANDLETIMESLOTSELECT, temp);
    },
    handleTimeSlotStartSearch({ commit }, obj) {
        let arr = util.handleTimeSlotCommon(obj.timeSlot);
        commit(types.HANDLETIMESLOTSTARTSEARCH, arr);
    },
    handleTimeSlotEndSearch({ commit }, obj) {
        let arr = util.handleTimeSlotCommon(obj.timeSlot);
        commit(types.HANDLETIMESLOTENDSEARCH, arr);
    },
    showPhoto({ commit }, obj) {
        let e = obj.event;
        let filename = e.srcElement.files[0].name;
        let filepath = e.srcElement.files[0].path;
        // large.jpg
        // C:\Users\xiongzl\Desktop\large.jpg
        // 获取图像的名称, 判断是否是图片
        if ("" == filename || !util.isPic(filename)) {
            obj.vueObj.$layer.msg("上传图片失败!");
            return;
        }
        let param = {
            name: filename,
            url: filepath,
            status: "finished",
            exist: false,
            id: null
        };
        commit(types.SHOWPHOTO, param);
    },
    handleRemove({ commit }, obj) {
        commit(types.HANDLEREMOVE, obj.index);
    },
    resetTimeMachine({ commit }) {
        commit(types.RESETTIMEMACHINE);
    },
    setTimeSlotEnd({ commit }) {
        commit(types.SETTIMESLOTEND);
    }
};

const mutations = {
    [types.TEST](state) {},
    [types.DEALWITHTIMESLOT](state, data) {
        state.timeMachine.timeSlotStart = data[0];
        state.timeMachine.timeSlotEnd = data[1];
    },
    [types.HANDLETIMESLOTSELECT](state, data) {
        state.timeMachine.timeSlotEnd = data;
    },
    [types.HANDLETIMESLOTSTARTSEARCH](state, arr) {
        state.timeMachine.timeSlotStartArr.splice(
            0,
            state.timeMachine.timeSlotStartArr.length
        );
        state.timeMachine.timeSlotStartArr = arr;
    },
    [types.HANDLETIMESLOTENDSEARCH](state, arr) {
        state.timeMachine.timeSlotEndArr.splice(
            0,
            state.timeMachine.timeSlotEndArr.length
        );
        state.timeMachine.timeSlotEndArr = arr;
    },
    [types.SHOWPHOTO](state, obj) {
        state.timeMachine.uploadList.push(obj);
    },
    [types.HANDLEREMOVE](state, index) {
        state.timeMachine.uploadList.splice(index, 1);
    },
    [types.SUBMITTIMEMACHINE](state, flag) {
        state.timeMachine.lastSubmitTimeSlot = state.timeMachine.timeSlotEnd;
        state.timeMachine.rightCurTime = new Date();
        state.timeMachine.timeSlotStart = timeMachineUtil.queryLastSubmitTimeSlot(
            state.timeMachine.rightCurTime
        );
        state.timeMachine.timeSlotEnd = util.getHourAndMin();
        state.timeMachine.todoListId = "";
        state.timeMachine.progress = 10;
        state.timeMachine.remark = "";
        state.timeMachine.note = "";
        state.timeMachine.consume = 0;
        state.timeMachine.income = 0;
        state.timeMachine.tags.splice(0, state.timeMachine.tags.length);
        state.timeMachine.uploadList.splice(
            0,
            state.timeMachine.uploadList.length
        );
        state.timeMachine.id = "";
        state.timeMachine.type = 1;
        state.timeMachine.showConsume = false;
        state.timeMachine.categorySetting.doWhatStatus = true;
        state.timeMachine.categorySetting.tagStatus = true;
        state.timeMachine.categorySetting.progressStatus = true;
        state.timeMachine.categorySetting.noteStatus = false;
        state.timeMachine.categorySetting.remarkStatus = true;
        state.timeMachine.categorySetting.attachStatus = true;
        state.timeMachine.categorySetting.consumeStatus = false;
        state.timeMachine.categorySetting.incomeStatus = false;
    },
    [types.RESET](state) {
        state.timeMachine.doWhat = "";
    },
    [types.QUERYTAGS](state, res) {
        state.timeMachine.searchedTags = res;
    },
    [types.QUERYALLTAGS](state, res) {
        state.timeMachine.allTags.splice(0, state.timeMachine.allTags.length);
        state.timeMachine.allTags = res;
    },
    [types.ADDTAG](state) {},
    [types.INITTIMESLOT](state) {
        if (state.timeMachine.lastSubmitTimeSlot == "") {
            state.timeMachine.timeSlotStart = "00:00";
        } else {
            state.timeMachine.timeSlotStart =
                state.timeMachine.lastSubmitTimeSlot;
        }
        state.timeMachine.timeSlotEnd = util.getHourAndMin();
        state.timeMachine.timeSlot =
            state.timeMachine.timeSlotStart +
            "~" +
            state.timeMachine.timeSlotEnd;
    },
    [types.SETTIMESLOTEND](state) {
        state.timeMachine.timeSlotEnd = util.getHourAndMin();
    },
    [types.DELETETAG](state) {},
    [types.GETCONSUMETIME](state, res) {
        state.timeMachine.consumeTime = res;
        state.timeMachine.timeSlot = "";
        state.timeMachine.timeSlot =
            state.timeMachine.timeSlotStart +
            "~" +
            state.timeMachine.timeSlotEnd;
    },
    [types.QUERYTIMELISTBYDATE](state, res) {
        state.timeMachine.timeList = res;
    },
    [types.SETTIMEMACHINEINFO](state, index) {
        let timeMachiineObj = state.timeMachine.timeList[index];
        let timeSlotArr = timeMachiineObj.timeMachine.timeSlot.split("~");
        state.timeMachine.rightCurTime = state.timeMachine.leftCurTime;
        state.timeMachine.timeSlotStart = timeSlotArr[0];
        state.timeMachine.timeSlotEnd = timeSlotArr[1];
        state.timeMachine.todoListId = timeMachiineObj.timeMachine.todolistId;
        state.timeMachine.tags.splice(0, state.timeMachine.tags.length);
        timeMachiineObj.tags.forEach(element => {
            state.timeMachine.tags.push(element.tagName);
        });
        state.timeMachine.progress = timeMachiineObj.timeMachine.progress;
        state.timeMachine.remark = timeMachiineObj.timeMachine.remark;
        state.timeMachine.uploadList = timeMachineUtil.getAttachsById(
            timeMachiineObj.timeMachine.id,
            types.TIMEMACHINE_GROUP
        );
        state.timeMachine.type = 2;
        state.timeMachine.id = timeMachiineObj.timeMachine.id;
        if (timeMachineUtil.isConsumeCategory(state.timeMachine.todoListId)) {
            state.timeMachine.showConsume = true;
        } else {
            state.timeMachine.showConsume = false;
        }
        // state.timeMachine.consume = timeMachiineObj.timeMachine.consume;

        let categoryId = timeMachiineObj.todolist.categoryId;
        let res = timeMachineUtil.queryCategorySetting(categoryId);
        if (res.doWhatStatus == 1) {
            state.timeMachine.categorySetting.doWhatStatus = true;
        } else {
            state.timeMachine.categorySetting.doWhatStatus = false;
        }
        if (res.tagStatus == 1) {
            state.timeMachine.categorySetting.tagStatus = true;
        } else {
            state.timeMachine.categorySetting.tagStatus = false;
        }
        if (res.progressStatus == 1) {
            state.timeMachine.categorySetting.progressStatus = true;
        } else {
            state.timeMachine.categorySetting.progressStatus = false;
        }
        if (res.noteStatus == 1) {
            state.timeMachine.categorySetting.noteStatus = true;
            state.timeMachine.note = timeMachiineObj.timeMachine.note;
        } else {
            state.timeMachine.categorySetting.noteStatus = false;
        }
        if (res.remarkStatus == 1) {
            state.timeMachine.categorySetting.remarkStatus = true;
        } else {
            state.timeMachine.categorySetting.remarkStatus = false;
        }
        if (res.attachStatus == 1) {
            state.timeMachine.categorySetting.attachStatus = true;
        } else {
            state.timeMachine.categorySetting.attachStatus = false;
        }
        if (res.consumeStatus == 1) {
            state.timeMachine.categorySetting.consumeStatus = true;
            state.timeMachine.consume = timeMachiineObj.timeMachine.consume;
        } else {
            state.timeMachine.categorySetting.consumeStatus = false;
        }
        if (res.incomeStatus == 1) {
            state.timeMachine.categorySetting.incomeStatus = true;
            state.timeMachine.income = timeMachiineObj.timeMachine.income;
        } else {
            state.timeMachine.categorySetting.incomeStatus = false;
        }
    },
    [types.QUERYLASTSUBMITTIMESLOT](state, res) {
        if (res == null) {
            state.timeMachine.lastSubmitTimeSlot = "00:00";
        } else {
            state.timeMachine.lastSubmitTimeSlot = res;
        }
    },
    [types.UPDATETIMEMACHINE](state) {
        state.timeMachine.type = 1;
        state.timeMachine.id = "";
    },
    [types.RESETTIMEMACHINE](state) {
        state.timeMachine.rightCurTime = new Date();
        state.timeMachine.timeSlotStart = timeMachineUtil.queryLastSubmitTimeSlot(
            state.timeMachine.rightCurTime
        );
        state.timeMachine.timeSlotEnd = util.getHourAndMin();
        state.timeMachine.todoListId = "";
        state.timeMachine.progress = 10;
        state.timeMachine.remark = "";
        state.timeMachine.note = "";
        state.timeMachine.consume = 0;
        state.timeMachine.income = 0;
        state.timeMachine.tags.splice(0, state.timeMachine.tags.length);
        state.timeMachine.uploadList.splice(
            0,
            state.timeMachine.uploadList.length
        );
        state.timeMachine.id = "";
        state.timeMachine.type = 1;
        state.timeMachine.showConsume = false;
        state.timeMachine.categorySetting.doWhatStatus = true;
        state.timeMachine.categorySetting.tagStatus = true;
        state.timeMachine.categorySetting.progressStatus = true;
        state.timeMachine.categorySetting.noteStatus = false;
        state.timeMachine.categorySetting.remarkStatus = true;
        state.timeMachine.categorySetting.attachStatus = true;
        state.timeMachine.categorySetting.consumeStatus = false;
        state.timeMachine.categorySetting.incomeStatus = false;
    },
    [types.QUERYTASKBYDATE](state, res) {
        res.sort(util.sortByTimeOfTasks);
        state.timeMachine.taskList.splice(0, state.timeMachine.taskList.length);
        state.timeMachine.taskList = res;
        let timeSlotStart = timeMachineUtil.queryLastSubmitTimeSlot(
            state.timeMachine.rightCurTime
        );
        if (timeSlotStart == "" || timeSlotStart == null) {
            state.timeMachine.timeSlotStart = "00:00";
        } else {
            state.timeMachine.timeSlotStart = timeSlotStart;
        }
        state.timeMachine.timeSlotEnd = util.getHourAndMin();
    },
    [types.TODOLISTCHANGE](state, resultObj) {
        let res = resultObj.res;
        let ele = resultObj.ele;
        if (res.doWhatStatus == 1) {
            state.timeMachine.categorySetting.doWhatStatus = true;
        } else {
            state.timeMachine.categorySetting.doWhatStatus = false;
        }
        if (res.tagStatus == 1) {
            state.timeMachine.categorySetting.tagStatus = true;
        } else {
            state.timeMachine.categorySetting.tagStatus = false;
        }
        if (res.progressStatus == 1) {
            state.timeMachine.categorySetting.progressStatus = true;
        } else {
            state.timeMachine.categorySetting.progressStatus = false;
        }
        if (res.noteStatus == 1) {
            state.timeMachine.categorySetting.noteStatus = true;
        } else {
            state.timeMachine.categorySetting.noteStatus = false;
        }
        if (res.remarkStatus == 1) {
            state.timeMachine.categorySetting.remarkStatus = true;
        } else {
            state.timeMachine.categorySetting.remarkStatus = false;
        }
        if (res.attachStatus == 1) {
            state.timeMachine.categorySetting.attachStatus = true;
        } else {
            state.timeMachine.categorySetting.attachStatus = false;
        }
        if (res.consumeStatus == 1) {
            state.timeMachine.categorySetting.consumeStatus = true;
        } else {
            state.timeMachine.categorySetting.consumeStatus = false;
        }
        if (res.incomeStatus == 1) {
            state.timeMachine.categorySetting.incomeStatus = true;
        } else {
            state.timeMachine.categorySetting.incomeStatus = false;
        }
        //=========================================================
        if (ele.id != null) {
            state.timeMachine.tags.splice(0, state.timeMachine.tags.length);
            ele.tags.forEach(element => {
                state.timeMachine.tags.push(element.tagName);
            });
            state.timeMachine.progress = ele.progress;
            state.timeMachine.remark = ele.remark;
            state.timeMachine.uploadList = timeMachineUtil.getAttachsById(
                ele.id,
                types.TIMEMACHINE_GROUP
            );
            state.timeMachine.type = 1;
            state.timeMachine.id = ele.id;
            if (
                timeMachineUtil.isConsumeCategory(state.timeMachine.todoListId)
            ) {
                state.timeMachine.showConsume = true;
            } else {
                state.timeMachine.showConsume = false;
            }
            state.timeMachine.consume = ele.consume;
            state.timeMachine.note = ele.note;
            state.timeMachine.income = ele.income;
        } else {
            state.timeMachine.progress = 10;
            state.timeMachine.remark = "";
            state.timeMachine.note = "";
            state.timeMachine.consume = 0;
            state.timeMachine.income = 0;
            state.timeMachine.tags.splice(0, state.timeMachine.tags.length);
            state.timeMachine.uploadList.splice(
                0,
                state.timeMachine.uploadList.length
            );
            state.timeMachine.id = "";
            state.timeMachine.type = 1;
            state.timeMachine.showConsume = false;
            state.timeMachine.categorySetting.doWhatStatus = true;
            state.timeMachine.categorySetting.tagStatus = true;
            state.timeMachine.categorySetting.progressStatus = true;
            state.timeMachine.categorySetting.noteStatus = false;
            state.timeMachine.categorySetting.remarkStatus = true;
            state.timeMachine.categorySetting.attachStatus = true;
            state.timeMachine.categorySetting.consumeStatus = false;
            state.timeMachine.categorySetting.incomeStatus = false;
        }
    },
    [types.ADDREMINDCYCLESETTING](state, res) {
        state.timeMachine.remindCycle = res;
    },
    [types.SAVESETTING](state) {
        state.timeMachine.switchChange = false;
        state.timeMachine.remindCycleStatus = false;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

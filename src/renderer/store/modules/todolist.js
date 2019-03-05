import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as todolistUtil from "@/utils/todolistUtil";
import * as targetUtil from "@/utils/targetUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    todoList: {
        id: "",
        categoryId: "",
        userId: 1,
        listName: "",
        repeatType: "0",
        remind: "",
        importLevel: "",
        heart: 0,
        leftCurTime: new Date(),
        curDateTime: new Date(),
        updateTime: "",
        syncStatus: 0,
        collapseName: "one",
        color: "#495060",
        categoryModal: false,
        categoryName: "",
        forecastTimeOfMin: 30,
        forecastTimeOfHour: 4,
        recommendTime: 60,
        timeType: "1",
        difficult: 3,
        isLeaf: 0,
        status: 1,
        index: "",
        type: 1,
        scheduleTime: "6",
        tierRelation: "",
        icons: [],
        categoryIds: [],
        categoryModalIds: [],
        categoryListOfSelect: [],
        categoryListOfSelectModal: [],
        categoryListOfLevel: [],
        categoryTaskList: [],
        todolists: [],
        imgCheck: ["0.png"],
        newStyle: "primary",
        style: "ghost",
        endDate:"",
        targetId:0,
        targets:[],
        iconCategorys: [],
        importLevelList: [
            {
                label: "重要且紧急",
                value: 1
            },
            {
                label: "紧急不重要",
                value: 2
            },
            {
                label: "重要不紧急",
                value: 3
            },
            {
                label: "不紧急不重要",
                value: 4
            }
        ]
    }
};

const getters = {
    todoList(state) {
        return state.todoList;
    }
};

const actions = {
    queryNewTodolistByDate({ commit, state }, param) {
        let res = todolistUtil.queryNewTodolistByDate(
            state.todoList,
            param.thisObj
        );
        commit(types.QUERYNEWTODOLISTBYDATE, res);
    },
    getIcons({ commit, state }, param) {
        let res = todolistUtil.getIcons();
        commit(types.GETICONS, res);
    },
    handleImgCheck({ commit, state }, param) {
        commit(types.HANDELIMGCHECK);
    },
    setTodolistInfoOfCategoryIds({ commit, state }) {
        setTimeout(() => {
            state.todoList.categoryIds.splice(
                0,
                state.todoList.categoryIds.length
            );
            let tempArr = state.todoList.todolists[
                state.todoList.index
            ].todolist.categoryIds.split(",");
            tempArr.forEach(element => {
                state.todoList.categoryIds.push(parseInt(element));
            });
        }, 1);
    },
    test({ commit }, obj) {
        commit(types.TEST);
    },
    resetTodolist({ commit }, obj) {
        commit(types.RESETTODOLIST);
    },
    updateTodolist({ commit, state }, obj) {
        todolistUtil.updateTodolist(state.todoList, obj.thisObj);
        commit(types.UPDATETODOLIST);
    },
    queryCategoryOfLevel({ commit }) {
        let result = todolistUtil.queryCategoryOfLevel();
        if (null != result) {
            commit(types.QUERYCATEGORYOFLEVEL, result);
        }
    },
    queryTodolistByDate({ commit, state }, obj) {
        let result = todolistUtil.queryTodolistByDate(
            state.todoList.leftCurTime,
            obj.thisObj
        );
        commit(types.QUERYTODOLISTBYDATE, result);
    },
    queryCategoryOfSelectModal({ commit }) {
        let result = todolistUtil.queryCategoryOfSelectModal();
        if (null != result) {
            commit(types.QUERYCATEGORYOFSELECTMODAL, result);
        }
    },
    addCategory({ commit, state }, obj) {
        let result = todolistUtil.addCategory(obj.thisObj, state.todoList);
        if (result) {
            commit(types.ADDCATEGORY);
        }
    },
    queryCategoryOfSelect({ commit }) {
        let result = todolistUtil.queryCategoryOfSelect();
        if (null != result) {
            commit(types.QUERYCATEGORYOFSELECT, result);
        }
    },
    addHeart({ commit }, obj) {
        commit(types.ADDHEART);
    },
    submitTodoList({ commit, state }, obj) {
        todolistUtil.submitTodoList(state.todoList, obj.thisObj, null);
        commit(types.SUBMITTODOLIST);
    },
    queryCategoryTask({ commit, state }) {
        let result = todolistUtil.queryCategoryTask(state.todoList);
        if (null != result) {
            commit(types.QUERYCATEGORYTASK, result);
            return result;
        }
    },
    deleteTaskById({ commit, state }, obj) {
        todolistUtil.deleteTaskById(obj.id, obj.thisObj, null);
        commit(types.DELETETASKBYID);
    },
    deleteCategoryById({ commit, state }, obj) {
        todolistUtil.deleteCategoryById(obj.category, obj.thisObj);
        commit(types.DELETECATEGORYBYID);
    },
    setTodolistInfo({ commit, state }, obj) {
        commit(types.SETTODOLISTINFO, obj.index);
    },
    queryTargets({ commit, state }, obj) {
        let result = targetUtil.queryTargets(obj.status);
        let arr = [];
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                let element = result[i];
                if (element.projection == 2) {
                    arr.push(i);
                }
            }
        }
        for (let j = arr.length - 1; j >= 0; j--) {
            result.splice(arr[j], 1);
        }
        commit(types.QUERYTARGETS, result);
    },
    addDiscardTask({ commit, state }, obj) {
        todolistUtil.addDiscardTask(obj.thisObj, obj.todolistId, obj.todolistDate, obj.discardStatus);
        commit(types.ADDDISCARDTASK, obj);
    },
    // todolistCategoryChange({commit,state}, obj) {
        
    //     // commit(types.QUERYTARGETS, result);
    // }
};

const mutations = {
    [types.ADDDISCARDTASK](state, obj) {
        state.todoList.todolists.forEach(element => {
            if (element.todolist.id == obj.todolistId) {
                if(obj.discardStatus == 1) {
                    element.todolist.discardStatus = 0;
                } else {
                    element.todolist.discardStatus = 1;
                }
            }
        });
    },
    [types.QUERYTARGETS](state, result) {
        state.todoList.targets.splice(0, state.todoList.targets.length);
        state.todoList.targets = result;
    },
    [types.TEST](state) {},
    [types.QUERYNEWTODOLISTBYDATE](state, res) {
        state.todoList.todolists.splice(0, state.todoList.todolists.length);
        state.todoList.todolists = res;
        state.todoList.newStyle = "primary";
        state.todoList.style = "ghost";
    },
    [types.ADDCATEGORY](state) {
        // state.todoList.categoryList.push(state.todoList.categoryName);
        state.todoList.categoryName = "";
        state.todoList.imgCheck.splice(0, state.todoList.imgCheck.length);
        state.todoList.categoryModalIds = [];
    },
    [types.QUERYCATEGORYOFSELECT](state, res) {
        state.todoList.categoryListOfSelect = res;
    },
    [types.QUERYCATEGORYOFLEVEL](state, res) {
        state.todoList.categoryListOfLevel = res;
    },
    [types.ADDHEART](state) {
        if (state.todoList.color == "orangeRed") {
            state.todoList.color = "#495060";
            state.todoList.heart = 0;
        } else {
            state.todoList.color = "orangeRed";
            state.todoList.heart = 1;
        }
    },
    [types.QUERYCATEGORYTASK](state, res) {
        state.todoList.categoryTaskList = res;
    },
    [types.SUBMITTODOLIST](state, res) {},
    [types.DELETETASKBYID](state) {},
    [types.DELETECATEGORYBYID](state) {},
    [types.QUERYCATEGORYOFSELECTMODAL](state, res) {
        state.todoList.categoryListOfSelectModal = res;
    },
    [types.QUERYTODOLISTBYDATE](state, res) {
        res.sort(util.sortByUrgencyOfTodolists);
        state.todoList.todolists.splice(0, state.todoList.todolists.length);
        state.todoList.todolists = res;
        state.todoList.style = "primary";
        state.todoList.newStyle = "ghost";
    },
    [types.SETTODOLISTINFO](state, index) {
        let todolistObj = state.todoList.todolists[index].todolist;
        state.todoList.id = todolistObj.id;
        state.todoList.curDateTime = new Date(todolistObj.curDateTime);
        state.todoList.categoryIds = todolistObj.categoryIds.split(",");
        state.todoList.listName = todolistObj.listName;
        state.todoList.repeatType = todolistObj.repeatType + "";
        state.todoList.scheduleTime = todolistObj.scheduleTime + "";
        state.todoList.endDate = todolistObj.endDate;
        // state.todoList.remind = todolistObj.remind;
        state.todoList.difficult = todolistObj.difficult;
        state.todoList.importLevel = todolistObj.importLevel;
        state.todoList.targetId = todolistObj.targetId;
        state.todoList.heart = todolistObj.heart;
        // state.todoList.timeType = todolistObj.forecastTimeType + "";
        state.todoList.type = 2;
        // if (todolistObj.forecastTime > 240) {
        //     state.todoList.forecastTimeOfHour = todolistObj.forecastTime / 60;
        // } else {
        //     state.todoList.forecastTimeOfMin = todolistObj.forecastTime;
        // }
    },
    [types.UPDATETODOLIST](state) {
        state.todoList.type = 1;
        state.todoList.id = "";
    },
    [types.RESETTODOLIST](state) {
        state.todoList.curDateTime = new Date();
        state.todoList.categoryIds.splice(0, state.todoList.categoryIds.length);
        state.todoList.listName = "";
        state.todoList.repeatType = "";
        state.todoList.scheduleTime = "";
        state.todoList.remind = "";
        state.todoList.importLevel = "";
        state.todoList.targetId = 0;
        state.todoList.difficult = 3;
        state.todoList.timeType = "1";
        state.todoList.forecastTimeOfMin = 30;
        state.todoList.type = 1;
        state.todoList.endDate = "";
    },
    [types.HANDELIMGCHECK](state) {
        // 获取选中图标的最后一个
        let obj = state.todoList.imgCheck[state.todoList.imgCheck.length - 1];
        state.todoList.imgCheck.splice(0, state.todoList.imgCheck.length);
        state.todoList.imgCheck.push(obj);
    },
    [types.GETICONS](state, res) {
        state.todoList.icons = [];
        state.todoList.icons = res;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as dashboardUtil from "@/utils/dashboardUtil";
import * as todolistUtil from "@/utils/todolistUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    dashboard: {
        index: 0,
        curDateTime: new Date(),
        todolist: [],
        done: [],
        discard: [],
        things: [],
        tomorrowThings: [],
        totalThing: 0,
        totalTodolist: 0,
        totalDone: 0,
        totalDiscard: 0,
        workProgressStatus: [],
        summarys: [],
        consume: {},
        note: {},
        sport: {},
        getupTime: "未知",
        sleepTime: "未知",
        targets: [],
        targetReasonModal: false,
        targetReason: "",
        taskStatusFlag: true,
        todayStyle: "primary",
        tomorrowStyle: "ghost",
        hiddenStyle: "ghost",
        showStyle: "primary",
        allTargets: [],
        targetDetailModal: false,
        targetDetailList: [],
        targetStr: "",
        reasons: [],
        allTargetReasons: [],
        targetReasons: [],
        oriTargetReasons: [],
        isReload: 1,
    }
};

const getters = {
    dashboard(state) {
        return state.dashboard;
    }
};

const actions = {
    getSummaryByDate({ state, commit }, param) {
        let result = dashboardUtil.getSummaryByDate(
            param.thisObj,
            state.dashboard
        );
        commit(types.GETSUMMARYBYDATE, result);
    },
    addReason({ state, commit }, param) {
        let result = dashboardUtil.addReason(param.thisObj, state.dashboard);
        commit(types.ADDREASON, result);
    },
    changeTargetStatus({ state, commit }, param) {
        let result = dashboardUtil.changeTargetStatus(
            param.thisObj,
            state.dashboard,
            param.show
        );
    },
    updateProgressStatus({ state, commit }, param) {
        let result = dashboardUtil.updateProgressStatus(
            param.thisObj,
            state.dashboard,
            param.command
        );
        // commit(types.UPDATEPROGRESSSTATUS, result);
    },
    getTargetByDate({ state, commit }, param) {
        let result = dashboardUtil.getTargetByDate(
            param.thisObj,
            state.dashboard
        );
        commit(types.GETTARGETBYDATE, result);
    },
    getTodolistByDate({ state, commit }, param) {
        let result = dashboardUtil.getTodolistByDate(
            param.thisObj,
            state.dashboard,
            "curDate"
        );
        commit(types.GETTODOLISTBYDATE, result);
    },
    getTodolistByNextDate({ state, commit }, param) {
        let result = dashboardUtil.getTodolistByDate(
            param.thisObj,
            state.dashboard,
            "nextDay"
        );
        commit(types.GETTODOLISTBYNEXTDATE, result);
    },
    getTotalConsumeByDate({ state, commit }, param) {
        let result = dashboardUtil.getTotalConsumeByDate(
            param.thisObj,
            state.dashboard
        );
        commit(types.GETTOTALCONSUMEBYDATE, result);
    },
    getTotalNoteByDate({ state, commit }, param) {
        let result = dashboardUtil.getTotalNoteByDate(
            param.thisObj,
            state.dashboard
        );
        commit(types.GETTOTALNOTEBYDATE, result);
    },
    getTotalSportTimeByDate({ state, commit }, param) {
        let result = dashboardUtil.getTotalSportTimeByDate(
            param.thisObj,
            state.dashboard
        );
        commit(types.GETTOTALSPORTTIMEBYDATE, result);
    },
    getGetupTimeByDate({ state, commit }, param) {
        let result = dashboardUtil.getGetupTimeByDate(
            param.thisObj,
            state.dashboard
        );
        commit(types.GETGETUPTIMEBYDATE, result);
    },
    getSleepTimeByDate({ state, commit }, param) {
        let result = dashboardUtil.getSleepTimeByDate(
            param.thisObj,
            state.dashboard
        );
        commit(types.GETSLEEPTIMEBYDATE, result);
    },
    getWorkProgressByDate({ state, commit }, param) {
        let result = dashboardUtil.getWorkProgressByDate(
            param.thisObj,
            state.dashboard
        );
        commit(types.GETWORKPROGRESSBYDATE, result);
    },
    showTarget({ state, commit }, param) {
        commit(types.SHOWTARGET);
    },
    hiddenTarget({ state, commit }, param) {
        commit(types.HIDDENTARGET);
    },
    showTargetDetail({ state, commit }, param) {
        let resultList = dashboardUtil.showTargetDetail(
            param.thisObj,
            param.index,
            state.dashboard
        );
        commit(types.SHOWTARGETDETAIL, resultList);
    },
    queryAllReasons({ state, commit }, param) {
        let resultList = dashboardUtil.queryAllReasons(
            param.thisObj,
            state.dashboard
        );
        commit(types.QUERYALLREASONS, resultList);
    },
    queryTargetReasons({ state, commit }, param) {
        let resultList = dashboardUtil.queryTargetReasons(
            param.thisObj,
            state.dashboard,
            param.reasonIds
        );
        commit(types.QUERYTARGETREASONS, resultList);
    },
    reasonSelect({ state, commit }, param) {
        commit(types.REASONSELECT, param.reasonObj);
    },
    pushTargetReason({ state, commit }, param) {
        commit(types.PUSHTARGETREASON, param.reasonObj);
    },
    addTargetReason({ state, commit }, param) {
        let resultList = dashboardUtil.addTargetReason(
            param.thisObj,
            state.dashboard
        );
    },
    closeTargetReason({ state, commit }, param) {
        commit(types.CLOSETARGETREASON, param.index);
    },
    getTodolistByDateOfDashboard({state, commit}, param) {
        let curResult = dashboardUtil.getTodolistByDate(param.thisObj, state.dashboard, "curDate");
        let nextResult = dashboardUtil.getTodolistByDate(param.thisObj, state.dashboard, "nextDay");
        let resultList = curResult.concat(nextResult);
        commit(types.GETTODOLISTBYDATEOFDASHBOARD, resultList);
    },
    discardTask({ state,commit }, obj) {
        todolistUtil.addDiscardTask(obj.thisObj, obj.todolistId, obj.todolistDate, obj.discardStatus);
        commit(types.DISCARDTASK, obj.discardStatus);
    },
    deleteListTaskById({commit,state}, obj) {
        todolistUtil.deleteTaskById(obj.id, obj.thisObj, null);
        commit(types.DELETELISTTASKBYID);
    },
};

const mutations = {
    [types.DELETELISTTASKBYID](state) {
        let dashboard = state.dashboard;
        let dashboardObj = dashboard.things[dashboard.index];
        dashboardObj.discardStatus = 1;
    },
    [types.DISCARDTASK](state, discardStatus) {
        let dashboard = state.dashboard;
        let dashboardObj = dashboard.things[dashboard.index];
        if (discardStatus == 1) {
            dashboardObj.discardStatus = 0;
        } else {
            dashboardObj.discardStatus = 1;
        }
    },
    [types.GETTODOLISTBYDATEOFDASHBOARD](state, resultList) {
        let dashboard = state.dashboard;
        dashboard.todolist.splice(0, dashboard.todolist.length);
        dashboard.done.splice(0, dashboard.done.length);
        dashboard.discard.splice(0, dashboard.discard.length);
        dashboard.things.splice(0, dashboard.things.length);
        let totalThings = 0;
        resultList.forEach(element => {
            if (element.progressStatus == 0 || element.progressStatus == null) {
                dashboard.todolist.push(element);
            } else if (element.progressStatus == 1) {
                dashboard.done.push(element);
            } else if (element.progressStatus == -1) {
                dashboard.discard.push(element);
            }
        });
        dashboard.todolist.sort(util.sortByUrgencyOfThings);
        dashboard.things = dashboard.things.concat(
            dashboard.todolist,
            dashboard.done,
            dashboard.discard
        );
        dashboard.totalThing = resultList.length;
        dashboard.totalTodolist = dashboard.todolist.length;
        dashboard.totalDone = dashboard.done.length;
        dashboard.totalDiscard = dashboard.discard.length;
    },
    [types.CLOSETARGETREASON](state, index) {
        state.dashboard.targetReasons.splice(index, 1);
    },
    [types.PUSHTARGETREASON](state, reasonObj) {
        state.dashboard.targetReasons.push(reasonObj);
    },
    [types.REASONSELECT](state, reasonObj) {
        state.dashboard.targetReason = "";
        state.dashboard.targetReasons.push(reasonObj);
    },
    [types.QUERYTARGETREASONS](state, resultList) {
        state.dashboard.targetReasons.splice(
            0,
            state.dashboard.targetReasons.length
        );
        state.dashboard.targetReasons = resultList;

        state.dashboard.oriTargetReasons.splice(
            0,
            state.dashboard.oriTargetReasons.length
        );
        resultList.forEach(element => {
            state.dashboard.oriTargetReasons.push(element);
        });
    },
    [types.QUERYALLREASONS](state, resultList) {
        state.dashboard.allTargetReasons.splice(
            0,
            state.dashboard.allTargetReasons.length
        );
        state.dashboard.allTargetReasons = resultList;
    },
    [types.SHOWTARGETDETAIL](state, resultList) {
        state.dashboard.targetDetailList.splice(
            0,
            state.dashboard.targetDetailList.length
        );
        state.dashboard.targetDetailList = resultList;
        state.dashboard.targetDetailModal = true;
    },
    [types.SHOWTARGET](state) {
        state.dashboard.targets.splice(0, state.dashboard.targets.length);
        state.dashboard.allTargets.forEach(element => {
            if (element.show == 1) {
                state.dashboard.targets.push(element);
            }
        });
        state.dashboard.showStyle = "primary";
        state.dashboard.hiddenStyle = "ghost";
    },
    [types.HIDDENTARGET](state) {
        state.dashboard.targets.splice(0, state.dashboard.targets.length);
        state.dashboard.allTargets.forEach(element => {
            if (element.show == 0) {
                state.dashboard.targets.push(element);
            }
        });
        state.dashboard.showStyle = "ghost";
        state.dashboard.hiddenStyle = "primary";
    },
    [types.GETSUMMARYBYDATE](state, result) {
        state.dashboard.summarys.splice(0, state.dashboard.summarys.length);
        // 获取当天的工作进度
        state.dashboard.summarys = result;
    },
    [types.CHANGETARGETSTATUS](state, result) {
        let dashboard = state.dashboard;
        dashboard.targetModal = true;
        let targetObj = dashboard.targets[dashboard.index];
        if (null != targetObj.reason) {
            dashboard.targetReason = targetObj.reason;
        }
    },
    [types.ADDREASON](state, result) {
        state.dashboard.targetReason = "";
    },
    [types.GETTARGETBYDATE](state, result) {
        state.dashboard.allTargets.splice(0, state.dashboard.allTargets.length);
        state.dashboard.targets.splice(0, state.dashboard.targets.length);
        state.dashboard.allTargets = result;
        result.forEach(element => {
            if (element.show == 1 && state.dashboard.showStyle == "primary") {
                state.dashboard.targets.push(element);
            } else if (
                element.show == 0 &&
                state.dashboard.hiddenStyle == "primary"
            ) {
                state.dashboard.targets.push(element);
            }
        });
    },
    [types.GETWORKPROGRESSBYDATE](state, result) {
        state.dashboard.workProgressStatus.splice(
            0,
            state.dashboard.workProgressStatus.length
        );
        state.dashboard.workProgressStatus = result;
    },
    [types.GETSLEEPTIMEBYDATE](state, result) {
        if (result != null) {
            state.dashboard.sleepTime = result;
        } else {
            state.dashboard.sleepTime = "未知";
        }
    },
    [types.GETGETUPTIMEBYDATE](state, result) {
        if (result != null) {
            state.dashboard.getupTime = result;
        } else {
            state.dashboard.getupTime = "未知";
        }
    },
    [types.GETTOTALSPORTTIMEBYDATE](state, result) {
        state.dashboard.sport = result;
    },
    [types.GETTOTALNOTEBYDATE](state, result) {
        state.dashboard.note = result;
    },
    [types.GETTOTALCONSUMEBYDATE](state, result) {
        state.dashboard.consume = result;
    },
    [types.GETTODOLISTBYDATE](state, resultList) {
        let dashboard = state.dashboard;
        dashboard.todolist.splice(0, dashboard.todolist.length);
        dashboard.done.splice(0, dashboard.done.length);
        dashboard.discard.splice(0, dashboard.discard.length);
        dashboard.things.splice(0, dashboard.things.length);
        let totalThings = 0;
        resultList.forEach(element => {
            if (element.progressStatus == 0 || element.progressStatus == null) {
                dashboard.todolist.push(element);
            } else if (element.progressStatus == 1) {
                dashboard.done.push(element);
            } else if (element.progressStatus == -1) {
                dashboard.discard.push(element);
            }
        });
        dashboard.todolist.sort(util.sortByUrgencyOfThings);
        dashboard.things = dashboard.things.concat(
            dashboard.todolist,
            dashboard.done,
            dashboard.discard
        );
        dashboard.totalThing = resultList.length;
        dashboard.totalTodolist = dashboard.todolist.length;
        dashboard.totalDone = dashboard.done.length;
        dashboard.totalDiscard = dashboard.discard.length;
        dashboard.todayStyle = "primary";
        dashboard.tomorrowStyle = "ghost";
    },
    [types.GETTODOLISTBYNEXTDATE](state, resultList) {
        let dashboard = state.dashboard;
        dashboard.todolist.splice(0, dashboard.todolist.length);
        dashboard.done.splice(0, dashboard.done.length);
        dashboard.discard.splice(0, dashboard.discard.length);
        dashboard.things.splice(0, dashboard.things.length);
        resultList.forEach(element => {
            if (element.progressStatus == 0 || element.progressStatus == null) {
                dashboard.todolist.push(element);
            } else if (element.progressStatus == 1) {
                dashboard.done.push(element);
            } else if (element.progressStatus == -1) {
                dashboard.discard.push(element);
            }
        });
        dashboard.things = dashboard.things.concat(
            dashboard.todolist,
            dashboard.done,
            dashboard.discard
        );
        dashboard.totalThing = resultList.length;
        dashboard.totalTodolist = dashboard.todolist.length;
        dashboard.totalDone = dashboard.done.length;
        dashboard.totalDiscard = dashboard.discard.length;
        dashboard.todayStyle = "ghost";
        dashboard.tomorrowStyle = "primary";
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

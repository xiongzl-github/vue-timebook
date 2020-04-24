import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import * as timeMachineUtil from "@/utils/timeMachineUtil";
import path from "path";
import {
    remote
} from "electron";
import types from "@/store/types.js";
import {
    user
} from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();




export function queryDoingTarget(target, thisObj){
    // 查询此用户所拥有的所有tag
    let resultList = [];
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr = "SELECT * from tbl_target WHERE userId = " + userId + " AND status = 1 AND isCompleted = 0 AND pid = 0 AND planning = 1 ORDER BY priority asc";
    let stmt = sql.prepare(sqlStr);
    while (stmt.step()) {
        let targetObj = stmt.getAsObject();
        resultList.push(targetObj);
    }
    console.log("queryDoingTarget");
    console.log(resultList);
    sql.close();
    return resultList;
}

export function checkAddTargetMethodParam(theme, thisObj){
    if(theme.theme == ''){
        this.$Message.warning({
            content: "请输入一个主题!"
        });
        return false;
    } else if (theme.target == '') {
        this.$Message.warning({
            content: "请输入一个目标!"
        });
        return false;
    } else {
        return true;
    }
}

// 添加目标
export function addTarget(state, thisObj){
    let target = state.target;
    let period = state.period;
    let theme = state.theme;
    console.log(target);
    console.log(period);
    console.log(theme);
    // 第一步: 校验参数
    let result = checkAddTargetMethodParam(theme, thisObj);
    if (!result){
        return;
    }
    // 第二步: 提交 theme
    var sql = dbUtil.getSqlObj();
    result = exeAddTheme(theme, thisObj, sql);
    // 第三步: 提交 period
    if(result) {
        period.themeId = result;
        target.themeId = result;
        let flag = exeAddPeriod(period, thisObj, sql);
        target.childTargets.forEach(ele => {
            flag = exeAddTarget(ele, thisObj, sql);
        });
        if(flag) {
            exeAddPeriodTarget();
        }
    }
    dbUtil.writeDataToDB(sql);
    thisObj.$Message.success({
        content: "添加成功!"
    });
    return ;
}


export function exeAddTheme(theme, thisObj, sql) {
    // 插入一个目标
    let curDateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let updateTime = curDateTime;
    let sqlstr =
        "INSERT INTO tbl_theme(userId, theme, target, curDateTime, updateTime, syncStatus, status) VALUES (" +
        wsCache.get("user").id +
        ", '" +
        theme.theme +
        "', '" +
        theme.target +
        "', '" +
        curDateTime +
        "', '" +
        updateTime +
        "', " +
        theme.syncStatus +
        ", " +
        theme.status +
        ")";
    try {
        sql.exec(sqlstr);
        let result = getLastInsertRowId(sql);
        return result;
    } catch (error) {
        thisObj.$Message.error({
            content: "添加失败!"
        });
        return false;
    }
} 

export function exeAddPeriod(period, thisObj, sql) {
    // 插入一个目标
    let curDateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let updateTime = curDateTime;
    let deadline = '';
    if(target.deadline != '') {
        deadline = deadline = util.dateForMat("yyyy-MM-dd", new Date(period.deadline));
    }
    var sql = dbUtil.getSqlObj();
    let sqlstr =
        "INSERT INTO tbl_target(userId, period, planning, priority, availableTime, themeId, deadline, isCompleted,  curDateTime, updateTime, syncStatus, status) VALUES (" +
        wsCache.get("user").id +
        ", " +
        period.period +
        ", '" +
        period.planning +
        "', '" +
        period.priority +
        "', " +
        period.availableTime +
        ", " +
        period.themeId +
        ", '" +
        deadline +
        "', '" +
        period.isCompleted +
        "', '" +
        curDateTime +
        "', '" +
        updateTime +
        "', " +
        period.syncStatus +
        ", " +
        period.status +
        ")";
    try {
        sql.exec(sqlstr);
        return getLastInsertRowId(sql);
    } catch (error) {
        thisObj.$Message.error({
            content: "添加失败!"
        });
        return false;
    }
} 



export function exeAddTarget(target, thisObj, sql) {
    // 插入一个目标
    let curDateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let updateTime = curDateTime;
    var sql = dbUtil.getSqlObj();
    let sqlstr =
        "INSERT INTO tbl_target(userId, theme, target, period, planning, priority, availableTime, pid, consumeTime, deadline, isCompleted,  curDateTime, updateTime, syncStatus, status, show) VALUES (" +
        wsCache.get("user").id +
        ", '" +
        target.theme +
        "', '" +
        target.target +
        "', " +
        target.period +
        ", '" +
        target.planning +
        "', '" +
        target.priority +
        "', " +
        target.availableTime +
        ", " +
        target.pid +
        ", " +
        target.consumeTime +
        ", '" +
        deadline +
        "', '" +
        target.isCompleted +
        "', '" +
        curDateTime +
        "', '" +
        updateTime +
        "', " +
        target.syncStatus +
        ", " +
        target.status +
        ", " +
        target.show +
        ")";
    try {
        sql.exec(sqlstr);
        let result = getLastInsertRowId(sql);
        dbUtil.writeDataToDB(sql);
        return result;
    } catch (error) {
        thisObj.$Message.error({
            content: "添加失败!"
        });
        return false;
    }
} 

// 获取最近插入的rowid
export function getLastInsertRowId(sql) {
    let sqlStr = "select last_insert_rowid()";
    let tempRes = sql.exec(sqlStr);
    tempRes = tempRes[0].values[0][0];
    return tempRes;
}


// ===========================================================

// 根据targetId 查询target 
export function queryTargetById(targetId) {
    // 查询此用户所拥有的所有tag
    let resultList = [];
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr = "SELECT * from tbl_target WHERE userId = " + userId + " AND status = 1 AND id = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: targetId
    });
    stmt.step();
    let targetObj = stmt.getAsObject();
    sql.close();
    return targetObj;
}

// 更新目标
export function updateTarget(target, timeMachine, thisObj) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let tagIds = timeMachineUtil.getTagIdsByTagName(timeMachine.tags);
    let complete = target.complete;
    let endDate = "";
    if (target.endDate != null && target.endDate != "") {
        endDate = util.dateForMat("yyyy-MM-dd", target.endDate);
    }
    let sqlStr =
        "UPDATE tbl_target set updateTime = '" +
        updateTime +
        "', target = '" +
        target.target +
        "', projection = '" +
        target.projection +
        "', endDate = '" +
        endDate +
        "', tagIds = '" +
        tagIds +
        "', complete = '" +
        complete +
        "' WHERE id = " +
        target.id;
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({
            content: "更新成功!"
        });
    } catch (error) {
        thisObj.$Message.error({
            content: "更新失败!"
        });
    }
}

// 根据目标id删除一个目标
export function deleteTargetById(id, thisObj) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_target set updateTime = '" +
        updateTime +
        "', status = " +
        0 +
        " WHERE id = " +
        id;
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({
            content: "删除成功!"
        });
    } catch (error) {
        thisObj.$Message.error({
            content: "删除失败!"
        });
    }
}

export function queryTargets(status) {
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let progress = 0;
    let curDate = new Date(util.dateForMat("yyyy-MM-dd", new Date()));
    let endDate = {};
    let realEndDate = {};
    let dayNum = 0;
    let absDayNum = 0;
    let sqlStr =
        "SELECT	a.id AS id,	a.target AS target, a.complete as complete, a.projection as projection, a.tagIds as tagIds, a.reasonIds as reasonIds, SUBSTR(a.target, 1, 10) as briefTarget, 	a.realEndDate AS realEndDate,	a.endDate AS endDate,	a.show AS show,		sum(c.progress) AS sumProgress, count(*) AS num FROM	(		SELECT			*		FROM			tbl_target		WHERE			userId = " +
        userId +
        "		AND status = 1	) AS a LEFT JOIN (	SELECT		*	FROM		tbl_todolist	WHERE		userId = " +
        userId +
        "	AND status = 1) AS b ON a.id = b.targetId LEFT JOIN (	SELECT		max(progress) as progress, todolistId	FROM		tbl_timeMachine	WHERE		userId = " +
        userId +
        "	AND status = 1 GROUP by todolistId) AS c ON b.id = c.todolistId GROUP BY (a.id) order by a.curDateTime desc";
    let stmt = sql.prepare(sqlStr);
    let resultList = [];
    let targetObj = {};
    let tags = [];
    while (stmt.step()) {
        targetObj = stmt.getAsObject();
        progress = parseInt(
            (targetObj.sumProgress / (targetObj.num * 100)) * 100
        );
        endDate = new Date(targetObj.endDate);
        dayNum = util.TimeCap(curDate, endDate);
        if (dayNum < 0) {
            absDayNum = -dayNum;
        }
        if (targetObj.id != null) {
            tags = timeMachineUtil.getTagsByIds(targetObj.tagIds);
            targetObj.tags = tags;
        }
        if (status == 1 && targetObj.complete == '0') {
            targetObj.progress = progress;
            targetObj.dayNum = dayNum;
            targetObj.absDayNum = absDayNum;
            resultList.push(targetObj);
        } else if (status == 0 && targetObj.complete == '1') {
            targetObj.progress = progress;
            targetObj.dayNum = dayNum;
            targetObj.absDayNum = absDayNum;
            resultList.push(targetObj);
        }
    }
    sql.close();
    return resultList;
}

// 查询所有的目标
export function queryAllTarget(target, thisObj, status) {
    // 查询此用户所拥有的所有tag
    let resultList = [];
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT a.*, SUBSTR(a.target, 1, 20) as briefTarget, b.id AS todolistId, c.id AS timeMachineId, c.progress AS progress FROM (SELECT * from tbl_target WHERE status = 1 AND userId = " +
        userId +
        ") AS a LEFT JOIN (SELECT * FROM tbl_todolist WHERE status = 1 AND userId = " +
        userId +
        ") AS b ON a.id = b.targetId LEFT JOIN (SELECT * FROM tbl_timeMachine WHERE status = 1 AND userId = " +
        userId +
        ") AS c ON b.id = c.id order by a.projection asc";
    let stmt = sql.prepare(sqlStr);
    let targetObj = {};
    let tags = [];
    while (stmt.step()) {
        targetObj = stmt.getAsObject();
        if (
            status == 1 &&
            (targetObj.progress == null || targetObj.progress != 100)
        ) {
            tags = timeMachineUtil.getTagsByIds(targetObj.tagIds);
            targetObj.tags = tags;
            resultList.push(targetObj);
        } else if (
            status == 0 &&
            (targetObj.progress != null && targetObj.progress == 100)
        ) {
            tags = timeMachineUtil.getTagsByIds(targetObj.tagIds);
            targetObj.tags = tags;
            resultList.push(targetObj);
        }
    }
    sql.close();
    return resultList;
}

// 提交目标
export function submitTarget(target, timeMachine, thisObj) {
    // 校验提交数据
    let result = checkSubmitTargetMethodParam(thisObj, timeMachine, target);
    if (!result) {
        // 插入一个目标
        let curDateTime = target.curDateTime.format("yyyy-MM-dd hh:mm:ss");
        let targetStr = target.target;
        // 根据tagName获取tagId
        let tagIds = timeMachineUtil.getTagIdsByTagName(timeMachine.tags);
        let updateTime = curDateTime;
        let syncStatus = target.syncStatus;
        let status = target.status;
        let endDate = "";
        if (target.endDate != null && target.endDate != "") {
            endDate = util.dateForMat("yyyy-MM-dd", new Date(target.endDate));
        }
        let realEndDate = endDate;
        var sql = dbUtil.getSqlObj();
        let sqlstr =
            "INSERT INTO tbl_target(userId, tagIds, target, projection, complete,  curDateTime, updateTime, endDate, realEndDate, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", '" +
            tagIds +
            "', '" +
            targetStr +
            "', '" +
            target.projection +
            "', '" +
            target.complete +
            "', '" +
            curDateTime +
            "', '" +
            updateTime +
            "', '" +
            endDate +
            "', '" +
            realEndDate +
            "', " +
            syncStatus +
            ", " +
            status +
            ")";
        try {
            sql.exec(sqlstr);
            dbUtil.writeDataToDB(sql);
            thisObj.$Message.success({
                content: "添加成功!"
            });
            return true;
        } catch (error) {
            thisObj.$Message.error({
                content: "添加失败!"
            });
            return false;
        }
    } else {
        return result;
    }
}

// 校验submitTarget方法的参数
export function checkSubmitTargetMethodParam(thisObj, timeMachine, target) {
    // 校验提交数据
    let result = true;
    let targetStr = target.target;
    let tagIds = timeMachine.tags;
    let endDate = target.endDate;
    let projection = target.projection;
    if ("" == targetStr) {
        thisObj.$Message.warning({
            content: "请输入一个目标!"
        });
    } else if ("" == projection) {
        thisObj.$Message.warning({
            content: "请输入一个规划"
        });
    } else if ("" == tagIds) {
        thisObj.$Message.warning({
            content: "请输入一个标签"
        });
    } else {
        result = false;
    }
    return result;
}
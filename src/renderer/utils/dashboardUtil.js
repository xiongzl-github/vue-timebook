import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import * as timeMachineUtil from "@/utils/timeMachineUtil";
import * as todolistUtil from "@/utils/todolistUtil";
import path from "path";
import {
    remote
} from "electron";
import types from "../store/types";
import {
    user
} from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
import {
    Level
} from "chalk";
var wsCache = new WebStorageCache();

// 添加targetReason
export function addTargetReason(thisObj, dashboard) {
    let targetObj = dashboard.targets[dashboard.index];
    let id = targetObj.id;
    let reasonIds = targetObj.reasonIds;
    let reasonIdsStr = "";
    for (let index = 0; index < dashboard.targetReasons.length; index++) {
        let element = dashboard.targetReasons[index];
        if (index == dashboard.targetReasons.length - 1) {
            reasonIdsStr += element.id;
        } else {
            reasonIdsStr += element.id + ",";
        }
    }
    if (reasonIdsStr == reasonIds) {
        return;
    }
    dashboard.reasonIdsStr = reasonIdsStr;
    let sql = dbUtil.getSqlObj();
    try {
        updateReasonLevel(sql, dashboard, thisObj);
        updateTargetReasonIds(sql, dashboard, thisObj);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({
            content: "添加成功!"
        });
    } catch (error) {
        thisObj.$Message.error({
            content: "添加失败!"
        });
    }
}

// 更新 reason 的level
export function updateReasonLevel(sql, dashboard, thisObj) {
    let flag = false;
    if (null == sql) {
        flag = true;
        sql = dbUtil.getSqlObj();
    }
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr = "";
    let level = 0;
    let id = 0;
    let mark = false;
    dashboard.targetReasons.forEach(element => {
        dashboard.oriTargetReasons.forEach(ele => {
            if (element.id == ele.id) {
                mark = true;
            }
        });
        if (!mark) {
            level = element.level + 1;
            id = element.id;
            sqlStr =
                "UPDATE tbl_reason set updateTime = '" +
                updateTime +
                "', level = " +
                level +
                " WHERE id = " +
                id +
                ";";
            sql.run(sqlStr);
        }
        mark = false;
    });
    dashboard.oriTargetReasons.forEach(ele => {
        dashboard.targetReasons.forEach(element => {
            if (ele.id == element.id) {
                mark = true;
            }
        });
        if (!mark) {
            level = ele.level - 1;
            id = ele.id;
            sqlStr =
                "UPDATE tbl_reason set updateTime = '" +
                updateTime +
                "', level = " +
                level +
                " WHERE id = " +
                id +
                ";";
            sql.run(sqlStr);
        }
        mark = false;
    });
    if (flag) {
        try {
            dbUtil.writeDataToDB(sql);
            thisObj.$Message.success({
                content: "添加成功!"
            });
        } catch (error) {
            thisObj.$Message.error({
                content: "添加失败!"
            });
        }
    }
}
// 更新 target 的reasonIds
export function updateTargetReasonIds(sql, dashboard, thisObj) {
    let flag = false;
    if (null == sql) {
        flag = true;
        sql = dbUtil.getSqlObj();
    }
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let targetObj = dashboard.targets[dashboard.index];
    let id = targetObj.id;
    let sqlStr =
        "UPDATE tbl_target set updateTime = '" +
        updateTime +
        "', reasonIds = '" +
        dashboard.reasonIdsStr +
        "' WHERE id = " +
        id +
        ";";

    if (flag) {
        try {
            sql.run(sqlStr);
            dbUtil.writeDataToDB(sql);
            thisObj.$Message.success({
                content: "添加成功!"
            });
        } catch (error) {
            thisObj.$Message.error({
                content: "添加失败!"
            });
        }
    } else {
        sql.run(sqlStr);
    }
}

// 查询目标的reason
export function queryTargetReasons(thisObj, dashboard, reasonIds) {
    let reasonArr = [];
    if (reasonIds.length > 2) {
        reasonArr = reasonIds.split(",");
    } else {
        reasonArr.push(reasonIds);
    }
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr = "";
    let resultList = [];
    let stmt = {};
    reasonArr.forEach(reasonId => {
        sqlStr = "select * from tbl_reason WHERE id = $a;";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: reasonId
        });
        stmt.step();
        resultList.push(stmt.getAsObject());
    });
    sql.close();
    return resultList;
}

// 查询所有的reason
export function queryAllReasons(thisObj, dashboard) {
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "select a.*, a.reason as value from tbl_reason as a WHERE status = 1 and userId = " +
        userId +
        " order by level desc;";
    let stmt = sql.prepare(sqlStr);
    let resultList = [];
    while (stmt.step()) {
        resultList.push(stmt.getAsObject());
    }
    sql.close();
    return resultList;
}

// 获取summary
export function getSummaryByDate(thisObj, dashboard) {
    let resultList = [];
    // 获取当天的工作进度
    let result = getWorkProgressByDate(thisObj, dashboard);
    if (result.length > 0) {
        resultList = resultList.concat(result);
    }
    // 获取当天的累计消费总额
    result = getTotalConsumeByDate(thisObj, dashboard);
    resultList.push(result);
    // 获取当天的笔记总数
    result = getTotalNoteByDate(thisObj, dashboard);
    resultList.push(result);
    // 获取当天的运动时长
    result = getTotalSportTimeByDate(thisObj, dashboard);
    resultList.push(result);
    // 获取当天的早起时间
    result = getGetupTimeByDate(thisObj, dashboard);
    resultList.push(result);
    // 获取当天的晚睡时间
    result = getSleepTimeByDate(thisObj, dashboard);
    resultList.push(result);
    return resultList;
}

// 添加原因
export function addReason(thisObj, dashboard) {
    if (null == dashboard.targetReason || "" == dashboard.targetReason) {
        thisObj.$Message.warning({
            content: "请输入一个原因!"
        });
        return;
    }
    // 插入一个目标
    let curDateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let updateTime = curDateTime;
    let syncStatus = 0;
    let status = 1;
    let level = 0;
    var sql = dbUtil.getSqlObj();
    let sqlstr =
        "INSERT INTO tbl_reason(userId,  curDateTime, updateTime, reason, syncStatus, status, level) VALUES (" +
        wsCache.get("user").id +
        ", '" +
        curDateTime +
        "', '" +
        updateTime +
        "', '" +
        dashboard.targetReason +
        "', " +
        syncStatus +
        ", " +
        status +
        ", " +
        level +
        ")";
    try {
        sql.exec(sqlstr);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({
            content: "添加成功!"
        });
    } catch (error) {
        thisObj.$Message.error({
            content: "添加失败!"
        });
    }
}

// 修改目标完成情况
export function changeTargetStatus(thisObj, dashboard, show) {
    let targetObj = dashboard.targets[dashboard.index];
    let id = targetObj.id;
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_target set updateTime = '" +
        updateTime +
        "', show = " +
        show +
        " WHERE id = " +
        id +
        ";";
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
    } catch (error) {
        thisObj.$Message.error({
            content: "修改失败!"
        });
    }
}

// 插入一条目标详情记录
export function addTargetDetail(targetObj, dashboard, thisObj, completeStatus) {
    // 插入一个目标
    let curDateTime = dashboard.curDateTime.format("yyyy-MM-dd hh:mm:ss");
    let updateTime = curDateTime;
    let syncStatus = 0;
    let status = 1;
    var sql = dbUtil.getSqlObj();
    let sqlstr =
        "INSERT INTO tbl_targetDetail(userId, targetId,  curDateTime, updateTime, reason, syncStatus, status, completeStatus) VALUES (" +
        wsCache.get("user").id +
        ", " +
        targetObj.id +
        ", '" +
        curDateTime +
        "', '" +
        updateTime +
        "', '" +
        dashboard.targetReason +
        "', " +
        syncStatus +
        ", " +
        status +
        ", " +
        completeStatus +
        ")";
    try {
        sql.exec(sqlstr);
        dbUtil.writeDataToDB(sql);
    } catch (error) {
        thisObj.$Message.error({
            content: "修改失败!"
        });
    }
}

// 更新一条目标详情记录
export function updateTargetDetail(
    targetDetailId,
    completeStatus,
    thisObj,
    dashboard
) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_targetDetail set updateTime = '" +
        updateTime +
        "', completeStatus = " +
        completeStatus +
        ", reason = '" +
        dashboard.targetReason +
        "' WHERE id = " +
        targetDetailId;
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
    } catch (error) {
        thisObj.$Message.error({
            content: "修改失败!"
        });
    }
}

export function showTargetDetail(thisObj, index, dashboard) {
    let date = util.dateForMat("yyyy-MM-dd", new Date(dashboard.curDateTime));
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let targetId = dashboard.targets[index].id;
    let targetStr = dashboard.targets[index].target;
    dashboard.targetStr = targetStr;
    let sqlStr =
        "SELECT	a.id AS id,	a.target AS target, SUBSTR(a.target, 1, 30) as briefTarget, 	a.realEndDate AS realEndDate,	a.endDate AS endDate,	a.show AS show,		b.listName as listName, coalesce(c.progress, 0) AS progress, d.dataUrl FROM	(		SELECT			*		FROM			tbl_target		WHERE			userId = " +
        userId +
        "		AND status = 1 AND id = $a	) AS a LEFT JOIN (	SELECT		*	FROM		tbl_todolist	WHERE		userId = " +
        userId +
        "	AND status = 1) AS b ON a.id = b.targetId LEFT JOIN (	SELECT		max(progress) as progress, todolistId	FROM		tbl_timeMachine	WHERE		userId = " +
        userId +
        "	AND status = 1 GROUP by todolistId) AS c ON b.id = c.todolistId LEFT JOIN (select * from tbl_category WHERE userId = " +
        userId +
        ") as d ON d.id = b.categoryId order by a.curDateTime desc";
    let stmt = sql.prepare(sqlStr);
    let resultList = [];
    let targetObj = {};
    let tags = [];
    stmt.bind({
        $a: targetId
    });
    while (stmt.step()) {
        targetObj = stmt.getAsObject();
        resultList.push(targetObj);
    }
    sql.close();
    return resultList;
}

// 获取目标详情
export function getTargetByDate(thisObj, dashboard) {
    let date = util.dateForMat("yyyy-MM-dd", new Date(dashboard.curDateTime));
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let progress = 0;
    let completeStatus = 1;
    let curDate = new Date(util.dateForMat("yyyy-MM-dd", new Date()));
    let endDate = {};
    let realEndDate = {};
    let dayNum = 0;
    let absDayNum = 0;
    let sqlStr =
        "SELECT	a.id AS id,	a.target AS target, a.tagIds as tagIds, a.reasonIds as reasonIds, SUBSTR(a.target, 1, 10) as briefTarget, 	a.realEndDate AS realEndDate,	a.endDate AS endDate,	a.show AS show,		sum(c.progress) AS sumProgress, count(*) AS num FROM	(		SELECT			*		FROM			tbl_target		WHERE			userId = " +
        userId +
        "		AND status = 1 AND projection = 1	) AS a LEFT JOIN (	SELECT		*	FROM		tbl_todolist	WHERE		userId = " +
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
        if (progress == 100) {
            completeStatus = 1;
        } else {
            if (curDate.getTime() <= endDate.getTime()) {
                completeStatus = 2;
            } else {
                completeStatus = 3;
            }
        }
        dayNum = util.TimeCap(curDate, endDate);
        if (dayNum < 0) {
            absDayNum = -dayNum;
        }
        if (targetObj.id != null) {
            tags = timeMachineUtil.getTagsByIds(targetObj.tagIds);
            targetObj.tags = tags;
        }
        targetObj.progress = progress;
        targetObj.dayNum = dayNum;
        targetObj.absDayNum = absDayNum;
        targetObj.completeStatus = completeStatus;
        resultList.push(targetObj);
    }
    sql.close();
    return resultList;
}

// 更新任务进度状态
export function updateProgressStatus(thisObj, dashboard, command) {
    let index = dashboard.index;
    let timeMachineId = dashboard.things[index].timeMachineId;
    let progress = 0;
    let progressStatus = 0;
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    if (command == "todo") {
        progressStatus = 0;
        progress = 80;
    } else if (command == "discard") {
        progressStatus = -1;
        progress = 50;
    } else if (command == "done") {
        progressStatus = 1;
        progress = 100;
    }
    let sqlStr =
        "UPDATE tbl_timeMachine set updateTime = '" +
        updateTime +
        "', progress = " +
        progress +
        ", progressStatus = " +
        progressStatus +
        " WHERE id = " +
        timeMachineId;
    sql.run(sqlStr);
    dbUtil.writeDataToDB(sql);
}

// 获取todolist详情
export function getTodolistByDate(thisObj, dashboard, type) {
    let result = [];
    let tempObj = {};
    let category = {};
    let obj = {};
    let resultObj = {};
    let sql = dbUtil.getSqlObj();
    let date = util.dateForMat("yyyy-MM-dd", new Date(dashboard.curDateTime));
    if (type == "nextDay") {
        date = util.dateForMatOfNextDay(
            "yyyy-MM-dd",
            new Date(dashboard.curDateTime)
        );
    }
    let dateObj = new Date(date);
    let stmt = {};
    let sqlStr = "";
    let endTimeNum = 0;
    let userId = wsCache.get("user").id;
    // 第一种情况, 不重复
    sqlStr =
        "SELECT 	d.categoryName || '-' || c.categoryName AS categoryName, 	b.id AS timeMachineId, 	c.iconName, c.dataUrl, 	SUBSTR(a.listName, 1, 14) AS brifListName, 	a.listName, a.repeatType, 	b.progressStatus, 	b.todolistId, 	a.difficult, 	a.heart, 	a.importLevel, 	a.forecastTime, 	a.scheduleTime, 	a.curDateTime, 	a.id, a.endDate, max(b.progress) as progress FROM 	tbl_todolist AS a LEFT JOIN (SELECT * FROM tbl_timeMachine WHERE (status = 1 OR status ISNULL) AND curDateTime LIKE $f) AS b ON a.id = b.todolistId LEFT JOIN tbl_category AS c ON a.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE a.userId = " +
        userId +
        " AND a.status = 1  AND a.repeatType = 0 AND a.curDateTime LIKE $a AND SUBSTR(a.curDateTime, 1, 10) <= $b GROUP BY (a.id)";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + date + "%",
            $b: date,
            $c: date,
            $f: "%" + date + "%"
        });
        while (stmt.step()) {
            resultObj = stmt.getAsObject();
            if (resultObj.id != null) {
                if (resultObj.endDate != "" && resultObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(resultObj.endDate)
                    );
                    resultObj.endTimeNum = endTimeNum;
                }
                resultObj.dateType = type;
                result.push(resultObj);
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常!"
        });
    }

    // 第二种情况, 每一天
    sqlStr =
        "SELECT 	d.categoryName || '-' || c.categoryName AS categoryName, 	b.id AS timeMachineId, 	c.iconName, c.dataUrl, 	SUBSTR(a.listName, 1, 14) AS brifListName, 	a.listName, 	b.progress, 	b.progressStatus, 	b.todolistId, 	a.difficult, 	a.heart, 	a.importLevel, 	a.forecastTime, 	a.scheduleTime, 	a.curDateTime, 	a.id,  a.repeatType, a.endDate FROM 	tbl_todolist AS a LEFT JOIN (SELECT * FROM tbl_timeMachine WHERE (status = 1 OR status ISNULL) AND curDateTime LIKE $f) AS b ON a.id = b.todolistId LEFT JOIN tbl_category AS c ON a.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE a.userId = " +
        userId +
        " AND 	(		a.status = 1 		OR ( 			a.status = 0 			AND SUBSTR(a.updateTime, 1, 10) > $c 		) 	) AND a.repeatType = 1 AND SUBSTR(a.curDateTime, 1, 10) <= $b";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date,
            $f: "%" + date + "%"
        });
        while (stmt.step()) {
            resultObj = stmt.getAsObject();
            if (resultObj.id != null) {
                if (resultObj.endDate != "" && resultObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(resultObj.endDate)
                    );
                    resultObj.endTimeNum = endTimeNum;
                }
                resultObj.dateType = type;
                result.push(resultObj);
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常!"
        });
    }
    // 第三种情况 每一周
    sqlStr =
        "SELECT 	d.categoryName || '-' || c.categoryName AS categoryName, 	b.id AS timeMachineId, 	c.iconName, c.dataUrl, 	SUBSTR(a.listName, 1, 14) AS brifListName, 	a.listName, 	b.progress, 	b.progressStatus, 	b.todolistId, 	a.difficult, 	a.heart, 	a.importLevel, 	a.forecastTime, 	a.scheduleTime, 	a.curDateTime, 	a.id, a.endDate,  a.repeatType, a.remind FROM 	tbl_todolist AS a LEFT JOIN (SELECT * FROM tbl_timeMachine WHERE (status = 1 OR status ISNULL) AND curDateTime LIKE $f) AS b ON a.id = b.todolistId LEFT JOIN tbl_category AS c ON a.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE a.userId = " +
        userId +
        " AND	(		a.status = 1 		OR ( 			a.status = 0 			AND SUBSTR(a.updateTime, 1, 10) > $c 		) 	) AND a.repeatType = 2 AND SUBSTR(a.curDateTime, 1, 10) <= $b";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date,
            $f: "%" + date + "%"
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                // 获取提醒日期
                let remindDate = new Date(
                    util.dateForMat("yyyy-MM-dd", new Date(tempObj.endDate))
                );
                if (remindDate.getDay() == dateObj.getDay()) {
                    tempObj.dateType = type;
                    result.push(tempObj);
                }
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常!"
        });
    }
    // 第四种情况 每个月
    sqlStr =
        "SELECT 	d.categoryName || '-' || c.categoryName AS categoryName, 	b.id AS timeMachineId, 	c.iconName, c.dataUrl, 	SUBSTR(a.listName, 1, 14) AS brifListName, 	a.listName, 	b.progress, 	b.progressStatus, 	b.todolistId, 	a.difficult, 	a.heart, 	a.importLevel, 	a.forecastTime, 	a.scheduleTime, 	a.curDateTime, a.remind, 	a.id,  a.repeatType, a.endDate FROM 	tbl_todolist AS a LEFT JOIN (SELECT * FROM tbl_timeMachine WHERE (status = 1 OR status ISNULL) AND curDateTime LIKE $f) AS b ON a.id = b.todolistId LEFT JOIN tbl_category AS c ON a.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE a.userId = " +
        userId +
        " AND 	(		a.status = 1 		OR ( 			a.status = 0 			AND SUBSTR(a.updateTime, 1, 10) > $c 		) 	) AND a.repeatType = 3 AND SUBSTR(a.curDateTime, 1, 10) <= $b";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date,
            $f: "%" + date + "%"
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                // 获取提醒日期
                let remindDate = new Date(
                    util.dateForMat("yyyy-MM-dd", new Date(tempObj.endDate))
                );
                if (remindDate.getDate() == dateObj.getDate()) {
                    tempObj.dateType = type;
                    result.push(tempObj);
                }
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常!"
        });
    }
    // 第五种情况 每一年
    sqlStr =
        "SELECT 	d.categoryName || '-' || c.categoryName AS categoryName, 	b.id AS timeMachineId, 	c.iconName, c.dataUrl, 	SUBSTR(a.listName, 1, 14) AS brifListName, 	b.progress, 	b.progressStatus, 	b.todolistId, 	a.* FROM 	tbl_todolist AS a LEFT JOIN (SELECT * FROM tbl_timeMachine WHERE (status = 1 OR status ISNULL) AND curDateTime LIKE $f) AS b ON a.id = b.todolistId LEFT JOIN tbl_category AS c ON a.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE a.userId = " +
        userId +
        " AND 	(		a.status = 1 		OR ( 			a.status = 0 			AND SUBSTR(a.updateTime, 1, 10) > $c 		) 	) AND a.repeatType = 4 AND SUBSTR(a.curDateTime, 1, 10) <= $b";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date,
            $f: "%" + date + "%"
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                if (
                    date.substring(5) ==
                    tempObj.endDate.split(" ")[0].substring(5)
                ) {
                    tempObj.dateType = type;
                    result.push(tempObj);
                }
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常!"
        });
    }
    // 第六种情况 每一天(节假日除外)
    sqlStr =
        "SELECT 	d.categoryName || '-' || c.categoryName AS categoryName, 	b.id AS timeMachineId, 	c.iconName, c.dataUrl, 	SUBSTR(a.listName, 1, 14) AS brifListName, 	a.listName, 	b.progress, 	b.progressStatus, 	b.todolistId, 	a.difficult, 	a.heart, 	a.importLevel, 	a.forecastTime, 	a.scheduleTime, 	a.curDateTime, 	a.id,  a.repeatType, a.endDate FROM 	tbl_todolist AS a LEFT JOIN (SELECT * FROM tbl_timeMachine WHERE (status = 1 OR status ISNULL) AND curDateTime LIKE $f) AS b ON a.id = b.todolistId LEFT JOIN tbl_category AS c ON a.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE a.userId = " +
        userId +
        " AND 	(		a.status = 1 		OR ( 			a.status = 0 			AND SUBSTR(a.updateTime, 1, 10) > $c 		) 	) AND a.repeatType = 5 AND SUBSTR(a.curDateTime, 1, 10) <= $b";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date,
            $f: "%" + date + "%"
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                if (dateObj.getDay() != 6 && dateObj.getDay() != 0) {
                    tempObj.dateType = type;
                    result.push(tempObj);
                }
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常!"
        });
    }
    // 第七种情况 每一天(工作日除外)
    sqlStr =
        "SELECT 	d.categoryName || '-' || c.categoryName AS categoryName, 	b.id AS timeMachineId, 	c.iconName, c.dataUrl, 	SUBSTR(a.listName, 1, 14) AS brifListName, 	a.listName, 	b.progress, 	b.progressStatus, 	b.todolistId, 	a.difficult, 	a.heart, 	a.importLevel, 	a.forecastTime, 	a.scheduleTime, 	a.curDateTime, 	a.id,  a.repeatType, a.endDate FROM 	tbl_todolist AS a LEFT JOIN (SELECT * FROM tbl_timeMachine WHERE (status = 1 OR status ISNULL) AND curDateTime LIKE $f) AS b ON a.id = b.todolistId LEFT JOIN tbl_category AS c ON a.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE a.userId = " +
        userId +
        " AND 	(		a.status = 1 		OR ( 			a.status = 0 			AND SUBSTR(a.updateTime, 1, 10) > $c 		) 	) AND a.repeatType = 6 AND SUBSTR(a.curDateTime, 1, 10) <= $b";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date,
            $f: "%" + date + "%"
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                if (dateObj.getDay() == 6 || dateObj.getDay() == 0) {
                    tempObj.dateType = type;
                    result.push(tempObj);
                }
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "7系统异常!"
        });
    }
    // 第8种情况 (获取所有未完成的任务)
    let flag = false;
    let temp = {};
    sqlStr =
        "SELECT 	d.categoryName || '-' || c.categoryName AS categoryName, 	a.id AS timeMachineId, 	c.iconName, c.dataUrl, 	SUBSTR(b.listName, 1, 14) AS brifListName, 	a.progress, 	a.progressStatus, 	a.todolistId, 	b.* FROM  	 tbl_timeMachine AS a LEFT JOIN (select * from tbl_todolist WHERE status = 1 and userId = " +
        userId +
        " AND SUBSTR(curDateTime, 1, 10) <= $e ) AS b ON b.id = a.todolistId LEFT JOIN tbl_category AS c ON b.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE 	a.status = 1 AND a.userId = " +
        userId +
        "  GROUP BY  	a.todolistId HAVING 	max(a.progress) AND a.progressStatus = 0  AND (b.repeatType = 0 or b.repeatType = 2 or b.repeatType = 3 or b.repeatType = 4)";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $e: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                for (let index = 0; index < result.length; index++) {
                    temp = result[index];
                    if (temp.id == tempObj.id) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    tempObj.dateType = type;
                    result.push(tempObj);
                }
                flag = false;
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "8系统异常!"
        });
    }

    // 第九种获取未完成的加心任务
    sqlStr =
        "SELECT d.categoryName || '-' || c.categoryName AS categoryName,    b.id AS timeMachineId,  c.iconName, c.dataUrl,  SUBSTR(a.listName, 1, 14) AS brifListName,  b.progress,     b.progressStatus,   b.todolistId,   a.* FROM	(		SELECT			*		FROM			tbl_todolist		WHERE			userId = " +
        userId +
        "		AND status = 1		AND heart = 1 AND SUBSTR(curDateTime, 1, 10) < $e	) AS a LEFT JOIN (	SELECT		*	FROM		tbl_timeMachine	WHERE		userId = " +
        userId +
        "	AND status = 1) AS b ON a.id = b.todolistId LEFT JOIN tbl_category AS c ON a.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE	b.progress ISNULL ORDER BY a.importLevel ASC";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $e: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                tempObj.dateType = type;
                result.push(tempObj);
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "9系统异常!"
        });
    }

    //获取今天延期完成的任务
    sqlStr =
        "SELECT 	d.categoryName || '-' || c.categoryName AS categoryName, 	a.id AS timeMachineId, 	c.iconName, 	c.dataUrl, 	SUBSTR(b.listName, 1, 14) AS brifListName, 	a.progress, 	a.progressStatus, 	a.todolistId, 	b.* FROM 	(SELECT * from tbl_timeMachine  WHERE  	status = 1 AND progress = 100  AND progressStatus = 1  AND SUBSTR(curDateTime, 1, 10) = $a  AND userId = 1) AS a LEFT JOIN ( 	SELECT 		* 	FROM 		tbl_todolist 	WHERE 		status = 1 	AND userId = " + userId + " 	AND SUBSTR(curDateTime, 1, 10) <= $b ) AS b ON b.id = a.todolistId  LEFT JOIN tbl_category AS c ON b.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id  WHERE SUBSTR(a.curDateTime, 1, 10) > SUBSTR(b.curDateTime, 1, 10) AND b.repeatType = 0 ";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: date,
            $b: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                tempObj.dateType = type;
                result.push(tempObj);
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============10==================!"
        });
    }

    // 设置时间的完成状态
    result.forEach(ele => {
        if (ele.timeMachineId != null || ele.timeMachineId != "") {
            sqlStr =
                "SELECT 	* FROM 	tbl_timeMachine WHERE userId = " +
                userId +
                " AND	todolistId = $a AND status = 1 AND curDateTime LIKE $f GROUP BY 	todolistId HAVING 	max(progress) ";
            stmt = sql.prepare(sqlStr);
            stmt.bind({
                $f: "%" + date + "%"
            });
            while (stmt.step()) {
                tempObj = stmt.getAsObject();
                ele.timeMachineId = tempObj.id;
                ele.progress = tempObj.progress;
                ele.progressStatus = tempObj.progressStatus;
                ele.todolistId = tempObj.todolistId;
            }
        }
    });
    // 查询是否有废弃任务
    let discardTasks = todolistUtil.getDiscardTaskByTodolistDate(date);
    let sign = false;
    for (let i = 0; i < result.length; i++) {
        let id = result[i].id;
        for (let j = 0; j < discardTasks.length; j++) {
            let listId = discardTasks[j].todolistId;
            if (id == listId) {
                result[i].discardStatus = 1;
                result[i].discardTaskId = discardTasks[j].id;
                sign = true;
                break;
            }
        }
        if (!sign) {
            result[i].discardStatus = 0;
            result[i].discardTaskId = null;
        } else {
            sign = false;
        }
    }
    sql.close();
    return result;
}

// 获取当天的消费总额
export function getTotalConsumeByDate(thisObj, dashboard) {
    let date = util.dateForMat("yyyy-MM-dd", new Date(dashboard.curDateTime));
    let sql = dbUtil.getSqlObj();
    let categoryName = "购物";
    let consume = 0;
    let categoryObj = getCategoryIdByName(sql, categoryName);
    let iconName = categoryObj.iconName;
    let dataUrl = categoryObj.dataUrl;
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT 	sum(consume) AS consume FROM 	tbl_timeMachine AS a WHERE 	a.status = 1 AND a.userId = " +
        userId +
        "  AND a.consume != 0 AND SUBSTR(a.curDateTime, 1, 10) = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: date
    });
    stmt.step();
    if (stmt.getAsObject().consume != null) {
        consume = stmt.getAsObject().consume;
    }
    let result = {
        iconName: iconName,
        consume: consume,
        group: categoryName,
        dataUrl: dataUrl
    };
    sql.close();
    return result;
}

// 获取当天的笔记总数
export function getTotalNoteByDate(thisObj, dashboard) {
    let date = util.dateForMat("yyyy-MM-dd", new Date(dashboard.curDateTime));
    let sql = dbUtil.getSqlObj();
    let categoryName = "笔记";
    let noteNum = 0;
    let userId = wsCache.get("user").id;
    let categoryObj = getCategoryIdByName(sql, categoryName);
    let iconName = categoryObj.iconName;
    let dataUrl = categoryObj.dataUrl;
    let sqlStr =
        "SELECT 	count(note) AS noteNum FROM 	tbl_timeMachine AS a WHERE 	a.status = 1 AND a.userId = " +
        userId +
        "  AND a.note != '' AND SUBSTR(a.curDateTime, 1, 10) = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: date
    });
    stmt.step();
    if (stmt.getAsObject().noteNum != null) {
        noteNum = stmt.getAsObject().noteNum;
    }
    let result = {
        iconName: iconName,
        noteNum: noteNum,
        group: categoryName,
        dataUrl: dataUrl
    };
    sql.close();
    return result;
}

// 获取当天运动的总时长
export function getTotalSportTimeByDate(thisObj, dashboard) {
    let date = util.dateForMat("yyyy-MM-dd", new Date(dashboard.curDateTime));
    let sql = dbUtil.getSqlObj();
    let categoryName = "运动";
    let categoryObj = getCategoryIdByName(sql, categoryName);
    let iconName = categoryObj.iconName;
    let dataUrl = categoryObj.dataUrl;
    let categoryId = categoryObj.id;
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT 	a.timeSlot FROM 	tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id  LEFT JOIN tbl_category AS c ON b.categoryId = c.id WHERE 	a.status = 1 AND a.userId = " +
        userId +
        "  AND SUBSTR(a.curDateTime, 1, 10) = $a AND b.categoryIds like $b";
    let stmt = sql.prepare(sqlStr);
    let result = 0;
    let timeSlot = [];
    stmt.bind({
        $a: date,
        $b: "%" + categoryId + "%"
    });
    while (stmt.step()) {
        timeSlot = stmt.getAsObject().timeSlot.split("~");
        result += dealWithTimeSlot(timeSlot);
    }
    let resultObj = {
        iconName: iconName,
        sportTime: result,
        group: categoryName,
        dataUrl: dataUrl
    };
    sql.close();
    return resultObj;
}

// 获取timeSlot之间的时间差
export function dealWithTimeSlot(timeSlot) {
    let timeSlotStart = timeSlot[0];
    let timeSlotEnd = timeSlot[1];
    let timeSlotStartArr = timeSlotStart.split(":");
    let timeSlotEndArr = timeSlotEnd.split(":");
    return (
        (timeSlotEndArr[0] - timeSlotStartArr[0]) * 60 +
        (timeSlotEndArr[1] - timeSlotStartArr[1])
    );
}

// 获取运动的类别id
export function getCategoryIdByName(sql, categoryName) {
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT id, iconName, dataUrl FROM tbl_category WHERE userId = " +
        userId +
        " AND  categoryName = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: categoryName
    });
    let result = 0;
    stmt.step();
    result = stmt.getAsObject();
    return result;
}

// 获取早起时间
export function getGetupTimeByDate(thisObj, dashboard) {
    let date = util.dateForMat("yyyy-MM-dd", new Date(dashboard.curDateTime));
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT SUBSTR(min(a.timeSlot) , 7, 11) as getupTime  FROM 	tbl_timeMachine AS a  WHERE 	a.status = 1 AND a.userId = " +
        userId +
        "   AND SUBSTR(a.curDateTime, 1, 10) = $a";
    let stmt = sql.prepare(sqlStr);
    let result = {};
    stmt.bind({
        $a: date
    });
    stmt.step();
    result = stmt.getAsObject();
    result.group = "早起";
    result.iconName = "0.png";
    result.dataUrl =
        "data:image/png;base64,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";
    if (result.getupTime == null) {
        result.getupTime = "00:00";
    }
    sql.close();
    return result;
}

// 获取晚睡时间
export function getSleepTimeByDate(thisObj, dashboard) {
    let date = util.dateForMat("yyyy-MM-dd", new Date(dashboard.curDateTime));
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT SUBSTR(max(a.timeSlot) , 7, 5) as sleepTime  FROM 	tbl_timeMachine AS a  WHERE 	a.status = 1 AND a.userId = " +
        userId +
        "   AND SUBSTR(a.curDateTime, 1, 10) = $a";
    let stmt = sql.prepare(sqlStr);
    let result = "";
    stmt.bind({
        $a: date
    });
    stmt.step();
    result = stmt.getAsObject();
    result.group = "晚睡";
    result.iconName = "0.png";
    result.dataUrl =
        "data:image/png;base64,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";
    if (result.sleepTime == null) {
        result.sleepTime = "00:00";
    }
    sql.close();
    return result;
}

// 获取当天的工作情况
export function getWorkProgressByDate(thisObj, dashboard) {
    let date = util.dateForMat("yyyy-MM-dd", new Date(dashboard.curDateTime));
    let sql = dbUtil.getSqlObj();
    let categoryName = "项目";
    let categoryId = getCategoryIdByName(sql, categoryName).id;
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT 	a.todolistId, e.iconName, e.dataUrl, e.categoryName AS project,  d.categoryName AS module,  c.categoryName AS stage,  a.progress, max(a.progress) FROM 	tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id LEFT JOIN tbl_category AS c ON b.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id LEFT JOIN tbl_category AS e ON d.pid = e.id WHERE 	a.status = 1 AND a.userId = " +
        userId +
        "  AND SUBSTR(a.curDateTime, 1, 10) = $a AND b.categoryIds LIKE $b GROUP BY a.todolistId";
    let stmt = sql.prepare(sqlStr);
    let resultList = [];
    stmt.bind({
        $a: date,
        $b: "%" + categoryId + "%"
    });
    let resultObj = {};
    while (stmt.step()) {
        resultObj = stmt.getAsObject();
        resultObj.group = "工作";
        resultObj.dataUrl =
            "data:image/png;base64,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";
        resultList.push(resultObj);
    }
    sql.close();
    return resultList;
}
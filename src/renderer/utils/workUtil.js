import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

export function getCategoryIdByName(categoryName) {
    let sql = dbUtil.getSqlObj();
    let result = 0;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    sqlStr =
        "SELECT id FROM tbl_category WHERE categoryName = $a AND userId = 1 AND status = 1";
    stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: categoryName });
    stmt.step();
    result = stmt.getAsObject().id;
    sql.close();
    return result;
}
export function getWorkOfTodolist(categoryId, weekStart, weekEnd) {
    let sql = dbUtil.getSqlObj();
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    let todolists = [];
    sqlStr =
        "SELECT 	* FROM 	tbl_todolist WHERE 	status = 1 AND userId = " +
        userId +
        " AND curDateTime >= $a AND curDateTime <= $b   AND categoryIds LIKE $c";
    stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: weekStart, $b: weekEnd, $c: "%" + categoryId + "%" });
    while (stmt.step()) {
        todolists.push(stmt.getAsObject());
    }
    sql.close();
    return todolists;
}
// 查询所有的备忘录
export function getWeekReport(work, thisObj) {
    let sql = dbUtil.getSqlObj();
    let workReport = [];
    let remarks = [];
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    let weekStart = work.weekArr[0];
    let weekStartStr = weekStart + " 00:00:00"
    let weekEnd = work.weekArr[1];
    let weekEndStr = weekEnd + " 23:59:59"
    let weekStartTime = new Date(weekStart).getTime();
    let weekEndTime = new Date(weekEnd).getTime();
    let categoryName = "项目";
    let pid = 0;
    let pids = [];
    let flag = true;
    let maxProgress = 0;
    let sumConsumeTime = 0;
    let workReportObj = null;
    let timeMachineObj = null;
    let curDateTime = null;
    // 首先查询工作的类别id
    let categoryId = getCategoryIdByName(categoryName);
    // 然后查询这周有没有新建的工作任务
    let todolists = getWorkOfTodolist(categoryId, weekStart, weekEnd);
    if (todolists.length > 0) {
        todolists.forEach(ele => {
            pid = ele.categoryIds.split(",")[3];
            if (pids.length > 0) {
                for (let i = 0; i < pids.length; i++) {
                    let id = pids[i];
                    if (id == pid) {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag) {
                pids.push(pid);
            }
            flag = true;
        });
    }
    pids.forEach(pid => {
        sqlStr =
            "SELECT 	c.categoryName as projectName, 	b.categoryName as moduleName, 	a.categoryName as stepName, 	d.listName as listName, d.id as todolistId, SUBSTR(d.curDateTime, 1, 10) AS curDateTime FROM 	(		SELECT 			* 		FROM 			tbl_category 		WHERE 			userId = " +
            userId +
            " 		AND status = 1 		AND pid = $a 	) AS a LEFT JOIN ( 	SELECT 		* 	FROM 		tbl_category 	WHERE 		userId = " +
            userId +
            " 	AND status = 1 ) AS b ON a.pid = b.id LEFT JOIN ( 	SELECT 		* 	FROM 		tbl_category 	WHERE 		userId = " +
            userId +
            " 	AND status = 1 ) AS c ON b.pid = c.id LEFT JOIN ( 	SELECT 		* 	FROM 		tbl_todolist 	WHERE 		userId = " +
            userId +
            " 	AND status = 1 AND curDateTime <= $c ) AS d ON a.id = d.categoryId ";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: pid, $b: weekStartStr, $c: weekEndStr });
        while (stmt.step()) {
            workReportObj = stmt.getAsObject();
            getWorkReportDetail(workReportObj);
            curDateTime = new Date(workReportObj.curDateTime);
            if(curDateTime >= weekStartTime && curDateTime <= weekEndTime) {
                workReportObj.type = 1;
            } else {
                workReportObj.type = 0;
            }
            workReport.push(workReportObj);
        }
    });
    sql.close();
    return workReport;
}

export function getWorkReportDetail(workReportObj) {
    let maxProgress = 0;
    let sumConsumeTime = 0;
    let remarks = [];
    if (workReportObj.todolistId != null) {
        let sql = dbUtil.getSqlObj();
        let userId = wsCache.get("user").id;
        let timeMachineObj = null;
        let sqlStr =
            "SELECT remark, progress, consumeTime FROM tbl_timeMachine WHERE userId = " +
            userId +
            " AND status = 1 AND todolistId = $a";
        let stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: workReportObj.todolistId });
        while (stmt.step()) {
            timeMachineObj = stmt.getAsObject();
            sumConsumeTime += timeMachineObj.consumeTime;
            remarks.push(timeMachineObj.remark);
            if (timeMachineObj.progress > maxProgress) {
                maxProgress = timeMachineObj.progress;
            }
        }
        sql.close();
    }
    workReportObj.progress = maxProgress;
    workReportObj.consumeTime = sumConsumeTime;
    workReportObj.remarks = remarks;
}

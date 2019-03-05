import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import * as todolistUtil from "@/utils/todolistUtil";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 时候加入复习计划
export function isJoinPreviewPlan(thisObj, knowledge) {
    let curDateTime = util.dateForMat("yyyy-MM-dd", new Date());
    let id = knowledge.noteOfReview[knowledge.noteIndex].id;
    let review = knowledge.noteOfReview[knowledge.noteIndex].review;
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    if (review == 0) {
        review = 1;
    } else if (review == 1) {
        review = 0;
    }
    let sql = dbUtil.getSqlObj();
    let sqlStr =
        "update tbl_timeMachine set review = " +
        review +
        ", updateTime = '" +
        updateTime +
        "' WHERE id = " +
        id +
        ";";
    sql.exec(sqlStr);
    dbUtil.writeDataToDB(sql);
}

// 记住复习内容
export function remember(thisObj, knowledge) {
    let curDateTime = util.dateForMat("yyyy-MM-dd", new Date());
    let id = knowledge.noteOfReview[knowledge.noteIndex].id;
    let reviewDays = knowledge.noteOfReview[knowledge.noteIndex].reviewDays;
    let reviewNum = knowledge.noteOfReview[knowledge.noteIndex].reviewNum + 1;
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    if (reviewDays != "") {
        reviewDays = reviewDays + "," + curDateTime;
    } else {
        reviewDays = curDateTime;
    }
    let sql = dbUtil.getSqlObj();
    let sqlStr =
        "update tbl_timeMachine set reviewNum = " +
        reviewNum +
        ", reviewDays = '" +
        reviewDays +
        "', updateTime = '" +
        updateTime +
        "' WHERE id = " +
        id +
        ";";
    sql.exec(sqlStr);
    dbUtil.writeDataToDB(sql);
}

// 获取需要复习的知识数据
export function getNoteOfReview(thisObj, knowledge) {
    let curDateTime = util.dateForMat("yyyy-MM-dd", new Date());
    let dateList = [];
    let intervalTime = 0;
    let condition = "";
    let sql = dbUtil.getSqlObj();
    let resultObj = {};
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT	a.id,  a.reviewNum,  a.review, a.reviewDays,  SUBSTR(a.curDateTime, 1, 10) AS curDateTime,  d.categoryName || '(' || c.categoryName || ')' AS categoryName,  b.listName FROM	tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id LEFT JOIN tbl_category AS c ON b.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE	a.status = 1 AND a.userId = " +
        userId +
        "  AND a.note != ''AND a.reviewNum != 7 AND review = 1 AND a.reviewDays NOT LIKE $a";
    let stmt = sql.prepare(sqlStr);
    let resultList = [];
    stmt.bind({
        $a: "%" + curDateTime + "%"
    });
    while (stmt.step()) {
        resultObj = stmt.getAsObject();
        for (let index = 0; index < 7; index++) {
            intervalTime += index;
            dateList.push(
                util.addDate(new Date(resultObj.curDateTime), intervalTime)
            );
        }
        for (let i = 0; i < dateList.length; i++) {
            if (dateList[i] == curDateTime) {
                resultList.push(resultObj);
                break;
            }
        }
        dateList.splice(0, dateList.length);
        intervalTime = 0;
    }
    sql.close();
    return resultList;
}

// 获取知识趋势相关数据
export function sumKnowledgeTrend(thisObj, knowledge) {
    let yearMonthType = knowledge.yearMonthTypeOfTrend;
    let trendYearMonth = knowledge.trendYearMonth;
    let year = util.dateForMat("yyyy", trendYearMonth);
    let sql = dbUtil.getSqlObj();
    let firstDay = "";
    let lastDay = "";
    let userId = wsCache.get("user").id;
    if (yearMonthType == 1) {
        // 表示的是月份
        firstDay = util.getFirstDayOfMonth(trendYearMonth);
        lastDay = util.getLastDayOfMonth(trendYearMonth);
    } else if (yearMonthType == 2) {
        // 表示的是年份
        firstDay = year + "-01-01 00:00:00";
        lastDay = year + "-12-31 23:59:59";
    }
    let sqlStr =
        "SELECT	a.id,	SUBSTR( a.curDateTime, 1, 10 ) AS curDateTime,	b.listName,	c.iconName, c.dataUrl,	d.categoryName || '(' || c.categoryName || ')' AS categoryName FROM	tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id LEFT JOIN tbl_category AS c ON b.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE	a.status = 1 AND a.userId = " +
        userId +
        "  AND a.curDateTime >= $a AND a.curDateTime <= $b AND a.progress = 100 AND a.note != '' ORDER BY a.curDateTime asc";
    let stmt = sql.prepare(sqlStr);
    let resultList = [];
    stmt.bind({ $a: firstDay, $b: lastDay });
    while (stmt.step()) {
        resultList.push(stmt.getAsObject());
    }
    sql.close();
    return resultList;
}

// 获取知识分析模态框中需要的数据
export function openKnowledgeModal(thisObj, knowledge, index) {
    let result = [];
    let firstDay = "";
    let lastDay = "";
    let yearMonthType = knowledge.yearMonthType;
    let analyzeYearMonth = knowledge.analyzeYearMonth;
    let sql = dbUtil.getSqlObj();
    let year = util.dateForMat("yyyy", analyzeYearMonth);
    let categoryId = knowledge.analyzeKnowledgeRightList[index].categoryId;
    let userId = wsCache.get("user").id;
    if (yearMonthType == 1) {
        // 表示的是月份
        firstDay = util.getFirstDayOfMonth(analyzeYearMonth);
        lastDay = util.getLastDayOfMonth(analyzeYearMonth);
    } else if (yearMonthType == 2) {
        // 表示的是年份
        firstDay = year + "-01-01 00:00:00";
        lastDay = year + "-12-31 23:59:59";
    }
    let sqlStr =
        "SELECT	c.iconName, c.dataUrl, SUBSTR( a.curDateTime, 1, 10 ) as curDateTime,  d.categoryName || '(' || c.categoryName || ')' AS categoryNames,  b.listName,  a.id FROM	tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id LEFT JOIN tbl_category AS c ON b.categoryId = c.id LEFT JOIN tbl_category AS d ON d.id = c.pid WHERE	a.status = 1 AND a.userId = " +
        userId +
        "  AND a.progress = 100 AND a.note != '' AND b.categoryId = $a AND a.curDateTime >= $b AND a.curDateTime <= $c";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: categoryId, $b: firstDay, $c: lastDay });
    while (stmt.step()) {
        result.push(stmt.getAsObject());
    }
    sql.close();
    return result;
}

// 获取知识分析数据
export function sumKnowledgeCategoryOfAnalyze(thisObj, knowledge) {
    let result = [];
    let firstDay = "";
    let lastDay = "";
    let yearMonthType = knowledge.yearMonthType;
    let analyzeYearMonth = knowledge.analyzeYearMonth;
    let sql = dbUtil.getSqlObj();
    let year = util.dateForMat("yyyy", analyzeYearMonth);
    let userId = wsCache.get("user").id;
    if (yearMonthType == 1) {
        // 表示的是月份
        firstDay = util.getFirstDayOfMonth(analyzeYearMonth);
        lastDay = util.getLastDayOfMonth(analyzeYearMonth);
    } else if (yearMonthType == 2) {
        // 表示的是年份
        firstDay = year + "-01-01 00:00:00";
        lastDay = year + "-12-31 23:59:59";
    }
    let sqlStr =
        "SELECT	COUNT( d.categoryName ) AS num,	c.iconName, c.dataUrl,	c.id AS categoryId, d.categoryName,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE	a.status = 1 AND a.userId = " +
        userId +
        "  	AND a.progress = 100 	AND a.note != '' 	AND a.curDateTime >= $a  	AND a.curDateTime <= $b  GROUP BY	categoryNames ORDER BY	categoryNames ASC";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: firstDay, $b: lastDay });
    while (stmt.step()) {
        result.push(stmt.getAsObject());
    }
    sql.close();
    return result;
}

// 根据id查询知识
export function echartsClickOfTree(thisObj, id) {
    let result = "";
    let flag = false;
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr = "SELECT	note from tbl_timeMachine as a WHERE a.status = 1 AND a.userId = " + userId + "  AND a.id = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: id });
    stmt.step();
    result = stmt.getAsObject().note;
    sql.close();
    return result;
}

// 根据类别id获取知识图谱
export function queryKnowledgeGraph(thisObj, knowledge, index) {
    let totalNodes = 0;
    let firstLevelObj = knowledge.noteCategoryList[index];
    firstLevelObj = { id: firstLevelObj.id, name: firstLevelObj.categoryName };
    let categoryId = firstLevelObj.id;
    var sql = dbUtil.getSqlObj();
    let firstChildren = getSubcategoryOfLevelByPid(categoryId, sql);
    let secondChildren = {};
    firstLevelObj.children = firstChildren;
    for (let i = 0; i < firstChildren.length; i++) {
        secondChildren = getKnowledgeGraphTitle(firstChildren[i].id, sql);
        firstChildren[i].children = secondChildren;
        firstChildren[i].isLeave = false;
        totalNodes += secondChildren.length;
    }
    sql.close();
    knowledge.totalNodes = totalNodes;
    return firstLevelObj;
}

export function getSubcategoryOfLevelByPid(pid, sql) {
    let children = [];
    let obj = {};
    let tempObj = {};
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT id, categoryName as name FROM tbl_category WHERE status = 1 AND userId = "+userId+"  AND  pid = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: pid });
    while (stmt.step()) {
        children.push(stmt.getAsObject());
    }
    return children;
}

// 获取知识图谱的尾节点的标题
export function getKnowledgeGraphTitle(categoryId, sql) {
    let result = [];
    let resultObj = {};
    let flag = false;
    if (sql == null) {
        sql = dbUtil.getSqlObj();
        flag = true;
    }
    let userId = wsCache.get("user").id;
    let sqlStr = "SELECT	a.id,	b.listName AS name FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id WHERE	a.status = 1 AND a.userId = " + userId + " 	AND b.categoryId = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: categoryId });
    while (stmt.step()) {
        resultObj = stmt.getAsObject();
        resultObj.isLeave = true;
        result.push(resultObj);
    }
    if (flag) {
        sql.close();
    }
    return result;
}

// 获取知识图谱中笔记的类别
export function queryNoteCategory(thisObj, knowledge) {
    let result = [];
    let sql = dbUtil.getSqlObj();
    let categoryId = knowledge.noteCategoryId;
    let userId = wsCache.get("user").id;
    let sqlStr = "SELECT id, categoryName FROM tbl_category WHERE status = 1 AND userId = " + userId + "  AND pid = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: categoryId });
    while (stmt.step()) {
        result.push(stmt.getAsObject());
    }
    sql.close();
    return result;
}

// 保存笔记
export function saveNote(thisObj, knowledge) {
    let result = "";
    let sql = dbUtil.getSqlObj();
    let id = knowledge.knowledgeList[knowledge.index].id;
    let sqlStr =
        "UPDATE tbl_timeMachine set note = '" +
        knowledge.note +
        "' WHERE id = " +
        id;
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
    } catch (error) {
        thisObj.$Message.error({ content: "系统异常!" });
    }
}

// 获取当天的笔记条数
export function getNoteNumOfCurDate(thisObj, knowledge) {
    let result = "";
    let sql = dbUtil.getSqlObj();
    let curDateTime = util.dateForMat("yyyy-MM-dd", knowledge.curDateTime);
    let userId = wsCache.get("user").id;
    let sqlStr = "SELECT	COUNT( * ) as num FROM	tbl_timeMachine AS a WHERE	a.status = 1 AND a.userId = " + userId + "  	AND a.note != '' 	AND SUBSTR( a.curDateTime, 1, 10 ) = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: curDateTime });
    stmt.step();
    result = stmt.getAsObject().num;
    sql.close();
    return result;
}

// 获取当天的笔记详情
export function queryKnowledgeListByDate(thisObj, knowledge) {
    let resultList = [];
    let sql = dbUtil.getSqlObj();
    let curDateTime = util.dateForMat(
        "yyyy-MM-dd",
        new Date(knowledge.curDateTime)
    );
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT	a.id, a.curDateTime, a.noteShow, SUBSTR( b.listName, 1, 10 ) as briefTitle, a.note, b.listName, c.iconName, c.dataUrl, c.categoryName, d.categoryName || '(' || c.categoryName || ')' AS categoryNames  FROM	tbl_timeMachine AS a left join tbl_todolist as b on a.todolistId = b.id left join tbl_category as c on c.id = b.categoryId LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE	a.status = 1 AND a.userId = " +
        userId +
        "  	AND a.note != '' 	AND SUBSTR( a.curDateTime, 1, 10 ) = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: curDateTime });
    while (stmt.step()) {
        resultList.push(stmt.getAsObject());
    }
    sql.close();
    return resultList;
}

// 获取当月的笔记条数
export function getNoteNumOfCurMonth(thisObj, knowledge) {
    let result = "";
    let sql = dbUtil.getSqlObj();
    let firstDay = util.getFirstDayOfMonth(knowledge.curDateTime);
    let lastDay = util.getLastDayOfMonth(knowledge.curDateTime);
    let userId = wsCache.get("user").id;
    let sqlStr =
        "	SELECT	COUNT( * ) as num  FROM	tbl_timeMachine AS a WHERE	a.status = 1 AND a.userId = " +
        userId +
        "  	AND a.note != '' 	AND a.curDateTime >= $a	AND a.curDateTime <= $b ";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: firstDay, $b: lastDay });
    stmt.step();
    result = stmt.getAsObject().num;
    sql.close();
    return result;
}

// 获取需要复习的笔记条数
export function getNoteNumOfReview(thisObj, knowledge) {
    let result = "";
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT	COUNT( * ) as num FROM	tbl_timeMachine AS a WHERE	a.status = 1 AND a.userId = " +
        userId +
        "  	AND a.note != '' 	AND a.reviewNum != 7";
    let stmt = sql.prepare(sqlStr);
    stmt.step();
    result = stmt.getAsObject().num;
    sql.close();
    return result;
}

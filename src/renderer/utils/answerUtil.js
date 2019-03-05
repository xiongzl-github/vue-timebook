import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();



// 更新备忘录
export function updateAnswer(answer, answerObj, sql) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_answer set updateTime = '" +
        updateTime +
        "', answerType = '" +
        answerObj.answerType +
        "' WHERE id = " +
        answerObj.answerId;
    sql.run(sqlStr);
}

// 查询所有的备忘录
export function queryAnswersByDate(answer, thisObj) {
    let sql = dbUtil.getSqlObj();
    let answers = [];
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    let date = new Date(answer.curDateTime);
    date = util.dateForMat("yyyy-MM-dd", date);
    sqlStr =
        "SELECT 	a.*, coalesce(b.answerType, 2) AS answerType, coalesce(b.id, 0) AS answerId FROM 	(		SELECT 			* 		FROM 			tbl_question 		WHERE 			userId = " +
        userId +
        " 		AND status = 1 	) AS a LEFT JOIN ( 	SELECT 		* 	FROM 		tbl_answer 	WHERE 		userId = 1 	AND status = 1 	AND SUBSTR(curDateTime, 1, 10) = $a ) AS b ON a.id = b.questionId order by a.curDateTime asc;";
    stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: date });
    while (stmt.step()) {
        answers.push(stmt.getAsObject());
    }
    sql.close();
    return answers;
}

// 添加问题回答
export function addAnswers(answer, thisObj) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let curDateTime = updateTime;
    let syncStatus = 0;
    let status = 1;
    var sql = dbUtil.getSqlObj();
    let answers = answer.answers;
    let flag = false;
    let count = 0;
    for (let index = 0; index < answer.answers.length; index++) {
        count = index + 1;
        let ele = answer.answers[index];
        if (ele.answerType == 2) {
            // 表示此题未做, 提示做此题
            thisObj.$Message.success({
                content: "第" + count + "题未做!"
            });
            flag = true;
            break;
        }
    }
    if (flag) {
        return;
    }
    try {
        for (let index = 0; index < answer.answers.length; index++) {
            let ele = answer.answers[index];
            if (ele.answerId == 0) {
                // 做插入操作
                addAnswer(answer, ele, sql);
            } else {
                updateAnswer(answer, ele, sql);
            }
        }
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({ content: "成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "失败!" });
    }
}

export function addAnswer(answer, answerObj, sql) {
    let updateTime = util.dateForMat("yyyy-MM-dd hh:mm:ss", answer.curDateTime);
    let curDateTime = updateTime;
    let syncStatus = 0;
    let status = 1;
    let sqlstr =
        "INSERT INTO tbl_answer(userId, questionId, answerType, curDateTime, updateTime, syncStatus, status) VALUES (" +
        wsCache.get("user").id +
        ", " +
        answerObj.id +
        ", '" +
        answerObj.answerType +
        "', '" +
        curDateTime +
        "', '" +
        updateTime +
        "', " +
        syncStatus +
        ", " +
        status +
        ")";
    sql.exec(sqlstr);
}

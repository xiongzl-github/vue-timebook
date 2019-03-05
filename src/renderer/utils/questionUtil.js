import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 删除备忘录
export function deleteQuestion(question, thisObj, id) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_question set updateTime = '" +
        updateTime +
        "', status = " +
        0 +
        " WHERE id = " +
        id;
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({ content: "删除成功!" });
        return true;
    } catch (error) {
        thisObj.$Message.error({ content: "删除失败!" });
        return false;
    }
}

// 更新备忘录
export function updateQuestion(question, thisObj) {
    let sql = dbUtil.getSqlObj();
    let result = checkAddQuestionMethodParam(question, thisObj);
    if (result) {
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let sqlStr =
            "UPDATE tbl_question set updateTime = '" +
            updateTime +
            "', questionStr = '" +
            question.questionStr +
            "' WHERE id = " +
            question.id;
        try {
            sql.run(sqlStr);
            dbUtil.writeDataToDB(sql);
            thisObj.$Message.success({ content: "更新成功!" });
        } catch (error) {
            thisObj.$Message.error({ content: "更新失败!" });
            return false;
        }
    } else {
        return false;
    }
    return result;
}



// 查询所有的问题
export function queryQuestions(memo, thisObj) {
    let sql = dbUtil.getSqlObj();
    let questions = [];
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    sqlStr =
        "SELECT a.*, SUBSTR( a.questionStr, 1, 25 ) AS briefQuestionStr FROM tbl_question as a WHERE status = 1 AND userId = " +
        userId +
        ";";
    stmt = sql.prepare(sqlStr);
    while (stmt.step()) {
        questions.push(stmt.getAsObject());
    }
    sql.close();
    return questions;
}

// 添加备忘录
export function addQuestion(question, thisObj) {
    // 检查有声书参数
    let result = checkAddQuestionMethodParam(question, thisObj);
    if (result) {
        // 将有声书插入
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let curDateTime = updateTime;
        let syncStatus = 0;
        let status = 1;
        var sql = dbUtil.getSqlObj();
        let sqlstr =
            "INSERT INTO tbl_question(userId, questionStr, curDateTime, updateTime, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", '" +
            question.questionStr +
            "', '" +
            curDateTime +
            "', '" +
            updateTime +
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
        } catch (error) {
            thisObj.$Message.error({
                content: "添加失败!"
            });
            return false;
        }
    } else {
        return false;
    }
    return result;
}

export function checkAddQuestionMethodParam(question, thisObj) {
    if ("" == question.questionStr) {
        thisObj.$Message.warning({ content: "请输入问题!" });
    } else {
        return true;
    }
    return false;
}

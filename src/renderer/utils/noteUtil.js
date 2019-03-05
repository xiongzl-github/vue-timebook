import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 删除相册
export function deleteNoteById(note, thisObj, id) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_note set updateTime = '" +
        updateTime +
        "', status = " +
        0 +
        " WHERE id = " +
        id;
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({ content: "删除成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "删除失败!" });
    }
}

// 更新相册
export function updateNote(note, thisObj) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_note set updateTime = '" +
        updateTime +
        "', note = '" +
        note.note +
        "' WHERE id = " +
        note.id;
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({ content: "更新成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "更新失败!" });
    }
}

// 查询所有的相册
export function queryNote(note, thisObj) {
    let sql = dbUtil.getSqlObj();
    let notes = [];
    let sqlStr = "";
    let stmt = {};
    let date = util.dateForMat("yyyy-MM", new Date(note.curYearMonth));
    let userId = wsCache.get("user").id;
    sqlStr =
        "SELECT  SUBSTR(a.curDateTime, 1, 10) AS curDateTime, SUBSTR(a.note, 1, 5) AS briefNote, id, note FROM tbl_note as a WHERE status = 1 AND userId = " +
        userId +
        " and SUBSTR(a.curDateTime, 1, 7) = $a order by a.curDateTime asc;";
    stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: date });
    while (stmt.step()) {
        notes.push(stmt.getAsObject());
    }
    sql.close();
    return notes;
}

// 检查note方法参数
export function checkAddNoteMethodParam(note, thisObj) {
    if ("" == note.note) {
        thisObj.$Message.warning({ content: "请输入手记!" });
    } else {
        return true;
    }
    return false;
}

export function addNote(note, thisObj) {
    // 检查有声书参数
    let result = checkAddNoteMethodParam(note, thisObj);
    if (result) {
        // 将有声书插入
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let curDateTime = updateTime;
        let syncStatus = 0;
        let status = 1;
        var sql = dbUtil.getSqlObj();
        let sqlstr =
            "INSERT INTO tbl_note(userId, note, curDateTime, updateTime, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", '" +
            note.note +
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
            // 处理上传的图片
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

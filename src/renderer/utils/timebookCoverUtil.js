import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "@/store/types.js";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 更新一个目标
export function updateTimebookCover(id, imgUrl, thisObj) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_timebookCover set updateTime = '" +
        updateTime +
        "', imgUrl = '" +
        imgUrl +
        "' WHERE id = " +
        id;
    sql.run(sqlStr);
    dbUtil.writeDataToDB(sql);
}

// 查询当前日期所有的cover
export function queryTimeBookCover(timeObj, thisObj, index) {
    // 查询此用户所拥有的所有tag
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr = "";
    let timebookCovers = [];
    let dateStr = timeObj.allTimeOfDays[index].curDateTime;
    sqlStr =
        "SELECT id, dateStr, coverPage, imgUrl FROM tbl_timebookCover WHERE status = 1 AND userId = " +
        userId +
        " AND dateStr = $a;";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: dateStr });
    while (stmt.step()) {
        timebookCovers.push(stmt.getAsObject());
    }
    sql.close();
    return timebookCovers;
}
// 查询当前日期, 页数的cover
export function querySingleTimeBookCover(timeObj, thisObj) {
    // 查询此用户所拥有的所有tag
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let dateStr = timeObj.allTimeOfDays[timeObj.timebookIndex].curDateTime;
    let coverPage = timeObj.coverPage;
    let sqlStr =
        "SELECT id, dateStr, coverPage, imgUrl FROM tbl_timebookCover WHERE status = 1 AND userId = " +
        userId +
        " AND dateStr = $a AND coverPage = $b;";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: dateStr, $b: coverPage });
    stmt.step();
    let resultObj = stmt.getAsObject();
    sql.close();
    return resultObj;
}

export function addTimebookCover(timeObj, coverOriSrc) {
    // 插入一个目标
    let curDateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let dateStr = timeObj.allTimeOfDays[timeObj.timebookIndex].curDateTime;
    let coverPage = timeObj.coverPage;
    let updateTime = curDateTime;
    let syncStatus = 0;
    let status = 1;
    var sql = dbUtil.getSqlObj();
    let sqlstr =
        "INSERT INTO tbl_timebookCover(userId, dateStr, coverPage, imgUrl,  curDateTime, updateTime, syncStatus, status) VALUES (" +
        wsCache.get("user").id +
        ", '" +
        dateStr +
        "', " +
        coverPage +
        ", '" +
        coverOriSrc +
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
    dbUtil.writeDataToDB(sql);
}

// 提交目标
export function confirmCover(timeObj, thisObj, coverOriSrc) {
    // 校验提交数据
    let result = checkConfirmCoverMethodParam(timeObj, thisObj, coverOriSrc);
    if (!result) {
        let coverObj = querySingleTimeBookCover(timeObj, thisObj);
        if (coverObj.id != undefined) {
            // 执行更新操作
            try {
                updateTimebookCover(coverObj.id, coverOriSrc);
                thisObj.$Message.success({
                    content: "更新成功!"
                });
                return false;
            } catch (error) {
                thisObj.$Message.error({
                    content: "更新失败!"
                });
                return true;
            }
        } else {
            try {
                addTimebookCover(timeObj, coverOriSrc);
                thisObj.$Message.success({
                    content: "添加成功!"
                });
                return false;
            } catch (error) {
                thisObj.$Message.error({
                    content: "添加失败!"
                });
                return true;
            }
        }
    } else {
        return result;
    }
}

// 校验submitTarget方法的参数
export function checkConfirmCoverMethodParam(timeObj, thisObj, coverOriSrc) {
    // 校验提交数据
    let result = true;
    let dateStr = timeObj.allTimeOfDays[timeObj.timebookIndex].curDateTime;
    let coverPage = timeObj.coverPage;
    if ("" == dateStr) {
        thisObj.$Message.warning({ content: "日期有误!" });
    } else if (0 == coverPage) {
        thisObj.$Message.warning({
            content: "封面类型有误"
        });
    } else if ("" == coverOriSrc) {
        thisObj.$Message.warning({ content: "图片地址有误" });
    } else {
        result = false;
    }
    return result;
}

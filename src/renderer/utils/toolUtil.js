import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 删除语言类别
export function deleteApiToolCategory(api, thisObj, id) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_comCategory set updateTime = '" +
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

// 查询所有的语言类别
export function queryAllToolCategory(api, thisObj) {
    let apiToolCategorys = [];
    let stmt = {};
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT a.id as value, a.categoryName as label FROM tbl_comCategory as a WHERE status = 1 AND type = 2 AND userId = " +
        userId +
        ";";
    stmt = sql.prepare(sqlStr);
    while (stmt.step()) {
        apiToolCategorys.push(stmt.getAsObject());
    }
    sql.close();
    return apiToolCategorys;
}

// 添加备忘录
export function addTool(api, thisObj) {
    // 检查有声书参数
    let result = checkAddToolMethodParam(api, thisObj);
    if (result) {
        // 检查这个语言类别是否存在
        result = checkToolIsRepeat(api, thisObj);
        if (result) {
            // 将有声书插入
            let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
            let curDateTime = updateTime;
            let syncStatus = 0;
            let status = 1;
            let type = 2;
            var sql = dbUtil.getSqlObj();
            let sqlstr =
                "INSERT INTO tbl_comCategory(userId, categoryName, type, curDateTime, updateTime, syncStatus, status) VALUES (" +
                wsCache.get("user").id +
                ", '" +
                api.tool.toolStr +
                "', " +
                type +
                ", '" +
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
            }
        } else {
            thisObj.$Message.warning({ content: "添加重复!" });
            return false;
        }
    } else {
        return false;
    }
    return result;
}

export function checkToolIsRepeat(api, thisObj) {
    let apiToolCategorys = [];
    let stmt = {};
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT a.* FROM tbl_comCategory as a WHERE status = 1 AND type = 2 AND categoryName = $a AND userId = " +
        userId +
        ";";
    stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: api.tool.toolStr });
    while (stmt.step()) {
        apiToolCategorys.push(stmt.getAsObject());
    }
    sql.close();
    if (apiToolCategorys.length >= 1) {
        return false;
    } else {
        return true;
    }
}

export function checkAddToolMethodParam(api, thisObj) {
    if ("" == api.tool.toolStr) {
        thisObj.$Message.warning({ content: "请输入语言类别!" });
    } else {
        return true;
    }
    return false;
}

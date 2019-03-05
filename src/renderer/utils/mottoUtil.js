import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 更新座右铭
export function updateMotto(motto, thisObj) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let result = checkAddMottoMethodParam(motto, thisObj);
    if (result) {
        let sqlStr =
            "UPDATE tbl_motto set updateTime = '" +
            updateTime +
            "', author = '" +
            motto.author +
            "', mottoStr = '" +
            motto.mottoStr +
            "' WHERE id = " +
            motto.id;
        try {
            sql.run(sqlStr);
            dbUtil.writeDataToDB(sql);
            thisObj.$Message.success({ content: "更新成功!" });
        } catch (error) {
            thisObj.$Message.error({ content: "更新失败!" });
        }
    } else {
        return false;
    }
    return result;
}

// 删除座右铭
export function deleteMotto(motto, thisObj, id) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_motto set updateTime = '" +
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

// 查询座右铭的个数
export function queryTotalMottoNum(motto, thisObj) {
    let sql = dbUtil.getSqlObj();
    let searchText = motto.searchStr;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr =
            "SELECT count(*) as totalNum FROM tbl_motto WHERE status = 1 AND userId = " +
            userId +
            "";
        stmt = sql.prepare(sqlStr);
    } else {
        sqlStr =
            "SELECT count(*) as totalNum FROM tbl_motto WHERE status = 1 AND userId = " +
            userId +
            " and mottoStr like $a or author like $b";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + searchText + "%",
            $b: "%" + searchText + "%"
        });
    }
    stmt.step();
    let result = stmt.getAsObject().totalNum;
    sql.close();
    return result;
}

// 查询所有的mottos
export function queryAllMottos() {
    let mottos = [];
    let stmt = {};
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr = "SELECT a.* FROM tbl_motto as a WHERE status = 1 AND userId = " + userId + ";";
    stmt = sql.prepare(sqlStr);
    while (stmt.step()) {
        mottos.push(stmt.getAsObject());
    }
    sql.close();
    return mottos;
}

// 查询所有座右铭
export function queryMottos(motto, thisObj) {
    let sql = dbUtil.getSqlObj();
    let mottos = [];
    let searchText = motto.searchStr;
    let curPageNum = motto.curPageNum;
    let pageSize = motto.pageSize;
    let startPage = (curPageNum - 1) * pageSize;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr =
            "SELECT a.*, SUBSTR(mottoStr, 1, 45) as briefMottoStr FROM tbl_motto as a WHERE status = 1 AND userId = " +
            userId +
            " limit $a, $b";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: startPage, $b: pageSize });
    } else {
        sqlStr =
            "SELECT a.*, SUBSTR(mottoStr, 1, 45) as briefMottoStr FROM tbl_motto as a WHERE status = 1 AND userId = " +
            userId +
            " and (mottoStr like $a or author like $d) limit $b, $c";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + searchText + "%",
            $d: "%" + searchText + "%",
            $b: startPage,
            $c: pageSize
        });
    }
    while (stmt.step()) {
        mottos.push(stmt.getAsObject());
    }
    sql.close();
    return mottos;
}

// 添加备忘录
export function addMotto(motto, thisObj) {
    // 检查有声书参数
    let result = checkAddMottoMethodParam(motto, thisObj);
    if (result) {
        // 将有声书插入
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let curDateTime = updateTime;
        let syncStatus = 0;
        let status = 1;
        var sql = dbUtil.getSqlObj();
        let sqlstr =
            "INSERT INTO tbl_motto(userId, author, mottoStr, curDateTime, updateTime, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", '" +
            motto.author +
            "', '" +
            motto.mottoStr +
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
            thisObj.$Message.success({ content: "添加成功!" });
        } catch (error) {
            thisObj.$Message.error({ content: "添加失败!" });
        }
    } else {
        return false;
    }
    return result;
}

export function checkAddMottoMethodParam(motto, thisObj) {
    if ("" == motto.author) {
        thisObj.$Message.warning({ content: "请输入作者!" });
    } else if ("" == motto.mottoStr) {
        thisObj.$Message.warning({ content: "请输入座右铭!" });
    } else {
        return true;
    }
    return false;
}

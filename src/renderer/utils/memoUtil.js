import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 删除备忘录
export function deleteMemo(memo, thisObj, id) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_memo set updateTime = '" +
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

// 更新备忘录
export function updateMemo(memo, thisObj) {
    let sql = dbUtil.getSqlObj();

    let result = checkAddMemoMethodParam(memo, thisObj);
    if (result) {
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let content = "";
        for (let i = 0; i < memo.memoContentTags.length; i++) {
            let ele = memo.memoContentTags[i];
            if (i == memo.memoContentTags.length - 1) {
                content += ele;
            } else {
                content += ele + "//";
            }
        }
        let sqlStr =
            "UPDATE tbl_memo set updateTime = '" +
            updateTime +
            "', subject = '" +
            memo.subject +
            "', content = '" +
            content +
            "', isLocked = '" +
            memo.isLocked +
            "', password = '" +
            memo.password +
            "' WHERE id = " +
            memo.id;
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

// 查询备忘录的个数
export function queryTotalMemoNum(memo, thisObj) {
    let sql = dbUtil.getSqlObj();
    let searchText = memo.searchStr;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr =
            "SELECT count(*) as totalNum FROM tbl_memo WHERE status = 1 AND userId = " +
            userId +
            "";
        stmt = sql.prepare(sqlStr);
    } else {
        sqlStr =
            "SELECT count(*) as totalNum FROM tbl_memo WHERE status = 1 AND userId = " +
            userId +
            " and subject like $a";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: "%" + searchText + "%" });
    }
    stmt.step();
    let result = stmt.getAsObject().totalNum;
    sql.close();
    return result;
}

// 查询所有的备忘录
export function queryMemos(memo, thisObj) {
    let sql = dbUtil.getSqlObj();
    let memos = [];
    let memoObj = {};
    let searchText = memo.searchStr;
    let curPageNum = memo.curPageNum;
    let pageSize = memo.pageSize;
    let startPage = (curPageNum - 1) * pageSize;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr =
            "SELECT * FROM tbl_memo WHERE status = 1 AND userId = " +
            userId +
            " limit $a, $b";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: startPage, $b: pageSize });
    } else {
        sqlStr =
            "SELECT * FROM tbl_memo WHERE status = 1 AND userId = " +
            userId +
            " and subject like $a limit $b, $c";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + searchText + "%",
            $b: startPage,
            $c: pageSize
        });
    }
    while (stmt.step()) {
        memoObj = stmt.getAsObject();
        if (memoObj.isLocked == 1) {
            memoObj.desc = "XXXXXX";
        } else {
            memoObj.desc = memoObj.content.split("//")[0].substring(0, 5);
        }
        memoObj.memoContentTags = memoObj.content.split("//");
        memos.push(memoObj);
    }
    sql.close();
    return memos;
}

// 添加备忘录
export function addMemo(memo, thisObj) {
    // 检查有声书参数
    let result = checkAddMemoMethodParam(memo, thisObj);
    if (result) {
        // 将有声书插入
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let curDateTime = updateTime;
        let content = "";
        let syncStatus = 0;
        let status = 1;
        for (let i = 0; i < memo.memoContentTags.length; i++) {
            let ele = memo.memoContentTags[i];
            if (i == memo.memoContentTags.length - 1) {
                content += ele;
            } else {
                content += ele + "//";
            }
        }
        var sql = dbUtil.getSqlObj();
        let sqlstr =
            "INSERT INTO tbl_memo(userId, subject, content, isLocked, password, curDateTime, updateTime, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", '" +
            memo.subject +
            "', '" +
            content +
            "', '" +
            memo.isLocked +
            "', '" +
            memo.password +
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

export function checkAddMemoMethodParam(memo, thisObj) {
    if ("" == memo.subject) {
        thisObj.$Message.warning({ content: "请输入主题!" });
    } else if (memo.memoContentTags.length == 0) {
        thisObj.$Message.warning({ content: "请输入内容!" });
    } else {
        return true;
    }
    return false;
}

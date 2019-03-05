import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 删除api
export function deleteApi(api, thisObj, id) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_api set updateTime = '" +
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

// 更新座API
export function updateApi(api, thisObj) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let result = checkAddApiMethodParam(api, thisObj);
    let lanId = "";
    let toolId = "";
    let methodDetail = "";
    let lanStr = "";
    let toolStr = "";
    if (result) {
        if (!api.lanChange) {
            lanId = getCategoryIdByName(api.lan.apiLanCategorys, api.lanId);
            lanStr = api.lanId;
        } else {
            lanId = api.lanId;
            lanStr = getCategoryNameById(api.lan.apiLanCategorys, lanId);
        }
        if (!api.toolChange) {
            toolId = getCategoryIdByName(api.tool.apiToolCategorys, api.toolId);
            toolStr = api.toolId;
        } else {
            toolId = api.toolId;
            toolStr = getCategoryNameById(api.tool.apiToolCategorys, toolId);
        }
        let methodDetail =
            lanStr +
            "," +
            toolStr +
            "," +
            api.methodName +
            "," +
            api.methodIntro;
        let sqlStr =
            "UPDATE tbl_api set updateTime = '" +
            updateTime +
            "', lanId = '" +
            lanId +
            "', toolId = '" +
            toolId +
            "', methodName = '" +
            api.methodName +
            "', methodIntro = '" +
            api.methodIntro +
            "', method = '" +
            api.method +
            "', methodDetail = '" +
            methodDetail +
            "' WHERE id = " +
            api.id;
        try {
            sql.run(sqlStr);
            dbUtil.writeDataToDB(sql);
            thisObj.$Message.success({ content: "更新成功!" });
        } catch (error) {
            thisObj.$Message.error({ content: "更新失败!" });
        }
    }
}

// 查询所有的apis
export function queryApis(api, thisObj) {
    let sql = dbUtil.getSqlObj();
    let apis = [];
    let searchText = api.searchStr;
    let curPageNum = api.curPageNum;
    let pageSize = api.pageSize;
    let startPage = (curPageNum - 1) * pageSize;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr =
            "SELECT 	a.*, b.categoryName AS lanStr, 	c.categoryName AS toolStr FROM 	(		SELECT			*		FROM			tbl_api		WHERE			userId = " +
            userId +
            "		AND status = 1	) AS a LEFT JOIN ( 	SELECT 		id,		categoryName 	FROM 		tbl_comCategory 	WHERE 		userId = " +
            userId +
            " 	AND status = 1 ) AS b ON a.lanId = b.id LEFT JOIN ( 	SELECT 		id, 		categoryName 	FROM 		tbl_comCategory 	WHERE 		userId = " +
            userId +
            " 	AND status = 1 ) AS c ON a.toolId = c.id limit $a, $b";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: startPage, $b: pageSize });
    } else {
        sqlStr =
            "SELECT 	a.*, b.categoryName AS lanStr, 	c.categoryName AS toolStr FROM 	(		SELECT			*		FROM			tbl_api		WHERE			userId = " +
            userId +
            "		AND status = 1 AND methodDetail like $a	) AS a LEFT JOIN ( 	SELECT 		id,		categoryName 	FROM 		tbl_comCategory 	WHERE 		userId = " +
            userId +
            " 	AND status = 1 ) AS b ON a.lanId = b.id LEFT JOIN ( 	SELECT 		id, 		categoryName 	FROM 		tbl_comCategory 	WHERE 		userId = " +
            userId +
            " 	AND status = 1 ) AS c ON a.toolId = c.id limit $b, $c";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + searchText + "%",
            $b: startPage,
            $c: pageSize
        });
    }
    while (stmt.step()) {
        apis.push(stmt.getAsObject());
    }
    sql.close();
    return apis;
}

// 查询座右铭的个数
export function queryTotalApiNum(api, thisObj) {
    let sql = dbUtil.getSqlObj();
    let searchText = api.searchStr;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr =
            "SELECT count(*) as totalNum FROM tbl_api WHERE status = 1 AND userId = " +
            userId +
            "";
        stmt = sql.prepare(sqlStr);
    } else {
        sqlStr =
            "SELECT count(*) as totalNum FROM tbl_api WHERE status = 1 AND userId = " +
            userId +
            " and methodDetail like $a";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + searchText + "%"
        });
    }
    stmt.step();
    let result = stmt.getAsObject().totalNum;
    sql.close();
    return result;
}

// 添加备忘录
export function addApi(api, thisObj) {
    // 检查有声书参数
    let result = checkAddApiMethodParam(api, thisObj);
    if (result) {
        // 将有声书插入
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let curDateTime = updateTime;
        let syncStatus = 0;
        let status = 1;
        let methodDetail = getMethodDetail(api);
        var sql = dbUtil.getSqlObj();
        let sqlstr =
            "INSERT INTO tbl_api(userId, lanId, toolId, methodName, methodIntro, method, methodDetail, curDateTime, updateTime, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", '" +
            api.lanId +
            "', '" +
            api.toolId +
            "', '" +
            api.methodName +
            "', '" +
            api.methodIntro +
            "', '" +
            api.method +
            "', '" +
            methodDetail +
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
        }
    } else {
        return false;
    }
    return result;
}

export function getCategoryIdByName(categorys, categoryName) {
    let id = 0;
    for (let index = 0; index < categorys.length; index++) {
        let element = categorys[index];
        if (element.label == categoryName) {
            id = element.value;
            break;
        }
    }
    return id;
}

export function getCategoryNameById(categorys, id) {
    let categoryName = "";
    for (let index = 0; index < categorys.length; index++) {
        let element = categorys[index];
        if (element.value == id) {
            categoryName = element.label;
            break;
        }
    }
    return categoryName;
}

export function getMethodDetail(api) {
    let methodDetail = "";
    let lanId = api.lanId;
    let lanStr = "";
    api.lan.apiLanCategorys.forEach(element => {
        if (element.value == lanId) {
            lanStr = element.label;
        }
    });
    let toolId = api.toolId;
    let toolStr = "";
    api.tool.apiToolCategorys.forEach(element => {
        if (element.value == toolId) {
            toolStr = element.label;
        }
    });
    methodDetail =
        lanStr + "," + toolStr + "," + api.methodName + "," + api.methodIntro;
    return methodDetail;
}

export function checkAddApiMethodParam(api, thisObj) {
    if ("" == api.lanId) {
        thisObj.$Message.warning({ content: "请输入语言类别!" });
    } else if ("" == api.toolId) {
        thisObj.$Message.warning({
            content: "请输入工具类别!"
        });
    } else if ("" == api.methodName) {
        thisObj.$Message.warning({
            content: "请输入方法名!"
        });
    } else if ("" == api.methodIntro) {
        thisObj.$Message.warning({
            content: "请输入方法说明!"
        });
    } else if ("" == api.method) {
        thisObj.$Message.warning({ content: "请输入方法!" });
    } else {
        return true;
    }
    return false;
}

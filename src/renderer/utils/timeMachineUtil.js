import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import * as todolistUtil from "@/utils/todolistUtil";
import path from "path";
import { remote } from "electron";
import types from "@/store/types.js";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

const Jimp = require("jimp");

// 查询todolist时间详情
export function getTimeMachineDetailByTodolistId(timeMachine) {
    let todolistId = timeMachine.todoListId;
    let date = util.dateForMat("yyyy-MM-dd", timeMachine.rightCurTime);
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let tags = [];
    let sqlStr =
        "SELECT	b.* FROM	(		SELECT			*		FROM			tbl_todolist		WHERE			id = $a	) AS a LEFT JOIN (	SELECT		max(progress),		c.* 	FROM		tbl_timeMachine AS c	WHERE		userId = 1	AND status = 1	GROUP BY		todolistId) AS b ON a.id = b.todolistId WHERE a.repeatType = 0";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: todolistId });
    stmt.step();
    let obj = stmt.getAsObject();
    if (obj.id != null) {
        tags = getTagsByIds(obj.tagIds);
        obj.tags = tags;
    }
    sql.close();
    return obj;
}

// 查询类别设置
export function queryCategorySetting(categoryId) {
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "select * from tbl_categorySetting WHERE categoryId = $a AND userId = " +
        userId +
        "";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: categoryId });
    stmt.step();
    let obj = stmt.getAsObject();
    sql.close();
    return obj;
}

// 保存设置
export function saveSetting(timeMachine, thisObj) {
    // 更新提醒时间
    let sql = dbUtil.getSqlObj();
    try {
        if (timeMachine.remindCycleStatus) {
            updateRemindCycleSetting(timeMachine, sql);
        }
        // 更新功能设置
        if (timeMachine.switchChange) {
            updateCategorySetting(timeMachine, sql);
        }

        dbUtil.writeDataToDB(sql);

        thisObj.$Message.success({ content: "更新设置成功!" });
    } catch (error) {
        thisObj.$Message.success({ content: "更新设置失败!" });
    }
}

// 更新功能设置
export function updateCategorySetting(timeMachine, sql) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let doWhatStatus = 0;
    let tagStatus = 0;
    let progressStatus = 0;
    let noteStatus = 0;
    let remarkStatus = 0;
    let attachStatus = 0;
    let consumeStatus = 0;
    let incomeStatus = 0;
    let categoryId = "";
    for (let i = 0; i < timeMachine.taskList.length; i++) {
        let todolistObj = timeMachine.taskList[i].todolist;
        if (timeMachine.todoListId == todolistObj.id) {
            categoryId = todolistObj.categoryId;
            break;
        }
    }
    if (timeMachine.categorySetting.doWhatStatus) {
        doWhatStatus = 1;
    }
    if (timeMachine.categorySetting.tagStatus) {
        tagStatus = 1;
    }
    if (timeMachine.categorySetting.progressStatus) {
        progressStatus = 1;
    }
    if (timeMachine.categorySetting.noteStatus) {
        noteStatus = 1;
    }
    if (timeMachine.categorySetting.remarkStatus) {
        remarkStatus = 1;
    }
    if (timeMachine.categorySetting.attachStatus) {
        attachStatus = 1;
    }
    if (timeMachine.categorySetting.consumeStatus) {
        consumeStatus = 1;
    }
    if (timeMachine.categorySetting.incomeStatus) {
        incomeStatus = 1;
    }
    let sqlStr =
        "update tbl_categorySetting set doWhatStatus = " +
        doWhatStatus +
        ", tagStatus = " +
        tagStatus +
        ", progressStatus = " +
        progressStatus +
        ", noteStatus = " +
        noteStatus +
        ", remarkStatus = " +
        remarkStatus +
        ", attachStatus = " +
        attachStatus +
        ", consumeStatus = " +
        consumeStatus +
        ", incomeStatus = " +
        incomeStatus +
        ", updateTime = '" +
        updateTime +
        "' WHERE userId = " +
        wsCache.get("user").id +
        " and categoryId = " +
        categoryId;
    sql.exec(sqlStr);
}

// 更新提醒时间设置
export function updateRemindCycleSetting(timeMachine, sql) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "update tbl_setting set remindCycle = " +
        timeMachine.remindCycle +
        ", updateTime = '" +
        updateTime +
        "' WHERE userId = " +
        wsCache.get("user").id +
        ";";
    sql.exec(sqlStr);
}

// 添加一条remindCycleSetting
export function addRemindCycleSetting(timeMachine) {
    let sql = dbUtil.getSqlObj();
    // 首先查询此记录是否存在
    let sqlstr = "select remindCycle  from tbl_setting WHERE userId = $a";
    let stmt = sql.prepare(sqlstr);
    stmt.bind({ $a: wsCache.get("user").id });
    stmt.step();
    let result = stmt.getAsObject();
    if (result.remindCycle != "" && result.remindCycle != null) {
        return result.remindCycle;
    }
    let updateTime = util.dateForMat("yyyy-MM-dd hh:mm:ss", new Date());
    let syncStatus = 0;
    let status = 1;
    sqlstr =
        "INSERT INTO tbl_setting(userId, remindCycle, updateTime, syncStatus, status) VALUES (" +
        wsCache.get("user").id +
        ", " +
        timeMachine.remindCycle +
        ", '" +
        updateTime +
        "', " +
        syncStatus +
        ", " +
        status +
        ")";
    let res = sql.exec(sqlstr);
    dbUtil.writeDataToDB(sql);
    return 60;
}

export function isConsumeCategory(todoListId) {
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT categoryIds FROM tbl_todolist WHERE id = $a AND userId = " +
        userId +
        "";
    let sql = dbUtil.getSqlObj();
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: todoListId });
    stmt.step();
    let categoryIds = stmt.getAsObject().categoryIds;
    sqlStr =
        "SELECT id FROM tbl_category WHERE categoryName = $a AND userId = " +
        userId +
        "";
    stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: "消费" });
    stmt.step();
    let categoryId = stmt.getAsObject().id;
    sql.close();
    if (categoryIds != undefined) {
        if (categoryIds.indexOf(categoryId) != -1) {
            return true;
        }
    }
    return false;
}

export function queryTaskByDate(date, thisObj) {
    let resultList = [];
    let resultObj = {};
    let result = todolistUtil.queryTodolistByDate(date, thisObj);
    if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
            let element = result[i];
            resultObj = queryTimeMachineByTodolistId(
                element.todolist.id,
                thisObj,
                date
            );
            if (resultObj.id == null || resultObj.id == "") {
                element.finished = false;
            } else {
                element.finished = true;
            }
            resultList.push(element);
        }
    }
    return resultList;
}

export function queryTimeMachineByTodolistId(todolistId, thisObj, date) {
    var sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let resultObj = {};
    let sqlStr =
        "SELECT * FROM tbl_timeMachine WHERE status = 1 AND userId = " +
        userId +
        " AND todolistId = $a AND SUBSTR(curDateTime, 1, 10) = $b AND progress = 100";
    try {
        let stmt = sql.prepare(sqlStr);
        date = util.dateForMat("yyyy-MM-dd", new Date(date));
        stmt.bind({ $a: todolistId, $b: date });
        stmt.step();
        resultObj = stmt.getAsObject();
    } catch (error) {
        thisObj.$Message.error({ content: "系统异常!" });
    }
    sql.close();
    return resultObj;
}

export function updateTimeMachine(timeMachine, thisObj) {
    try {
        deleteTimeMachineById(timeMachine.id, thisObj, types.UPDATE);
        submitTimeMachine(thisObj, timeMachine, types.UPDATE);
        thisObj.$Message.success({ content: "更新时间清单成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "更新时间清单失败!" });
    }
}

// 查询最后一次提交的结束时间段
export function queryLastSubmitTimeSlot(rightCurTime) {
    let sql = dbUtil.getSqlObj();
    let date = new Date(rightCurTime);
    date = util.dateForMat("yyyy-MM-dd", date);
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT max(substr(timeSlot, 7, 5)) as timeSlotEnd FROM tbl_timeMachine WHERE status = 1 AND userId = " +
        userId +
        " AND curDateTime LIKE $a;";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: "%" + date + "%" });
    stmt.step();
    let resultObj = stmt.getAsObject();
    sql.close();
    return resultObj.timeSlotEnd;
}

// 根据时间清单查询其附件
export function getAttachsById(busId, group) {
    let note = 0;
    let sql = dbUtil.getSqlObj();
    let uploadList = [];
    let obj = {};
    let tempObj = {};
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT attachNativeUrl, attachName, id FROM tbl_attach WHERE status = 1 AND userId = " +
        userId +
        " AND busId = $a AND attachGroup = $b";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: busId, $b: group });
    let tempId = busId + group;
    while (stmt.step()) {
        tempId += note++;
        tempObj = stmt.getAsObject();
        let obj = {
            name: tempObj.attachName,
            url: tempObj.attachNativeUrl,
            status: "finished",
            tempId: tempId,
            playStatus: 1,
            exist: true,
            id: tempObj.id
        };
        uploadList.push(obj);
    }
    sql.close();
    return uploadList;
}

// 根据id删除时间清单
export function deleteTimeMachineById(id, thisObj, type) {
    // let sqlStr = "delete from tbl_timeMachine WHERE id = " + id + "";
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "update tbl_timeMachine set status = 0, updateTime = '" +
        updateTime +
        "' WHERE id = " +
        id +
        ";";
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);

        if (null == type) {
            thisObj.$Message.success({ content: "删除时间清单成功!" });
        }
    } catch (error) {
        thisObj.$Message.error({ content: "删除时间清单失败!" });
    }
}

// 按日期查询时光机
export function queryTimeListByDate(timeMachine, thisObj) {
    var sql = dbUtil.getSqlObj();
    let timeList = [];
    let obj = {};
    let todolist = {};
    let tags = [];
    let timeMachineObj = {};
    let date = new Date(timeMachine.leftCurTime);
    date = util.dateForMat("yyyy-MM-dd", date);
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT a.*, SUBSTR(a.remark, 1, 12) AS briefRemark FROM tbl_timeMachine as a WHERE status = 1 AND userId = " +
        userId +
        " AND curDateTime LIKE $a order by timeSlot desc";
    try {
        let stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: "%" + date + "%" });
        while (stmt.step()) {
            timeMachineObj = stmt.getAsObject();
            todolist = getTodolistById(timeMachineObj.todolistId);
            tags = getTagsByIds(timeMachineObj.tagIds);
            if(todolist.endDate != undefined && todolist.endDate != "") {
                let endTimeNum = util.TimeCap(
                    new Date(date),
                    new Date(todolist.endDate)
                );
                todolist.endTimeNum = endTimeNum;
            }
            obj = {
                timeMachine: timeMachineObj,
                todolist: todolist,
                tags: tags
            };
            timeList.push(obj);
        }
        sql.close();
    } catch (error) {
        thisObj.$Message.error({ content: "系统异常!" });
    }
    return timeList;
}

// 根据todolistId获取todolist
export function getTodolistById(id) {
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT id, listName, SUBSTR(listName, 1, 5) AS briefListName, categoryId, endDate from tbl_todolist WHERE id = $a AND userId = " +
        userId +
        "";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: id });
    stmt.step();
    let obj = stmt.getAsObject();
    sql.close();
    return obj;
}

// 根据多个id获取tags
export function getTagsByIds(ids) {
    let sql = dbUtil.getSqlObj();
    let tags = [];
    let tagArr = ids.split(",");
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    tagArr.forEach(element => {
        sqlStr =
            "SELECT id, tagName from tbl_tag WHERE id in ($a) AND userId = " +
            userId +
            "";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: element });
        while (stmt.step()) {
            tags.push(stmt.getAsObject());
        }
    });
    sql.close();
    return tags;
}

// 提交时光机
export function submitTimeMachine(thisObj, timeMachine, type) {
    // 校验提交数据
    let result = checkSubmitTimeMachineMethodParam(thisObj, timeMachine);
    if (!result) {
        return result;
    }
    // 执行插入语句
    return execSubmitTimeMachine(thisObj, timeMachine, type);
}

export function getTagIdsByTagName(tags) {
    var sql = dbUtil.getSqlObj();
    let ids = [];
    let userId = wsCache.get("user").id;
    tags.forEach(tagName => {
        let sqlStr =
            "SELECT id from tbl_tag WHERE userId = " +
            userId +
            " and tagName IN('" +
            tagName +
            "')";
        let tempRes = sql.exec(sqlStr);
        tempRes = tempRes[0].values[0][0];
        ids.push(tempRes);
    });
    sql.close();
    return ids.join(",");
}

export function execSubmitTimeMachine(thisObj, timeMachine, type) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let curDateTime = timeMachine.rightCurTime.format("yyyy-MM-dd hh:mm:ss");
    let uploadList = timeMachine.uploadList;
    var sql = dbUtil.getSqlObj();
    let syncStatus = 0;
    let review = 1;
    let reviewNum = 0;
    let reviewDays = "";
    if (timeMachine.review) {
        let review = 1;
    }
    // 根据tagName获取tagId
    let tagIds = getTagIdsByTagName(timeMachine.tags);
    let sqlstr =
        "INSERT INTO tbl_timeMachine(userId, todolistId, tagIds, consumeTime, progressStatus, progress, timeSlot, remark, curDateTime, updateTime, syncStatus, status, consume, income, note, reviewDays, review, reviewNum) VALUES (" +
        wsCache.get("user").id +
        ", " +
        timeMachine.todoListId +
        ", '" +
        tagIds +
        "', " +
        timeMachine.consumeTime +
        ", " +
        timeMachine.progressStatus +
        ", " +
        timeMachine.progress +
        ", '" +
        timeMachine.timeSlot +
        "', '" +
        timeMachine.remark +
        "', '" +
        curDateTime +
        "', '" +
        updateTime +
        "', " +
        syncStatus +
        ", " +
        timeMachine.status +
        ", " +
        timeMachine.consume +
        ", " +
        timeMachine.income +
        ", '" +
        timeMachine.note +
        "', '" +
        reviewDays +
        "', " +
        review +
        ", " +
        reviewNum +
        ")";
    try {
        sql.exec(sqlstr);
        let tempRes = getLastInsertRowId(sql);
        timeMachine.id = tempRes;
        timeMachine.lastSubmitTimeSlot = timeMachine.timeSlotEnd;
        // 处理附件
        if (timeMachine.uploadList.length > 0) {
            handleAttach(
                timeMachine.uploadList,
                tempRes,
                wsCache.get("user").id,
                sql
            );
        }
        // 处理复习提醒
        // if (timeMachine.review) {
        //     handleNoteRemind();
        // }
        dbUtil.writeDataToDB(sql);
        if (null == type) {
            thisObj.$Message.success({
                content: "添加时间清单成功!"
            });
        }
    } catch (error) {
        thisObj.$Message.error({ content: "添加时间清单失败!" });
    }
}

// 获取最近插入的rowid
export function getLastInsertRowId(sql) {
    let flag = false;
    if (null == sql) {
        sql = dbUtil.getSqlObj();
        flag = true;
    }
    let sqlStr = "select last_insert_rowid()";
    let tempRes = sql.exec(sqlStr);
    tempRes = tempRes[0].values[0][0];
    if (flag) {
        sql.close();
    }
    return tempRes;
}

// 处理笔记中出现的图片
export function handleNoteAttach(fileName, nativePath) {
    let curTimeNum = new Date().getTime();
    fileName = curTimeNum + "-" + fileName;
    let attachPath = dbUtil.getAttachmentPath(fileName);
    Jimp.read(nativePath, function(err, lenna) {
        lenna
            .resize(256, 256) // resize
            .quality(100) // set JPEG quality
            //.greyscale() // set greyscale
            .write(attachPath); // save
    });
    let returnPath = util.transPath2(attachPath);
    return returnPath;
}

// 处理附件
export function handleAttach(uploadList, id, userId, sql) {
    for (let index = 0; index < uploadList.length; index++) {
        let element = uploadList[index];
        let nativePath = util.transPath(element.url);
        let attachPath = dbUtil.getAttachmentPath(element.name);
        attachPath = util.transPath(attachPath);
        Jimp.read(nativePath, function(err, lenna) {
            lenna
                .resize(256, 256) // resize
                .quality(100) // set JPEG quality
                //.greyscale() // set greyscale
                .write(attachPath); // save
        });
        // 插入附件
        insertAttach(
            id,
            userId,
            element.name,
            attachPath,
            sql,
            types.TIMEMACHINE_GROUP
        );
    }
}

export function insertAttach(id, userId, attachName, attachPath, sql, group) {
    let curDateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let updateTime = curDateTime;
    let syncStatus = 0;
    let status = 1;
    let sqlstr =
        "INSERT INTO tbl_attach(userId, busId, attachName, attachNativeUrl, attachGroup, curDateTime, updateTime, syncStatus, status) VALUES (" +
        wsCache.get("user").id +
        ", " +
        id +
        ", '" +
        attachName +
        "', '" +
        attachPath +
        "', '" +
        group +
        "', '" +
        curDateTime +
        "', '" +
        updateTime +
        "', " +
        syncStatus +
        ", " +
        status +
        ")";
    let res = sql.exec(sqlstr);
}

export function getConsumeTime(timeMachine) {
    let timeSlotStart = timeMachine.timeSlotStart;
    let timeSlotEnd = timeMachine.timeSlotEnd;
    let timeSlotStartArr = timeSlotStart.split(":");
    let timeSlotEndArr = timeSlotEnd.split(":");
    return (
        (timeSlotEndArr[0] - timeSlotStartArr[0]) * 60 +
        (timeSlotEndArr[1] - timeSlotStartArr[1])
    );
}

export function checkSubmitTimeMachineMethodParam(thisObj, timeMachine) {
    let flag = false;
    if (null == timeMachine) {
        thisObj.$Message.warning({ content: "参数为null!" });
    } else if (
        "" == timeMachine.timeSlotStart ||
        "" == timeMachine.timeSlotEnd
    ) {
        thisObj.$Message.warning({
            content: "请输入开始时间或结束时间"
        });
    } else if ("" == timeMachine.todoListId) {
        thisObj.$Message.warning({
            content: "请输入你正在做的事情"
        });
    } else if ("" == timeMachine.tags) {
        thisObj.$Message.warning({ content: "请输入一个标签" });
    } else if ("" == timeMachine.progress) {
        thisObj.$Message.warning({ content: "请输入事件的进度" });
    } else if (timeMachine.consumeTime < 0) {
        thisObj.$Message.warning({ content: "结束时间必须大于开始时间" });
    } else {
        return true;
    }
    return flag;
}

export function deleteTag(obj) {
    // 查询此用户所拥有的所有tag
    let tagId = obj.tagId;
    let sql = dbUtil.getSqlObj();
    let thisObj = obj.thisObj;
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    //let sqlStr = "DELETE FROM tbl_tag WHERE id = " + tagId + ";";
    let sqlStr =
        "update tbl_tag set status = 0, updateTime = '" +
        updateTime +
        "' WHERE id = " +
        tagId +
        ";";
    try {
        sql.exec(sqlStr);
        dbUtil.writeDataToDB(sql);

        thisObj.$Message.success({ content: "删除标签成功!" });
        return true;
    } catch (err) {
        thisObj.$Message.error({ content: "删除标签失败!" });
        return false;
    }
}

export function addTag(timeMachine, thisObj) {
    // 1. 判断标签是否已经存在
    let tagName = timeMachine.tagName;
    let userId = wsCache.get("user").id;
    let result = isTagRepeat(tagName, thisObj);
    if (result != "") {
        return result;
    }
    // 2. 添加标签
    result = execAddTagSql(tagName, userId, thisObj);
    return result;
}

export function execAddTagSql(tagName, userId, thisObj) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let syncStatus = 0;
    let status = 1;
    let sql = dbUtil.getSqlObj();
    let sqlstr =
        "INSERT INTO tbl_tag(userId, tagName, updateTime, syncStatus, status) VALUES (" +
        wsCache.get("user").id +
        ", '" +
        tagName +
        "', '" +
        updateTime +
        "', " +
        syncStatus +
        ", " +
        status +
        ")";
    let res = sql.exec(sqlstr);
    dbUtil.writeDataToDB(sql);

    if (res != null) {
        thisObj.$Message.success({ content: "添加标签成功!" });
        return types.SUCCESS;
    } else {
        thisObj.$Message.error({ content: "添加标签失败!" });
        return types.FAILURE;
    }
}

export function isTagRepeat(tagName, thisObj) {
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT count(tagName) FROM tbl_tag WHERE status = 1 AND userId = " +
        userId +
        " AND  tagName = '" +
        tagName +
        "';";
    let sql = dbUtil.getSqlObj();
    let tempRes = sql.exec(sqlStr);
    sql.close();
    tempRes = tempRes[0].values[0][0];
    if (tempRes > 0) {
        thisObj.$Message.warning({ content: "此标签已存在!" });
        return types.TAG_REPEAT_CODE;
    } else {
        return "";
    }
}

export function queryAllTags() {
    // 查询此用户所拥有的所有tag
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT id, tagName FROM tbl_tag WHERE status = 1 AND userId = " +
        userId +
        ";";
    let tempRes = sql.exec(sqlStr);
    sql.close();
    let res = [];
    if (tempRes.length == 0) {
        return res;
    }
    for (let index = 0; index < tempRes[0].values.length; index++) {
        let id = tempRes[0].values[index][0];
        let tagName = tempRes[0].values[index][1];
        let obj = { id: id, tagName: tagName };
        res.push(obj);
    }
    return res;
}

export function queryTags(query) {
    // 查询此用户所拥有的所有tag
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT id, tagName FROM tbl_tag WHERE status = 1 AND userId = " +
        userId +
        " AND tagName like '%" +
        query +
        "%';";
    let sql = dbUtil.getSqlObj();
    let tempRes = sql.exec(sqlStr);
    sql.close();
    let res = [];
    if (tempRes.length == 0) {
        return res;
    }
    for (let index = 0; index < tempRes[0].values.length; index++) {
        let id = tempRes[0].values[index][0];
        let tagName = tempRes[0].values[index][1];
        let obj = { id: id, tagName: tagName };
        res.push(obj);
    }
    return res;
}

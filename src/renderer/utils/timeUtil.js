import * as util from "@/utils/util.js";
import * as dbUtil from "@/utils/dbUtil";
import * as timeMachineUtil from "@/utils/timeMachineUtil.js";
import * as knowledgeUtil from "@/utils/knowledgeUtil.js";
import * as dashboardUtil from "@/utils/dashboardUtil.js";
import * as consumeUtil from "@/utils/consumeUtil.js";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 显示timebook
export function showTimeBook(param, time) {
    let sql = dbUtil.getSqlObj();
    let sqlStr = "";
    let timeList = [];
    let stmt = {};
    let date = time.allTimeOfDays[param.index].curDateTime;
    let timeMachineList = [];
    let knowledgeList = [];
    let targetList = [];
    let consumeList = [];
    let summaryList = [];
    let videoList = [];
    let voiceList = [];
    let picList = [];
    let dicList = [];
    let pageDetailList = [];
    let oriPageNum = 2;
    let pageNum = 2;
    let pageEle = 15;
    let oriPageEle = 15;
    let userId = wsCache.get("user").id;
    if (time.dateType == 1) {
        date = util.dateForMat("yyyy-MM-dd", new Date(date));
        timeList.push(date);
    } else if (time.dateType == 2) {
        date = util.dateForMat("yyyy-MM", new Date(date));
        sqlStr =
            "SELECT 	SUBSTR(curDateTime, 1, 10) AS curDateTime FROM 	tbl_timeMachine WHERE 	status = 1 AND userId = " +
            userId +
            " AND SUBSTR(curDateTime, 1, 7) = $a GROUP BY 	SUBSTR(curDateTime, 1, 10) ORDER BY 	curDateTime DESC ";
    } else if (time.dateType == 3) {
        date = util.dateForMat("yyyy", new Date(date));
        sqlStr =
            "SELECT 	SUBSTR(curDateTime, 1, 10) AS curDateTime FROM 	tbl_timeMachine WHERE 	status = 1 AND userId = " +
            userId +
            " AND SUBSTR(curDateTime, 1, 4) = $a GROUP BY 	SUBSTR(curDateTime, 1, 10) ORDER BY 	curDateTime DESC ";
    }

    if (sqlStr != "") {
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: date });
        while (stmt.step()) {
            timeList.push(stmt.getAsObject().curDateTime);
        }
    }
    timeList.forEach(date => {
        time.allTimeOfDays[param.index].curDateTime = date;
        timeMachineList = queryTimeMachineListByDate(
            param.thisObj,
            time,
            param.index,
            param.timeMachine
        );
        knowledgeList = queryKnowledgesByDate(
            param.thisObj,
            time,
            param.index,
            param.knowledge
        );
        targetList = queryTargetListByDate(
            param.thisObj,
            time,
            param.index,
            param.dashboard
        );
        consumeList = queryConsumesByDate(
            param.thisObj,
            time,
            param.index,
            param.consume
        );
        summaryList = querySummaryListByDate(param, time);
        voiceList = queryVoiceListByDate(param.thisObj, time, param.index);
        videoList = queryVideoListByDate(param.thisObj, time, param.index);
        picList = queryPicListByDate(param.thisObj, time, param.index);

        if (timeMachineList.length > 0) {
            pageNum = setDicContent(
                timeMachineList,
                dicList,
                pageDetailList,
                pageNum,
                pageEle,
                oriPageEle,
                "timeMachine",
                "时间清单",
                date
            );
        }
        if (knowledgeList.length > 0) {
            pageNum = setDicContent(
                knowledgeList,
                dicList,
                pageDetailList,
                pageNum,
                pageEle,
                oriPageEle,
                "knowledge",
                "知识清单",
                date
            );
        }
        if (targetList.length > 0) {
            pageNum = setDicContent(
                targetList,
                dicList,
                pageDetailList,
                pageNum,
                pageEle,
                oriPageEle,
                "target",
                "目标清单",
                date
            );
        }
        if (consumeList.length > 0) {
            pageNum = setDicContent(
                consumeList,
                dicList,
                pageDetailList,
                pageNum,
                pageEle,
                oriPageEle,
                "consume",
                "消费清单",
                date
            );
        }
        if (summaryList.length > 0) {
            pageNum = setDicContent(
                summaryList,
                dicList,
                pageDetailList,
                pageNum,
                pageEle,
                oriPageEle,
                "summary",
                "一日小结",
                date
            );
        }
        if (voiceList.length > 0) {
            pageNum = setDicContent(
                voiceList,
                dicList,
                pageDetailList,
                pageNum,
                pageEle,
                oriPageEle,
                "voice",
                "有声读物",
                date
            );
        }
        if (videoList.length > 0) {
            pageNum = setDicContent(
                videoList,
                dicList,
                pageDetailList,
                pageNum,
                pageEle,
                oriPageEle,
                "video",
                "视频",
                date
            );
        }
        if (picList.length > 0) {
            pageNum = setDicContent(
                picList,
                dicList,
                pageDetailList,
                pageNum,
                pageEle,
                oriPageEle,
                "pic",
                "相册",
                date
            );
        }
    });

    // 设置目录
    let tempValue = 0;
    let tempDate = "";
    let dateCount = 1;
    let tempObj = {};
    let tempDicList = [];
    let initPageNum = 2;
    for (let i = 0; i < pageDetailList.length; i++) {
        tempValue++;
        let obj = pageDetailList[i];
        for (let j = 0; j < tempDicList.length; j++) {
            let element = tempDicList[j];
            if (obj.date == element.date) {
                if (obj.category != element.category) {
                    tempDicList.push(obj);
                    break;
                }
            } 
        }
        if (i == 0) {
            tempDicList.push(obj);
            tempDate = obj.date;
        }
        if (tempDate != obj.date) {
            tempDicList.push(obj);
            dateCount++;
            tempDate = obj.date;
        }
        if (dateCount + tempValue >= 24) {
            let tempObj = {
                list: tempDicList,
                pageNum: ++initPageNum,
                category: "directory",
                dicName: "目录",
                date: null
            };
            dicList.push(tempObj);
            tempDicList = [];
            dateCount = 0;
            tempValue = 0;
        }
        if (i == pageDetailList.length - 1 && dateCount != 0) {
            let tempObj = {
                list: tempDicList,
                pageNum: ++initPageNum,
                category: "directory",
                dicName: "目录",
                date: null
            };
            dicList.push(tempObj);
        }
    }

    // 根据目录页数, 修改内容页数
    // let addPage = dicList.length +  - oriPageNum;
    pageDetailList.forEach(obj => {
        obj.pageNum = obj.pageNum + dicList.length;
    });
    // 修改目录里面的内容页数
    for (let i = 0; i < dicList.length; i++) {
        let contentList = dicList[i].list;
        for (let j = 0; j < contentList.length; j++) {
            let contentDetailList = contentList[j].list;
            for (let n = 0; n < contentDetailList.length; n++) {
                let contentDetailObj = contentDetailList[n];
                contentDetailObj.pageNum =
                    contentDetailObj.pageNum + dicList.length;
            }
        }
    }

    let resultObj = {
        dicList: dicList,
        pageDetailList: pageDetailList,
        timeBookTotalPageNum: pageNum - oriPageNum
    };
    return resultObj;
}

// 设置字典
export function setDicContent(
    list,
    dicList,
    pageDetailList,
    pageNum,
    pageEle,
    oriPageEle,
    category,
    dicName,
    date
) {
    let count = list.length / 15;
    if (count < 1) {
        let obj = {
            list: list,
            pageNum: ++pageNum,
            category: category,
            dicName: dicName,
            date: date
        };
        pageDetailList.push(obj);
    } else {
        for (let index = 0; index <= count; index++) {
            if (index * pageEle + pageEle > list.length) {
                pageEle = list.length - index * pageEle;
            }
            let obj = {
                list: list.slice(
                    index * oriPageEle,
                    index * oriPageEle + pageEle
                ),
                pageNum: ++pageNum,
                category: category,
                dicName: dicName,
                date: date
            };
            pageDetailList.push(obj);
        }
        pageEle = 15;
    }
    return pageNum;
}

// 查询timeMachine
export function queryTimeMachineListByDate(thisObj, time, index, timeMachine) {
    let resultList = [];
    let oriLeftCurTime = timeMachine.leftCurTime;
    timeMachine.leftCurTime = time.allTimeOfDays[index].curDateTime;
    resultList = timeMachineUtil.queryTimeListByDate(timeMachine, thisObj);
    resultList.forEach(element => {
        element.timeMachine.isShow = false;
        element.timeMachine.oriShow = element.timeMachine.show;
    });
    timeMachine.leftCurTime = oriLeftCurTime;
    return resultList;
}
// 查询knowledge
export function queryKnowledgesByDate(thisObj, time, index, knowledge) {
    let resultList = [];
    let oriCurTime = knowledge.curDateTime;
    knowledge.curDateTime = time.allTimeOfDays[index].curDateTime;
    resultList = knowledgeUtil.queryKnowledgeListByDate(thisObj, knowledge);
    resultList.forEach(element => {
        element.isShow = false;
        element.oriNoteShow = element.noteShow;
    });
    knowledge.curDateTime = oriCurTime;
    return resultList;
}
// 查询target
export function queryTargetListByDate(thisObj, time, index, dashboard) {
    let resultList = [];
    let oriCurTime = dashboard.curDateTime;
    dashboard.curDateTime = time.allTimeOfDays[index].curDateTime;
    resultList = dashboardUtil.getTargetByDate(thisObj, dashboard);
    resultList.forEach(element => {
        element.isShow = false;
        element.oriShow = element.show;
    });
    dashboard.curDateTime = oriCurTime;
    return resultList;
}
// 查询consume
export function queryConsumesByDate(thisObj, time, index, consume) {
    let resultList = [];
    let oriCurTime = consume.curDateTime;
    consume.curDateTime = time.allTimeOfDays[index].curDateTime;
    resultList = consumeUtil.queryConsumeListByDate(
        thisObj,
        new Date(consume.curDateTime)
    );
    resultList.forEach(element => {
        element.isShow = false;
        element.oriConsumeShow = element.consumeShow;
    });
    consume.curDateTime = oriCurTime;
    return resultList;
}

// 保存时光走廊设置
export function saveTimeSetting(thisObj, time) {
    let sql = dbUtil.getSqlObj();
    try {
        // 更新时光清单, 知识清单, 消费清单
        updateTimeMachineTimeSetting(sql, time);
        updateKnowledgeTimeSetting(sql, time);
        updateConsumeTimeSetting(sql, time);
        // 更新目标清单
        updateTargetTimeSetting(sql, time);
        // 更新总结清单
        updateSummaryTimeSetting(sql, time);
        // 更新有声读物, 相册, 视频
        updateVoiceTimeSetting(sql, time);
        updatePicTimeSetting(sql, time);
        updateVideoTimeSetting(sql, time);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({ content: "操作成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "操作失败!" });
    }
}

// 更新有声读物
export function updateVideoTimeSetting(sql, time) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let show = 1;
    let sqlStr = "";
    time.videoList.forEach(video => {
        if (video.show != video.oriShow) {
            sqlStr =
                "UPDATE tbl_attach set updateTime = '" +
                updateTime +
                "', show = " +
                video.show +
                " WHERE id = " +
                video.attachId +
                ";";
            sql.run(sqlStr);
        }
    });
}
// 更新有声读物
export function updatePicTimeSetting(sql, time) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let show = 1;
    let sqlStr = "";
    time.picList.forEach(pic => {
        if (pic.show != pic.oriShow) {
            sqlStr =
                "UPDATE tbl_attach set updateTime = '" +
                updateTime +
                "', show = " +
                pic.show +
                " WHERE id = " +
                pic.attachId +
                ";";
            sql.run(sqlStr);
        }
    });
}
// 更新有声读物
export function updateVoiceTimeSetting(sql, time) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let show = 1;
    let sqlStr = "";
    time.voiceList.forEach(voice => {
        if (voice.show != voice.oriShow) {
            sqlStr =
                "UPDATE tbl_attach set updateTime = '" +
                updateTime +
                "', show = " +
                voice.show +
                " WHERE id = " +
                voice.attachId +
                ";";
            sql.run(sqlStr);
        }
    });
}

// 更新时光清单显示设置
export function updateSummaryTimeSetting(sql, time) {
    let date = util.dateForMat(
        "yyyy-MM-dd",
        new Date(time.allTimeOfDays[time.index].curDateTime)
    );
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let curDateTime = updateTime;
    let show = 1;
    let sqlStr = "";
    time.summaryList.forEach(summary => {
        if (
            summary.exist == 0 &&
            summary.summaryShow != summary.oriSummaryShow
        ) {
            if (summary.group != "工作") {
                summary.todolistId = 0;
            }
            sqlStr =
                "INSERT INTO tbl_summary(userId, todolistId, groupName, summaryShow, curDateTime, oriCurDateTime, updateTime, syncStatus, status) VALUES (" +
                wsCache.get("user").id +
                ", " +
                summary.todolistId +
                ", '" +
                summary.group +
                "', '" +
                summary.summaryShow +
                "', '" +
                curDateTime +
                "', '" +
                date +
                "', '" +
                updateTime +
                "', " +
                0 +
                ", " +
                1 +
                ")";
            sql.run(sqlStr);
        } else if (
            summary.exist == 1 &&
            summary.summaryShow != summary.oriSummaryShow
        ) {
            sqlStr =
                "UPDATE tbl_summary set updateTime = '" +
                updateTime +
                "', summaryShow = " +
                summary.summaryShow +
                " WHERE id = " +
                summary.id +
                ";";
            sql.run(sqlStr);
        }
    });
}
// 更新时光清单显示设置
export function updateTargetTimeSetting(sql, time) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let show = 1;
    let sqlStr = "";
    time.targetList.forEach(target => {
        if (target.show != target.oriShow) {
            sqlStr =
                "UPDATE tbl_target set updateTime = '" +
                updateTime +
                "', show = " +
                target.show +
                " WHERE id = " +
                target.id +
                ";";
            sql.run(sqlStr);
        }
    });
}
// 更新时光清单显示设置
export function updateConsumeTimeSetting(sql, time) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let show = 1;
    let sqlStr = "";
    time.consumeList.forEach(consume => {
        if (consume.consumeShow != consume.oriConsumeShow) {
            sqlStr =
                "UPDATE tbl_timeMachine set updateTime = '" +
                updateTime +
                "', consumeShow = " +
                consume.consumeShow +
                " WHERE id = " +
                consume.id +
                ";";
            sql.run(sqlStr);
        }
    });
}
// 更新时光清单显示设置
export function updateKnowledgeTimeSetting(sql, time) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let show = 1;
    let sqlStr = "";
    time.knowledgeList.forEach(knowledge => {
        if (knowledge.noteShow != knowledge.oriNoteShow) {
            sqlStr =
                "UPDATE tbl_timeMachine set updateTime = '" +
                updateTime +
                "', noteShow = " +
                knowledge.noteShow +
                " WHERE id = " +
                knowledge.id +
                ";";
            sql.run(sqlStr);
        }
    });
}
// 更新时光清单显示设置
export function updateTimeMachineTimeSetting(sql, time) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let show = 1;
    let sqlStr = "";
    time.timeMachineList.forEach(ele => {
        if (ele.timeMachine.show != ele.timeMachine.oriShow) {
            sqlStr =
                "UPDATE tbl_timeMachine set updateTime = '" +
                updateTime +
                "', show = " +
                ele.timeMachine.show +
                " WHERE id = " +
                ele.timeMachine.id +
                ";";
            sql.run(sqlStr);
        }
    });
}

// 根据日期查询videoBook
export function queryVideoListByDate(thisObj, time, index) {
    let sql = dbUtil.getSqlObj();
    let videoBooks = [];
    let resultObj = {};
    let userId = wsCache.get("user").id;
    let date = util.dateForMat(
        "yyyy-MM-dd",
        new Date(time.allTimeOfDays[index].curDateTime)
    );
    let sqlStr =
        "SELECT 	b.id id,	b.category AS category,	a.id AS attachId, a.show as show,	a.attachName AS attachName, a.attachNativeUrl as url FROM 	(		SELECT 			* 		FROM 			tbl_attach 		WHERE 			SUBSTR(curDateTime, 1, 10) = $a 		AND status = 1 AND userId = " +
        userId +
        " 		AND attachGroup = 'Video_Video_Group' 	) AS a LEFT JOIN tbl_video AS b ON b.id = a.busId WHERE 	b.status = 1 ";
    try {
        let stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: date });
        while (stmt.step()) {
            resultObj = stmt.getAsObject();
            resultObj.isShow = false;
            resultObj.oriShow = resultObj.show;
            videoBooks.push(resultObj);
        }
    } catch (error) {
        thisObj.$Message.error({ content: "系统异常!" });
    }
    sql.close();
    return videoBooks;
}
// 根据日期查询picBook
export function queryPicListByDate(thisObj, time, index) {
    let sql = dbUtil.getSqlObj();
    let picBooks = [];
    let resultObj = {};
    let userId = wsCache.get("user").id;
    let date = util.dateForMat(
        "yyyy-MM-dd",
        new Date(time.allTimeOfDays[index].curDateTime)
    );
    let sqlStr =
        "SELECT 	b.id id,	b.category AS category,	a.id AS attachId, a.show as show,	a.attachName AS attachName, a.attachNativeUrl as url FROM 	(		SELECT 			* 		FROM 			tbl_attach 		WHERE 			SUBSTR(curDateTime, 1, 10) = $a 		AND status = 1 AND userId = " +
        userId +
        " 		AND attachGroup = 'Pic_Img_Group' 	) AS a LEFT JOIN tbl_pic AS b ON b.id = a.busId WHERE 	b.status = 1";
    try {
        let stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: date });
        while (stmt.step()) {
            resultObj = stmt.getAsObject();
            resultObj.isShow = false;
            resultObj.oriShow = resultObj.show;
            picBooks.push(resultObj);
        }
    } catch (error) {
        thisObj.$Message.error({ content: "系统异常!" });
    }
    sql.close();
    return picBooks;
}
// 根据日期查询voiceBook
export function queryVoiceListByDate(thisObj, time, index) {
    let sql = dbUtil.getSqlObj();
    let voiceBooks = [];
    let resultObj = {};
    let userId = wsCache.get("user").id;
    let date = util.dateForMat(
        "yyyy-MM-dd",
        new Date(time.allTimeOfDays[index].curDateTime)
    );
    let sqlStr =
        "SELECT 	b.id id,	b.bookName AS bookName,	a.id AS attachId, a.show as show,	a.attachName AS attachName, a.attachNativeUrl as url FROM 	(		SELECT 			* 		FROM 			tbl_attach 		WHERE 			SUBSTR(curDateTime, 1, 10) = $a 		AND status = 1 AND userId = " +
        userId +
        " 		AND attachGroup = 'Voice_Audio_Group' 	) AS a LEFT JOIN tbl_book AS b ON b.id = a.busId WHERE 	b.status = 1";
    try {
        let stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: date });
        while (stmt.step()) {
            resultObj = stmt.getAsObject();
            resultObj.isShow = false;
            resultObj.oriShow = resultObj.show;
            voiceBooks.push(resultObj);
        }
    } catch (error) {
        thisObj.$Message.error({ content: "系统异常!" });
    }
    sql.close();
    return voiceBooks;
}

// 查询所有的summary
export function querySummaryListByDate(param, time) {
    let sql = dbUtil.getSqlObj();
    let stmt = {};
    let resultObj = {};
    let sqlStr = "";
    let userId = wsCache.get("user").id;
    param.dashboard.curDateTime = time.allTimeOfDays[param.index].curDateTime;
    let date = util.dateForMat(
        "yyyy-MM-dd",
        new Date(param.dashboard.curDateTime)
    );
    let resultList = dashboardUtil.getSummaryByDate(
        param.thisObj,
        param.dashboard
    );
    resultList.forEach(element => {
        element.isShow = false;
        if (element.group == "工作") {
            sqlStr =
                "SELECT a.summaryShow, a.id from tbl_summary AS a WHERE a.todolistId = $a AND a.groupName = $b AND a.oriCurDateTime = $c AND status = 1 AND userId = " +
                userId +
                "";
            stmt = sql.prepare(sqlStr);
            stmt.bind({ $a: element.todolistId, $b: element.group, $c: date });
        } else {
            sqlStr =
                "SELECT a.summaryShow, a.id from tbl_summary AS a WHERE a.groupName = $b AND a.oriCurDateTime = $c  AND status = 1 AND userId = " +
                userId +
                "";
            stmt = sql.prepare(sqlStr);
            stmt.bind({ $b: element.group, $c: date });
        }
        stmt.step();
        do {
            resultObj = stmt.getAsObject();
            if (undefined == resultObj.summaryShow) {
                element.summaryShow = 1;
                element.exist = 0;
                element.oriSummaryShow = 1;
            } else {
                element.summaryShow = resultObj.summaryShow;
                element.oriSummaryShow = resultObj.summaryShow;
                element.exist = 1;
                element.id = resultObj.id;
            }
        } while (stmt.step());
    });
    return resultList;
}

// 查询所有的time
export function queryAllTime(thisObj, time) {
    let sql = dbUtil.getSqlObj();
    let timeBooks = [];
    let curPageNum = time.curPageNum;
    let pageSize = time.pageSize;
    let startPage = (curPageNum - 1) * pageSize;
    let sqlStr = "";
    let userId = wsCache.get("user").id;
    let stmt = {};
    if (
        time.dateType == 1 &&
        time.curDateTime != null &&
        time.curDateTime != ""
    ) {
        let date = util.dateForMat("yyyy-MM-dd", time.curDateTime);
        sqlStr =
            "SELECT SUBSTR(curDateTime, 1, 10) as curDateTime FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " AND SUBSTR(curDateTime, 1, 10) = $a GROUP BY SUBSTR(curDateTime, 1, 10)";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: date });
    } else if (
        time.dateType == 2 &&
        time.curDateTime != null &&
        time.curDateTime != ""
    ) {
        let date = util.dateForMat("yyyy-MM", time.curDateTime);
        sqlStr =
            "SELECT SUBSTR(curDateTime, 1, 7) as curDateTime FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " AND SUBSTR(curDateTime, 1, 7) = $a GROUP BY SUBSTR(curDateTime, 1, 7)";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: date });
    } else if (
        time.dateType == 3 &&
        time.curDateTime != null &&
        time.curDateTime != ""
    ) {
        let date = util.dateForMat("yyyy", time.curDateTime);
        sqlStr =
            "SELECT SUBSTR(curDateTime, 1, 4) as curDateTime FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " AND SUBSTR(curDateTime, 1, 4) = $a GROUP BY SUBSTR(curDateTime, 1, 4)";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: date });
    } else if (
        time.dateType == 1 &&
        (time.curDateTime == "" || time.curDateTime == null)
    ) {
        sqlStr =
            "SELECT SUBSTR(curDateTime, 1, 10) as curDateTime FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " GROUP BY SUBSTR(curDateTime, 1, 10) ORDER BY curDateTime  DESC limit $b, $c ";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $b: startPage, $c: pageSize });
    } else if (
        time.dateType == 2 &&
        (time.curDateTime == "" || time.curDateTime == null)
    ) {
        sqlStr =
            "SELECT SUBSTR(curDateTime, 1, 7) as curDateTime FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " GROUP BY SUBSTR(curDateTime, 1, 7) ORDER BY curDateTime  DESC limit $b, $c ";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $b: startPage, $c: pageSize });
    } else if (
        time.dateType == 3 &&
        (time.curDateTime == "" || time.curDateTime == null)
    ) {
        sqlStr =
            "SELECT SUBSTR(curDateTime, 1, 4) as curDateTime FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " GROUP BY SUBSTR(curDateTime, 1, 4) ORDER BY curDateTime  DESC limit $b, $c ";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $b: startPage, $c: pageSize });
    }
    try {
        while (stmt.step()) {
            timeBooks.push(stmt.getAsObject());
        }
    } catch (error) {
        thisObj.$Message.error({ content: "系统异常!" });
    }
    sql.close();
    return timeBooks;
}

// 查询所有time的个数
export function queryAllTimeNum(thisObj, time) {
    let sql = dbUtil.getSqlObj();
    let result = 0;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if (
        time.dateType == 1 &&
        time.curDateTime != null &&
        time.curDateTime != ""
    ) {
        let date = util.dateForMat("yyyy-MM-dd", time.curDateTime);
        sqlStr =
            "SELECT count(*) as totalNum FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " AND SUBSTR(curDateTime, 1, 10) = $a GROUP BY SUBSTR(curDateTime, 1, 10)";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: date });
    } else if (
        time.dateType == 2 &&
        time.curDateTime != null &&
        time.curDateTime != ""
    ) {
        let date = util.dateForMat("yyyy-MM", time.curDateTime);
        sqlStr =
            "SELECT  count(*) as totalNum FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " AND SUBSTR(curDateTime, 1, 7) = $a GROUP BY SUBSTR(curDateTime, 1, 7)";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: date });
    } else if (
        time.dateType == 3 &&
        time.curDateTime != null &&
        time.curDateTime != ""
    ) {
        let date = util.dateForMat("yyyy", time.curDateTime);
        sqlStr =
            "SELECT  count(*) as totalNum FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " AND SUBSTR(curDateTime, 1, 4) = $a GROUP BY SUBSTR(curDateTime, 1, 4)";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: date });
    } else if (
        time.dateType == 1 &&
        (time.curDateTime == "" || time.curDateTime == null)
    ) {
        sqlStr =
            "SELECT count(*) as totalNum FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " GROUP BY SUBSTR(curDateTime, 1, 10) ORDER BY curDateTime  DESC";
        stmt = sql.prepare(sqlStr);
    } else if (
        time.dateType == 2 &&
        (time.curDateTime == "" || time.curDateTime == null)
    ) {
        sqlStr =
            "SELECT count(*) as totalNum FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " GROUP BY SUBSTR(curDateTime, 1, 7) ORDER BY curDateTime  DESC";
        stmt = sql.prepare(sqlStr);
    } else if (
        time.dateType == 3 &&
        (time.curDateTime == "" || time.curDateTime == null)
    ) {
        sqlStr =
            "SELECT count(*) as totalNum FROM tbl_timeMachine WHERE status = 1 AND userId = " +
            userId +
            " GROUP BY SUBSTR(curDateTime, 1, 4) ORDER BY curDateTime  DESC ";
        stmt = sql.prepare(sqlStr);
    }
    try {
        stmt.step();
        result = stmt.getAsObject().totalNum;
    } catch (error) {
        thisObj.$Message.error({ content: "系统异常!" });
    }
    sql.close();
    return result;
}

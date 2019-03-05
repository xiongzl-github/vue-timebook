import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 查询情绪趋势当天数据
export function queryEmotionTrendData(thisObj, emotion) {
    let sql = dbUtil.getSqlObj();
    let result = {};
    let resultObj = {};
    let resultObjList = [];
    let tempObj = {};
    let userId = wsCache.get("user").id;
    let date = util.dateForMat("yyyy-MM-dd", emotion.trendYearMonth);
    let dateArr = date.split("-");
    let year = dateArr[0];
    let month = dateArr[1];
    let day = dateArr[2];
    let sqlStr = "";
    let firstDay = "";
    let lastDay = "";
    let emotionTrendList = [];
    let emotionTrendXAxisData = [];
    let emotionTrendSeriesFirstData = [];
    let emotionTrendSeriesSecendData = [];
    let num = 1;
    let stmt = {};
    let dateNum = 0;
    let dateMonth = "";
    let flag = false;
    let sumRate = 0;
    let countNum = 0;
    let totalSumRate = 0;
    let totalCountNum = 0;
    let maxSumRate = 5;
    if (emotion.emotionTrendYearMonthType == 1) {
        // 月
        firstDay = util.getFirstDayOfMonth(emotion.trendYearMonth);
        lastDay = util.getLastDayOfMonth(emotion.trendYearMonth);
        dateNum = parseInt(lastDay.split(" ")[0].split("-")[2]);
        dateMonth = parseInt(
            util.dateForMat("yyyy-MM", emotion.trendYearMonth).split("-")[1]
        );
        for (let index = 1; index <= dateNum; index++) {
            date = dateMonth + "-" + index;
            emotionTrendXAxisData.push(date);
        }
        sqlStr =
            "SELECT id, rate, state, SUBSTR(curDateTime, 1, 10) AS curDateTime FROM 	tbl_emotion as a WHERE 	userId = " +
            userId +
            " AND status = 1 AND curDateTime >= $a AND curDateTime < $b ORDER BY curDateTime ASC";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: firstDay, $b: lastDay });
        while (stmt.step()) {
            resultObj = stmt.getAsObject();
            if (resultObj.id != null) {
                if (resultObj.state == 0) {
                    resultObj.emotionStr = "高兴";
                } else if (resultObj.state == 1) {
                    resultObj.emotionStr = "平静";
                } else if (resultObj.state == 2) {
                    resultObj.emotionStr = "兴奋";
                } else if (resultObj.state == 3) {
                    resultObj.emotionStr = "低落";
                } else if (resultObj.state == 4) {
                    resultObj.emotionStr = "忧伤";
                } else if (resultObj.state == 5) {
                    resultObj.emotionStr = "生气";
                } else if (resultObj.state == 6) {
                    resultObj.emotionStr = "思念";
                }
                emotionTrendList.push(resultObj);
            }
        }
        for (let index = 0; index < emotionTrendXAxisData.length; index++) {
            let tempDate = emotionTrendXAxisData[index];
            for (let j = 0; j < emotionTrendList.length; j++) {
                resultObj = emotionTrendList[j];
                dateArr = resultObj.curDateTime.split("-");
                month = dateArr[1];
                day = parseInt(dateArr[2]);
                date = month + "-" + day;
                if (tempDate == date) {
                    countNum++;
                    emotionTrendSeriesFirstData.push(resultObj.rate);
                    sumRate += resultObj.rate;
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                emotionTrendSeriesFirstData.push(0);
            }
            flag = false;
        }
        for (let index = 1; index <= dateNum; index++) {
            if (countNum != 0) {
                emotionTrendSeriesSecendData.push(
                    parseFloat((sumRate / countNum).toFixed(1))
                );
            } else {
                emotionTrendSeriesSecendData.push(0);
            }
        }
    } else if (emotion.emotionTrendYearMonthType == 2) {
        // 年
        num = 12;
        for (let i = 1; i <= num; i++) {
            emotionTrendXAxisData.push(i);
            firstDay = util.getFirstDayOfMonth(new Date(year, i, 0));
            lastDay = util.getLastDayOfMonth(new Date(year, i, 0));
            sqlStr =
                "SELECT 	sum(rate) AS sumRate, 	count(rate) countRate, 	SUBSTR(curDateTime, 1, 7) AS curDateTime FROM 	tbl_emotion AS a WHERE 	userId = " +
                userId +
                " AND status = 1 AND curDateTime >= $a AND curDateTime < $b GROUP BY SUBSTR(curDateTime, 1, 7) ";
            stmt = sql.prepare(sqlStr);
            stmt.bind({ $a: firstDay, $b: lastDay });
            stmt.step();
            resultObj = stmt.getAsObject();
            if (resultObj.sumRate != null) {
                resultObj.rateDegreeOfMonth = parseFloat(
                    (resultObj.sumRate / resultObj.countRate).toFixed(1)
                );
                emotionTrendList.push(resultObj);
                emotionTrendSeriesFirstData.push(resultObj.sumRate);
                if (resultObj.sumRate > maxSumRate) {
                    maxSumRate = resultObj.sumRate;
                }
                totalSumRate += resultObj.sumRate;
                totalCountNum += resultObj.countRate;
                emotionTrendSeriesSecendData.push(resultObj.rateDegreeOfMonth);
                flag = true;
            } else {
                emotionTrendSeriesSecendData.push(0);
            }
            if (!flag) {
                emotionTrendSeriesFirstData.push(0);
            }
            flag = false;
        }
    }
    result = {
        emotionTrendList: emotionTrendList,
        emotionTrendXAxisData: emotionTrendXAxisData,
        emotionTrendSeriesFirstData: emotionTrendSeriesFirstData,
        emotionTrendSeriesSecendData: emotionTrendSeriesSecendData,
        maxSumRate: maxSumRate
    };
    return result;
}

// 查询情绪分析当天的数据
export function queryEmotionAnaDetailData(thisObj, emotion, index) {
    let state = emotion.emotionAnaList[index].state;
    let sql = dbUtil.getSqlObj();
    let resultObj = {};
    let resultObjList = [];
    let userId = wsCache.get("user").id;
    let date = util.dateForMat("yyyy-MM-dd", emotion.analyzeYearMonth);
    let dateArr = date.split("-");
    let year = dateArr[0];
    let month = dateArr[1];
    let day = dateArr[2];
    let sqlStr = "";
    let firstDay = "";
    let lastDay = "";
    if (emotion.emotionAnaYearMonthType == 1) {
        // 月
        firstDay = util.getFirstDayOfMonth(emotion.analyzeYearMonth);
        lastDay = util.getLastDayOfMonth(emotion.analyzeYearMonth);
    } else if (emotion.emotionAnaYearMonthType == 2) {
        // 年
        firstDay = year + "-01-01 00:00:00";
        lastDay = year + "-12-31 23:59:59";
    }
    sqlStr =
        "SELECT 	id, 	state, 	SUBSTR(curDateTime, 1, 10) AS curDateTime, 	remark FROM 	tbl_emotion AS a WHERE 	a.userId = " +
        userId +
        " AND a.status = 1 AND state = $a AND curDateTime >= $b AND curDateTime < $c ORDER BY 	a.curDateTime ASC ";
    try {
        let stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: state, $b: firstDay, $c: lastDay });
        while (stmt.step()) {
            resultObj = stmt.getAsObject();
            if (resultObj.state == 0) {
                resultObj.emotionStr = "高兴";
            } else if (resultObj.state == 1) {
                resultObj.emotionStr = "平静";
            } else if (resultObj.state == 2) {
                resultObj.emotionStr = "兴奋";
            } else if (resultObj.state == 3) {
                resultObj.emotionStr = "低落";
            } else if (resultObj.state == 4) {
                resultObj.emotionStr = "忧伤";
            } else if (resultObj.state == 5) {
                resultObj.emotionStr = "生气";
            } else if (resultObj.state == 6) {
                resultObj.emotionStr = "思念";
            }
            resultObjList.push(resultObj);
        }
        sql.close();
    } catch (error) {
        thisObj.$Message.error({ content: "系统故障!" });
    }
    return resultObjList;
}
// 查询情绪分析当天的数据
export function queryEmotionAnaData(thisObj, emotion) {
    let sql = dbUtil.getSqlObj();
    let result = {};
    let resultObj = {};
    let resultObjList = [];
    let tempObj = {};
    let userId = wsCache.get("user").id;
    let date = util.dateForMat("yyyy-MM-dd", emotion.analyzeYearMonth);
    let dateArr = date.split("-");
    let year = dateArr[0];
    let month = dateArr[1];
    let day = dateArr[2];
    let sqlStr = "";
    let firstDay = "";
    let lastDay = "";
    let emotionAnaList = [];
    let emotionAnaLegendData = [];
    let emotionAnaSeriesData = [];
    let totalState = 0;
    if (emotion.emotionAnaYearMonthType == 1) {
        // 月
        firstDay = util.getFirstDayOfMonth(emotion.analyzeYearMonth);
        lastDay = util.getLastDayOfMonth(emotion.analyzeYearMonth);
    } else if (emotion.emotionAnaYearMonthType == 2) {
        // 年
        firstDay = year + "-01-01 00:00:00";
        lastDay = year + "-12-31 23:59:59";
    }
    sqlStr =
        "SELECT	a.state, count(a.state) AS countState FROM	tbl_emotion AS a WHERE	a.userId = " +
        userId +
        " AND a.status = 1 AND a.curDateTime >= $a AND a.curDateTime < $b GROUP BY a.state ORDER BY a.state asc";
    try {
        let stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: firstDay, $b: lastDay });
        while (stmt.step()) {
            resultObj = stmt.getAsObject();
            totalState += resultObj.countState;
            if (resultObj.state == 0) {
                resultObj.emotionStr = "高兴";
            } else if (resultObj.state == 1) {
                resultObj.emotionStr = "平静";
            } else if (resultObj.state == 2) {
                resultObj.emotionStr = "兴奋";
            } else if (resultObj.state == 3) {
                resultObj.emotionStr = "低落";
            } else if (resultObj.state == 4) {
                resultObj.emotionStr = "忧伤";
            } else if (resultObj.state == 5) {
                resultObj.emotionStr = "生气";
            } else if (resultObj.state == 6) {
                resultObj.emotionStr = "思念";
            }
            emotionAnaLegendData.push(resultObj.emotionStr);
            tempObj = {
                value: resultObj.countState,
                name: resultObj.emotionStr
            };
            emotionAnaSeriesData.push(tempObj);
            resultObjList.push(resultObj);
        }
        for (let index = 0; index < resultObjList.length; index++) {
            let ele = resultObjList[index];
            tempObj = {
                state: ele.state,
                emotionStr: ele.emotionStr,
                countState: ele.countState,
                totalState: totalState,
                stateDegree: parseFloat(
                    ((ele.countState / totalState) * 100).toFixed(2)
                )
            };
            emotionAnaList.push(tempObj);
        }
        result = {
            emotionAnaList: emotionAnaList,
            emotionAnaLegendData: emotionAnaLegendData,
            emotionAnaSeriesData: emotionAnaSeriesData
        };
        sql.close();
    } catch (error) {
        thisObj.$Message.error({ content: "系统故障!" });
    }
    return result;
}
// 查询当天的心情
export function queryEmotionByDate(thisObj, emotion) {
    let sql = dbUtil.getSqlObj();
    let resultObj = {};
    let userId = wsCache.get("user").id;
    let curDateTime = util.dateForMat("yyyy-MM-dd", emotion.curDateTime);
    let sqlStr =
        "SELECT a.* FROM tbl_emotion as a WHERE SUBSTR(curDateTime, 1, 10) = $a AND status = 1 AND userId = " +
        userId +
        "; ";
    try {
        let stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: curDateTime });
        stmt.step();
        resultObj = stmt.getAsObject();
        sql.close();
    } catch (error) {
        thisObj.$Message.error({ content: "系统故障!" });
    }
    return resultObj;
}

// 更新心情
export function updateEmotion(thisObj, emotion) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr = "";
    try {
        sqlStr =
            "UPDATE tbl_emotion set updateTime = '" +
            updateTime +
            "', rate = " +
            emotion.emotionObj.rate +
            ", state = '" +
            emotion.emotionObj.state +
            "', remark = '" +
            emotion.emotionObj.remark +
            "' WHERE id = " +
            emotion.emotionObj.id +
            ";";
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({ content: "更新成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "更新失败!" });
    }
}

// 添加当天的心情
export function addEmotion(thisObj, emotion) {
    let sql = dbUtil.getSqlObj();
    let curDateTime = util.dateForMat(
        "yyyy-MM-dd hh:mm:ss",
        emotion.curDateTime
    );
    let updateTime = curDateTime;
    let syncStatus = 0;
    let status = 1;
    let sqlStr = "";
    if (emotion.emotionObj.remark == "" || emotion.emotionObj.remark == null) {
        emotion.emotionObj.remark = "Today is a beautiful day!";
    }
    try {
        sqlStr =
            "INSERT INTO tbl_emotion(userId, rate, state, remark, curDateTime, updateTime, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", " +
            emotion.emotionObj.rate +
            ", '" +
            emotion.emotionObj.state +
            "', '" +
            emotion.emotionObj.remark +
            "', '" +
            curDateTime +
            "', '" +
            updateTime +
            "', " +
            syncStatus +
            ", " +
            status +
            ")";
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({ content: "添加成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "添加失败!" });
    }
}

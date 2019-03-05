import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

export function openConsumeModal(thisObj, consume, index, type) {
    let resultList = [];
    let sql = dbUtil.getSqlObj();
    let firstDay = "";
    let lastDay = "";
    let yearMonthType = [];
    let sqlStr = "";
    let stmt = {};
    let yearMonthStr = "";
    let date = util.dateForMat("yyyy-MM-dd", consume.analyzeYearMonth);
    let dateArr = date.split("-");
    let year = dateArr[0];
    let month = dateArr[1];
    let day = dateArr[2];
    let num = 0;
    let categoryId = 0;
    let userId = wsCache.get("user").id;

    if (type == 1) {
        categoryId = consume.analyzeConsumeRightList[index].categoryId;
    } else if (type == 2) {
        categoryId = consume.analyzeBudgetRightList[index].categoryId;
    }
    if (consume.type == 1 || consume.type == 0) {
        num = 1;
    } else if (consume.type == 2) {
        num = 12;
    }
    sqlStr = "";
    if (consume.consumeType != 2) {
        for (let index = 1; index <= num; index++) {
            if (consume.type == 1) {
                // 表示的是月份
                firstDay = util.getFirstDayOfMonth(consume.analyzeYearMonth);
                lastDay = util.getLastDayOfMonth(consume.analyzeYearMonth);
                yearMonthStr = util.dateForMat(
                    "yyyy-MM",
                    consume.analyzeYearMonth
                );
            } else if (consume.type == 2) {
                // 表示的是年份
                firstDay = util.getFirstDayOfMonth(new Date(year, index, 0));
                lastDay = util.getLastDayOfMonth(new Date(year, index, 0));
                yearMonthStr = util.dateForMat(
                    "yyyy-MM",
                    new Date(year, index, 0)
                );
            } else if (consume.type == 0) {
                // 表示的是日
                firstDay = util.dateForMat(
                    "yyyy-MM-dd hh:mm:ss",
                    new Date(year, month - 1, day, 0, 0, 0)
                );
                lastDay = util.dateForMat(
                    "yyyy-MM-dd hh:mm:ss",
                    new Date(year, month - 1, day, 23, 59, 59)
                );
                yearMonthStr = util.dateForMat(
                    "yyyy-MM",
                    consume.analyzeYearMonth
                );
            }
            if (consume.consumeType == 1) {
                // 支出
                sqlStr =
                    "SELECT a.consume, a.curDateTime,	c.iconName, c.dataUrl,	c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames  FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id 	LEFT JOIN tbl_budget AS e ON e.categoryId = c.id WHERE	a.status = 1 AND a.userId = " +
                    userId +
                    " 	AND a.progress = 100 	AND a.consume != 0	AND e.curYearMonth = $a AND c.id = $e AND a.curDateTime >= $c	AND a.curDateTime <= $d	ORDER BY a.consume ASC";
                stmt = sql.prepare(sqlStr);
                stmt.bind({
                    $a: yearMonthStr,
                    $c: firstDay,
                    $d: lastDay,
                    $e: categoryId
                });
            } else if (consume.consumeType == 3) {
                sqlStr =
                    "SELECT	SUM(a.consume) AS sumConsume,	COUNT(d.categoryName) AS num,	c.iconName, c.dataUrl,	c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames,	e.type, 	e.budget,	e.curYearMonth FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id 	LEFT JOIN tbl_budget AS e ON e.categoryId = c.id WHERE	a.status = 1  AND a.userId = " +
                    userId +
                    " 		AND a.progress = 100 	AND a.consume != 0	AND e.curYearMonth = $a AND c.id = $e AND e.type = $b AND a.curDateTime >= $c	AND a.curDateTime <= $d	ORDER BY a.consume ASC";
                stmt = sql.prepare(sqlStr);
                stmt.bind({
                    $a: yearMonthStr,
                    $b: 1,
                    $c: firstDay,
                    $d: lastDay,
                    $e: categoryId
                });
            } else if (consume.consumeType == 4) {
                sqlStr =
                    "SELECT	SUM(a.consume) AS sumConsume,	COUNT(d.categoryName) AS num,	c.iconName, c.dataUrl,	c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames,	e.type, 	e.budget,	e.curYearMonth FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id 	LEFT JOIN tbl_budget AS e ON e.categoryId = c.id WHERE	a.status = 1  AND a.userId = " +
                    userId +
                    " 	 	AND a.progress = 100 	AND a.consume != 0	AND e.curYearMonth = $a AND c.id = $e AND e.type = $b AND a.curDateTime >= $c	AND a.curDateTime <= $d	ORDER BY a.consume ASC";
                stmt = sql.prepare(sqlStr);
                stmt.bind({
                    $a: yearMonthStr,
                    $b: 2,
                    $c: firstDay,
                    $d: lastDay,
                    $e: categoryId
                });
            } else if (consume.consumeType == 0) {
                sqlStr =
                    "SELECT	SUM(a.consume) AS sumConsume,	COUNT(d.categoryName) AS num,	c.iconName, c.dataUrl,		c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames,	e.type, 	e.budget,	e.curYearMonth FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id 	LEFT JOIN tbl_budget AS e ON e.categoryId = c.id WHERE	a.status = 1 AND a.userId = " +
                    userId +
                    " 	AND a.progress = 100 	AND a.consume != 0	AND e.curYearMonth = $a AND e.type = $b AND a.curDateTime >= $c	AND a.curDateTime <= $d	GROUP BY categoryNames	ORDER BY categoryNames ASC";
                stmt = sql.prepare(sqlStr);
                stmt.bind({
                    $a: yearMonthStr,
                    $b: 0,
                    $c: firstDay,
                    $d: lastDay
                });
            }
            while (stmt.step()) {
                resultList.push(stmt.getAsObject());
            }
        }
    } else if (consume.consumeType == 2) {
        if (consume.type == 1) {
            // 表示的是月份
            firstDay = util.getFirstDayOfMonth(consume.analyzeYearMonth);
            lastDay = util.getLastDayOfMonth(consume.analyzeYearMonth);
        } else if (consume.type == 2) {
            // 表示的是年份
            firstDay = year + "-01-01 00:00:00";
            lastDay = year + "-12-31 23:59:59";
        } else if (consume.type == 0) {
            firstDay = util.dateForMat(
                "yyyy-MM-dd hh:mm:ss",
                new Date(year, month - 1, day, 0, 0, 0)
            );
            lastDay = util.dateForMat(
                "yyyy-MM-dd hh:mm:ss",
                new Date(year, month - 1, day, 23, 59, 59)
            );
        }
        // 收入
        sqlStr =
            "SELECT	a.income as consume, a.curDateTime, 	c.iconName, c.dataUrl,	c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE	a.status = 1  AND a.userId = " +
            userId +
            " 	 	AND a.progress = 100 AND c.id = $e 	AND a.income != 0	AND a.curDateTime >= $a 	AND a.curDateTime <= $b	GROUP BY categoryNames	ORDER BY categoryNames ASC";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: firstDay, $b: lastDay, $e: categoryId });
        while (stmt.step()) {
            resultList.push(stmt.getAsObject());
        }
    }
    sql.close();
    return resultList;
}

export function sumConsumeCategoryOfAnalyze(thisObj, consume) {
    let resultList = [];
    if (consume.consumeCategoryType == 2 && consume.consumeType == 2) {
        return resultList;
    }
    let sql = dbUtil.getSqlObj();
    let firstDay = "";
    let lastDay = "";
    let yearMonthType = [];
    let sqlStr = "";
    let stmt = {};
    let yearMonthStr = "";
    let date = util.dateForMat("yyyy-MM-dd", consume.analyzeYearMonth);
    let dateArr = date.split("-");
    let year = dateArr[0];
    let month = dateArr[1];
    let day = dateArr[2];
    let num = 0;
    let userId = wsCache.get("user").id;
    if (consume.type == 1 || consume.type == 0) {
        num = 1;
    } else if (consume.type == 2) {
        num = 12;
    }
    sqlStr = "";
    if (consume.consumeType != 2) {
        for (let index = 1; index <= num; index++) {
            if (consume.type == 1) {
                // 表示的是月份
                firstDay = util.getFirstDayOfMonth(consume.analyzeYearMonth);
                lastDay = util.getLastDayOfMonth(consume.analyzeYearMonth);
                yearMonthStr = util.dateForMat(
                    "yyyy-MM",
                    consume.analyzeYearMonth
                );
            } else if (consume.type == 2) {
                // 表示的是年份
                firstDay = util.getFirstDayOfMonth(new Date(year, index, 0));
                lastDay = util.getLastDayOfMonth(new Date(year, index, 0));
                yearMonthStr = util.dateForMat(
                    "yyyy-MM",
                    new Date(year, index, 0)
                );
            } else if (consume.type == 0) {
                // 表示的是日
                firstDay = util.dateForMat(
                    "yyyy-MM-dd hh:mm:ss",
                    new Date(year, month - 1, day, 0, 0, 0)
                );
                lastDay = util.dateForMat(
                    "yyyy-MM-dd hh:mm:ss",
                    new Date(year, month - 1, day, 23, 59, 59)
                );
                yearMonthStr = util.dateForMat(
                    "yyyy-MM",
                    consume.analyzeYearMonth
                );
            }
            if (consume.consumeType == 1) {
                // 支出
                sqlStr =
                    "SELECT	SUM(a.consume) AS sumConsume,	COUNT(d.categoryName) AS num,	c.iconName, c.dataUrl,		c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames,	e.type, 	e.budget,	e.curYearMonth FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id 	LEFT JOIN tbl_budget AS e ON e.categoryId = c.id WHERE	a.status = 1 AND a.userId = " +
                    userId +
                    " 	AND a.progress = 100 	AND a.consume != 0	AND e.curYearMonth = $a AND a.curDateTime >= $c	AND a.curDateTime <= $d	GROUP BY categoryNames	ORDER BY categoryNames ASC";
                stmt = sql.prepare(sqlStr);
                stmt.bind({
                    $a: yearMonthStr,
                    $c: firstDay,
                    $d: lastDay
                });
            } else if (consume.consumeType == 3) {
                sqlStr =
                    "SELECT	SUM(a.consume) AS sumConsume,	COUNT(d.categoryName) AS num,	c.iconName, c.dataUrl,		c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames,	e.type, 	e.budget,	e.curYearMonth FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id 	LEFT JOIN tbl_budget AS e ON e.categoryId = c.id WHERE	a.status = 1 AND a.userId = " +
                    userId +
                    " 	AND a.progress = 100 	AND a.consume != 0	AND e.curYearMonth = $a AND e.type = $b AND a.curDateTime >= $c	AND a.curDateTime <= $d	GROUP BY categoryNames	ORDER BY categoryNames ASC";
                stmt = sql.prepare(sqlStr);
                stmt.bind({
                    $a: yearMonthStr,
                    $b: 1,
                    $c: firstDay,
                    $d: lastDay
                });
            } else if (consume.consumeType == 4) {
                sqlStr =
                    "SELECT	SUM(a.consume) AS sumConsume,	COUNT(d.categoryName) AS num,	c.iconName, c.dataUrl,		c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames,	e.type, 	e.budget,	e.curYearMonth FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id 	LEFT JOIN tbl_budget AS e ON e.categoryId = c.id WHERE	a.status = 1 AND a.userId = " +
                    userId +
                    " 	AND a.progress = 100 	AND a.consume != 0	AND e.curYearMonth = $a AND e.type = $b AND a.curDateTime >= $c	AND a.curDateTime <= $d	GROUP BY categoryNames	ORDER BY categoryNames ASC";
                stmt = sql.prepare(sqlStr);
                stmt.bind({
                    $a: yearMonthStr,
                    $b: 2,
                    $c: firstDay,
                    $d: lastDay
                });
            } else if (consume.consumeType == 0) {
                sqlStr =
                    "SELECT	SUM(a.consume) AS sumConsume,	COUNT(d.categoryName) AS num,	c.iconName, c.dataUrl,		c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames,	e.type, 	e.budget,	e.curYearMonth FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id 	LEFT JOIN tbl_budget AS e ON e.categoryId = c.id WHERE	a.status = 1 AND a.userId = " +
                    userId +
                    " 	AND a.progress = 100 	AND a.consume != 0	AND e.curYearMonth = $a AND e.type = $b AND a.curDateTime >= $c	AND a.curDateTime <= $d	GROUP BY categoryNames	ORDER BY categoryNames ASC";
                stmt = sql.prepare(sqlStr);
                stmt.bind({
                    $a: yearMonthStr,
                    $b: 0,
                    $c: firstDay,
                    $d: lastDay
                });
            }
            while (stmt.step()) {
                resultList.push(stmt.getAsObject());
            }
        }
    } else if (consume.consumeType == 2) {
        if (consume.type == 1) {
            // 表示的是月份
            firstDay = util.getFirstDayOfMonth(consume.analyzeYearMonth);
            lastDay = util.getLastDayOfMonth(consume.analyzeYearMonth);
        } else if (consume.type == 2) {
            // 表示的是年份
            firstDay = year + "-01-01 00:00:00";
            lastDay = year + "-12-31 23:59:59";
        }
        // 收入
        sqlStr =
            "SELECT	SUM(a.income) AS sumConsume,	COUNT(d.categoryName) AS num, 	c.iconName, c.dataUrl,	c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE	a.status = 1 AND a.userId = " +
            userId +
            " 	AND a.progress = 100 	AND a.income != 0	AND a.curDateTime >= $a 	AND a.curDateTime <= $b	GROUP BY categoryNames	ORDER BY categoryNames ASC";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: firstDay,
            $b: lastDay
        });
        while (stmt.step()) {
            resultList.push(stmt.getAsObject());
        }
    }
    sql.close();
    return resultList;
}

export function openConsumeModalOfTrend(thisObj, consume, index) {
    let resultList = [];
    let obj = consume.consumeBudgetDetialOfTrendList[index];
    let categoryId = obj.categoryId;
    let firstDay = util.getFirstDayOfMonth(new Date(obj.curYearMonth));
    let lastDay = util.getLastDayOfMonth(new Date(obj.curYearMonth));
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT	c.iconName, c.dataUrl,	a.id,	d.categoryName || '(' || c.categoryName || ')' AS categoryName,	a.curDateTime,	a.consume FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE	a.status = 1 AND a.userId = " +
        userId +
        " 	AND a.progress = 100 	AND a.consume != 0 	AND a.curDateTime >= $a	AND a.curDateTime <= $b 	AND c.id = $c  ORDER BY a.consume ASC";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: firstDay, $b: lastDay, $c: categoryId });
    while (stmt.step()) {
        resultList.push(stmt.getAsObject());
    }
    sql.close();
    return resultList;
}

// 获取预算详情
export function queryBudgetDetailOfTrend(thisObj, consume) {
    let yearMonthType = consume.yearMonthType;
    let consumeTypeOfTrend = consume.consumeTypeOfTrend;
    let resultObj = {};
    let resultList = [];
    if (consumeTypeOfTrend == 2) {
        return resultList;
    }
    let userId = wsCache.get("user").id;
    let trendYearMonth = consume.trendYearMonth;
    let trendYearMonthStr = "";
    let year = util.dateForMat("yyyy", trendYearMonth);
    let sql = dbUtil.getSqlObj();
    let firstDay = "";
    let lastDay = "";
    let sqlStr = "";
    let rate = 0;

    let num = 0;
    if (yearMonthType == 1) {
        num = 1;
    } else if (yearMonthType == 2) {
        num = 12;
    }
    for (let index = 1; index <= num; index++) {
        if (yearMonthType == 1) {
            // 表示的是月份
            firstDay = util.getFirstDayOfMonth(trendYearMonth);
            lastDay = util.getLastDayOfMonth(trendYearMonth);
            trendYearMonthStr = util.dateForMat("yyyy-MM", trendYearMonth);
        } else if (yearMonthType == 2) {
            // 表示的是年份
            firstDay = util.getFirstDayOfMonth(new Date(year, index, 0));
            lastDay = util.getLastDayOfMonth(new Date(year, index, 0));
            trendYearMonthStr = util.dateForMat(
                "yyyy-MM",
                new Date(year, index, 0)
            );
        }
        if (consumeTypeOfTrend == 1) {
            sqlStr =
                "SELECT SUM(a.consume) AS sumConsume,	COUNT(d.categoryName) AS num,	c.iconName, c.dataUrl,	c.id AS categoryId,	d.categoryName || '(' || c.categoryName || ')' AS categoryNames,	e.type, 	e.budget,	e.curYearMonth, a.curDateTime FROM	tbl_timeMachine AS a	LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id	LEFT JOIN tbl_category AS c ON b.categoryId = c.id	LEFT JOIN tbl_category AS d ON c.pid = d.id 	LEFT JOIN tbl_budget AS e ON e.categoryId = c.id WHERE	a.status = 1  AND a.userId = " +
                userId +
                "  	AND a.progress = 100 	AND a.consume != 0	AND e.curYearMonth = $a	AND a.curDateTime >= $b AND a.curDateTime <= $c	GROUP BY categoryNames	ORDER BY sumConsume ASC";
        }
        let stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: trendYearMonthStr, $b: firstDay, $c: lastDay });
        while (stmt.step()) {
            resultObj = stmt.getAsObject();
            rate = (resultObj.sumConsume / resultObj.budget) * 100;
            if (rate > 100) {
                resultObj.rate = 100;
            } else {
                resultObj.rate = parseInt(rate);
            }
            if (resultObj.type == 1) {
                resultObj.yearMonthTypeOfTrend = "年度预算";
            } else if (resultObj.type == 2) {
                resultObj.yearMonthTypeOfTrend = "月度预算";
            } else if(resultObj.type == 0) {
                resultObj.yearMonthTypeOfTrend = "当天预算";
            }
            resultList.push(resultObj);
        }
    }
    sql.close();
    return resultList;
}

// 统计消费趋势
export function sumConsumeTrend(thisObj, consume) {
    let yearMonthType = consume.yearMonthType;
    let consumeTypeOfTrend = consume.consumeTypeOfTrend;
    let trendYearMonth = consume.trendYearMonth;
    let year = util.dateForMat("yyyy", trendYearMonth);
    let sql = dbUtil.getSqlObj();
    let firstDay = "";
    let lastDay = "";
    let sqlStr = "";
    let userId = wsCache.get("user").id;
    if (yearMonthType == 1) {
        // 表示的是月份
        firstDay = util.getFirstDayOfMonth(trendYearMonth);
        lastDay = util.getLastDayOfMonth(trendYearMonth);
    } else if (yearMonthType == 2) {
        // 表示的是年份
        firstDay = year + "-01-01 00:00:00";
        lastDay = year + "-12-31 23:59:59";
    }
    if (consumeTypeOfTrend == 1) {
        sqlStr =
            "SELECT a.id, a.curDateTime, a.consume, c.iconName, c.dataUrl, d.categoryName || '(' || c.categoryName || ')' AS categoryName FROM tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id LEFT JOIN tbl_category AS c ON b.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE a.status = 1 AND a.userId = " +
            userId +
            " AND a.curDateTime >= $a AND a.curDateTime <= $b AND a.progress = 100 AND a.consume != 0";
    } else if (consumeTypeOfTrend == 2) {
        sqlStr =
            "SELECT a.id, a.curDateTime, a.income AS consume, c.iconName,  c.dataUrl, d.categoryName || '(' || c.categoryName || ')' AS categoryName FROM tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id LEFT JOIN tbl_category AS c ON b.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id WHERE a.status = 1 AND a.userId = " +
            userId +
            " AND a.curDateTime >= $a AND a.curDateTime <= $b AND a.progress = 100 and a.income != 0";
    }
    let stmt = sql.prepare(sqlStr);
    let resultList = [];
    stmt.bind({ $a: firstDay, $b: lastDay });
    while (stmt.step()) {
        resultList.push(stmt.getAsObject());
    }
    sql.close();
    return resultList;
}

// 查询每个类别的消费情况
export function sumCategoryConsume(thisObj, consume) {
    let type = consume.type;
    let consumeType = consume.consumeType;
    let year = util.dateForMat("yyyy", consume.analyzeYearMonth);
    let sql = dbUtil.getSqlObj();
    let categoryList = [];
    let resultList = [];
    let tempList = [];
    let result = {};
    let obj = {};
    let tempObj = {};
    let sqlStr = "";
    let stmt = {};
    let firstDay = "";
    let lastDay = "";
    let userId = wsCache.get("user").id;
    if (type == 1) {
        // 表示的是月份
        firstDay = util.getFirstDayOfMonth(consume.analyzeYearMonth);
        lastDay = util.getLastDayOfMonth(consume.analyzeYearMonth);
    } else if (type == 2) {
        // 表示的是年份
        firstDay = year + "-01-01 00:00:00";
        lastDay = year + "-12-31 23:59:59";
    }
    sqlStr =
        "SELECT a.categoryName, a.id, a.iconName, a.dataUrl from tbl_category as a WHERE a.pid = $a AND a.userId = " +
        userId +
        " AND a.status = 1;";
    stmt = sql.prepare(sqlStr);
    if (consumeType == 1) {
        // 表示的是支出
        stmt.bind({ $a: consume.consumeCategoryId });
    } else if (consumeType == 2) {
        // 表示的是收入
        stmt.bind({ $a: consume.incomeCategoryId });
    }
    while (stmt.step()) {
        categoryList.push(stmt.getAsObject());
    }
    categoryList.forEach(element => {
        sqlStr =
            "SELECT a.curDateTime, a.consume, a.income, c.categoryName, c.iconName, c.dataUrl FROM tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id LEFT JOIN tbl_category as c on b.categoryId = c.id WHERE a.status = 1 AND a.userId = " +
            userId +
            " AND a.progress = 100 AND b.categoryIds LIKE $a AND a.curDateTime >= $b AND a.curDateTime <= $c ";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + element.id + "%",
            $b: firstDay,
            $c: lastDay
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            tempObj.childCategory =
                element.categoryName + " (" + tempObj.categoryName + ")";
            tempList.push(tempObj);
        }
        obj = {
            categoryName: element.categoryName,
            iconName: element.iconName,
            list: tempList
        };
        if (obj.list.length > 0) {
            resultList.push(obj);
        }
        tempList = [];
    });
    sql.close();

    return resultList;
}
// 查询当月得收入
export function queryConsumeIncome(date) {
    let sql = dbUtil.getSqlObj();
    let firstDay = util.getFirstDayOfMonth(date);
    let lastDay = util.getLastDayOfMonth(date);
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT sum( a.income ) AS num FROM tbl_timeMachine AS a WHERE a.status = 1 AND a.userId = " +
        userId +
        " AND a.income != 0 AND a.curDateTime >= $a AND a.curDateTime <= $b";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: firstDay, $b: lastDay });
    stmt.step();
    let result = stmt.getAsObject().num;
    sql.close();
    return result;
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

// 查询指定年份, 年度预算用了多少
export function sumYearExpend(thisObj, year, yearMonth) {
    let sql = dbUtil.getSqlObj();
    let firstDay = year + "-01-01 00:00:00";
    let lastDay = year + "-12-31 23:59:59";
    let userId = wsCache.get("user").id;

    let sqlStr =
        "SELECT sum(a.consume) as num FROM tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id LEFT JOIN tbl_budget AS c ON c.categoryId = b.categoryId WHERE a.status = 1 AND a.userId = " +
        userId +
        " AND a.consume != 0 AND a.curDateTime >= $a AND a.curDateTime <= $b AND c.type = 1 AND c.curYearMonth = $c";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: firstDay, $b: lastDay, $c: yearMonth });
    stmt.step();
    let result = stmt.getAsObject().num;
    sql.close();
    return result;
}

// 查询整年花费了多少钱(不区分年度月度)
export function sumTotalYearExpendOfConsume(thisObj, year, yearMonth) {
    let sql = dbUtil.getSqlObj();
    let firstDay = year + "-01-01 00:00:00";
    let lastDay = year + "-12-31 23:59:59";
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT sum( a.consume ) AS num FROM tbl_timeMachine AS a WHERE a.status = 1 AND a.userId = " +
        userId +
        " AND a.consume != 0 AND a.progress = 100 AND a.curDateTime >= $a AND a.curDateTime <= $b";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: firstDay, $b: lastDay });
    stmt.step();
    let result = stmt.getAsObject().num;
    sql.close();
    return result;
}

// 查询指定月份花了多少钱
export function sumMonthExpend(thisObj, date, yearMonth) {
    let sql = dbUtil.getSqlObj();
    let firstDay = util.getFirstDayOfMonth(date);
    let lastDay = util.getLastDayOfMonth(date);
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT sum(a.consume) as num FROM tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id LEFT JOIN tbl_budget AS c ON c.categoryId = b.categoryId WHERE a.status = 1 AND a.userId = " +
        userId +
        " AND a.consume != 0 AND a.curDateTime >= $a AND a.curDateTime <= $b AND c.type = 2 AND c.curYearMonth = $c";

    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: firstDay, $b: lastDay, $c: yearMonth });
    stmt.step();
    let result = stmt.getAsObject().num;
    sql.close();
    return result;
}

// 查询指定月份花了多少钱
export function sumTotalMonthExpendOfConsume(thisObj, date, yearMonth) {
    let sql = dbUtil.getSqlObj();
    let firstDay = util.getFirstDayOfMonth(date);
    let lastDay = util.getLastDayOfMonth(date);
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT sum( a.consume ) AS num FROM tbl_timeMachine AS a WHERE a.status = 1 AND a.userId = " +
        userId +
        " AND a.consume != 0 AND a.progress = 100 AND a.curDateTime >= $a AND a.curDateTime <= $b";

    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: firstDay, $b: lastDay });
    stmt.step();
    let result = stmt.getAsObject().num;
    sql.close();
    return result;
}

export function sumAllMonthExpend(thisObj, consume) {
    let sql = dbUtil.getSqlObj();
    let year = util.dateForMat("yyyy", consume.analyzeYearMonth);
    let firstDay = year + "-01-01 00:00:00";
    let lastDay = year + "-12-31 23:59:59";
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT sum(a.consume) as num FROM tbl_timeMachine AS a LEFT JOIN tbl_todolist AS b ON a.todolistId = b.id LEFT JOIN tbl_budget AS c ON c.categoryId = b.categoryId WHERE a.status = 1 AND a.userId = " +
        userId +
        "  AND a.consume != 0 AND a.curDateTime >= $a AND a.curDateTime <= $b AND c.type = 2";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: firstDay, $b: lastDay });
    stmt.step();
    let result = stmt.getAsObject().num;
    sql.close();
    return result;
}

// 将某月设置应用于当前月份
export function applyConsumeSetting(thisObj, consume) {
    let sql = dbUtil.getSqlObj();
    let budgetList = consume.consumeBudgetList;
    let updateTime = util.dateForMat("yyyy-MM-dd hh:mm:ss", new Date());
    let syncStatus = 0;
    let status = 1;
    let curYearMonth = util.dateForMat("yyyy-MM", new Date());
    let sqlStr = "";
    try {
        // 查询当前月是否有预算
        let budgets = queryBudgetByCurYearMonth(curYearMonth, sql);
        if (budgets.length == 0) {
            budgetList.forEach(element => {
                // 校验参数是否为空
                if (
                    element.budget == "" ||
                    element.budget == null ||
                    element.budget == undefined
                ) {
                    element.budget = 0;
                }
                sqlStr =
                    "INSERT INTO tbl_budget(userId, categoryId, updateTime, syncStatus, status, budget, type, curYearMonth) VALUES (" +
                    wsCache.get("user").id +
                    ", " +
                    element.categoryId +
                    ", '" +
                    updateTime +
                    "', " +
                    syncStatus +
                    ", " +
                    status +
                    ", " +
                    element.budget +
                    ", " +
                    element.type +
                    ", '" +
                    curYearMonth +
                    "')";
                sql.run(sqlStr);
            });
        }
        thisObj.$Message.success({ content: "成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "失败!" });
    }
    dbUtil.writeDataToDB(sql);
}

export function queryBudgetByCurYearMonth(curYearMonth, sql) {
    let flag = false;
    if (sql == null) {
        sql = dbUtil.getSqlObj();
        flag = true;
    }
    let budgets = [];
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT * FROM tbl_budget WHERE curYearMonth = $a AND status = 1 AND userId = " +
        userId +
        " ";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: curYearMonth });
    while (stmt.step()) {
        budgets.push(stmt.getAsObject());
    }
    if (flag) {
        sql.close();
    }
    return budgets;
}

// 保存消费设置
export function saveConsumeSetting(thisObj, consume) {
    let sql = dbUtil.getSqlObj();
    let budgetList = consume.consumeBudgetList;
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let syncStatus = 0;
    let status = 1;
    let curYearMonth = consume.curYearMonth.format("yyyy-MM");
    let sqlStr = "";
    let flag = false;
    try {
        for (let i = 0; i < budgetList.length; i++) {
            let element = budgetList[i];
            if (element.type == 3) {
                thisObj.$Message.warning({
                    content: "请为消费类别选择一个年月日类型!"
                });
                flag = true;
            }
        }
        if (flag) {
            return;
        }
        budgetList.forEach(element => {
            // 校验参数是否为空
            if (
                element.budget == "" ||
                element.budget == null ||
                element.budget == undefined
            ) {
                element.budget = 0;
            }
            if (
                element.budgetId == "" ||
                element.budgetId == null ||
                element.budgetId == undefined
            ) {
                sqlStr =
                    "INSERT INTO tbl_budget(userId, categoryId, updateTime, syncStatus, status, budget, type, curYearMonth) VALUES (" +
                    wsCache.get("user").id +
                    ", " +
                    element.categoryId +
                    ", '" +
                    updateTime +
                    "', " +
                    syncStatus +
                    ", " +
                    status +
                    ", " +
                    element.budget +
                    ", " +
                    element.type +
                    ", '" +
                    curYearMonth +
                    "')";
                sql.run(sqlStr);
            } else {
                sqlStr =
                    "UPDATE tbl_budget set updateTime = '" +
                    updateTime +
                    "', budget = " +
                    element.budget +
                    ", type = " +
                    element.type +
                    " WHERE id = " +
                    element.budgetId;
                sql.run(sqlStr);
            }
        });
        thisObj.$Message.success({ content: "成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "失败!" });
    }
    dbUtil.writeDataToDB(sql);
}

// 根据日期查询消费详情
export function queryConsumeListByDate(thisObj, date) {
    date = util.dateForMat("yyyy-MM-dd", date);
    let resultList = [];
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT a.*, b.listName, c.categoryName, c.dataUrl FROM tbl_timeMachine AS a left JOIN tbl_todolist AS b ON a.todolistId = b.id left JOIN tbl_category AS c ON c.id = b.categoryId WHERE a.curDateTime LIKE $a AND a.consume != 0 AND a.status = 1 AND a.userId = " +
        userId +
        " AND b.status = 1 AND c.status = 1";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: "%" + date + "%" });
    while (stmt.step()) {
        resultList.push(stmt.getAsObject());
    }
    sql.close();
    return resultList;
}

// 查询消费预算
export function queryConsumeBudget(thisObj, consumeCategoryId, date) {
    date = util.dateForMat("yyyy-MM", date);
    let resultList = [];
    let resultObj = {};
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    // let sqlStr = "SELECT a.id as categoryId, a.categoryName, b.id as budgetId, coalesce(b.budget, 0) as budget, coalesce(b.type, 3) as type FROM tbl_category AS a left JOIN tbl_budget as b on a.id = b.categoryId AND b.curYearMonth = $b WHERE a.isLeaf = 1 and a.status = 1 AND a.userId = " + userId + " AND a.tierRelation LIKE $a";
    let sqlStr =
        "SELECT	DISTINCT d.id AS categoryId,	d.categoryName,	b.id AS budgetId,	coalesce(b.budget, 0) AS budget,	coalesce(b.type, 3) AS type FROM	(		SELECT			*		FROM			tbl_timeMachine		WHERE			status = 1		AND userId = " +
        userId +
        "		AND consume != 0		AND SUBSTR(curDateTime, 1, 7) = $a	) AS a LEFT JOIN tbl_todolist AS c ON a.todolistId = c.id LEFT JOIN tbl_category AS d ON c.categoryId = d.id LEFT JOIN (	SELECT		*	FROM		tbl_budget	WHERE		status = 1	AND userId = " +
        userId +
        "	AND curYearMonth = $b) AS b ON b.categoryId = d.id";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: date, $b: date });
    while (stmt.step()) {
        resultObj = stmt.getAsObject();
        resultList.push(resultObj);
    }
    sql.close();
    return resultList;
}

// 根据消费名称查询消费id
export function queryConsumeCategoryIdByName(thisObj, categoryName) {
    let result = "";
    let sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT id FROM tbl_category WHERE categoryName = $a and status = 1 AND userId = " +
        userId +
        " ";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({ $a: categoryName });
    stmt.step();
    result = stmt.getAsObject().id;
    sql.close();
    return result;
}

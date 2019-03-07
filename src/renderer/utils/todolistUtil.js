import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import * as targetUtil from "@/utils/targetUtil";
import path from "path";
import {
    remote
} from "electron";
import types from "../store/types";
import {
    user
} from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

export function getDiscardTaskByTodolistDate(todolistDate) {
    var sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let discardTasks = [];
    let sqlStr =
        "SELECT * FROM tbl_discardTask WHERE status = 1 AND userId = " +
        userId +
        " AND todolistDate = $a;";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: todolistDate
    });
    while (stmt.step()) {
        discardTasks.push(stmt.getAsObject());
    }
    sql.close();
    return discardTasks;
}

export function updateDiscardTask(thisObj, id, status) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_discardTask set updateTime = '" +
        updateTime +
        "', status = " + status + " WHERE id = " + id + ";";
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({
            content: "成功!"
        });
    } catch (error) {
        thisObj.$Message.error({
            content: "失败!"
        });
    }
}

export function getDiscardTaskByTodolistDateAndTodolistId(todolistDate, todolistId) {
    var sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let discardTasks = [];
    let sqlStr =
        "SELECT * FROM tbl_discardTask WHERE userId = " +
        userId +
        " AND todolistDate = $a AND todolistId = $b;";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: todolistDate,
        $b: todolistId
    });
    stmt.step();
    let discardTaskObj = stmt.getAsObject();
    sql.close();
    return discardTaskObj;
}

export function addDiscardTask(thisObj, todolistId, todolistDate, discardStatus) {
    let discardTaskObj = getDiscardTaskByTodolistDateAndTodolistId(todolistDate, todolistId);
    if (discardTaskObj.id != undefined && discardTaskObj.id != null) {
        if (discardStatus == 1) {
            updateDiscardTask(thisObj, discardTaskObj.id, 0);
        } else {
            updateDiscardTask(thisObj, discardTaskObj.id, 1);
        }
    } else {
        let sql = dbUtil.getSqlObj();
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let curDateTime = updateTime;
        let syncStatus = 0;
        let status = 1;
        let sqlstr =
            "INSERT INTO tbl_discardTask(userId, todolistId, todolistDate, curDateTime, updateTime, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", " +
            todolistId +
            ", '" +
            todolistDate +
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
                content: "成功!"
            });
        } catch (error) {
            thisObj.$Message.error({
                content: "失败!"
            });
        }
    }
}


// 根据categoryIds 查询todolist
export function queryTodolistByCategoryIds(todolist, thisObj, categoryIds) {
    var sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT * FROM tbl_todolist WHERE status = 1 AND userId = " +
        userId +
        " AND categoryIds = $a AND repeatType = 0 AND targetId != '' AND endDate != '';";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: categoryIds
    });
    stmt.step();
    let todolistObj = stmt.getAsObject();
    sql.close();
    return todolistObj;
}

// 获取iconCategory
export function getCategoryIcons(id) {
    var sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let iconCategorys = [];
    let sqlStr =
        "SELECT * FROM tbl_iconCategory WHERE status = 1 AND userId = " +
        userId +
        ";";
    let stmt = sql.prepare(sqlStr);
    while (stmt.step()) {
        iconCategorys.push(stmt.getAsObject());
    }
    sql.close();
    return iconCategorys;
}

// 获取图标
export function getIcons() {
    let resultList = [];
    let obj = {};
    for (let index = 1; index <= 60; index++) {
        obj = {
            iconName: index + ".png",
            index: index
        };
        resultList.push(obj);
    }
    return resultList;
}

export function updateTodolist(todolist, thisObj) {
    deleteTaskById(todolist.id, thisObj, types.UPDATE);
    submitTodoList(todolist, thisObj, types.UPDATE);
}

// 获取今日新建所有的任务
export function queryNewTodolistByDate(todolist, thisObj) {
    let date = util.dateForMat("yyyy-MM-dd", todolist.leftCurTime);
    let sql = dbUtil.getSqlObj();
    let tempObj = {};
    let category = {};
    let parentCategory = {};
    let obj = {};
    let userId = wsCache.get("user").id;
    let sqlStr =
        "select * from tbl_todolist WHERE  status = 1 AND userId = " +
        userId +
        " AND repeatType != 0 order by importLevel asc";
    let stmt = sql.prepare(sqlStr);
    let resultList = [];
    stmt.bind({
        $c: date
    });
    let endTimeNum = 0;
    while (stmt.step()) {
        tempObj = stmt.getAsObject();
        tempObj.discardStatus = 0;
        if (tempObj.endDate != "" && tempObj.endDate != null) {
            endTimeNum = util.TimeCap(
                new Date(date),
                new Date(tempObj.endDate)
            );
            tempObj.endTimeNum = endTimeNum;
        }
        // 根据categoryId获取caategory
        category = queryCategoryById(tempObj.categoryId);
        parentCategory = queryCategoryById(category.pid);
        obj = {
            todolist: tempObj,
            category: category,
            parentCategory: parentCategory
        };
        resultList.push(obj);
    }
    sql.close();
    return resultList;
}

export function queryTodolistByDate(date, thisObj) {
    let result = [];
    let tempObj = {};
    let category = {};
    let parentCategory = {};
    let obj = {};
    let sql = dbUtil.getSqlObj();
    date = util.dateForMat("yyyy-MM-dd", date);
    let dateObj = new Date(date);
    let stmt = {};
    let userId = wsCache.get("user").id;
    let endTimeNum = 0;
    // 第一种情况, 不重复
    let sqlStr =
        "select * from tbl_todolist WHERE status = 1 AND userId = " +
        userId +
        " AND repeatType = 0 AND curDateTime like $a AND SUBSTR(curDateTime, 1, 10) <= $b order by importLevel asc";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + date + "%",
            $b: date,
            $c: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                category = queryCategoryById(tempObj.categoryId);
                parentCategory = queryCategoryById(category.pid);
                obj = {
                    todolist: tempObj,
                    category: category,
                    parentCategory: parentCategory
                };
                result.push(obj);
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============1==================!"
        });
    }
    // 第二种情况, 每一天
    sqlStr =
        "select * from tbl_todolist WHERE (status = 1 or (status = 0 AND SUBSTR(updateTime, 1, 10) > $c)) AND userId = " +
        userId +
        " AND repeatType = 1 AND SUBSTR(curDateTime, 1, 10) <= $b order by importLevel asc";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                // 根据categoryId获取caategory
                category = queryCategoryById(tempObj.categoryId);
                parentCategory = queryCategoryById(category.pid);
                obj = {
                    todolist: tempObj,
                    category: category,
                    parentCategory: parentCategory
                };
                result.push(obj);
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============2==================!"
        });
    }
    // 第三种情况 每一周
    sqlStr =
        "select * from tbl_todolist WHERE  (status = 1 or (status = 0 AND SUBSTR(updateTime, 1, 10) > $c)) AND userId = " +
        userId +
        "  AND repeatType = 2 AND SUBSTR(curDateTime, 1, 10) <= $b order by importLevel asc";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                // 获取提醒日期
                let remindDate = new Date(
                    util.dateForMat("yyyy-MM-dd", new Date(tempObj.endDate))
                );
                endTimeNum = util.TimeCap(
                    new Date(date),
                    new Date(tempObj.endDate)
                );
                tempObj.endTimeNum = endTimeNum;
                if (remindDate.getDay() == dateObj.getDay()) {
                    // 根据categoryId获取caategory
                    category = queryCategoryById(tempObj.categoryId);
                    parentCategory = queryCategoryById(category.pid);
                    obj = {
                        todolist: tempObj,
                        category: category,
                        parentCategory: parentCategory
                    };
                    result.push(obj);
                }
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============3==================!"
        });
    }
    // 第四种情况 每个月
    sqlStr =
        "select * from tbl_todolist WHERE  (status = 1 or (status = 0 AND SUBSTR(updateTime, 1, 10) > $c)) AND userId = " +
        userId +
        "  AND repeatType = 3 AND SUBSTR(curDateTime, 1, 10) <= $b order by importLevel asc";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                // 获取提醒日期
                let remindDate = new Date(
                    util.dateForMat("yyyy-MM-dd", new Date(tempObj.endDate))
                );
                if (remindDate.getDate() == dateObj.getDate()) {
                    // 根据categoryId获取caategory
                    category = queryCategoryById(tempObj.categoryId);
                    parentCategory = queryCategoryById(category.pid);
                    obj = {
                        todolist: tempObj,
                        category: category,
                        parentCategory: parentCategory
                    };
                    result.push(obj);
                }
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============4==================!"
        });
    }
    // 第五种情况 每一年
    sqlStr =
        "select * from tbl_todolist WHERE  (status = 1 or (status = 0 AND SUBSTR(updateTime, 1, 10) > $c)) AND userId = " +
        userId +
        "  AND repeatType = 4 AND SUBSTR(curDateTime, 1, 10) <= $b order by importLevel asc";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                if (
                    date.substring(5) ==
                    tempObj.endDate.split(" ")[0].substring(5)
                ) {
                    category = queryCategoryById(tempObj.categoryId);
                    parentCategory = queryCategoryById(category.pid);
                    obj = {
                        todolist: tempObj,
                        category: category,
                        parentCategory: parentCategory
                    };
                    result.push(obj);
                }
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============5==================!"
        });
    }
    // 第六种情况 每一天(节假日除外)
    sqlStr =
        "select * from tbl_todolist WHERE  (status = 1 or (status = 0 AND SUBSTR(updateTime, 1, 10) > $c)) AND userId = " +
        userId +
        "  AND repeatType = 5 AND SUBSTR(curDateTime, 1, 10) <= $b order by importLevel asc";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                if (dateObj.getDay() != 6 && dateObj.getDay() != 0) {
                    // 根据categoryId获取caategory
                    category = queryCategoryById(tempObj.categoryId);
                    parentCategory = queryCategoryById(category.pid);
                    obj = {
                        todolist: tempObj,
                        category: category,
                        parentCategory: parentCategory
                    };
                    result.push(obj);
                }
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============6==================!"
        });
    }
    // 第七种情况 每一天(工作日除外)
    sqlStr =
        "select * from tbl_todolist WHERE  (status = 1 or (status = 0 AND SUBSTR(updateTime, 1, 10) > $c)) AND userId = " +
        userId +
        "  AND repeatType = 6 AND SUBSTR(curDateTime, 1, 10) <= $b order by importLevel asc";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $b: date,
            $c: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                if (dateObj.getDay() == 6 || dateObj.getDay() == 0) {
                    // 根据categoryId获取caategory
                    category = queryCategoryById(tempObj.categoryId);
                    parentCategory = queryCategoryById(category.pid);
                    obj = {
                        todolist: tempObj,
                        category: category,
                        parentCategory: parentCategory
                    };
                    result.push(obj);
                }
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============7==================!"
        });
    }
    // 第8种情况 (获取所有未完成的任务)
    let flag = false;
    let temp = {};
    sqlStr =
        "SELECT b.* FROM 	tbl_timeMachine AS a LEFT JOIN (select * from tbl_todolist WHERE status = 1 and userId = " +
        userId +
        " AND SUBSTR(curDateTime, 1, 10) <= $e ) AS b ON a.todolistId = b.id WHERE 	a.status = 1 AND a.userId = " +
        userId +
        " GROUP BY  	a.todolistId HAVING 	max(a.progress) AND a.progressStatus = 0  AND (b.repeatType = 0 or b.repeatType = 2 or b.repeatType = 3 or b.repeatType = 4)";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $e: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                for (let index = 0; index < result.length; index++) {
                    temp = result[index];
                    if (temp.todolist.id == tempObj.id) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    // 根据categoryId获取caategory
                    category = queryCategoryById(tempObj.categoryId);
                    parentCategory = queryCategoryById(category.pid);
                    obj = {
                        todolist: tempObj,
                        category: category,
                        parentCategory: parentCategory
                    };
                    result.push(obj);
                }
            }
            flag = false;
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============8==================!"
        });
    }
    // 第九种获取还未开始的加心任务
    sqlStr =
        "SELECT a.* FROM	(		SELECT			*		FROM			tbl_todolist		WHERE			userId = " +
        userId +
        "		AND status = 1		AND heart = 1 AND SUBSTR(curDateTime, 1, 10) < $e	) AS a LEFT JOIN (	SELECT		*	FROM		tbl_timeMachine	WHERE		userId = " +
        userId +
        "	AND status = 1) AS b ON a.id = b.todolistId WHERE	b.progress ISNULL ORDER BY a.importLevel ASC";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $e: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                // 根据categoryId获取caategory
                category = queryCategoryById(tempObj.categoryId);
                parentCategory = queryCategoryById(category.pid);
                obj = {
                    todolist: tempObj,
                    category: category,
                    parentCategory: parentCategory
                };
                result.push(obj);
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============9==================!"
        });
    }

    //获取今天延期完成的任务
    sqlStr =
        "SELECT 	b.* FROM 	(SELECT * from tbl_timeMachine  WHERE  	status = 1 AND progress = 100  AND progressStatus = 1  AND SUBSTR(curDateTime, 1, 10) = $a  AND userId = 1) AS a LEFT JOIN ( 	SELECT 		* 	FROM 		tbl_todolist 	WHERE 		status = 1 	AND userId = 1 	AND SUBSTR(curDateTime, 1, 10) <= $b ) AS b ON b.id = a.todolistId  LEFT JOIN tbl_category AS c ON b.categoryId = c.id LEFT JOIN tbl_category AS d ON c.pid = d.id  WHERE SUBSTR(a.curDateTime, 1, 10) > SUBSTR(b.curDateTime, 1, 10) AND b.repeatType = 0 ";
    try {
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: date,
            $b: date
        });
        while (stmt.step()) {
            tempObj = stmt.getAsObject();
            if (tempObj.id != null) {
                if (tempObj.endDate != "" && tempObj.endDate != null) {
                    endTimeNum = util.TimeCap(
                        new Date(date),
                        new Date(tempObj.endDate)
                    );
                    tempObj.endTimeNum = endTimeNum;
                }
                // 根据categoryId获取caategory
                category = queryCategoryById(tempObj.categoryId);
                parentCategory = queryCategoryById(category.pid);
                obj = {
                    todolist: tempObj,
                    category: category,
                    parentCategory: parentCategory
                };
                result.push(obj);
            }
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "系统异常==============10==================!"
        });
    }

    // 删除因为target临时变动而涉及的todolist
    for (let i = result.length - 1; i >= 0; i--) {
        let ele = result[i];
        let targetId = ele.todolist.targetId;
        if(targetId != 0) {
            // 根据targetId查询target 
            let target = targetUtil.queryTargetById(targetId);
            if(target.projection == 2) {
                result.splice(i, 1);
            }
        }
    }


    let discardTasks = getDiscardTaskByTodolistDate(date);
    let sign = false;
    for (let i = 0; i < result.length; i++) {
        let id = result[i].todolist.id;
        for (let j = 0; j < discardTasks.length; j++) {
            let listId = discardTasks[j].todolistId;
            if (id == listId) {
                result[i].todolist.discardStatus = 1;
                result[i].todolist.discardTaskId = discardTasks[j].id;
                sign = true;
                break;
            }
        }
        if (!sign) {
            result[i].todolist.discardStatus = 0;
            result[i].todolist.discardTaskId = null;
        } else {
            sign = false;
        }
    }
    sql.close();
    return result;
}

// 通过categoryId获取category
export function queryCategoryById(id) {
    let userId = wsCache.get("user").id;
    let sqlStr =
        "select id, categoryName, pid from tbl_category WHERE status = 1 AND userId = " +
        userId +
        " AND id = $a";
    var sql = dbUtil.getSqlObj();
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: id
    });
    stmt.step();
    let obj = stmt.getAsObject();
    sql.close();
    return obj;
}

export function deleteCategoryById(id, isLeaf) {
    return execDeleteCategoryByIdSql(id, isLeaf);
}

export function execDeleteCategoryByIdSql(category, thisObj) {
    var sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    try {
        if (category.pid == 0) {
            thisObj.$Message.warning({
                content: "根节点不能删除!"
            });
            return;
        }
        if (category.isLeaf == 1) {
            // 判断当前节点的父节点是否有其它的子节点
            if (!hasChildNode(category.pid)) {
                updateCategoryIsLeafStatusByPid(category.pid, 1, sql);
            }
            // let sqlstr =
            //     "DELETE FROM tbl_category WHERE id = " + category.id + ";";
            let sqlStr =
                "update tbl_category set status = 0, updateTime = '" +
                updateTime +
                "' WHERE id = " +
                category.id +
                ";";
            sql.exec(sqlStr);
            dbUtil.writeDataToDB(sql);
            thisObj.$Message.success({
                content: "删除成功!"
            });
        } else {
            thisObj.$Message.warning({
                content: "存在子节点, 不能删除!"
            });
        }
    } catch (error) {
        thisObj.$Message.error({
            content: "删除时间清单类别类别失败!"
        });
    }
}

export function hasChildNode(id) {
    var sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT count(*) as childNum from tbl_category WHERE status = 1 AND userId = " +
        userId +
        " AND pid = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: id
    });
    stmt.step();
    let result = stmt.getAsObject();
    sql.close();
    if (result.childNum > 1) {
        return true;
    } else {
        return false;
    }
}

export function deleteTaskById(id, thisObj, type) {
    return execDeleteTaskByIdSql(id, thisObj, type);
}

export function execDeleteTaskByIdSql(id, thisObj, type) {
    //let sqlstr = "DELETE FROM tbl_todolist WHERE id = " + id + ";";
    var sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlstr =
        "update tbl_todolist set status = 0, updateTime = '" +
        updateTime +
        "' WHERE id = " +
        id +
        ";";
    try {
        sql.exec(sqlstr);
        dbUtil.writeDataToDB(sql);
        if (type == null) {
            thisObj.$Message.success({
                content: "删除任务清单成功!"
            });
        }
    } catch (error) {
        if (type == null) {
            thisObj.$Message.success({
                content: "删除任务清单失败!"
            });
        }
    }
}

// 添加清单
export function submitTodoList(todoList, thisObj, type) {
    // 判断参数是否有效
    let result = checkSubmitTodoListParams(todoList, thisObj);
    if (result) {
        return;
    }
    // 执行insert语句
    result = execSubmitTodoListSql(todoList, thisObj, type);
    return result;
}

// 执行提交todoList方法sql
export function execSubmitTodoListSql(todoList, thisObj, type) {
    var sql = dbUtil.getSqlObj();
    let dateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let curDateTime = todoList.curDateTime.format("yyyy-MM-dd hh:mm:ss");
    let remind = util.dateForMat(
        "yyyy-MM-dd hh:mm:ss",
        new Date(todoList.remind)
    );
    let endDate = "";
    if (todoList.endDate != null && todoList.endDate != "") {
        endDate = util.dateForMat("yyyy-MM-dd", new Date(todoList.endDate));
    }
    let categoryId = todoList.categoryIds[todoList.categoryIds.length - 1];
    let categoryIds = todoList.categoryIds.join(",");
    let forecastTime = 0;
    if (todoList.timeType == 1) {
        forecastTime = todoList.forecastTimeOfMin;
    } else {
        forecastTime = todoList.forecastTimeOfHour * 60;
    }
    let sqlstr =
        "INSERT INTO tbl_todolist(categoryId, userId, listName, categoryIds, heart, repeatType, importLevel, targetId, difficult, curDateTime, updateTime, syncStatus, status, scheduleTime, endDate) VALUES(" +
        categoryId +
        ", " +
        wsCache.get("user").id +
        ", '" +
        todoList.listName +
        "', '" +
        categoryIds +
        "', " +
        todoList.heart +
        ", " +
        todoList.repeatType +
        ", " +
        todoList.importLevel +
        "," +
        todoList.targetId +
        "," +
        todoList.difficult +
        ", '" +
        curDateTime +
        "', '" +
        dateTime +
        "', " +
        todoList.syncStatus +
        ", " +
        todoList.status +
        ", " +
        todoList.scheduleTime +
        ", '" +
        endDate +
        "');";
    try {
        sql.exec(sqlstr);
        // 获取最近插入的rowid
        let lastId = getLastInsertRowId(sql);
        // 更新关联表的todolistId
        if (todoList.id != "") {
            updateTodolistIdOfTimemachine(todoList.id, lastId, sql);
        }
        dbUtil.writeDataToDB(sql);
        if (type == null) {
            thisObj.$Message.success({
                content: "添加任务清单成功!"
            });
        }
    } catch (error) {
        if (type == null) {
            thisObj.$Message.error({
                content: "添加任务清单失败!"
            });
        }
    }
}

// 检查SubmitTodoList方法参数
export function checkSubmitTodoListParams(todoList, thisObj) {
    let categoryId = todoList.categoryIds[todoList.categoryIds.length - 1];
    let categoryIds = todoList.categoryIds.join(",");
    if (categoryId == "") {
        thisObj.$Message.warning({
            content: "请选择一个清单类别!"
        });
        return true;
    } else if (todoList.listName == "") {
        thisObj.$Message.warning({
            content: "请填写任务名称!"
        });
        return true;
    } else if (todoList.repeatType == "") {
        thisObj.$Message.warning({
            content: "请填写重复类型!"
        });
        return true;
    } else if ((todoList.repeatType == 2 || todoList.repeatType == 3 || todoList.repeatType == 4) && todoList.endDate == "") {
        thisObj.$Message.warning({
            content: "请选择截至时间!"
        });
        return true;
    } else if (todoList.importLevel == "") {
        thisObj.$Message.warning({
            content: "请选择一个优先级!"
        });
        return true;
    } else {
        return false;
    }
}

// 校验addCategory方法是否为空
export function checkAddCategoryMethodParam(obj) {
    let flag = false;
    let categoryName = obj.categoryName;
    if (categoryName == "") {
        thisObj.$Message.warning({
            content: "请输入一个类别!"
        });
    } else if (obj.imgCheck.length == 0) {
        thisObj.$Message.warning({
            content: "请选择一个图标!"
        });
    } else {
        return false;
    }
    return true;
}

export function fixDataUrl() {
    let resultList = [];
    let resultObj = {};
    let sql = dbUtil.getSqlObj();
    let sqlStr = "select * from tbl_category";
    let stmt = sql.prepare(sqlStr);
    while (stmt.step()) {
        resultObj = stmt.getAsObject();
        let iconName = resultObj.iconName;
        let idEle = iconName.split(".")[0];
        let element = document.getElementById(idEle + "");
        let dataUrl = element.getAttribute("src");
        let id = resultObj.id;
        sqlStr =
            "update tbl_category set dataUrl = '" +
            dataUrl +
            "' WHERE id = " +
            id +
            ";";
        sql.run(sqlStr);
    }
    dbUtil.writeDataToDB(sql);
}

// 添加清单类别
export function addCategory(thisObj, obj) {
    // 校验参数是否为空
    if (checkAddCategoryMethodParam(obj)) {
        return false;
    }
    var sql = dbUtil.getSqlObj();
    let categoryName = obj.categoryName;
    let categoryPid = obj.categoryModalIds[obj.categoryModalIds.length - 1];
    if (categoryPid == "") {
        if (obj.categoryModalIds.length == 1) {
            categoryPid = 0;
        } else {
            categoryPid = obj.categoryModalIds[obj.categoryModalIds.length - 2];
        }
    }
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let syncStatus = 0;
    let status = 1;
    let isLeaf = 1;
    let tierRelation = "";
    let type = 0;
    let iconName = obj.imgCheck[0];
    let idEle = iconName.split(".")[0];
    let element = document.getElementById(idEle + "");
    let dataUrl = element.getAttribute("src");
    if (categoryPid != 0) {
        // 删除数组最后一个元素
        obj.categoryModalIds.splice(obj.categoryModalIds.length - 1, 1);
        tierRelation = obj.categoryModalIds.join(",");
    }
    let sqlstr =
        "INSERT INTO tbl_category(userId, pid, categoryName, isLeaf, tierRelation, iconName, dataUrl, updateTime, syncStatus, status) VALUES (" +
        wsCache.get("user").id +
        ", " +
        categoryPid +
        ", '" +
        categoryName +
        "', " +
        isLeaf +
        ", '" +
        tierRelation +
        "', '" +
        iconName +
        "', '" +
        dataUrl +
        "', '" +
        updateTime +
        "', " +
        syncStatus +
        ", " +
        status +
        ")";
    try {
        sql.exec(sqlstr);
        let lastId = getLastInsertRowId(sql);
        // 为每个类别插入基本的功能
        insertCategorySetting(obj, lastId, sql);
        // 改变当前元素的父元素是否是叶子的状态
        if (categoryPid != 0) {
            updateCategoryIsLeafStatusByPid(categoryPid, 0, sql);
        }
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({
            content: "添加清单类别成功!"
        });
    } catch (error) {
        thisObj.$Message.error({
            content: "添加清单类别失败!"
        });
        return false;
    }
    return true;
}



// 获取最近插入的rowid
export function getLastInsertRowId(sql) {
    let sqlStr = "select last_insert_rowid()";
    let tempRes = sql.exec(sqlStr);
    tempRes = tempRes[0].values[0][0];
    return tempRes;
}

export function insertCategorySetting(todoList, id, sql) {
    if (sql == null) {
        sql = dbUtil.getSqlObj();
    }
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let syncStatus = 0;
    let status = 1;
    let doWhatStatus = 1;
    let tagStatus = 1;
    let progressStatus = 1;
    let noteStatus = 0;
    let remarkStatus = 0;
    let attachStatus = 0;
    let consumeStatus = 0;
    let incomeStatus = 0;
    let noteCategoryStatus = 0;
    let consumeCategoryStatus = 0;
    let sqlstr =
        "INSERT INTO tbl_categorySetting(userId, categoryId, updateTime, syncStatus, status, doWhatStatus, tagStatus, progressStatus, noteStatus, remarkStatus, attachStatus, consumeStatus, incomeStatus) VALUES (" +
        wsCache.get("user").id +
        ", " +
        id +
        ", '" +
        updateTime +
        "', " +
        syncStatus +
        ", " +
        status +
        ", " +
        doWhatStatus +
        ", " +
        tagStatus +
        ", " +
        progressStatus +
        ", " +
        noteStatus +
        ", " +
        remarkStatus +
        ", " +
        attachStatus +
        ", " +
        consumeStatus +
        ", " +
        incomeStatus +
        ")";
    sql.exec(sqlstr);
}

// 更新当前节点的父节点的叶子状态
export function updateCategoryIsLeafStatusByPid(id, isLeaf, sql) {
    let date = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "update tbl_category set isLeaf = " +
        isLeaf +
        ", updateTime = '" +
        date +
        "' WHERE id = " +
        id +
        ";";
    sql.exec(sqlStr);
}

export function queryCategoryTask(todoList) {
    let obj = {};
    let list = [];
    let categoryList = todoList.categoryListOfSelect;
    let id = "";
    let categoryTaskList = [];
    categoryList.forEach(element => {
        id = element.id;
        // 根据categoryId查询任务清单
        categoryTaskList = queryTodoListByCategoryId(id);
        obj = {
            id: id,
            categoryName: element.categoryName,
            categoryTaskList: categoryTaskList
        };
        list.push(obj);
    });
    return list;
}

export function queryTodoListByCategoryId(id) {
    var sql = dbUtil.getSqlObj();
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT id, listName FROM tbl_todolist WHERE status = 1 AND userId = " +
        userId +
        " AND  categoryId = " +
        id +
        ";";
    let tempRes = sql.exec(sqlStr);
    let res = [];
    if (tempRes.length == 0) {
        return res;
    }
    for (let index = 0; index < tempRes[0].values.length; index++) {
        let id = tempRes[0].values[index][0];
        let listName = tempRes[0].values[index][1];
        let obj = {
            id: id,
            listName: listName
        };
        res.push(obj);
    }
    sql.close();
    return res;
}

// 查询所有的清单级别
export function queryCategoryOfLevel() {
    let result = [];
    let tempObj = {};
    let obj = {};
    let children = [];
    var sql = dbUtil.getSqlObj();
    let firstLevels = getSubcategoryOfLevelByPid(0, sql);
    let secendLevels = {};
    let thirdLevels = {};
    let fourthLevels = {};
    let fifthLevels = {};
    for (let i = 0; i < firstLevels.length; i++) {
        secendLevels = getSubcategoryOfLevelByPid(firstLevels[i].id, sql);
        firstLevels[i].children = secendLevels;
        for (let j = 0; j < secendLevels.length; j++) {
            thirdLevels = getSubcategoryOfLevelByPid(secendLevels[j].id, sql);
            secendLevels[j].children = thirdLevels;
            for (let q = 0; q < thirdLevels.length; q++) {
                fourthLevels = getSubcategoryOfLevelByPid(thirdLevels[q].id, sql);
                thirdLevels[q].children = fourthLevels;
                for (let p = 0; p < fourthLevels.length; p++) {
                    fifthLevels = getSubcategoryOfLevelByPid(fourthLevels[p].id, sql);
                    fourthLevels[p].children = fifthLevels;
                }
            }
        }
    }
    sql.close();
    return JSON.parse(JSON.stringify(firstLevels));
}

export function getSubcategoryOfLevelByPid(pid, sql) {
    let children = [];
    let obj = {};
    let tempObj = {};
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT id, categoryName, isLeaf, pid FROM tbl_category WHERE status = 1 AND userId = " +
        userId +
        " AND  pid = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: pid
    });
    while (stmt.step()) {
        tempObj = stmt.getAsObject();
        obj = {
            label: tempObj.categoryName,
            id: tempObj.id,
            isLeaf: tempObj.isLeaf,
            pid: tempObj.pid
        };
        children.push(obj);
    }
    return children;
}

// 查询所有的select Modal下的选项
export function queryCategoryOfSelectModal() {
    var sql = dbUtil.getSqlObj();
    let result = [];
    let tempObj = {};
    let obj = {};
    let children = [];
    let firstLevels = getSubcategoryOfModalByPid(0, sql);
    let secendLevels = {};
    let thirdLevels = {};
    let fourthLevels = {};
    let fifthLevels = {};
    for (let i = 0; i < firstLevels.length - 1; i++) {
        secendLevels = getSubcategoryOfModalByPid(firstLevels[i].value, sql);
        firstLevels[i].children = secendLevels;
        for (let j = 0; j < secendLevels.length - 1; j++) {
            thirdLevels = getSubcategoryOfModalByPid(
                secendLevels[j].value,
                sql
            );
            secendLevels[j].children = thirdLevels;
            for (let q = 0; q < thirdLevels.length - 1; q++) {
                fourthLevels = getSubcategoryOfModalByPid(thirdLevels[q].value, sql);
                thirdLevels[q].children = fourthLevels;
                for (let p = 0; p < fourthLevels.length - 1; p++) {
                    fifthLevels = getSubcategoryOfModalByPid(fourthLevels[p].value, sql);
                    fourthLevels[p].children = fifthLevels;
                }
            }
        }
    }
    sql.close();
    return firstLevels;
}

// 查询所有的清单类别
export function queryCategoryOfSelect() {
    var sql = dbUtil.getSqlObj();
    let result = [];
    let tempObj = {};
    let obj = {};
    let children = [];
    let firstLevels = getSubcategoryByPid(0, sql);
    let secendLevels = {};
    let thirdLevels = {};
    let fourthLevels = {};
    let fifthLevels = {};

    for (let i = 0; i < firstLevels.length; i++) {
        secendLevels = getSubcategoryByPid(firstLevels[i].value, sql);
        firstLevels[i].children = secendLevels;
        for (let j = 0; j < secendLevels.length; j++) {
            thirdLevels = getSubcategoryByPid(secendLevels[j].value, sql);
            secendLevels[j].children = thirdLevels;
            for (let q = 0; q < thirdLevels.length; q++) {
                fourthLevels = getSubcategoryByPid(thirdLevels[q].value, sql);
                thirdLevels[q].children = fourthLevels;
                for (let p = 0; p < fourthLevels.length; p++) {
                    fifthLevels = getSubcategoryByPid(fourthLevels[p].value, sql);
                    fourthLevels[p].children = fifthLevels;
                }
            }
        }
    }
    sql.close();
    return firstLevels;
}

export function getSubcategoryByPid(pid, sql) {
    let children = [];
    let obj = {};
    let tempObj = {};
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT id, categoryName FROM tbl_category WHERE status = 1 AND userId = " +
        userId +
        " AND pid = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: pid
    });
    while (stmt.step()) {
        tempObj = stmt.getAsObject();
        obj = {
            label: tempObj.categoryName,
            value: tempObj.id
        };
        children.push(obj);
    }
    return children;
}

// 获取模态框的父选择器, 另外在每个节点单独加上"当前节点"
export function getSubcategoryOfModalByPid(pid, sql) {
    let children = [];
    let obj = {};
    let tempObj = {};
    let emptyObj = {
        label: "当前节点",
        value: ""
    };
    let userId = wsCache.get("user").id;
    let sqlStr =
        "SELECT id, categoryName FROM tbl_category WHERE status = 1 AND userId = " +
        userId +
        " AND pid = $a";
    let stmt = sql.prepare(sqlStr);
    stmt.bind({
        $a: pid
    });
    while (stmt.step()) {
        tempObj = stmt.getAsObject();
        obj = {
            label: tempObj.categoryName,
            value: tempObj.id
        };
        children.push(obj);
    }
    children.push(emptyObj);
    return children;
}

export function updateTodolistIdOfTimemachine(
    oldTimeMachineId,
    newTimeMachineId,
    sql
) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_timeMachine set updateTime = '" +
        updateTime +
        "', todolistId = " +
        newTimeMachineId +
        " WHERE todolistId = " +
        oldTimeMachineId;
    sql.run(sqlStr);
}
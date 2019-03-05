import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import WebStorageCache from "web-storage-cache";
export var user = {};

// 将user放入缓存中
export function setUserCache(user) {
    // create WebStorageCache instance.
    let wsCache = new WebStorageCache();
    // 超时截止日期，可用使用Date类型
    var nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    // cache 'wqteam' at 'username', expired in 100 seconds
    wsCache.set("user", user, { exp: nextYear });
}

export function updateUserLoginStatu(user, thisObj, autoLogin) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let userId = user.id;
    let sqlStr =
        "UPDATE tbl_user set updateTime = '" +
        updateTime +
        "', autoLogin = " +
        autoLogin +
        " WHERE id = " +
        userId;
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
        // thisObj.$Message.success({ content: "删除成功!" });
    } catch (error) {
        thisObj.$Message.success({ content: "登陆状态设置失败!" });
    }
}

// 实现用户自动登陆
export function isRemenber() {
    let sql = dbUtil.getSqlObj();
    let result = true;
    let users = [];
    let user = null;
    let sqlStr =
        "SELECT * FROM tbl_user WHERE status = 1 and remenber = 1 and autoLogin = 1 order by createTime desc";
    let stmt = {};
    try {
        stmt = sql.prepare(sqlStr);
        while (stmt.step()) {
            users.push(stmt.getAsObject());
        }
        if (users.length == 1) {
            user = users[0];
            user.password = "";
            setUserCache(user);
        } else {
            result = false;
        }
    } catch (error) {
        result = false;
    }
    sql.close();
    return result;
}

// 实现用户登陆功能
export function login(user, thisObj) {
    // 检查有声书参数
    let result = checkRegisterMethodParam(user, thisObj);
    let sql = dbUtil.getSqlObj();
    if (result) {
        // 根据用户名以及密码判断用户是否存在
        let sqlStr =
            "SELECT * FROM tbl_user WHERE status = 1 and username = $a and password = $b";
        let stmt = {};
        try {
            stmt = sql.prepare(sqlStr);
            stmt.bind({ $a: user.username, $b: user.password });
            stmt.step();
            if (null != stmt.getAsObject().id) {
                user = stmt.getAsObject();
                user.password = "";
                setUserCache(user);
                thisObj.$Message.success({
                    content: "登陆成功!"
                });
                updateUserLoginStatu(user, thisObj, 1);
            } else {
                thisObj.$Message.error({
                    content: "用户名称或密码错误!"
                });
                result = false;
            }
        } catch (error) {
            thisObj.$Message.error({ content: "登陆失败!" });
            result = false;
        }
    }
    sql.close();
    return result;
}

// 实现用户注册功能
export function register(user, thisObj) {
    let result = checkRegisterMethodParam(user, thisObj);
    if (result) {
        // 将有声书插入
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let curDateTime = updateTime;
        let remenber = 0;
        let autoLogin = 1;
        if (user.remenber) {
            remenber = 1;
        }
        var sql = dbUtil.getSqlObj();
        let sqlstr =
            "INSERT INTO tbl_user(username, password, createTime, updateTime, syncStatus, status, remenber, autoLogin) VALUES ('" +
            user.username +
            "', '" +
            user.password +
            "', '" +
            curDateTime +
            "', '" +
            updateTime +
            "', " +
            user.syncStatus +
            ", " +
            user.status +
            ", " +
            remenber +
            ", " +
            autoLogin +
            ")";
        try {
            console.log("sqlstr: ");
            console.log(sqlstr);
            sql.exec(sqlstr);
            let id = getLastInsertRowId(sql);
            console.log("id: ");
            console.log(id);
            let client = {
                id: id,
                username: user.username,
                password: user.password,
                createTime: curDateTime,
                updateTime: updateTime,
                syncStatus: user.syncStatus,
                status: user.status,
                remenber: remenber
            };
            client.password = "";
            setUserCache(client);
            dbUtil.writeDataToDB(sql);
            thisObj.$Message.success({ content: "注册成功!" });
            return true;
        } catch (error) {
            console.log(error);
            thisObj.$Message.error({ content: "注册失败!" });
            return false;
        }
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

// 校验reg方法的参数
export function checkRegisterMethodParam(user, thisObj) {
    if ("" == user.username) {
        thisObj.$Message.success({ content: "请输入用户名!" });
    } else if ("" == user.password) {
        thisObj.$Message.success({ content: "请输入密码!" });
    } else if (user.password.length < 6) {
        thisObj.$Message.success({ content: "密码至少6位!" });
    } else {
        return true;
    }
    return false;
}

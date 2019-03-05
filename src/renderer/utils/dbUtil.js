import path from "path";
import { remote } from "electron";
import types from "@/store/types";
import Datastore from "nedb";

var dbpath = path.join(remote.app.getPath("userData"), "/databases/sql.db");
var fs = require("fs");

// 获取数据库路径
export function getDBPath(dbname) {
    return path.join(remote.app.getPath("userData"), "/nedb/" + dbname);
}

// 获取附件的存储路径
export function getAttachmentPath(attachName) {
    return path.join(
        remote.app.getPath("userData"),
        "/attachments/" + attachName
    );
}

// 获取附件的存储路径
export function getAttachmentPathOfVoice(attachName, pathStr) {
    return path.join(
        remote.app.getPath("userData"),
        "/attachments/" + pathStr + attachName
    );
}

var dbInfo = [
    {
        tableName: types.TBL_USER
    },
    {
        tableName: types.TBL_TAG
    },
    {
        tableName: types.TBL_TIMEMACHINE
    },
    {
        tableName: types.TBL_ATTACH
    }
];

// 判断表中是否有数据
export function isEmptyDB(db) {
    db.count({}, function(err, count) {
        if (count == 0) {
            return true;
        } else {
            return false;
        }
    });
}

// 获取表现在最大的id值

// 初始化数据库
export function initDB(db) {
    db.count({}, function(err, count) {
        if (count == 0) {
            // 说明数据库是空的
            // 插入数据库基本信息(都有哪些数据库表)
            db.insert(dbInfo, function(err, data) {
                if (null != data) {
                    // console.log("success: " + data);
                }
            });
            // 创建数据库实例
            createDB(db);
        }
    });
}

// 获取sql.js数据对象
export function getSqlObj() {
    let sql = require("sql.js");
    let filebuffer = fs.readFileSync(dbpath);
    // load the db
    return new sql.Database(filebuffer);
}

// 将更新数据写入sql文件中
export function writeDataToDB(db) {
    let binaryArray = db.export();
    let buffer = new Buffer(binaryArray);
    fs.writeFileSync(dbpath, buffer);
    db.close();
}

export function DBExists() {
    let fs = require("fs");
    var sql = require("sql.js");
    let pathStr = path.join(remote.app.getPath("userData"));
    let dirs = [];
    let parentDir = pathStr + "\\databases";
    fs.exists(parentDir, function(exists) {
        if (!exists) {
            fs.mkdir(parentDir, function(err) {
                if (err) {
                    return console.error(parentDir + "目录创建失败!");
                }
            });
            setTimeout(() => {
                var db = new sql.Database();
                var binaryArray = db.export();
                var buffer = new Buffer(binaryArray);
                var dbpath = path.join(
                    remote.app.getPath("userData"),
                    "/databases/sql.db"
                );
                fs.writeFileSync(dbpath, buffer);
            }, 100);
        }
    });
}

// 初始化数据库表
export function initDBTables() {
    // 判断数据库文件是否存在?
    DBExists();
    let flag = false;
    let db = {};
    setTimeout(() => {
        db = getSqlObj();
        let sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_category';";
        let result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_category (" +
                "id  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                "pid  INTEGER NOT NULL," +
                "userId  INTEGER NOT NULL," +
                "categoryName  TEXT NOT NULL," +
                "isLeaf  INTEGER NOT NULL," +
                "tierRelation  TEXT," +
                "iconName  TEXT NOT NULL," +
                "dataUrl  TEXT NOT NULL," +
                "updateTime  TEXT NOT NULL," +
                "syncStatus  INTEGER NOT NULL," +
                "status  INTEGER NOT NULL);";
            db.run(sqlstr);
        }
        // tbl_todolist
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_todolist';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_todolist (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " categoryId   INTEGER NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " listName   TEXT NOT NULL," +
                " categoryIds   TEXT," +
                " heart   INTEGER NOT NULL," +
                " repeatType   INTEGER NOT NULL," +
                " remind   TEXT," +
                " importLevel   INTEGER NOT NULL," +
                " difficult   INTEGER," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL," +
                " forecastTimeType   INTEGER," +
                " forecastTime   INTEGER," +
                " scheduleTime   INTEGER," +
                " targetId   INTEGER," +
                " endDate   TEXT" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_tag表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_tag';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_tag (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " tagName   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_timeMachine表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_timeMachine';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_timeMachine (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " todolistId   INTEGER NOT NULL," +
                " tagIds   TEXT NOT NULL," +
                " timeSlot   TEXT NOT NULL," +
                " consumeTime   INTEGER NOT NULL," +
                " progress   INTEGER NOT NULL," +
                " progressStatus   INTEGER NOT NULL," +
                " remark   TEXT," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL," +
                " consume   INTEGER," +
                " income   INTEGER," +
                " note   TEXT," +
                " reviewDays   TEXT," +
                " review   INTEGER," +
                " reviewNum   INTEGER," +
                " show   INTEGER default 1," +
                " noteShow   INTEGER default 1," +
                " consumeShow   INTEGER default 1" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_attach表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_attach';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_attach (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " busId   INTEGER NOT NULL," +
                " attachName   TEXT NOT NULL," +
                " attachNativeUrl   TEXT NOT NULL," +
                " attachRomoteUrl   TEXT," +
                " attachGroup   INTEGER NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL," +
                " show   INTEGER default 1" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_setting表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_setting';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_setting (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " remindCycle   INTEGER NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_categorySetting表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_categorySetting';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_categorySetting (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " categoryId   INTEGER NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " doWhatStatus   INTEGER NOT NULL," +
                " tagStatus   INTEGER NOT NULL," +
                " progressStatus   INTEGER NOT NULL," +
                " noteStatus   INTEGER NOT NULL," +
                " remarkStatus   INTEGER NOT NULL," +
                " attachStatus   INTEGER NOT NULL," +
                " consumeStatus   INTEGER NOT NULL," +
                " incomeStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_budget表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_budget';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_budget (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " categoryId   INTEGER NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " curYearMonth   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " budget   INTEGER NOT NULL," +
                " type   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_incomeCategory表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_incomeCategory';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_incomeCategory (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " categoryName   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_income表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_income';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_income (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " categoryId   INTEGER NOT NULL," +
                " income   INTEGER NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " curYearMonth   TEXT NOT NULL," +
                " iconName   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_target表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_target';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_target (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " target   TEXT NOT NULL," +
                " projection   TEXT," +
                " tagIds   TEXT NOT NULL," +
                " complete   TEXT," +
                " updateTime   TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " endDate   TEXT," +
                " realEndDate   TEXT," +
                " reasonIds   TEXT," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL," +
                " show   INTEGER default 1" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_targetDetail表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_reason';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_reason (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " reason   TEXT," +
                " level   INTEGER default 0," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_book表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_book';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_book (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " bookName   TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " section   TEXT," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " coverAttachId   INTEGER," +
                " audioAttachId   INTEGER," +
                " remark   TEXT," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_user表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_user';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_user (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " username   TEXT NOT NULL," +
                " password   TEXT NOT NULL," +
                " phoneNum   TEXT," +
                " address   TEXT," +
                " email   TEXT," +
                " wechat   TEXT," +
                " qq   TEXT," +
                " nickName   TEXT," +
                " sex   INTEGER," +
                " status   INTEGER NOT NULL," +
                " createTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " remenber   INTEGER NOT NULL," +
                " autoLogin   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_summary表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_summary';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_summary (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " groupName   TEXT NOT NULL," +
                " todolistId   INTEGER," +
                " userId   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " oriCurDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " summaryShow   INTEGER default 1" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_pic表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_pic';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_pic (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " category   TEXT NOT NULL," +
                " remark   TEXT," +
                " userId   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_video表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_video';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_video (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " category   TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " remark   TEXT," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_emotion表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_emotion';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_emotion (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " rate   INTEGER NOT NULL," +
                " state  TEXT NOT NULL," +
                " remark  TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_memo表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_memo';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_memo (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " subject   TEXT NOT NULL," +
                " content  TEXT NOT NULL," +
                " isLocked  TEXT NOT NULL," +
                " password  TEXT," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_motto表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_motto';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_motto (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " author   TEXT NOT NULL," +
                " mottoStr  TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_comCategory表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_comCategory';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_comCategory (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " categoryName   TEXT NOT NULL," +
                " type  INTEGER NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_api表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_api';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_api (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " lanId   TEXT NOT NULL," +
                " toolId   TEXT NOT NULL," +
                " methodName   TEXT NOT NULL," +
                " methodIntro   TEXT NOT NULL," +
                " method   TEXT NOT NULL," +
                " methodDetail   TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        // 创建tbl_question表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_question';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_question (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " questionStr   TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_answer表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_answer';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_answer (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " questionId   INTEGER NOT NULL," +
                " answerType   TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_iconCategory表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_iconCategory';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_iconCategory (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " categoryId   INTEGER NOT NULL," +
                " iconName   TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_note表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_note';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_note (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " note   TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_timebookCover表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_timebookCover';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_timebookCover (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " coverPage   INTEGER NOT NULL," +
                " dateStr   TEXT NOT NULL," +
                " imgUrl   TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }
        // 创建tbl_discardTask表
        sqlstr =
            "SELECT COUNT(*) FROM sqlite_master where type='table' and name='tbl_discardTask';";
        result = db.exec(sqlstr);
        if (result[0].values[0][0] == 0) {
            flag = true;
            sqlstr =
                "CREATE TABLE tbl_discardTask (" +
                " id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                " userId   INTEGER NOT NULL," +
                " todolistId   INTEGER NOT NULL," +
                " todolistDate   TEXT NOT NULL," +
                " curDateTime   TEXT NOT NULL," +
                " updateTime   TEXT NOT NULL," +
                " syncStatus   INTEGER NOT NULL," +
                " status   INTEGER NOT NULL" +
                ");";
            db.run(sqlstr);
        }

        if (flag) {
            let binaryArray = db.export();
            let buffer = new Buffer(binaryArray);
            let dbpath = path.join(
                remote.app.getPath("userData"),
                "/databases/sql.db"
            );
            fs.writeFileSync(dbpath, buffer);
        }
    }, 1000);
}

// 初始化数据库
export function createDB(db) {
    // 首先查询有那几个数据库表
    let item = {};
    let path = "";
    db.find({}, function(err, arr) {
        for (let index = 0; index < arr.length; index++) {
            let item = arr[index];
            if (item.tableName != types.TBL_DBINFO) {
                path = getDBPath(item.tableName);
                new Datastore({
                    filename: path,
                    autoload: true
                });
            }
        }
    });
}

// 创建数据库实例
export function createDBInstance(dbname) {
    let path = getDBPath(dbname);
    return new Datastore({
        filename: path,
        autoload: true
    });
}

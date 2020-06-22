// 用于存放通用方法的
import { screen } from "electron";
import path from "path";
import { remote } from "electron";



/**
 * 日期相减
 *
 * @export
 * @param {*} sDate
 * @returns
 */
export function DateMinus(sDate){
　　 var sdate = new Date(sDate);
　　 var now = new Date();
　　 var days = sdate.getTime() - now.getTime();
　　 var day = parseInt(days / (1000 * 60 * 60 * 24));
　　 return day;
}




export function sleep(n) {
    var start = new Date().getTime();
    while (true) {
        if (new Date().getTime() - start > n) {
            break;
        }
    }
}

export function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

// 时间段数组
export const timeSectionArr = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30"
];

// 获取屏幕的高度以及宽度
export function getScreenInfo() {
    return screen.getPrimaryDisplay().size;
}

//获取当前的系统时间(不包括时分秒)
export function getCurDateTime() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var curDateTime = year + "-";
    if (month > 9) {
        curDateTime = curDateTime + month + "-";
    } else {
        curDateTime = curDateTime + "0" + month + "-";
    }
    if (date > 9) {
        curDateTime = curDateTime + date;
    } else {
        curDateTime = curDateTime + "0" + date;
    }
    return curDateTime;
}

// 获取1到24之间的时间段
export function getAllTimeSlot() {
    let temp = "";
    let timeSlotArr = [];
    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            temp = "0" + i + ":00";
            timeSlotArr.push(temp);
        } else {
            temp = i + ":00";
            timeSlotArr.push(temp);
        }
    }
    return timeSlotArr;
}

// 获取当前的系统时间(只获取时和分)
export function getHourAndMin() {
    var d = new Date();
    var hour = d.getHours();
    var min = d.getMinutes();
    var hourAndMin = "";
    if (hour > 9) {
        hourAndMin = hour + ":";
    } else {
        hourAndMin = "0" + hour + ":";
    }
    if (min > 9) {
        hourAndMin = hourAndMin + min;
    } else {
        hourAndMin = hourAndMin + "0" + min;
    }
    return hourAndMin;
}

export function handleTimeSlotCommon(timeSlot) {
    let arr = [];
    let tempValue = "";
    timeSlot = timeSlot.split(":")[0];
    let timeSlotArrTemp = [];
    if ("" != timeSlot) {
        timeSlotArrTemp = getAllTimeSlot();
        for (let i = 0; i < timeSlotArrTemp.length; i++) {
            tempValue = timeSlotArrTemp[i].slice(0, 2);

            if (tempValue.includes(timeSlot)) {
                arr.push(timeSlotArrTemp[i]);
            }
        }
    }
    return arr;
}

export function getTimeSlot() {
    // $("#time-curDateTime").html(getCurDateTime());
    var timeTemp = "";

    var time = getHourAndMin();
    var hour = time.split(":")[0];

    switch (hour + ":00") {
        case "00:00":
            timeTemp = "23:00~00:00";
            break;
        case "01:00":
            timeTemp = "00:00~01:00";
            break;
        case "02:00":
            timeTemp = "01:00~02:00";
            break;
        case "03:00":
            timeTemp = "02:00~03:00";
            break;
        case "04:00":
            timeTemp = "03:00~04:00";
            break;
        case "05:00":
            timeTemp = "04:00~05:00";
            break;
        case "06:00":
            timeTemp = "05:00~06:00";
            break;
        case "07:00":
            timeTemp = "06:00~07:00";
            break;
        case "08:00":
            timeTemp = "07:00~08:00";
            break;
        case "09:00":
            timeTemp = "08:00~09:00";
            break;
        case "10:00":
            timeTemp = "09:00~10:00";
            break;
        case "11:00":
            timeTemp = "10:00~11:00";
            break;
        case "12:00":
            timeTemp = "11:00~12:00";
            break;
        case "13:00":
            timeTemp = "12:00~13:00";
            break;
        case "14:00":
            timeTemp = "13:00~14:00";
            break;
        case "15:00":
            timeTemp = "14:00~15:00";
            break;
        case "16:00":
            timeTemp = "15:00~16:00";
            break;
        case "17:00":
            timeTemp = "16:00~17:00";
            break;
        case "18:00":
            timeTemp = "17:00~18:00";
            break;
        case "19:00":
            timeTemp = "18:00~19:00";
            break;
        case "20:00":
            timeTemp = "19:00~20:00";
            break;
        case "21:00":
            timeTemp = "20:00~21:00";
            break;
        case "22:00":
            timeTemp = "21:00~22:00";
            break;
        case "23:00":
            timeTemp = "22:00~23:00";
            break;
    }
    return timeTemp;
}

// 创建一条错误消息提示信息
export function createErrorTip(db, message) {
    db.$Message.error({
        content: message,
        top: 500,
        duration: 5,
        closable: true
    });
}

// 创建一条警告消息提示信息
export function createWarningTip(db, message) {
    db.$Message.warning({
        content: message,
        top: 500,
        duration: 5,
        closable: true
    });
}

// 创建一条成功消息提示信息
export function createSuccessTip(db, message) {
    db.$Message.success({
        content: message,
        top: 500,
        duration: 5,
        closable: true
    });
}

// 日期加减
export function addDate(date, days) {
    if (days == undefined || days == "") {
        days = 0;
    }
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return (
        date.getFullYear() +
        "-" +
        getFormatDate(month) +
        "-" +
        getFormatDate(day)
    );
}
// 日期月份/天的显示，如果是1位数，则在前面加上'0'
export function getFormatDate(arg) {
    if (arg == undefined || arg == "") {
        return "";
    }

    var re = arg + "";
    if (re.length < 2) {
        re = "0" + re;
    }

    return re;
}

// 获取常用图片后缀
export function getPicSuffix() {
    return new Array("jpg", "png", "jpeg", "bmp", "gif");
}

// 获取常用视频后缀
export function getVideoSuffix() {
    return new Array("mp4", "rmvb", "avi", "rm", "mkv");
}

// 根据文件名称, 判断其是否是图像
export function isPic(filename) {
    let fileSuffix = filename.split(".")[1].toLowerCase();
    let picArr = getPicSuffix();
    if (picArr.includes(fileSuffix)) {
        return true;
    } else {
        return false;
    }
}

// 根据文件名称, 判断其是否是音频
export function isAudio(filename) {
    let fileSuffix = filename
        .split(".")
        [filename.split(".").length - 1].toLocaleLowerCase();
    if ("mp3" == fileSuffix.toLocaleLowerCase()) {
        return true;
    } else {
        return false;
    }
}

// 根据文件名称, 判断其是否是视频
export function isVideo(filename) {
    let fileSuffix = filename
        .split(".")
        [filename.split(".").length - 1].toLowerCase();
    let videoArr = getVideoSuffix();
    if (videoArr.includes(fileSuffix)) {
        return true;
    } else {
        return false;
    }
}

// 将路径由单斜杠变为双斜杠
export function transPath(path) {
    return path.replace(/\\/g, "\\\\");
}

// 将单斜杠变为反双斜杠
export function transPath2(path) {
    return path.replace(/\\/g, "//");
}

// 计算时间差
export function TimeCap(startTime, endTime) {
    let timeCap = endTime.getTime() - startTime.getTime();
    return Math.floor(timeCap / (24 * 3600 * 1000));
}

// 日期格式化
export function dateForMat(fmt, date) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
}

// 日期格式化, 在当前日期的基础上加一
export function dateForMatOfNextDay(fmt, date) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate() + 1, //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
}

// js对数组进行排序
export function sortByPropertyByDesc(obj01, obj02) {
    return obj01.budget - obj02.budget;
}

// js对数组进行排序
export function sortByProperty(obj01, obj02) {
    return obj01.type - obj02.type;
}

export function sortByPropertyByAsc(obj01, obj02) {
    return -(obj01.budget - obj02.budget);
}

export function sortByMoney(obj01, obj02) {
    return obj01.consume - obj02.consume;
}

export function sortByMoneyOfTrend(obj01, obj02) {
    return obj01.sumConsume - obj02.sumConsume;
}

export function sortByTimebookPage(obj01, obj02) {
    return obj01.index - obj02.index;
}

export function sortByTime(obj01, obj02) {
    return Date.parse(new Date(obj01.date)) - Date.parse(new Date(obj02.date));
}

export function sortByTimeOfTrend(obj01, obj02) {
    return (
        Date.parse(new Date(obj01.curDateTime)) -
        Date.parse(new Date(obj02.curDateTime))
    );
}

export function sortByRate(obj01, obj02) {
    return -(obj01.rate - obj02.rate);
}

export function sortByNumByDesc(obj01, obj02) {
    return obj01.num - obj02.num;
}

export function sortByNumByAsc(obj01, obj02) {
    return -(obj01.num - obj02.num);
}

export function sortByTimeByDesc(obj01, obj02) {
    return (
        Date.parse(new Date(obj01.curDateTime)) -
        Date.parse(new Date(obj02.curDateTime))
    );
}

export function sortByUrgencyOfThings(obj01, obj02) {
    return obj01.importLevel - obj02.importLevel;
}
export function sortByUrgencyOfTodolists(obj01, obj02) {
    return obj01.todolist.importLevel - obj02.todolist.importLevel;
}


export function sortByDifficutOfThings(obj01, obj02) {
    return -(obj01.difficult - obj02.difficult);
}

export function sortByConsumeTimeOfThings(obj01, obj02) {
    return obj01.forecastTime - obj02.forecastTime;
}

export function sortByTimeOfThings(obj01, obj02) {
    return obj01.scheduleTime - obj02.scheduleTime;
}
export function sortByTimeOfTasks(obj01, obj02) {
    return obj01.todolist.scheduleTime - obj02.todolist.scheduleTime;
}

// 获取当月第一天
export function getFirstDayOfMonth(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let firstDay = new Date(year, month, 1, 0, 0, 0);
    return dateForMat("yyyy-MM-dd hh:mm:ss", firstDay);
}
// 获取当月最后一天
export function getLastDayOfMonth(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let lastDay = new Date(year, month + 1, 0, 23, 59, 59);
    return dateForMat("yyyy-MM-dd hh:mm:ss", lastDay);
}

// 初始化文件夹
export function initDirs() {
    let fs = require("fs");
    let pathStr = path.join(remote.app.getPath("userData"));
    let dirs = [];
    let parentDir = pathStr + "\\attachments";
    fs.exists(parentDir, function(exists) {
        if (!exists) {
            fs.mkdir(parentDir, function(err) {
                if (err) {
                    return console.error(parentDir + "目录创建失败!");
                }
            });
        }
    });
    dirs.push(pathStr + "\\attachments\\img");
    dirs.push(pathStr + "\\attachments\\audio");
    dirs.push(pathStr + "\\attachments\\video");
    setTimeout(() => {
        dirs.forEach(obj => {
            fs.exists(obj, function(exists) {
                if (!exists) {
                    fs.mkdir(obj, function(err) {
                        if (err) {
                            return console.error(obj + "目录创建失败!");
                        }
                    });
                }
            });
        });
    }, 1000);
}

// 复制文件
export function copyFile(sourFile, destFile) {
    let fs = require("fs");
    setTimeout(() => {
        var readStream = fs.createReadStream(sourFile);
        var writeStream = fs.createWriteStream(destFile);
        readStream.pipe(writeStream);
    }, 1000);
}

// 获取指定目录下所有文件
export function getFilesOfDirctory(path) {
    let fs = require("fs");
    let files = fs.readdirSync(path);
    return files;
}

// 获取日期所在的周
export function getWeekRange(date) {
    let weekArr = [];
    let weekStart = "";
    let weekEnd = "";
    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";
    let weekStr = weekdays[date.getDay()];
    if (weekStr == "Sunday") {
        weekStart = getPreWeekDay(date, 6);
        weekEnd = getNextWeekDay(date, 0);
    } else if (weekStr == "Monday") {
        weekStart = getPreWeekDay(date, 0);
        weekEnd = getNextWeekDay(date, 6);
    } else if (weekStr == "Tuesday") {
        weekStart = getPreWeekDay(date, 1);
        weekEnd = getNextWeekDay(date, 5);
    } else if (weekStr == "Wednesday") {
        weekStart = getPreWeekDay(date, 2);
        weekEnd = getNextWeekDay(date, 4);
    } else if (weekStr == "Thursday") {
        weekStart = getPreWeekDay(date, 3);
        weekEnd = getNextWeekDay(date, 3);
    } else if (weekStr == "Friday") {
        weekStart = getPreWeekDay(date, 4);
        weekEnd = getNextWeekDay(date, 2);
    } else if (weekStr == "Saturday") {
        weekStart = getPreWeekDay(date, 5);
        weekEnd = getNextWeekDay(date, 1);
    }
    weekArr.push(weekStart);
    weekArr.push(weekEnd);
    return weekArr;
}

export function getPreWeekDay(curDate, dayNum) {
    let weekDay = new Date(curDate.getTime() - 24 * 60 * 60 * 1000 * dayNum);
    let weekStart = dateForMat("yyyy-MM-dd", weekDay);
    return weekStart;
}

export function getNextWeekDay(curDate, dayNum) {
    let weekDay = new Date(curDate.getTime() + 24 * 60 * 60 * 1000 * dayNum);
    let weekEnd = dateForMat("yyyy-MM-dd", weekDay);
    return weekEnd;
}

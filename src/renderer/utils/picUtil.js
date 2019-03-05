import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import * as timeMachineUtil from "@/utils/timeMachineUtil";
import * as voiceUtil from "@/utils/voiceUtil";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

// 删除相册
export function deletePicImg(pic, thisObj, index) {
    let sql = dbUtil.getSqlObj();
    voiceUtil.updateAttachById(pic.pics[index].id, sql);
    dbUtil.writeDataToDB(sql);
}

// 更新相册
export function updatePic(pic, timeMachine, thisObj) {
    let picObj = pic.pics[pic.index];
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_pic set updateTime = '" +
        updateTime +
        "', category = '" +
        pic.category +
        "', remark = '" +
        pic.remark +
        "' WHERE id = " +
        picObj.id;
    try {
        sql.run(sqlStr);
        // 处理音频封面附件
        let files = handlePic(timeMachine, sql, picObj.id, 2);
        // voiceUtil.updateAttach(picObj.id, types.PIC_IMG_GROUP, sql);
        files.forEach(file => {
            if (!file.exist) {
                timeMachineUtil.insertAttach(
                    picObj.id,
                    wsCache.get("user").id,
                    file.name,
                    file.path,
                    sql,
                    types.PIC_IMG_GROUP
                );
            }
        });
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({ content: "更新成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "更新失败!" });
    }
}

// 获取所有相册的个数
export function getTotalPicBookNum(pic, thisObj) {
    let sql = dbUtil.getSqlObj();
    let searchText = pic.searchStr;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr = "SELECT count(*) as totalNum FROM tbl_pic WHERE status = 1 AND userId = " + userId + "";
        stmt = sql.prepare(sqlStr);
    } else {
        sqlStr = "SELECT count(*) as totalNum FROM tbl_book WHERE status = 1 AND userId = " + userId + " and bookName like $a";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: "%" + searchText + "%" });
    }
    stmt.step();
    let result = stmt.getAsObject().totalNum;
    sql.close();
    return result;
}

// 查询所有的相册
export function queryAllPic(thisObj, pic) {
    let sql = dbUtil.getSqlObj();
    let picBooks = [];
    let pics = [];
    let picObj = {};
    let searchText = pic.searchStr;
    let curPageNum = pic.curPageNum;
    let pageSize = pic.pageSize;
    let startPage = (curPageNum - 1) * pageSize;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr = "SELECT * FROM tbl_pic WHERE status = 1 AND userId = " + userId + " limit $a, $b";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: startPage, $b: pageSize });
    } else {
        sqlStr = "SELECT * FROM tbl_pic WHERE status = 1 AND userId = " + userId + " and category like $a limit $b, $c";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + searchText + "%",
            $b: startPage,
            $c: pageSize
        });
    }
    while (stmt.step()) {
        picObj = stmt.getAsObject();
        pics = timeMachineUtil.getAttachsById(picObj.id, types.PIC_IMG_GROUP);
        picObj.picObjList = pics;
        picBooks.push(picObj);
    }
    sql.close();
    return picBooks;
}

// 处理图片上传
export function handlePic(timeMachine, sql, picId, type) {
    let fileList = [];
    let files = timeMachine.uploadList;
    let flag = true;
    for (let j = 0; j < files.length; j++) {
        let file = files[j];
        for (let i = 0; i < files.length; i++) {
            if (i != j) {
                let fileObj = files[i];
                if (file.name == fileObj.name) {
                    flag = false;
                    break;
                }
            }
        }
        if (flag) {
            fileList.push(file);
        } else {
            flag = true;
        }
    }
    flag = true;
    let fileObj = {};
    let destFiles = [];
    let sourFile = "";
    let destFile = "";
    let destFileDir = util.transPath(
        dbUtil.getAttachmentPathOfVoice("", "img")
    );
    let destFilesDir = util.getFilesOfDirctory(destFileDir);
    fileList.forEach(file => {
        sourFile = util.transPath(file.url);
        destFile = util.transPath(
            dbUtil.getAttachmentPathOfVoice(file.name, "img/")
        );
        for (let index = 0; index < destFilesDir.length; index++) {
            let ele = destFilesDir[index];
            if (ele == file.name) {
                flag = false;
                break;
            }
        }
        if (flag) {
            util.copyFile(sourFile, destFile);
        } else {
            flag = true;
        }
        if (type == 1) {
            fileObj = { name: file.name, path: destFile };
        } else {
            fileObj = {
                name: file.name,
                path: destFile,
                exist: file.exist,
                id: file.id
            };
        }

        destFiles.push(fileObj);
    });
    return destFiles;
}

// 检查相册参数
export function checkAddPicMethodParam(pic, timeMachine, thisObj) {
    if ("" == pic.category) {
        thisObj.$Message.warning({ content: "请输入类名!" });
    } else if (timeMachine.uploadList.length == 0) {
        thisObj.$Message.warning({ content: "请上传照片!" });
    } else {
        return true;
    }
    return false;
}

export function addPic(thisObj, pic, timeMachine) {
    // 检查有声书参数
    let result = checkAddPicMethodParam(pic, timeMachine, thisObj);
    if (result) {
        // 将有声书插入
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let curDateTime = updateTime;
        var sql = dbUtil.getSqlObj();
        let sqlstr =
            "INSERT INTO tbl_pic(userId, category, remark, curDateTime, updateTime, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", '" +
            pic.category +
            "', '" +
            pic.remark +
            "', '" +
            curDateTime +
            "', '" +
            updateTime +
            "', " +
            pic.syncStatus +
            ", " +
            pic.status +
            ")";
        try {
            sql.exec(sqlstr);
            let picId = timeMachineUtil.getLastInsertRowId(sql);
            // 处理上传的图片
            let files = handlePic(timeMachine, sql, picId, 1);
            files.forEach(file => {
                timeMachineUtil.insertAttach(
                    picId,
                    wsCache.get("user").id,
                    file.name,
                    file.path,
                    sql,
                    types.PIC_IMG_GROUP
                );
            });
            dbUtil.writeDataToDB(sql);
            thisObj.$Message.success({
                content: "添加成功!"
            });
        } catch (error) {
            thisObj.$Message.error({
                content: "添加失败!"
            });
        }
    }
}

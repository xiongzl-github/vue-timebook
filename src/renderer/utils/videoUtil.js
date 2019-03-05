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

var fs = require("fs");

export function deleteVideo(video, thisObj, index) {
    let sql = dbUtil.getSqlObj();
    voiceUtil.updateAttachById(video.videoList[index].id, sql);
    dbUtil.writeDataToDB(sql);
}

// 删除有声书
export function deleteVoiceBook(voiceId, thisObj) {
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_book set updateTime = '" +
        updateTime +
        "', status = " +
        0 +
        " WHERE id = " +
        voiceId;
    try {
        sql.run(sqlStr);
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({ content: "删除成功!" });
        return true;
    } catch (error) {
        thisObj.$Message.success({ content: "删除失败!" });
        return false;
    }
}

// 更新视频
export function updateVideo(video, timeMachine, thisObj) {
    let videoObj = video.videos[video.index];
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_video set updateTime = '" +
        updateTime +
        "', category = '" +
        video.category +
        "', remark = '" +
        video.remark +
        "' WHERE id = " +
        videoObj.id;
    try {
        sql.run(sqlStr);
        // 处理视频封面附件
        let files = voiceUtil.handleCoverOfVoice(timeMachine, sql, videoObj.id);
        updateAttach(videoObj.id, types.VIDEO_IMG_GROUP, sql);
        files.forEach(file => {
            timeMachineUtil.insertAttach(
                videoObj.id,
                wsCache.get("user").id,
                file.name,
                file.path,
                sql,
                types.VIDEO_IMG_GROUP
            );
        });
        // 处理视频附件
        files = handleVideoOfVideo(video, sql, videoObj.id);
        // updateAttach(videoObj.id, types.VIDEO_VIDEO_GROUP, sql);
        files.forEach(file => {
            if (!file.exist) {
                timeMachineUtil.insertAttach(
                    videoObj.id,
                    wsCache.get("user").id,
                    file.name,
                    file.path,
                    sql,
                    types.VIDEO_VIDEO_GROUP
                );
            }
        });
        dbUtil.writeDataToDB(sql);
        thisObj.$Message.success({ content: "更新成功!" });
    } catch (error) {
        thisObj.$Message.error({ content: "更新失败!" });
    }
}

// 更新附件
export function updateAttach(id, group, sql) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_attach set updateTime = '" +
        updateTime +
        "', status = " +
        0 +
        " WHERE busId = " +
        id +
        " and attachGroup = '" +
        group +
        "';";
    sql.run(sqlStr);
}

// 查询所有的有声书
export function queryAllVideoBook(video, thisObj) {
    let sql = dbUtil.getSqlObj();
    let videoBooks = [];
    let coverOfVideoBook = {};
    let videoOfVideoBookList = [];
    let videoBookObj = {};
    let searchText = video.searchStr;
    let curPageNum = video.curPageNum;
    let pageSize = video.pageSize;
    let startPage = (curPageNum - 1) * pageSize;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr = "SELECT * FROM tbl_video WHERE status = 1 AND userId = " + userId + "  limit $a, $b";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: startPage, $b: pageSize });
    } else {
        sqlStr = "SELECT * FROM tbl_video WHERE status = 1 AND userId = " + userId + " and category like $a limit $b, $c";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + searchText + "%",
            $b: startPage,
            $c: pageSize
        });
    }
    while (stmt.step()) {
        videoBookObj = stmt.getAsObject();
        coverOfVideoBook = timeMachineUtil.getAttachsById(
            videoBookObj.id,
            types.VIDEO_IMG_GROUP
        )[0];
        videoOfVideoBookList = timeMachineUtil.getAttachsById(
            videoBookObj.id,
            types.VIDEO_VIDEO_GROUP
        );
        videoBookObj.coverObj = coverOfVideoBook;
        videoBookObj.videoObjList = videoOfVideoBookList;
        videoBooks.push(videoBookObj);
    }
    sql.close();
    return videoBooks;
}

// 获取voiceBook的条数
export function getTotalVideoBookNum(video, thisObj) {
    let sql = dbUtil.getSqlObj();
    let searchText = video.searchStr;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr = "SELECT count(*) as totalNum FROM tbl_video WHERE status = 1 AND userId = " + userId + "";
        stmt = sql.prepare(sqlStr);
    } else {
        sqlStr = "SELECT count(*) as totalNum FROM tbl_video WHERE status = 1 AND userId = " + userId + " and category like $a";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: "%" + searchText + "%" });
    }
    stmt.step();
    let result = stmt.getAsObject().totalNum;
    sql.close();
    return result;
}

// 添加视频
export function addVideo(video, timeMachine, thisObj) {
    // 检查有声书参数
    let result = checkAddVideoMethodParam(video, timeMachine, thisObj);
    if (result) {
        // 将有声书插入
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let curDateTime = updateTime;
        var sql = dbUtil.getSqlObj();
        let sqlstr =
            "INSERT INTO tbl_video(userId, category, remark, curDateTime, updateTime, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", '" +
            video.category +
            "', '" +
            video.remark +
            "', '" +
            curDateTime +
            "', '" +
            updateTime +
            "', " +
            video.syncStatus +
            ", " +
            video.status +
            ")";
        try {
            sql.exec(sqlstr);
            let videoId = timeMachineUtil.getLastInsertRowId(sql);
            // 处理视频封面附件
            let files = handleCoverOfVoice(timeMachine, sql, videoId);
            files.forEach(file => {
                timeMachineUtil.insertAttach(
                    videoId,
                    wsCache.get("user").id,
                    file.name,
                    file.path,
                    sql,
                    types.VIDEO_IMG_GROUP
                );
            });
            // 处理视频附件
            files = handleVideoOfVideo(video, sql, videoId);
            files.forEach(file => {
                timeMachineUtil.insertAttach(
                    videoId,
                    wsCache.get("user").id,
                    file.name,
                    file.path,
                    sql,
                    types.VIDEO_VIDEO_GROUP
                );
            });
            dbUtil.writeDataToDB(sql);
            thisObj.$Message.success({
                content: "添加成功!"
            });
        } catch (error) {
            thisObj.$Message.error({ content: "添加失败!" });
        }
    }
}

// 处理音频封面附件
export function handleCoverOfVoice(timeMachine, sql, voiceId) {
    let file = timeMachine.uploadList[0];
    let flag = true;
    let fileObj = {};
    let destFiles = [];
    let sourFile = util.transPath(file.url);
    let destFile = util.transPath(
        dbUtil.getAttachmentPathOfVoice(file.name, "img/")
    );
    let destFileDir = util.transPath(
        dbUtil.getAttachmentPathOfVoice("", "img")
    );
    let destFilesDir = util.getFilesOfDirctory(destFileDir);
    for (let index = 0; index < destFilesDir.length; index++) {
        let ele = destFilesDir[index];
        if (ele == file.name) {
            flag = false;
            break;
        }
    }
    if (flag) {
        util.copyFile(sourFile, destFile);
    }
    fileObj = {
        name: file.name,
        path: destFile
    };
    destFiles.push(fileObj);
    return destFiles;
}

// 处理音频附件
export function handleVideoOfVideo(video, sql, videoId) {
    let fileObj = {};
    let destFiles = [];
    let flag = true;
    video.videoList.forEach(file => {
        // 复制文件
        flag = true;
        let sourFile = util.transPath(file.url);
        let destFile = dbUtil.getAttachmentPathOfVoice(file.name, "video/");
        destFile = util.transPath(destFile);
        let destFileDir = util.transPath(
            dbUtil.getAttachmentPathOfVoice("", "video")
        );
        let destFilesDir = util.getFilesOfDirctory(destFileDir);
        for (let index = 0; index < destFilesDir.length; index++) {
            let ele = destFilesDir[index];
            if (ele == file.name) {
                flag = false;
                break;
            }
        }
        if (flag) {
            util.copyFile(sourFile, destFile);
        }
        if (video.operateStatus == 1) {
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

// 检查有声书参数
export function checkAddVideoMethodParam(video, timeMachine, thisObj) {
    if ("" == video.category) {
        thisObj.$Message.success({ content: "请输入类别!" });
    } else if (timeMachine.uploadList.length == 0) {
        thisObj.$Message.success({ content: "请上传封面!" });
    } else if (video.videoList.length == 0) {
        thisObj.$Message.success({ content: "请上传视频!" });
    } else {
        return true;
    }
    return false;
}

import * as dbUtil from "@/utils/dbUtil";
import * as util from "@/utils/util";
import * as timeMachineUtil from "@/utils/timeMachineUtil";
import path from "path";
import { remote } from "electron";
import types from "../store/types";
import { user } from "@/utils/userUtil";
import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

var fs = require("fs");


export function deleteAudio(voice, thisObj, index){
    let sql = dbUtil.getSqlObj();
    updateAttachById(voice.audioList[index].id, sql);
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

// 更新有声书
export function updateVoice(voice, timeMachine, thisObj) {
    let audioObj = voice.audios[voice.index];
    let sql = dbUtil.getSqlObj();
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_book set updateTime = '" +
        updateTime +
        "', bookName = '" +
        voice.bookName +
        "', remark = '" +
        voice.remark +
        "' WHERE id = " +
        audioObj.id;
    try {
        sql.run(sqlStr);
        // 处理音频封面附件
        let files = handleCoverOfVoice(timeMachine, sql, audioObj.id);
        updateAttach(audioObj.id, types.VOICE_IMG_GROUP, sql);
        files.forEach(file => {
            timeMachineUtil.insertAttach(
                audioObj.id,
                voice.userId,
                file.name,
                file.path,
                sql,
                types.VOICE_IMG_GROUP
            );
        });
        // 处理音频附件
        files = handleAudioOfVoice(voice, sql, audioObj.id, 2);
        files.forEach(file => {
            if (!file.exist) {
                timeMachineUtil.insertAttach(
                    audioObj.id,
                    wsCache.get("user").id,
                    file.name,
                    file.path,
                    sql,
                    types.VOICE_AUDIO_GROUP
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

// 根据附件id更新附件
export function updateAttachById(id, sql) {
    let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let sqlStr =
        "UPDATE tbl_attach set updateTime = '" +
        updateTime +
        "', status = " +
        0 +
        " WHERE id = " +
        id +
        ";";
    sql.run(sqlStr);
}

// 查询所有的有声书
export function queryAllVoiceBook(voice, thisObj) {
    let sql = dbUtil.getSqlObj();
    let voiceBooks = [];
    let coverOfVoiceBook = {};
    let audioOfVoiceBookList = [];
    let voiceBookObj = {};
    let searchText = voice.searchStr;
    let curPageNum = voice.curPageNum;
    let pageSize = voice.pageSize;
    let startPage = (curPageNum - 1) * pageSize;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr = "SELECT * FROM tbl_book WHERE status = 1 AND userId = " + userId + " limit $a, $b";
        stmt = sql.prepare(sqlStr);
        stmt.bind({ $a: startPage, $b: pageSize });
    } else {
        sqlStr = "SELECT * FROM tbl_book WHERE status = 1 AND userId = " + userId + " and bookName like $a limit $b, $c";
        stmt = sql.prepare(sqlStr);
        stmt.bind({
            $a: "%" + searchText + "%",
            $b: startPage,
            $c: pageSize
        });
    }
    while (stmt.step()) {
        voiceBookObj = stmt.getAsObject();
        coverOfVoiceBook = timeMachineUtil.getAttachsById(
            voiceBookObj.id,
            types.VOICE_IMG_GROUP
        )[0];
        audioOfVoiceBookList = timeMachineUtil.getAttachsById(
            voiceBookObj.id,
            types.VOICE_AUDIO_GROUP
        );
        voiceBookObj.coverObj = coverOfVoiceBook;
        voiceBookObj.audioObjList = audioOfVoiceBookList;
        voiceBooks.push(voiceBookObj);
    }
    sql.close();

    return voiceBooks;
}

// 获取voiceBook的条数
export function getTotalVoiceBookNum(voice, thisObj) {
    let sql = dbUtil.getSqlObj();
    let searchText = voice.searchStr;
    let sqlStr = "";
    let stmt = {};
    let userId = wsCache.get("user").id;
    if ("" == searchText) {
        sqlStr = "SELECT count(*) as totalNum FROM tbl_book WHERE status = 1 AND userId = " + userId + "";
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

// 添加有声书
export function addVoice(voice, timeMachine, thisObj) {
    // 检查有声书参数
    let result = checkAddVoiceMethodParam(voice, timeMachine, thisObj);
    if (result) {
        // 将有声书插入
        let updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        let curDateTime = updateTime;
        var sql = dbUtil.getSqlObj();
        let sqlstr =
            "INSERT INTO tbl_book(userId, bookName, section, remark, curDateTime, updateTime, syncStatus, status) VALUES (" +
            wsCache.get("user").id +
            ", '" +
            voice.bookName +
            "', '" +
            voice.section +
            "', '" +
            voice.remark +
            "', '" +
            curDateTime +
            "', '" +
            updateTime +
            "', " +
            voice.syncStatus +
            ", " +
            voice.status +
            ")";
        try {
            sql.exec(sqlstr);
            let voiceId = timeMachineUtil.getLastInsertRowId(sql);
            // 处理音频封面附件
            let files = handleCoverOfVoice(timeMachine, sql, voiceId);
            files.forEach(file => {
                timeMachineUtil.insertAttach(
                    voiceId,
                    wsCache.get("user").id,
                    file.name,
                    file.path,
                    sql,
                    types.VOICE_IMG_GROUP
                );
            });
            // 处理音频附件
            files = handleAudioOfVoice(voice, sql, voiceId, 1);
            files.forEach(file => {
                timeMachineUtil.insertAttach(
                    voiceId,
                    wsCache.get("user").id,
                    file.name,
                    file.path,
                    sql,
                    types.VOICE_AUDIO_GROUP
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

// 处理音频附件(type == 1:表示的是添加操作; type == 2:表示的是更新操作.)
export function handleAudioOfVoice(voice, sql, voiceId, type) {
    let fileObj = {};
    let destFiles = [];
    let flag = true;
    voice.audioList.forEach(file => {
        // 复制文件
        flag = true;
        let sourFile = util.transPath(file.url);
        let destFile = dbUtil.getAttachmentPathOfVoice(file.name, "audio/");
        destFile = util.transPath(destFile);
        let destFileDir = util.transPath(
            dbUtil.getAttachmentPathOfVoice("", "audio")
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

        if (type == 1) {
            fileObj = {
                name: file.name,
                path: destFile,
                attachId: null,
                exist: false
            };
        } else if (type == 2) {
            fileObj = {
                name: file.name,
                path: destFile,
                attachId: file.id,
                exist: file.exist
            };
        }
        destFiles.push(fileObj);
    });
    return destFiles;
}

// 检查有声书参数
export function checkAddVoiceMethodParam(voice, timeMachine, thisObj) {
    if ("" == voice.bookName) {
        thisObj.$Message.success({ content: "请输入书名!" });
    } else if (timeMachine.uploadList.length == 0) {
        thisObj.$Message.success({ content: "请上传封面!" });
    } else if (voice.audioList.length == 0) {
        thisObj.$Message.success({ content: "请上传音频!" });
    } else {
        return true;
    }
    return false;
}

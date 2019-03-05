import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as noteUtil from "@/utils/noteUtil";
import * as videoUtil from "@/utils/videoUtil";
import * as voiceUtil from "@/utils/voiceUtil";
import * as picUtil from "@/utils/picUtil";
import { url } from "inspector";

const state = {
    memory: {
        tabName: "note",
        animated: true
    },
    note: {
        curDateTime: new Date(),
        curYearMonth: new Date(),
        note: "",
        id: 0,
        notes: [],
        operType: 1,
        codeStyle: "github",
        toolbars: {
            bold: true, // 粗体
            header: true, // 标题
            mark: true, // 标记
            quote: true, // 引用
            ol: true, // 有序列表
            link: true, // 链接
            imagelink: true, // 图片链接
            code: true, // code
            help: true, // 帮助
            undo: true, // 上一步
            redo: true, // 下一步
            trash: true, // 清空
            save: true, // 保存（触发events中的save事件）
            /* 1.4.2 */
            /* 2.1.8 */
            alignleft: true, // 左对齐
            aligncenter: true, // 居中
            alignright: true, // 右对齐
            /* 2.2.1 */
            subfield: true, // 单双栏模式
            preview: true // 预览
        }
    },
    voice: {
        curDateTime: new Date(),
        searchStr: "",
        voiceModal: false,
        bookName: "",
        audioList: [],
        syncStatus: 0,
        status: 1,
        userId: 1,
        section: "",
        remark: "",
        audios: [],
        operateStatus: 1,
        index: 0,
        placement: "bottom-start",
        show: true,
        url: "",
        key: -1,
        pageSize: 15,
        totalNum: 0,
        curPageNum: 1,
        syncStatus: 0,
        status: 1
    },
    pic: {
        curDateTime: new Date(),
        picModal: false,
        searchStr: "",
        pageSize: 15,
        totalNum: 0,
        curPageNum: 1,
        remark: "",
        operateStatus: 1,
        category: "",
        syncStatus: 0,
        status: 1,
        pics: [],
        picImgs: [],
        index: 0,
        picPlayModal: false,
        interval: 1500
    },
    video: {
        curDateTime: new Date(),
        videoModal: false,
        searchStr: "",
        pageSize: 15,
        totalNum: 0,
        curPageNum: 1,
        remark: "",
        operateStatus: 1,
        category: "",
        syncStatus: 0,
        status: 1,
        videos: [],
        videoList: [],
        index: 0,
        show: true
    }
};

const getters = {
    memory(state) {
        return state.memory;
    },
    note(state) {
        return state.note;
    },
    voice(state) {
        return state.voice;
    },
    video(state) {
        return state.video;
    },
    pic(state) {
        return state.pic;
    }
};

const actions = {
    deleteVoiceBook({ commit, state }, param) {
        let voiceId = state.voice.audios[param.index].id;
        let result = voiceUtil.deleteVoiceBook(voiceId, param.thisObj);
        if (result) {
            commit(types.DELETEVOICEBOOOK, param.index);
        }
    },
    updateVoice({ commit, state }, param) {
        voiceUtil.updateVoice(state.voice, param.timeMachine, param.thisObj);
    },
    showVoiceBook({ commit, state }, param) {
        commit(types.SHOWVOICEBOOK, param);
    },
    queryAllVoiceBook({ commit, state }, param) {
        let voiceBooks = voiceUtil.queryAllVoiceBook(
            state.voice,
            param.thisObj
        );
        let totalNum = voiceUtil.getTotalVoiceBookNum(
            state.voice,
            param.thisObj
        );
        let obj = { voiceBooks: voiceBooks, totalNum: totalNum };
        commit(types.QUERYALLVOICEBOOK, obj);
    },
    deleteAudio({ commit, state }, param) {
        voiceUtil.deleteAudio(state.voice, param.thisObj, param.index);
        commit(types.DELETEAUDIO, param.index);
    },
    addVoice({ commit, state }, param) {
        voiceUtil.addVoice(state.voice, param.timeMachine, param.thisObj);
    },
    uploadAudio({ commit, state }, obj) {
        let e = obj.event;
        let thisObj = obj.thisObj;
        let filename = e.srcElement.files[0].name;
        let filepath = e.srcElement.files[0].path;
        if ("" == filename || !util.isAudio(filename)) {
            thisObj.$Message.error({ content: "请上传音频!" });
            return;
        }
        let param = {
            name: filename,
            url: filepath,
            status: "finished",
            playStatus: 1,
            exist: false,
            id: null
        };
        commit(types.UPLOADAUDIO, param);
    },
    closeVoiceModal({ commit, state }, param) {
        commit(types.CLOSEVOICEMODAL, param);
    },
    addPic({ commit, state }, param) {
        let result = picUtil.addPic(
            param.thisObj,
            state.pic,
            param.timeMachine
        );
    },
    queryAllPic({ commit, state }, param) {
        let pics = picUtil.queryAllPic(param.thisObj, state.pic);
        let totalNum = picUtil.getTotalPicBookNum(state.pic, param.thisObj);
        let obj = {
            pics: pics,
            totalNum: totalNum
        };
        commit(types.QUERYALLPIC, obj);
    },
    deletePicImg({ commit, state }, param) {
        picUtil.deletePicImg(state.pic, param.thisObj, param.index);
        commit(types.DELETEPICIMG, param);
    },
    showPicBook({ commit, state }, param) {
        commit(types.SHOWPICBOOK, param);
    },
    updatePic({ commit, state }, param) {
        picUtil.updatePic(state.pic, param.timeMachine, param.thisObj);
    },
    closePicModal({ commit, state }, param) {
        commit(types.CLOSEPICMODAL, param);
    },
    playPic({ commit, state }, param) {
        commit(types.PLAYPIC, param.index);
    },
    uploadVideo({ commit, state }, obj) {
        let e = obj.event;
        let thisObj = obj.thisObj;
        let filename = e.srcElement.files[0].name;
        let filepath = e.srcElement.files[0].path;
        if ("" == filename || !util.isVideo(filename)) {
            thisObj.$Message.error({ content: "请上传视频!" });
            return;
        }
        let param = {
            name: filename,
            url: filepath,
            status: "finished",
            playStatus: 1,
            exist: false,
            id: null
        };
        commit(types.UPLOADVIDEO, param);
    },
    addVideo({ commit, state }, param) {
        videoUtil.addVideo(state.video, param.timeMachine, param.thisObj);
    },
    queryAllVideoBook({ commit, state }, param) {
        let videoBooks = videoUtil.queryAllVideoBook(
            state.video,
            param.thisObj
        );
        let totalNum = videoUtil.getTotalVideoBookNum(
            state.video,
            param.thisObj
        );
        let obj = { videoBooks: videoBooks, totalNum: totalNum };
        commit(types.QUERYALLVIDEOBOOK, obj);
    },
    showVideoBook({ commit, state }, param) {
        commit(types.SHOWVIDEOBOOK, param);
    },
    deleteVideo({ commit, state }, param) {
        videoUtil.deleteVideo(state.video, param.thisObj, param.index);
        commit(types.DELETEVIDEO, param.index);
    },
    updateVideo({ commit, state }, param) {
        videoUtil.updateVideo(state.video, param.timeMachine, param.thisObj);
    },
    closeVideoModal({ commit, state }, param) {
        commit(types.CLOSEVIDEOMODAL, param);
    },
    addNote({ commit, state }, param) {
        noteUtil.addNote(state.note, param.thisObj);
    },
    queryNote({ commit, state }, param) {
        let notes = noteUtil.queryNote(state.note, param.thisObj);
        commit(types.QUERYNOTE, notes);
    },
    setNoteInfo({ commit, state }, param) {
        commit(types.SETNOTEINFO, param.noteObj);
    },
    resetNote({ commit, state }, param) {
        commit(types.RESETNOTE);
    },
    updateNote({ commit, state }, param) {
        noteUtil.updateNote(state.note, param.thisObj);
        commit(types.RESETNOTE);
    },
    deleteNoteById({ commit, state }, param) {
        noteUtil.deleteNoteById(state.note, param.thisObj, param.id);
    }
};

const mutations = {
    [types.RESETNOTE](state) {
        let note = state.note;
        note.note = "";
        note.curDateTime = new Date();
        note.operType = 1;
        note.id = 0;
    },
    [types.SETNOTEINFO](state, noteObj) {
        let note = state.note;
        note.note = noteObj.note;
        note.curDateTime = noteObj.curDateTime;
        note.operType = 2;
        note.id = noteObj.id;
    },
    [types.QUERYNOTE](state, notes) {
        let note = state.note;
        note.notes.splice(0, note.notes.length);
        note.notes = notes;
    },
    [types.CLOSEVIDEOMODAL](state, param) {
        let video = state.video;
        let timeMachine = param.timeMachine;
        video.category = "";
        video.remark = "";
        video.index = 0;
        video.operateStatus = 1;
        video.show = true;
        video.videoList.splice(0, video.videoList.length);
        timeMachine.uploadList.splice(0, timeMachine.uploadList.length);
    },
    [types.DELETEVIDEO](state, index) {
        state.video.videoList.splice(index, 1);
    },
    [types.SHOWVIDEOBOOK](state, param) {
        let index = param.index;
        let timeMachine = param.timeMachine;
        let video = state.video.videos[index];
        state.video.category = video.category;
        state.video.remark = video.remark;
        state.video.videoList.splice(0, state.video.videoList.length);
        state.video.videoList = state.video.videoList.concat(
            video.videoObjList
        );
        timeMachine.uploadList.splice(0, timeMachine.uploadList.length);
        timeMachine.uploadList.push(video.coverObj);
        state.video.videoModal = true;
        state.video.operateStatus = 2;
        state.video.index = index;
    },
    [types.QUERYALLVIDEOBOOK](state, obj) {
        state.video.videos.splice(0, state.video.videos.length);
        state.video.videos = obj.videoBooks;
        state.video.totalNum = obj.totalNum;
    },
    [types.UPLOADVIDEO](state, obj) {
        state.video.videoList.push(obj);
    },
    [types.PLAYPIC](state, index) {
        state.pic.index = index;
        state.pic.picPlayModal = true;
    },
    [types.CLOSEPICMODAL](state, param) {
        let pic = state.pic;
        let timeMachine = param.timeMachine;
        pic.category = "";
        pic.remark = "";
        pic.index = 0;
        pic.operateStatus = 1;
        timeMachine.uploadList.splice(0, timeMachine.uploadList.length);
    },
    [types.SHOWPICBOOK](state, param) {
        let index = param.index;
        let timeMachine = param.timeMachine;
        let pic = state.pic.pics[index];
        state.pic.category = pic.category;
        state.pic.remark = pic.remark;
        timeMachine.uploadList.splice(0, timeMachine.uploadList.length);
        timeMachine.uploadList = timeMachine.uploadList.concat(pic.picObjList);
        state.pic.picModal = true;
        state.pic.operateStatus = 2;
        state.pic.index = index;
    },
    [types.QUERYALLPIC](state, obj) {
        state.pic.pics.splice(0, state.pic.pics.length);
        state.pic.pics = obj.pics;
        state.pic.totalNum = obj.totalNum;
    },
    [types.DELETEPICIMG](state, param) {
        param.timeMachine.uploadList.splice(param.index, 1);
    },
    [types.SEARCHVOICEBOOK](state, voiceBooks) {
        state.voice.audios.splice(0, state.voice.audios.length);
        state.voice.audios = voiceBooks;
    },
    [types.DELETEVOICEBOOOK](state, index) {
        state.voice.audios.splice(index, 1);
    },
    [types.CLOSEVOICEMODAL](state, param) {
        let voice = state.voice;
        let timeMachine = param.timeMachine;
        voice.bookName = "";
        voice.section = "";
        voice.remark = "";
        voice.index = 0;
        voice.operateStatus = 1;
        voice.show = true;
        voice.audioList.splice(0, voice.audioList.length);
        timeMachine.uploadList.splice(0, timeMachine.uploadList.length);
    },
    [types.SHOWVOICEBOOK](state, param) {
        let index = param.index;
        let timeMachine = param.timeMachine;
        let audio = state.voice.audios[index];
        state.voice.bookName = audio.bookName;
        state.voice.section = audio.section;
        state.voice.remark = audio.remark;
        state.voice.audioList.splice(0, state.voice.audioList.length);
        state.voice.audioList = state.voice.audioList.concat(
            audio.audioObjList
        );
        timeMachine.uploadList.splice(0, timeMachine.uploadList.length);
        timeMachine.uploadList.push(audio.coverObj);
        state.voice.voiceModal = true;
        state.voice.operateStatus = 2;
        state.voice.index = index;
    },
    [types.QUERYALLVOICEBOOK](state, obj) {
        state.voice.audios.splice(0, state.voice.audios.length);
        state.voice.audios = obj.voiceBooks;
        state.voice.totalNum = obj.totalNum;
    },
    [types.DELETEAUDIO](state, index) {
        state.voice.audioList.splice(index, 1);
    },
    [types.UPLOADAUDIO](state, obj) {
        state.voice.audioList.push(obj);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

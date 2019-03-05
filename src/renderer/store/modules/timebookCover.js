import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as timebookCoverUtil from "@/utils/timebookCoverUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    timebookCover: {
        coverFirstPageSrc: "",
        coverSecondPageSrc: "",
        coverLastFistPageSrc: "",
        coverLastSecondPageSrc: "",
        coverLastThirdPageSrc: ""
    }
};

const getters = {
    timebookCover(state) {
        return state.timebookCover;
    }
};

const actions = {
    queryTimeBookCover({ commit, state }, param) {
        let timebookCoverArr = timebookCoverUtil.queryTimeBookCover(
            param.timeObj,
            param.thisObj,
            param.index
        );
        commit(types.QUERYTIMEBOOKCOVER, timebookCoverArr);
    },
    confirmCover({ commit, state }, param) {
        let result = timebookCoverUtil.confirmCover(param.timeObj, param.thisObj, param.coverOriSrc);
        if(!result) {
            commit(types.CONFIRMCOVER, param.timeObj);
        }
        
    }
};

const mutations = {
    [types.CONFIRMCOVER](state, timeObj) {
        let timebookCover = state.timebookCover;
        timeObj.timebookCoverModal = false;
        timeObj.coverIndex = 0;
    },
    [types.QUERYTIMEBOOKCOVER](state, timebookCoverArr) {
        let timebookCover = state.timebookCover;
        timebookCoverArr.forEach(element => {
            if (element.coverPage == 1) {
                timebookCover.coverFirstPageSrc = element.imgUrl;
            } else if (element.coverPage == 2) {
                timebookCover.coverSecondPageSrc = element.imgUrl;
            } else if (element.coverPage == 3) {
                timebookCover.coverLastFistPageSrc = element.imgUrl;
            } else if (element.coverPage == 4) {
                timebookCover.coverLastSecondPageSrc = element.imgUrl;
            } else if (element.coverPage == 5) {
                timebookCover.coverLastThirdPageSrc = element.imgUrl;
            }
        });
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

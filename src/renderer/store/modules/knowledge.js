import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as knowledgeUtil from "@/utils/knowledgeUtil";
import * as consumeUtil from "@/utils/consumeUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    knowledge: {
        tabName: "knowledge-detail",
        animated: true,
        curDateTime: new Date(),
        sumKnowledgeNumOfDay: 10,
        sumKnowledgeNumOfMonth: 20,
        sumKnowledgeNumOfReview: 8,
        knowledgeList: [],
        noteModal: false,
        note: "",
        title: "",
        index: 0,
        toolbars: {
            bold: true, // 粗体
            italic: true, // 斜体
            header: true, // 标题
            underline: true, // 下划线
            strikethrough: true, // 中划线
            mark: true, // 标记
            superscript: false, // 上角标
            subscript: false, // 下角标
            quote: true, // 引用
            ol: true, // 有序列表
            ul: true, // 无序列表
            link: true, // 链接
            imagelink: true, // 图片链接
            code: true, // code
            table: true, // 表格
            // fullscreen: true, // 全屏编辑
            readmodel: true, // 沉浸式阅读
            // htmlcode: true, // 展示html源码
            help: true, // 帮助
            /* 1.3.5 */
            undo: true, // 上一步
            redo: true, // 下一步
            trash: true, // 清空
            save: true, // 保存（触发events中的save事件）
            /* 1.4.2 */
            navigation: true, // 导航目录
            /* 2.1.8 */
            alignleft: true, // 左对齐
            aligncenter: true, // 居中
            alignright: true, // 右对齐
            /* 2.2.1 */
            subfield: true, // 单双栏模式
            preview: true // 预览
        },
        // 知识温习 start
        isReview: true,
        noteOfReview: [],
        noteIndex: 0,
        knowledgeReviewModal: false,
        // 知识温习 end

        // 知识图谱 start
        noteCategoryId: 0,
        totalNodes: 0,
        knowledgeGraphModal: false,
        noteCategoryList: [],
        tree: {
            tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
            },
            legend: {
                top: "2%",
                left: "5%",
                orient: "vertical",
                data: [
                    {
                        name: "知识图谱",
                        icon: "rectangle"
                    }
                ],
                borderColor: "#c23531"
            },
            series: [
                {
                    type: "tree",
                    name: "知识图谱",
                    data: [],
                    top: "5%",
                    left: "10%",
                    bottom: "5%",
                    right: "40%",
                    symbolSize: 7,
                    label: {
                        normal: {
                            position: "left",
                            verticalAlign: "middle",
                            align: "right"
                        }
                    },

                    leaves: {
                        label: {
                            normal: {
                                position: "right",
                                verticalAlign: "middle",
                                align: "left"
                            }
                        }
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }
            ]
        },
        // 知识图谱 end
        // 知识分析 start
        yearMonthType: 1,
        analyzeYearMonth: new Date(),
        analyzeKnowledgeRightList: [],
        analyzeKnowledgeRightDetailList: [],
        rank: 1,
        animated: true,
        knowledgeDetailModal: false,
        knowledgeAnalyzeModal: false,
        circlePie: {
            title: {
                text: "知识类别",
                x: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            grid: { x: "30%", y: "10%", width: "100%" },
            legend: {
                orient: "vertical",
                x: "left",
                data: []
            },
            series: [
                {
                    name: "知识类别",
                    type: "pie",
                    selectedMode: "single",
                    radius: [0, "30%"],
                    label: {
                        normal: {
                            position: "inner"
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: []
                },
                {
                    name: "知识类别",
                    type: "pie",
                    radius: ["40%", "55%"],
                    label: {},
                    data: []
                }
            ]
        },
        // 知识分析 end
        // 知识趋势 start
        trendYearMonth: new Date(),
        yearMonthTypeOfTrend: 1,
        trendKnowledgeDetail: [],
        knowledgeTrendModal: false,
        lineAndBar: {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    snap: true,
                    crossStyle: {
                        color: "#999"
                    }
                }
            },
            grid: { x: "15%", y: "10%", width: "65%" },
            // toolbox: {
            //     feature: {
            //         dataView: { show: true, readOnly: false },
            //         magicType: { show: true, type: ["line", "bar"] },
            //         restore: { show: true },
            //         saveAsImage: { show: true }
            //     }
            // },
            legend: {
                data: ["当天笔记数", "累计笔记数"]
            },
            xAxis: [
                {
                    type: "category",
                    data: [],
                    axisPointer: {
                        type: "shadow"
                    }
                }
            ],
            yAxis: [
                {
                    type: "value",
                    name: "当天笔记数",
                    min: 0,
                    max: 100,
                    interval: 10,
                    axisLabel: {
                        formatter: "{value}篇"
                    }
                },
                {
                    type: "value",
                    name: "累计笔记数",
                    min: 0,
                    max: 100,
                    interval: 10,
                    axisLabel: {
                        formatter: "{value}篇"
                    }
                }
            ],
            series: [
                {
                    name: "当天笔记数",
                    type: "bar",
                    barWidth: 5,
                    data: []
                },
                {
                    name: "累计笔记数",
                    type: "line",
                    yAxisIndex: 1,
                    data: []
                    // smooth: true
                }
            ]
        }
        // 知识趋势 end
    }
};

function test() {}

const getters = {
    knowledge(state) {
        return state.knowledge;
    }
};

const actions = {
    isJoinPreviewPlan({commit, state}, param){
        let result = knowledgeUtil.isJoinPreviewPlan(param.thisObj, state.knowledge);
        commit(types.ISJOINPREVIEWPLAN);
    },
    remember({ commit, state }, param) {
        let result = knowledgeUtil.remember(param.thisObj, state.knowledge);
        commit(types.REMEMBER);
    },
    disremember({ commit, state }, param) {
        let result = knowledgeUtil.disremember(param.thisObj, state.knowledge);
    },
    rightClick({ commit, state }, param) {
        commit(types.RIGHTCLICK);
    },
    leftClick({ commit, state }, param) {
        commit(types.LEFTCLICK);
    },
    openKnowledgeReviewModal({ commit, state }, param) {
        let knowledge = state.knowledge;
        let result = knowledgeUtil.echartsClickOfTree(
            param.thisObj,
            knowledge.noteOfReview[knowledge.noteIndex].id
        );
        commit(types.OPENKNOWLEDGEREVIEWMODAL, result);
    },
    getNoteOfReview({ commit, state }, param) {
        let result = knowledgeUtil.getNoteOfReview(
            param.thisObj,
            state.knowledge
        );
        commit(types.GETNOTEOFREVIEW, result);
    },
    openKnowledgeModalOfTrend({ commit, state }, param) {
        let id = state.knowledge.trendKnowledgeDetail[param.index].id;
        let title = state.knowledge.trendKnowledgeDetail[param.index].listName;
        let result = knowledgeUtil.echartsClickOfTree(param.thisObj, id);
        let resultObj = { title: title, note: result };
        commit(types.OPENKNOWLEDGEMODALOFTREND, resultObj);
    },
    sumKnowledgeTrend({ commit, state }, param) {
        let result = knowledgeUtil.sumKnowledgeTrend(
            param.thisObj,
            state.knowledge
        );
        commit(types.SUMKNOWLEDGETREND, result);
    },
    showKnowledgeNote({ commit, state }, param) {
        let id =
            state.knowledge.analyzeKnowledgeRightDetailList[param.index].id;
        let title =
            state.knowledge.analyzeKnowledgeRightDetailList[param.index]
                .listName;
        let result = knowledgeUtil.echartsClickOfTree(param.thisObj, id);
        let resultObj = {
            title: title,
            note: result
        };
        commit(types.SHOWKNOWLEDGENOTE, resultObj);
    },
    openKnowledgeModal({ commit, state }, param) {
        let result = knowledgeUtil.openKnowledgeModal(
            param.thisObj,
            state.knowledge,
            param.index
        );
        commit(types.OPENKNOWLEDGEMODAL, result);
    },
    sumKnowledgeCategoryOfAnalyze({ commit, state }, param) {
        let result = knowledgeUtil.sumKnowledgeCategoryOfAnalyze(
            param.thisObj,
            state.knowledge
        );
        commit(types.SUMKNOWLEDGECATEGORYOFANALYZE, result);
    },
    echartsClickOfTree({ commit, state }, param) {
        let result = knowledgeUtil.echartsClickOfTree(param.thisObj, param.id);
        let resultObj = {
            title: param.name,
            note: result,
            isLeave: param.isLeave
        };
        commit(types.ECHARTSCLICKOFTREE, resultObj);
    },
    queryKnowledgeGraph({ commit, state }, param) {
        let result = knowledgeUtil.queryKnowledgeGraph(
            param.thisObj,
            state.knowledge,
            param.index
        );
        commit(types.QUERYKNOWLEDGEGRAPH, result);
    },
    queryNoteCategory({ commit, state }, param) {
        let result = knowledgeUtil.queryNoteCategory(
            param.thisObj,
            state.knowledge
        );
        commit(types.QUERYNOTECATEGORY, result);
    },
    queryNoteCategoryIdByName({ commit, state }, param) {
        let res = consumeUtil.queryConsumeCategoryIdByName(
            param.thisObj,
            param.categoryName
        );
        commit(types.QUERYNOTECATEGORYIDBYNAME, res);
    },
    saveNote({ commit, state }, param) {
        let result = knowledgeUtil.saveNote(param.thisObj, state.knowledge);
    },
    queryKnowledgeListByDate({ commit, state }, param) {
        let result = knowledgeUtil.queryKnowledgeListByDate(
            param.thisObj,
            state.knowledge
        );
        commit(types.QUERYKNOWLEDGELISTBYDATE, result);
    },
    getNoteNumOfCurDate({ commit, state }, param) {
        let result = knowledgeUtil.getNoteNumOfCurDate(
            param.thisObj,
            state.knowledge
        );
        commit(types.GETNOTENUMOFCURDATE, result);
    },
    getNoteNumOfCurMonth({ commit, state }, param) {
        let result = knowledgeUtil.getNoteNumOfCurMonth(
            param.thisObj,
            state.knowledge
        );
        commit(types.GETNOTENUMOFCURMONTH, result);
    },
    getNoteNumOfReview({ commit, state }, param) {
        let result = knowledgeUtil.getNoteNumOfReview(
            param.thisObj,
            state.knowledge
        );
        commit(types.GETNOTENUMOFREVIEW, result);
    }
};

const mutations = {
    [types.ISJOINPREVIEWPLAN](state){
        let knowledge = state.knowledge;
        let review = knowledge.noteOfReview[knowledge.noteIndex].review;
        if (review == 0) {
            knowledge.noteOfReview[knowledge.noteIndex].review = 1;
            knowledge.isReview = true;
        } else if (review == 1) {
            knowledge.noteOfReview[knowledge.noteIndex].review = 0;
            knowledge.isReview = false;
        }
    },
    [types.REMEMBER](state) {
        let knowledge = state.knowledge;
        knowledge.noteOfReview.splice(knowledge.noteIndex, 1);
        if (
            knowledge.noteOfReview.length == knowledge.noteIndex ||
            knowledge.noteOfReview.length == 0
        ) {
            knowledge.noteIndex = 0;
        }
        knowledge.sumKnowledgeNumOfReview = knowledge.noteOfReview.length;
    },
    [types.LEFTCLICK](state) {
        let knowledge = state.knowledge;
        let length = knowledge.noteOfReview.length;
        let index = knowledge.noteIndex;
        if (index == 0) {
            knowledge.noteIndex = length - 1;
        } else {
            knowledge.noteIndex--;
        }
    },
    [types.RIGHTCLICK](state) {
        let knowledge = state.knowledge;
        let length = knowledge.noteOfReview.length;
        let index = knowledge.noteIndex;
        if (index == length - 1) {
            knowledge.noteIndex = 0;
        } else {
            knowledge.noteIndex++;
        }
    },
    [types.OPENKNOWLEDGEREVIEWMODAL](state, result) {
        let knowledge = state.knowledge;
        knowledge.knowledgeReviewModal = true;
        knowledge.title = knowledge.noteOfReview[knowledge.noteIndex].listName;
        knowledge.note = result;
    },
    [types.GETNOTEOFREVIEW](state, resultList) {
        let knowledge = state.knowledge;
        knowledge.sumKnowledgeNumOfReview = resultList.length;
        knowledge.noteOfReview.splice(0, knowledge.noteOfReview.length);
        resultList.forEach(ele => {
            if (ele.review == 0) {
                ele.isReview = false;
            } else if (ele.review == 1) {
                ele.isReview = true;
            }
            knowledge.noteOfReview.push(ele);
        });
    },
    [types.OPENKNOWLEDGEMODALOFTREND](state, resultObj) {
        state.knowledge.knowledgeTrendModal = true;
        state.knowledge.title = resultObj.title;
        state.knowledge.note = resultObj.note;
    },
    [types.SUMKNOWLEDGETREND](state, resultList) {
        let knowledge = state.knowledge;
        let yearMonthType = knowledge.yearMonthTypeOfTrend;
        let trendYearMonth = knowledge.trendYearMonth;
        let xAxisDataOfKnowledge = knowledge.lineAndBar.xAxis[0].data;
        let seriesDataOfCurDate = knowledge.lineAndBar.series[0].data;
        let seriesDataOfAddup = knowledge.lineAndBar.series[1].data;
        let maxNoteOfCurDate = 0;
        let maxNoteOfCurDateInterval = 0;
        let maxNoteOfAddup = 0;
        let maxNoteOfAddupInterval = 0;
        let dateMonth = 0;
        let num = 0;
        let addupNum = 0;
        let resultObj = {};
        let index = 0;
        let indexNum = 0;
        let maxNum = 0;
        knowledge.trendKnowledgeDetail.splice(
            0,
            knowledge.trendKnowledgeDetail.length
        );
        xAxisDataOfKnowledge.splice(0, xAxisDataOfKnowledge.length);
        seriesDataOfCurDate.splice(0, seriesDataOfCurDate.length);
        seriesDataOfAddup.splice(0, seriesDataOfAddup.length);
        knowledge.trendKnowledgeDetail = resultList;
        if (yearMonthType == 1) {
            index = parseInt(
                util.getLastDayOfMonth(trendYearMonth).split("-")[2]
            );
            dateMonth = parseInt(
                util.dateForMat("yyyy-MM", trendYearMonth).split("-")[1]
            );
            indexNum = 2;
        } else if (yearMonthType == 2) {
            index = 12;
            indexNum = 1;
        }
        for (let i = 1; i <= index; i++) {
            if (dateMonth != 0) {
                xAxisDataOfKnowledge.push(dateMonth + "-" + i);
            } else {
                xAxisDataOfKnowledge.push(i + "月");
            }
            for (let j = 0; j < resultList.length; j++) {
                resultObj = resultList[j];
                if (resultObj.curDateTime.split("-")[indexNum] == i) {
                    num++;
                    addupNum++;
                }
            }
            seriesDataOfCurDate.push(num);
            seriesDataOfAddup.push(addupNum);
            if (maxNum < num) {
                maxNum = num;
            }
            num = 0;
        }
        maxNoteOfCurDate = parseInt((maxNum + 4)*1.2);
        maxNoteOfAddup = parseInt((addupNum + 4)*1.2);
        // maxNoteOfCurDateInterval
        if (maxNoteOfCurDate < 10) {
            knowledge.lineAndBar.yAxis[0].interval = 1;
            knowledge.lineAndBar.yAxis[0].max = 10;
        } else {
            knowledge.lineAndBar.yAxis[0].interval = parseInt(maxNoteOfCurDate / 10);
            knowledge.lineAndBar.yAxis[0].max = parseInt(maxNoteOfCurDate -(maxNoteOfCurDate % 10));
        }
        if (maxNoteOfAddup < 10) {
            knowledge.lineAndBar.yAxis[1].interval = 1;
            knowledge.lineAndBar.yAxis[1].max = 10;
        } else {
            knowledge.lineAndBar.yAxis[1].interval = parseInt(maxNoteOfAddup / 10);
            knowledge.lineAndBar.yAxis[1].max = parseInt(maxNoteOfAddup - (maxNoteOfAddup % 10));
        }
    },
    [types.SHOWKNOWLEDGENOTE](state, resultObj) {
        state.knowledge.knowledgeAnalyzeModal = true;
        state.knowledge.title = resultObj.title;
        state.knowledge.note = resultObj.note;
    },
    [types.OPENKNOWLEDGEMODAL](state, resultList) {
        state.knowledge.knowledgeDetailModal = true;
        state.knowledge.analyzeKnowledgeRightDetailList = resultList;
    },
    [types.SUMKNOWLEDGECATEGORYOFANALYZE](state, resultList) {
        let knowledge = state.knowledge;
        let legendData = knowledge.circlePie.legend.data;
        let innerCircleData = knowledge.circlePie.series[0].data;
        let innerCircleDataValue = 0;
        let innerCircleDataObj = {};
        let outerCircleData = knowledge.circlePie.series[1].data;
        let outerCircleDataValue = 0;
        let outerCircleDataObj = {};
        let categoryName = "";
        let tempCategoryName = "";
        let ele = {};
        let tempEle = {};
        let flag = true;
        let totalNum = 0;
        legendData.splice(0, legendData.length);
        innerCircleData.splice(0, innerCircleData.length);
        outerCircleData.splice(0, outerCircleData.length);
        knowledge.analyzeKnowledgeRightList.splice(
            0,
            knowledge.analyzeKnowledgeRightList.length
        );
        for (let i = 0; i < resultList.length; i++) {
            ele = resultList[i];
            categoryName = ele.categoryNames.split("(")[0];
            for (let index = 0; index < innerCircleData.length; index++) {
                let element = innerCircleData[index];
                if (element.name === categoryName) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                legendData.push(categoryName);
                for (let j = 0; j < resultList.length; j++) {
                    tempEle = resultList[j];
                    tempCategoryName = tempEle.categoryNames.split("(")[0];
                    if (categoryName == tempCategoryName) {
                        innerCircleDataValue =
                            innerCircleDataValue + tempEle.num;
                    }
                }
                innerCircleDataObj = {
                    name: categoryName,
                    value: innerCircleDataValue
                };
                innerCircleData.push(innerCircleDataObj);
                innerCircleDataValue = 0;
            }
            outerCircleDataObj = {
                name: ele.categoryNames,
                value: ele.num
            };
            outerCircleData.push(outerCircleDataObj);
            outerCircleDataValue = 0;
            flag = true;
            totalNum += ele.num;
        }
        resultList.forEach(element => {
            element.rate = parseFloat(
                (element.num / totalNum * 100).toFixed(2)
            );
            element.totalNum = totalNum;
            knowledge.analyzeKnowledgeRightList.push(element);
        });
    },
    [types.ECHARTSCLICKOFTREE](state, result) {
        let knowledge = state.knowledge;
        if (result.isLeave) {
            knowledge.knowledgeGraphModal = true;
        }
        knowledge.title = result.title;
        knowledge.note = result.note;
    },
    [types.QUERYNOTECATEGORY](state, result) {
        state.knowledge.noteCategoryList = result;
    },
    [types.QUERYKNOWLEDGELISTBYDATE](state, result) {
        state.knowledge.knowledgeList = result;
    },
    [types.GETNOTENUMOFCURDATE](state, result) {
        state.knowledge.sumKnowledgeNumOfDay = result;
    },
    [types.GETNOTENUMOFCURMONTH](state, result) {
        state.knowledge.sumKnowledgeNumOfMonth = result;
    },
    [types.GETNOTENUMOFREVIEW](state, result) {
        state.knowledge.sumKnowledgeNumOfReview = result;
    },
    [types.QUERYNOTECATEGORYIDBYNAME](state, result) {
        state.knowledge.noteCategoryId = result;
    },
    [types.QUERYKNOWLEDGEGRAPH](state, result) {
        let tempList = [result];
        state.knowledge.tree.series[0].data = tempList;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as emotionUtil from "@/utils/emotionUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    emotion: {
        tabName: "emotion-detail",
        animated: true,
        shadow: false,
        curDateTime: new Date(),
        rate: 3,
        state: "1",
        emotionDetailModal: false,
        emotionObj: null,
        emotionAnaYearMonthType: 1,
        analyzeYearMonth: new Date(),
        emotionAnaList: [],
        emotionAnaDetailList: [],
        emotionDetailModal: false,

        emotionTrendYearMonthType: 1,
        emotionTrendDetailList: [],
        emotionTrendList: [],
        trendYearMonth: new Date(),
        emotionPie: {
            title: {
                text: "情绪分析",
                x: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: "vertical",
                left: "left",
                data: []
            },
            series: [
                {
                    name: "情绪类别",
                    type: "pie",
                    radius: "55%",
                    center: ["50%", "60%"],
                    data: [],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }
            ]
        },
        emotionLineBar: {
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
            legend: {
                data: ["情绪指数", "平均情绪指数"]
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
                    name: "情绪指数",
                    min: 0,
                    max: 8,
                    interval: 1,
                    axisLabel: {
                        formatter: "{value}"
                    }
                },
                {
                    type: "value",
                    name: "平均情绪指数",
                    min: 0,
                    max: 8,
                    interval: 1,
                    axisLabel: {
                        formatter: "{value}"
                    }
                }
            ],
            series: [
                {
                    name: "情绪指数",
                    type: "bar",
                    barWidth: 5,
                    data: []
                },
                {
                    name: "平均情绪指数",
                    type: "line",
                    yAxisIndex: 1,
                    data: []
                    // smooth: true
                }
            ]
        }
    }
};

const getters = {
    emotion(state) {
        return state.emotion;
    }
};

const actions = {
    addEmotion({ commit, state }, param) {
        let result = emotionUtil.addEmotion(param.thisObj, state.emotion);
        // commit(types.ADDEMOTION, result);
    },
    updateEmotion({ commit, state }, param) {
        let result = emotionUtil.updateEmotion(param.thisObj, state.emotion);
    },
    queryEmotionByDate({ commit, state }, param) {
        let result = emotionUtil.queryEmotionByDate(
            param.thisObj,
            state.emotion
        );
        commit(types.QUERYEMOTIONBYDATE, result);
    },
    queryEmotionAnaData({ commit, state }, param) {
        let result = emotionUtil.queryEmotionAnaData(
            param.thisObj,
            state.emotion
        );
        commit(types.QUERYEMOTIONANADATA, result);
    },
    queryEmotionAnaDetailData({ commit, state }, param) {
        let result = emotionUtil.queryEmotionAnaDetailData(
            param.thisObj,
            state.emotion,
            param.index
        );
        commit(types.QUERYEMOTIONANADETAILDATA, result);
    },
    queryEmotionTrendData({ commit, state }, param) {
        let result = emotionUtil.queryEmotionTrendData(
            param.thisObj,
            state.emotion
        );
        commit(types.QUERYEMOTIONTRENDDATA, result);
    }
};

const mutations = {
    [types.QUERYEMOTIONTRENDDATA](state, result) {
        state.emotion.emotionTrendList.splice(
            0,
            state.emotion.emotionTrendList.length
        );
        state.emotion.emotionLineBar.xAxis[0].data.splice(
            0,
            state.emotion.emotionLineBar.xAxis[0].data.length
        );
        state.emotion.emotionLineBar.series[0].data.splice(
            0,
            state.emotion.emotionLineBar.series[0].data.length
        );
        state.emotion.emotionLineBar.series[1].data.splice(
            0,
            state.emotion.emotionLineBar.series[1].data.length
        );
        state.emotion.emotionTrendList = result.emotionTrendList;
        state.emotion.emotionLineBar.xAxis[0].data =
            result.emotionTrendXAxisData;
        state.emotion.emotionLineBar.series[0].data =
            result.emotionTrendSeriesFirstData;
        state.emotion.emotionLineBar.series[1].data =
            result.emotionTrendSeriesSecendData;
        state.emotion.emotionLineBar.yAxis[0].max = result.maxSumRate + 5;
        state.emotion.emotionLineBar.yAxis[1].max = result.maxSumRate + 5;
    },
    [types.QUERYEMOTIONANADETAILDATA](state, result) {
        state.emotion.emotionDetailModal = true;
        state.emotion.emotionAnaDetailList.splice(
            0,
            state.emotion.emotionAnaDetailList.length
        );
        state.emotion.emotionAnaDetailList = result;
    },
    [types.QUERYEMOTIONANADATA](state, result) {
        state.emotion.emotionAnaList.splice(
            0,
            state.emotion.emotionAnaList.length
        );
        state.emotion.emotionPie.legend.data.splice(
            0,
            state.emotion.emotionPie.legend.data.length
        );
        state.emotion.emotionPie.series[0].data.splice(
            0,
            state.emotion.emotionPie.series[0].data.length
        );
        state.emotion.emotionAnaList = result.emotionAnaList;
        state.emotion.emotionPie.legend.data = result.emotionAnaLegendData;
        state.emotion.emotionPie.series[0].data = result.emotionAnaSeriesData;
    },
    [types.QUERYEMOTIONBYDATE](state, result) {
        state.emotion.emotionObj = result;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

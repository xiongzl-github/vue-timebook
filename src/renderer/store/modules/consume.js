import types from "../types.js";
import * as util from "@/utils/util";
import * as dbUtil from "@/utils/dbUtil";
import * as consumeUtil from "@/utils/consumeUtil";
import path from "path";
import { remote } from "electron";
import { url } from "inspector";

const state = {
    consume: {
        animated: true,
        tabName: "consume-detail",
        userId: 1,
        syncStatus: 0,
        status: 1,
        showIncomeModal: false,
        curDateTime: new Date(),
        curYearMonth: new Date(),
        incomeCategory: "",
        sumBudget: 0,
        sumSeasonBudget: 0,
        sumDayBudget: 0,
        sumMonthBudget: 0,
        sumYearBudget: 0,
        sumDayExpend: 0,
        sumMonthExpend: 0,
        sumYearExpend: 0,
        sumYearIncome: 0,
        setting: false,
        consumeCategoryId: "",
        incomeCategoryId: "",
        incomeCurYearMonth: new Date(),
        consumeBudget: 0,
        consumeSort: "asc",
        applySetting: false,
        imgCheck: [],
        incomeIcons: [],
        consumeList: [],
        consumeBudgetList: [],
        incomeCategoryList: [],
        //========================消费分析========================
        type: 1, //用户区分年月日, 1月; 2年, 0日
        consumeType: "1", // 用于区分消费类型, 1, 支出, 2, 收入
        consumeCategoryType: 1,
        analyzeYearMonth: new Date(),
        analyzeResultList: [],
        analyzeConsumeList: [],
        analyzeIncomeList: [],
        consumeCategoryList: [],
        incomeCategoryList: [],
        sumTotalMonthExpendOfConsume: 0, // 根据analyzeYearMonth获取单个月所有费用(包括年度, 月度)
        sumTotalYearExpendOfConsume: 0, // 根据analyzeYearMonth获取整年所有费用(包裹年度, 月度)
        sumTotalMonthExpendOfIncome: 0, // 根据analyzeYearMonth获取单个月所有收入(包括年度, 月度)
        sumTotalYearExpendOfIncome: 0, // 根据analyzeYearMonth获取整年所有收入(包裹年度, 月度)
        analyzeConsumeRightList: [],
        analyzeIncomeRightList: [],
        analyzeBudgetRightList: [],
        analyzeConsumeRightDetailList: [],
        consumeDetailModal: false,
        timeButtonStyle: "ghost",
        moneyButtonStyle: "primary",
        index: 0,
        circlePie: {
            title: {
                text: "收支类别",
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
                    name: "收支类别",
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
                    name: "收支类别",
                    type: "pie",
                    radius: ["40%", "55%"],
                    label: {},
                    data: []
                }
            ]
        },
        //===========================消费趋势
        yearMonthType: 1, // 1, 月. 2, 年
        consumeTypeOfTrend: "1", // // 用于区分消费类型, 1, 支出, 2, 收入
        trendYearMonth: new Date(),
        trendXAxisData: [],
        trendYAxisCurConsume: [],
        trendYAxisAcumulatedConsume: [],
        trendDetailType: 1, // 1. 消费详情, 2. 预算详情
        trendConsumeDetail: [],
        consumeBudgetDetialOfTrendList: [],
        consumeDetailModalOfTrend: false,
        consumeBudgetDetailModalList: [],
        moneyButtonStyleOfTrend: "primary",
        timeButtonStyleOfTrend: "ghost",
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
                data: ["当天收支", "累计收支"]
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
                    name: "当天收支",
                    min: 0,
                    max: 1000,
                    interval: 50,
                    axisLabel: {
                        formatter: "{value}.00￥"
                    }
                },
                {
                    type: "value",
                    name: "累计收支",
                    min: 0,
                    max: 3000,
                    interval: 150,
                    axisLabel: {
                        formatter: "{value}.00￥"
                    }
                }
            ],
            series: [
                {
                    name: "当天收支",
                    type: "bar",
                    barWidth: 5,
                    data: []
                },
                {
                    name: "累计收支",
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
    consume(state) {
        return state.consume;
    }
};

const actions = {
    sumConsumeCategoryOfAnalyze({ commit, state }, param) {
        let result = consumeUtil.sumConsumeCategoryOfAnalyze(
            param.thisObj,
            state.consume
        );
        commit(types.SUMCONSUMECATEGORYOFANALYZE, result);
    },
    openConsumeModalOfTrend({ commit, state }, param) {
        let result = consumeUtil.openConsumeModalOfTrend(
            param.thisObj,
            state.consume,
            param.index
        );
        commit(types.OPENCONSUMEMODALOFTREND, result);
    },
    queryBudgetDetailOfTrend({ commit, state }, param) {
        let result = consumeUtil.queryBudgetDetailOfTrend(
            param.thisObj,
            state.consume
        );
        commit(types.QUERYBUDGETDETAILOFTREND, result);
    },
    sumConsumeTrend({ commit, state }, param) {
        let result = consumeUtil.sumConsumeTrend(param.thisObj, state.consume);
        commit(types.SUMCONSUMETREND, result);
    },
    openConsumeModal({ commit, state }, param) {
        let result = consumeUtil.openConsumeModal(
            param.thisObj,
            state.consume,
            param.index,
            param.category
        );
        commit(types.OPENCONSUMEMODAL, result);
    },
    openIncomeModal({ commit, state }, param) {
        commit(types.OPENINCOMEMODAL, param.index);
    },
    sumCategoryConsume({ commit, state }, param) {
        let thisObj = param.thisObj;
        let result = consumeUtil.sumCategoryConsume(thisObj, state.consume);
        commit(types.SUMCATEGORYCONSUME, result);
    },
    queryConsumeIncome({ commit, state }, param) {
        let result = consumeUtil.queryConsumeIncome(state.consume.curDateTime);
        commit(types.QUERYCONSUMEINCOME, result);
    },
    sumYearExpend({ commit, state }, param) {
        let thisObj = param.thisObj;
        let year = util.dateForMat("yyyy", state.consume.curDateTime);
        let yearMonth = util.dateForMat("yyyy-MM", state.consume.curDateTime);
        let result = consumeUtil.sumYearExpend(thisObj, year, yearMonth);
        commit(types.SUMYEAREXPEND, result);
    },
    sumTotalYearExpendOfConsume({ commit, state }, param) {
        let thisObj = param.thisObj;
        let year = util.dateForMat("yyyy", state.consume.analyzeYearMonth);
        let yearMonth = util.dateForMat(
            "yyyy-MM",
            state.consume.analyzeYearMonth
        );
        let result = consumeUtil.sumTotalYearExpendOfConsume(
            thisObj,
            year,
            yearMonth
        );
        commit(types.SUMTOTALYEAREXPENDOFCONSUME, result);
    },
    sumMonthExpend({ commit, state }, param) {
        let thisObj = param.thisObj;
        let yearMonth = util.dateForMat("yyyy-MM", state.consume.curDateTime);
        let result = consumeUtil.sumMonthExpend(
            thisObj,
            state.consume.curDateTime,
            yearMonth
        );
        commit(types.SUMMONTHEXPEND, result);
    },
    sumTotalMonthExpendOfConsume({ commit, state }, param) {
        let thisObj = param.thisObj;
        let yearMonth = util.dateForMat(
            "yyyy-MM",
            state.consume.analyzeYearMonth
        );
        let result = consumeUtil.sumTotalMonthExpendOfConsume(
            thisObj,
            state.consume.curDateTime,
            yearMonth
        );
        commit(types.SUMTOTALMONTHEXPENDOFCONSUME, result);
    },
    queryBudgetByCurYearMonth({ commit, state }, param) {
        let thisObj = param.thisObj;
        let curYearMonth = util.dateForMat("yyyy-MM", new Date());
        let budgets = consumeUtil.queryBudgetByCurYearMonth(curYearMonth, null);
        let flag = false;
        if (budgets.length == 0) {
            flag = true;
        }
        commit(types.QUERYBUDGETBYCURYEARMONTH, flag);
    },
    applyConsumeSetting({ commit, state }, param) {
        let thisObj = param.thisObj;
        consumeUtil.applyConsumeSetting(thisObj, state.consume);
    },
    saveConsumeSetting({ commit, state }, param) {
        let thisObj = param.thisObj;
        consumeUtil.saveConsumeSetting(thisObj, state.consume);
    },
    queryConsumeListByDate({ commit, state }, param) {
        let thisObj = param.thisObj;
        let curDateTime = state.consume.curDateTime;
        let resultList = consumeUtil.queryConsumeListByDate(
            thisObj,
            curDateTime
        );
        commit(types.QUERYCONSUMELISTBYDATE, resultList);
    },
    queryConsumeBudget({ commit, state }, param) {
        let thisObj = param.thisObj;
        let resultList = consumeUtil.queryConsumeBudget(
            thisObj,
            state.consume.consumeCategoryId,
            state.consume.curYearMonth
        );
        commit(types.QUERYCONSUMEBUDGET, resultList);
    },
    queryConsumeCategoryIdByName({ commit, state }, param) {
        commit(types.QUERYCONSUMECATEGORYIDBYNAME, param);
    }
};

const mutations = {
    [types.OPENCONSUMEMODALOFTREND](state, resultList) {
        state.consume.consumeBudgetDetailModalList.splice(
            0,
            state.consume.consumeBudgetDetailModalList.length
        );
        resultList.forEach(element => {
            element.curDateTime = element.curDateTime.split(" ")[0];
            state.consume.consumeBudgetDetailModalList.push(element);
        });
    },
    [types.QUERYBUDGETDETAILOFTREND](state, resultList) {
        state.consume.consumeBudgetDetialOfTrendList = resultList;
    },
    [types.QUERYCONSUMELISTBYDATE](state, resultList) {
        state.consume.consumeList = resultList;
        state.consume.sumDayExpend = 0;
        resultList.forEach(element => {
            state.consume.sumDayExpend += element.consume;
        });
    },
    [types.QUERYCONSUMECATEGORYIDBYNAME](state, param) {
        let thisObj = param.thisObj;
        let categoryName = param.categoryName;
        let res = consumeUtil.queryConsumeCategoryIdByName(
            thisObj,
            categoryName
        );
        if (categoryName == "购物") {
            state.consume.consumeCategoryId = res;
        } else if (categoryName == "收入") {
            state.consume.incomeCategoryId = res;
        }
    },
    [types.QUERYCONSUMEBUDGET](state, resultList) {
        state.consume.consumeBudgetList = resultList;
    },
    [types.QUERYBUDGETBYCURYEARMONTH](state, flag) {
        state.consume.applySetting = flag;
    },
    [types.SUMMONTHEXPEND](state, res) {
        state.consume.sumMonthExpend = res;
    },
    [types.SUMYEAREXPEND](state, res) {
        if (res == "" || res == null || res == undefined) {
            state.consume.sumYearExpend = 0;
        } else {
            state.consume.sumYearExpend = res;
        }
    },
    [types.SUMALLYEAREXPEND](state, res) {
        state.consume.sumAllYearExpend = res;
    },
    [types.QUERYCONSUMEINCOME](state, res) {
        if (res == "" || res == null || res == undefined) {
            state.consume.sumYearIncome = 0;
        } else {
            state.consume.sumYearIncome = res;
        }
    },
    [types.SUMCATEGORYCONSUME](state, res) {
        let income = 0;
        let consume = 0;
        let consumeSum = 0;
        let incomeSum = 0;
        let obj = {};
        let rate = 0;
        state.consume.analyzeConsumeList.splice(
            0,
            state.consume.analyzeConsumeList.length
        );
        state.consume.consumeCategoryList.splice(
            0,
            state.consume.consumeCategoryList.length
        );
        state.consume.analyzeIncomeList.splice(
            0,
            state.consume.analyzeIncomeList.length
        );
        state.consume.incomeCategoryList.splice(
            0,
            state.consume.incomeCategoryList.length
        );

        state.consume.analyzeConsumeRightList.splice(
            0,
            state.consume.analyzeConsumeRightList.length
        );
        state.consume.analyzeIncomeRightList.splice(
            0,
            state.consume.analyzeIncomeRightList.length
        );

        let num = 0;
        let resultObj = {};
        let list01 = [];
        let list02 = [];
        let children = [];
        let tempObj = {};

        res.forEach(element => {
            element.list.forEach(ele => {
                income = ele.income + income;
                consume = ele.consume + consume;
            });
            incomeSum = incomeSum + income;
            consumeSum = consumeSum + consume;
            income = 0;
            consume = 0;
        });
        res.forEach(element => {
            income = 0;
            consume = 0;
            num = 0;
            children = [];
            element.list.forEach(ele => {
                income = ele.income + income;
                consume = ele.consume + consume;
                num++;
                tempObj = {
                    childCategory: ele.childCategory,
                    date: ele.curDateTime.split(" ")[0],
                    consume: ele.consume,
                    income: ele.income,
                    iconName: ele.iconName
                };
                children.push(tempObj);
            });

            if (state.consume.consumeType == 1) {
                state.consume.consumeCategoryList.push(element.categoryName);
                rate = ((consume / consumeSum) * 100).toFixed(0);
                obj = { name: element.categoryName, value: rate };
                state.consume.analyzeConsumeList.push(obj);
                // resultObj
                resultObj = {
                    categoryName: element.categoryName,
                    rate: parseInt(rate),
                    num: num,
                    consume: consume,
                    iconName: element.iconName,
                    children: children
                };
                state.consume.analyzeConsumeRightList.push(resultObj);
            } else if (state.consume.consumeType == 2) {
                state.consume.incomeCategoryList.push(element.categoryName);
                rate = ((income / incomeSum) * 100).toFixed(0);
                obj = { name: element.categoryName, value: rate };
                state.consume.analyzeIncomeList.push(obj);
                // resultObj
                resultObj = {
                    categoryName: element.categoryName,
                    rate: parseInt(rate),
                    num: num,
                    consume: income,
                    iconName: element.iconName,
                    children: children
                };
                state.consume.analyzeIncomeRightList.push(resultObj);
            }
        });
        if (state.consume.consumeType == 1) {
            state.consume.pie.series[0].data = state.consume.analyzeConsumeList;
            state.consume.pie.legend.data = state.consume.consumeCategoryList;
        } else if (state.consume.consumeType == 2) {
            state.consume.pie.series[0].data = state.consume.analyzeIncomeList;
            state.consume.pie.legend.data = state.consume.incomeCategoryList;
        }
    },
    [types.SUMALLMONTHEXPEND](state, res) {
        state.consume.sumAllMonthExpend = res;
    },
    [types.SUMALLYEAREXPEND](state, res) {
        state.consume.sumAllYearExpend = res;
    },
    [types.SUMTOTALMONTHEXPENDOFCONSUME](state, res) {
        state.consume.sumTotalMonthExpendOfConsume = res;
    },
    [types.SUMTOTALYEAREXPENDOFCONSUME](state, res) {
        state.consume.sumTotalYearExpendOfConsume = res;
    },
    [types.OPENINCOMEMODAL](state, index) {
        state.consume.analyzeConsumeRightDetailList.splice(
            0,
            state.consume.analyzeConsumeRightDetailList.length
        );
        let data = state.consume.analyzeIncomeRightList[index].children;
        let obj = {};
        data.forEach(element => {
            obj = {
                iconName: element.iconName,
                consume: element.income,
                date: element.date,
                categoryName: element.childCategory
            };
            state.consume.analyzeConsumeRightDetailList.push(obj);
        });
        state.consume.analyzeConsumeRightDetailList.sort(util.sortByMoney);
    },
    [types.OPENCONSUMEMODAL](state, result) {
        let consume = state.consume;
        consume.analyzeConsumeRightDetailList.splice(
            0,
            consume.analyzeConsumeRightDetailList.length
        );
        result.forEach(element => {
            element.curDateTime = element.curDateTime.split(" ")[0];
            consume.analyzeConsumeRightDetailList.push(element);
        });
    },
    [types.SUMCONSUMETREND](state, resultList) {
        let consume = state.consume;
        let trendYearMonth = consume.trendYearMonth;
        let dateNum = 0;
        let dateMonth = 0;
        let date = "";
        let tempDate = "";
        let tempDateArr = [];
        let monthNum = "";
        consume.lineAndBar.xAxis[0].data.splice(
            0,
            consume.lineAndBar.xAxis[0].data.length
        );
        consume.lineAndBar.series[0].data.splice(
            0,
            consume.lineAndBar.series[0].data.length
        );
        consume.lineAndBar.series[1].data.splice(
            0,
            consume.lineAndBar.series[1].data.length
        );
        consume.trendConsumeDetail.splice(0, consume.trendConsumeDetail.length);
        resultList.forEach(element => {
            element.curDateTime = element.curDateTime.split(" ")[0];
            consume.trendConsumeDetail.push(element);
        });
        consume.trendConsumeDetail = resultList;
        // 获取每一天得消费总额
        let curDateTime = "";
        let tempCurDateTime = "";
        let list = [];
        consume.lineAndBar.series[1].data = list;
        let list01 = [];
        let obj = {};
        let consumeNum = 0;
        let flag = true;
        let tempNum = 0;
        resultList.forEach(element => {
            curDateTime = element.curDateTime.split(" ")[0];
            for (let index = 0; index < list01.length; index++) {
                let ele = list01[index];
                if (ele.curDateTime === curDateTime) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                resultList.forEach(ele => {
                    tempCurDateTime = ele.curDateTime.split(" ")[0];
                    if (tempCurDateTime == curDateTime) {
                        consumeNum = ele.consume + consumeNum;
                    }
                });
                obj = { curDateTime: curDateTime, consume: consumeNum };
                list01.push(obj);
                consumeNum = 0;
            }
            flag = true;
        });
        // 获取每一个月的消费总额
        let yearMonth = "";
        let tempYearMonth = "";
        let list02 = [];
        flag = true;
        resultList.forEach(element => {
            curDateTime = element.curDateTime.split(" ")[0];
            curDateTime =
                curDateTime.split("-")[0] + "-" + curDateTime.split("-")[1];
            list02.forEach(ele => {});
            for (let index = 0; index < list02.length; index++) {
                let ele = list02[index];
                if (ele.curDateTime === curDateTime) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                resultList.forEach(ele => {
                    tempCurDateTime = ele.curDateTime.split(" ")[0];
                    tempCurDateTime =
                        tempCurDateTime.split("-")[0] +
                        "-" +
                        tempCurDateTime.split("-")[1];
                    if (tempCurDateTime === curDateTime) {
                        consumeNum = ele.consume + consumeNum;
                    }
                });
                obj = { curDateTime: curDateTime, consume: consumeNum };
                list02.push(obj);
                consumeNum = 0;
            }
            flag = true;
        });
        flag = true;
        if (consume.yearMonthType == 1) {
            dateNum = parseInt(
                util
                    .getLastDayOfMonth(trendYearMonth)
                    .split(" ")[0]
                    .split("-")[2]
            );
            dateMonth = parseInt(
                util.dateForMat("yyyy-MM", trendYearMonth).split("-")[1]
            );
            for (let index = 1; index <= dateNum; index++) {
                date = dateMonth + "-" + index;
                consume.lineAndBar.xAxis[0].data.push(date);
                list01.forEach(element => {
                    tempDateArr = element.curDateTime.split("-");
                    tempDate =
                        parseInt(tempDateArr[1]) +
                        "-" +
                        parseInt(tempDateArr[2]);
                    if (tempDate == date) {
                        consume.lineAndBar.series[0].data.push(element.consume);
                        if (list.length == 0) {
                            list.push(element.consume);
                        } else {
                            tempNum = list[list.length - 1] + element.consume;
                            list.push(tempNum);
                        }
                        flag = false;
                    }
                });
                if (flag) {
                    consume.lineAndBar.series[0].data.push(0);
                    if (list.length == 0) {
                        list.push(0);
                    } else {
                        tempNum = list[list.length - 1];
                        list.push(tempNum);
                    }
                }
                flag = true;
            }
        } else if (consume.yearMonthType == 2) {
            for (let index = 1; index <= 12; index++) {
                consume.lineAndBar.xAxis[0].data.push(index);
                list02.forEach(element => {
                    monthNum = parseInt(element.curDateTime.split("-")[1]);
                    if (index == monthNum) {
                        consume.lineAndBar.series[0].data.push(element.consume);
                        if (list.length == 0) {
                            list.push(element.consume);
                        } else {
                            tempNum = list[list.length - 1] + element.consume;
                            list.push(tempNum);
                        }
                        flag = false;
                    }
                });
                if (flag) {
                    consume.lineAndBar.series[0].data.push(0);
                    if (list.length == 0) {
                        list.push(0);
                    } else {
                        tempNum = list[list.length - 1];
                        list.push(tempNum);
                    }
                }
                flag = true;
            }
        }
        // 获取一个月当中消费最高的是那一天
        let maxConsumeOfMonth = 0;
        let maxConsumeOfDate = 0;
        if (consume.yearMonthType == 1) {
            if (list01.length > 0) {
                maxConsumeOfDate = list01[0].consume;
            }
            list01.forEach(ele => {
                if (maxConsumeOfDate < ele.consume) {
                    maxConsumeOfDate = ele.consume;
                }
            });
            maxConsumeOfDate = parseInt(maxConsumeOfDate * 1.2);
        } else if (consume.yearMonthType == 2) {
            if (list02.length > 0) {
                maxConsumeOfDate = list02[0].consume;
            }
            list02.forEach(ele => {
                if (maxConsumeOfDate < ele.consume) {
                    maxConsumeOfDate = ele.consume;
                }
            });
            maxConsumeOfDate = parseInt(maxConsumeOfDate * 1.2);
        }
        consume.lineAndBar.yAxis[0].max = maxConsumeOfDate;
        consume.lineAndBar.yAxis[1].max = parseInt(list[list.length - 1] * 1.2);
        consume.lineAndBar.yAxis[0].interval = maxConsumeOfDate / 10;
        consume.lineAndBar.yAxis[1].interval = parseInt(
            (list[list.length - 1] * 1.2) / 10
        );
    },
    [types.SUMCONSUMECATEGORYOFANALYZE](state, resultList) {
        resultList.sort(util.sortByProperty);
        let consume = state.consume;
        let legendData = consume.circlePie.legend.data;
        let innerCircleData = consume.circlePie.series[0].data;
        let innerCircleDataValue = 0;
        let innerCircleDataObj = {};
        let outerCircleData = consume.circlePie.series[1].data;
        let outerCircleDataValue = 0;
        let outerCircleDataObj = {};
        let categoryName = "";
        let categoryNames = "";
        let tempCategoryName = "";
        let ele = {};
        let tempEle = {};
        let flag = true;
        let mark = true;
        let sumConsume = 0;
        let sumBudget = 0;
        legendData.splice(0, legendData.length);
        innerCircleData.splice(0, innerCircleData.length);
        outerCircleData.splice(0, outerCircleData.length);
        consume.analyzeConsumeRightList.splice(
            0,
            consume.analyzeConsumeRightList.length
        );
        consume.analyzeBudgetRightList.splice(
            0,
            consume.analyzeBudgetRightList.length
        );
        for (let i = 0; i < resultList.length; i++) {
            ele = resultList[i];
            categoryName = ele.categoryNames.split("(")[0];
            categoryNames = ele.categoryNames;
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
                        if (consume.consumeCategoryType == 1) {
                            innerCircleDataValue =
                                innerCircleDataValue + tempEle.sumConsume;
                        } else if (consume.consumeCategoryType == 2) {
                            innerCircleDataValue =
                                innerCircleDataValue + tempEle.budget;
                        }
                    }
                }
                innerCircleDataObj = {
                    name: categoryName,
                    value: innerCircleDataValue
                };
                innerCircleData.push(innerCircleDataObj);
                innerCircleDataValue = 0;
            }

            for (let index = 0; index < outerCircleData.length; index++) {
                let element = outerCircleData[index];
                if (element.name === categoryNames) {
                    mark = false;
                    break;
                }
            }
            if (mark) {
                for (let k = 0; k < resultList.length; k++) {
                    tempEle = resultList[k];
                    if (ele.categoryNames == tempEle.categoryNames) {
                        if (consume.consumeCategoryType == 1) {
                            outerCircleDataValue =
                                outerCircleDataValue + tempEle.sumConsume;
                        } else if (consume.consumeCategoryType == 2) {
                            outerCircleDataValue =
                                outerCircleDataValue + tempEle.budget;
                        }
                    }
                }
                outerCircleDataObj = {
                    name: ele.categoryNames,
                    value: outerCircleDataValue
                };
                outerCircleData.push(outerCircleDataObj);
                outerCircleDataValue = 0;
            }
            flag = true;
            mark = true;
            sumConsume += ele.sumConsume;
            sumBudget += ele.budget;
        }
        resultList.forEach(element => {
            if (consume.consumeCategoryType == 1) {
                element.rate = parseFloat(
                    ((element.sumConsume / sumConsume) * 100).toFixed(2)
                );
                element.totalConsume = sumConsume;
                consume.analyzeConsumeRightList.push(element);
            } else if (consume.consumeCategoryType == 2) {
                element.rate = parseFloat(
                    ((element.budget / sumBudget) * 100).toFixed(2)
                );
                element.totalBudget = sumBudget;
                consume.analyzeBudgetRightList.push(element);
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

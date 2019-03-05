<!--  -->
<template>
    <Tabs v-model="consume.tabName" :animated="consume.animated" v-on:on-click="handle">
        <TabPane name="consume-detail" label="收支详情" icon="navicon-round">
            <DatePicker size="large" @on-change="queryConsumeListByDate" class="Consume-DatePicker" type="date" v-model="consume.curDateTime" placeholder="Select date"></DatePicker>
            <span style="float:left;margin-left:40px;line-height:45px">
                <strong style="font-size:14px;margin-top:10px">当天支出: </strong>
                <strong style="font-size:18px;margin-top:10px">￥{{consume.sumDayExpend}}</strong>
            </span>
            <span style="float:left;margin-left:50px;line-height:45px">
                <strong style="font-size:14px;margin-top:10px">当月支出: </strong>
                <strong style="font-size:18px;margin-top:10px">￥{{consume.sumMonthExpend}}/{{consume.sumMonthBudget}}</strong>
            </span>
            <span style="float:left;margin-left:50px;line-height:45px">
                <strong style="font-size:14px;margin-top:10px">年度支出: </strong>
                <strong style="font-size:18px;margin-top:10px">￥{{consume.sumYearExpend}}/{{consume.sumYearBudget}}</strong>
            </span>
            <span style="float:left;margin-left:50px;line-height:45px">
                <strong style="font-size:14px;margin-top:10px">当月收入: </strong>
                <strong style="font-size:18px;margin-top:10px">￥{{consume.sumYearIncome}}</strong>
            </span>
            <span v-on:click="openConsumeSetting">
                <Icon style="font-size:22px;display:inline-block;float:right;margin-top:12px;cursor:pointer" type="gear-a"></Icon>
            </span>
            <div id="Consume-Detail" style="width:1005px;height:550px;padding-left:70px">
                <Card v-for="(item, index) in consume.consumeList" :key="index" style="width:208px;display:inline-block;margin:0 20px 20px 0;float:left">
                    <div style="text-align:center">
                        <img style="width:64px;height:64px" :src="item.dataUrl">
                        <div style="width:150px;display:inline-block">
                            <h3>{{item.categoryName}}</h3>
                            {{item.listName}}
                            <span>价格: {{item.consume}}</span>
                        </div>
                    </div>
                </Card>
            </div>
            <Modal :footer-hide=false id="consumeSettingModal" :mask-closable="false" v-model="consume.setting" @on-ok="saveConsumeSetting" :styles="{top: '300px', width:'500px', height:'300px'}" title="消费预算!">
                <div style="text-align:center">
                    <div style="margin-bottom:2px;text-align:center">
                        <DatePicker type="month" format="yyyy-MM" @on-change="queryConsumeBudget" class="Consume-budget-DatePicker" v-model="consume.curYearMonth"></DatePicker>
                        <h3 style="text-align:left;margin-left:0px;display:inline-block;">预算总额:</h3>
                        <strong style="font-size:24px">{{consume.sumBudget}}￥</strong>
                    </div>
                    <div style="text-align:center">
                        <div style="display:inline-block;width:140px">
                            <h3 style="display:inline-block;">当日预算:</h3>
                            <strong style="font-size:24px">{{consume.sumDayBudget}}￥</strong>
                        </div>
                        <div style="display:inline-block;width:140px">
                            <h3 style="display:inline-block;">月度预算:</h3>
                            <strong style="font-size:24px">{{consume.sumMonthBudget}}￥</strong>
                        </div>
                        <div style="display:inline-block;width:140px">
                            <h3 style="display:inline-block;">年度预算:</h3>
                            <strong style="font-size:24px">{{consume.sumYearBudget}}￥</strong>
                        </div>
                        <strong v-on:click="consumeBudgetSort" style="font-size:14px;float:right;margin-top:10px" v-if="consume.consumeSort == 'asc'">
                            <Icon style="font-size:14px" type="chevron-up"></Icon>
                        </strong>
                        <strong v-on:click="consumeBudgetSort" style="font-size:14px;float:right;margin-top:10px" v-if="consume.consumeSort == 'desc'">
                            <Icon style="font-size:14px" type="chevron-down"></Icon>
                        </strong>
                    </div>

                    <div id="consumeBudget" style="width:468px;height:300px;">
                        <div style="padding-top:10px" v-for="item in consume.consumeBudgetList">
                            <h4 style="display:inline-block;width:80px;text-align:right;margin-right:10px">{{item.categoryName}}: </h4>
                            <Input @on-change="sumBudget" size="small" v-model="item.budget" style="width: 278px;margin-right:10px"></Input>
                            <ButtonGroup size="small" shape="circle">
                                <Button v-on:click="item.type = 0" v-if="item.type == 0" type="primary">日</Button>
                                <Button v-on:click="item.type = 0" v-if="item.type != 0" type="ghost">日</Button>
                                <Button v-on:click="item.type = 2" v-if="item.type == 2" type="primary">月</Button>
                                <Button v-on:click="item.type = 2" v-if="item.type != 2" type="ghost">月</Button>
                                <Button v-on:click="item.type = 1" v-if="item.type == 1" type="primary">年</Button>
                                <Button v-on:click="item.type = 1" v-if="item.type != 1" type="ghost">年</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="text" @click="consume.setting=false">取消</Button>
                    <Tooltip content="将选中月预算设置应用到当前月" placement="top">
                        <Button v-show="consume.applySetting" style="margin-right:10px" type="error" @click="applyConsumeSetting">应用</Button>
                    </Tooltip>
                    <Button type="success" @click="saveConsumeSetting">确认</Button>
                </div>
            </Modal>
        </TabPane>
        <TabPane name="consume-analyze" label="收支分析" icon="ios-lightbulb">
            <div>
                <div style="width:600px;height:610px;display:inline-block;float:left">
                    <div style="width:600px;height:50px;text-align:center;">
                        <ButtonGroup size="default" style="margin:10px 5px 10px 0px;">
                            <Button v-on:click="changeYearMonth(2)" v-if="consume.type == 2" type="primary">年</Button>
                            <Button v-on:click="changeYearMonth(2)" v-if="consume.type != 2" type="ghost">年</Button>
                            <Button v-on:click="changeYearMonth(1)" v-if="consume.type == 1" type="primary">月</Button>
                            <Button v-on:click="changeYearMonth(1)" v-if="consume.type != 1" type="ghost">月</Button>
                            <Button v-on:click="changeYearMonth(0)" v-if="consume.type == 0" type="primary">日</Button>
                            <Button v-on:click="changeYearMonth(0)" v-if="consume.type != 0" type="ghost">日</Button>
                        </ButtonGroup>
                        <span v-if="consume.type == 0">
                            <DatePicker type="date" format="yyyy-MM-dd" @on-change="changeYearMonth(null)" class="Consume-Analyze-DatePicker" v-model="consume.analyzeYearMonth"></DatePicker>
                        </span>
                        <span v-if="consume.type == 1">
                            <DatePicker type="month" format="yyyy-MM" @on-change="changeYearMonth(null)" class="Consume-Analyze-DatePicker" v-model="consume.analyzeYearMonth"></DatePicker>
                        </span>
                        <span v-if="consume.type == 2">
                            <DatePicker type="year" format="yyyy" @on-change="changeYearMonth(null)" class="Consume-Analyze-DatePicker" v-model="consume.analyzeYearMonth"></DatePicker>
                        </span>
                        <RadioGroup v-on:on-change="changeYearMonth(null)" v-model="consume.consumeType">
                            <Radio label="1">支出</Radio>
                            <Radio label="0">当日支出</Radio>
                            <Radio label="4">月度支出</Radio>
                            <Radio label="3">年度支出</Radio>
                            <Radio v-if="consume.consumeCategoryType == 1" label="2">收入</Radio>
                        </RadioGroup>
                    </div>
                    <div class="echarts" style="margin:50px 0px 0 50px">
                        <IEcharts style="width:600px;height:520px" :option="consume.circlePie" />
                    </div>
                </div>
                <div>
                    <ButtonGroup size="default" style="display:inline-block;float:left">
                        <Button style="width:190px" v-on:click="changeConsumeCategoryOfAnalyze(1)" v-if="consume.consumeCategoryType == 1" type="primary">收支类别</Button>
                        <Button style="width:190px" v-on:click="changeConsumeCategoryOfAnalyze(1)" v-if="consume.consumeCategoryType != 1" type="ghost">收支类别</Button>
                        <Button style="width:190px" v-on:click="changeConsumeCategoryOfAnalyze(2)" v-if="consume.consumeCategoryType == 2" type="primary">预算类别</Button>
                        <Button style="width:190px" v-on:click="changeConsumeCategoryOfAnalyze(2)" v-if="consume.consumeCategoryType != 2" type="ghost">预算类别</Button>
                    </ButtonGroup>
                    <el-dropdown @command="sortConsumeDetail" style="display:inline-block;float:right;padding-top:10px">
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="time">时间</el-dropdown-item>
                            <el-dropdown-item command="money">金额</el-dropdown-item>
                            <el-dropdown-item v-if="consume.trendDetailType == 2" command="overSpend">超支</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div id="consumeAnalyze" style="width:406px;height:570px;display:inline-block;float:right">
                    <div v-if="consume.consumeCategoryType == 1" v-on:click="openConsumeModal(index, 1)" v-for="(item, index) in consume.analyzeConsumeRightList" :key="index" style="width:406px;height:50px;display:inline-block;margin-bottom:-5px;cursor:pointer;border-bottom: 1px solid #ddd;">
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img src="../assets/img/arrow.png" style="float:right;width:24px;height:24px;margin:10px 0px 0 0px">
                        <strong style="font-size:14px;font-weight:bolder;float:left;margin:5px 0 0 10px">{{item.categoryNames}} {{item.rate}}%({{item.sumConsume}}/{{item.totalConsume}})</strong>
                        <strong style="font-size:14px;font-weight:bolder;float:right;margin:5px 10px 0 0px">￥{{item.sumConsume}}.00</strong>
                        <Progress :hide-info=true style="float:left;margin-left:10px;display:inline-block;width:250px" :percent="item.rate" status="active"></Progress>
                        <strong style="font-size:14px;font-weight:bolder;float:right;margin:0px 10px 0px 0px">{{item.num}}笔</strong>
                    </div>
                    <div v-if="consume.consumeCategoryType == 2" v-on:click="openConsumeModal(index, 2)" v-for="(item, index) in consume.analyzeBudgetRightList" :key="index" style="width:406px;height:50px;display:inline-block;margin-bottom:-5px;cursor:pointer;border-bottom: 1px solid #ddd;">
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img src="../assets/img/arrow.png" style="float:right;width:24px;height:24px;margin:10px 0px 0 0px">
                        <strong style="font-size:14px;font-weight:bolder;float:left;margin:5px 0 0 10px">{{item.categoryNames}} {{item.rate}}%({{item.budget}}/{{item.totalBudget}})</strong>
                        <strong style="font-size:14px;font-weight:bolder;float:right;margin:5px 10px 0 0px">￥{{item.budget}}.00</strong>
                        <Progress :hide-info=true style="float:left;margin-left:10px;display:inline-block;width:250px" :percent="item.rate" status="active"></Progress>
                        <strong style="font-size:14px;font-weight:bolder;float:right;margin:0px 10px 0px 0px">{{item.num}}笔</strong>
                    </div>
                </div>
            </div>
            <Modal :mask-closable="false" v-model="consume.consumeDetailModal" :styles="{top: '200px', width:'500px', height:'500px'}" title="消费预算!">
                <div style="margin-bottom:10px">
                    <ButtonGroup>
                        <Button v-on:click="sortByMoney" style="width:234px" :type="consume.moneyButtonStyle">金额</Button>
                        <Button v-on:click="sortByTime" style="width:234px" :type="consume.timeButtonStyle">时间</Button>
                    </ButtonGroup>
                </div>
                <div id="consumeAnalyzeDetail" style="width:468px;height:450px;display:inline-block;">
                    <div v-for="(item, index) in consume.analyzeConsumeRightDetailList" :key="index" style="width:468px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.categoryNames}}</strong>
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">￥{{item.consume}}.00</strong>
                        </div>
                        <strong style="text-align:right;font-size:14px;font-weight:bolder;float:right;margin:0px 10px 0 0px">{{item.curDateTime}}</strong>
                    </div>
                </div>
            </Modal>
        </TabPane>
        <TabPane name="consume-trend" label="收支趋势" icon="stats-bars">
            <div>
                <div style="width:600px;height:610px;display:inline-block;float:left">
                    <div style="width:600px;height:50px;text-align:center;">
                        <ButtonGroup size="default" style="margin:0px 10px 0 10px;">
                            <Button v-on:click="changeYearMonthOfTrend(2)" v-if="consume.yearMonthType == 2" type="primary">年</Button>
                            <Button v-on:click="changeYearMonthOfTrend(2)" v-if="consume.yearMonthType != 2" type="ghost">年</Button>
                            <Button v-on:click="changeYearMonthOfTrend(1)" v-if="consume.yearMonthType == 1" type="primary">月</Button>
                            <Button v-on:click="changeYearMonthOfTrend(1)" v-if="consume.yearMonthType != 1" type="ghost">月</Button>
                        </ButtonGroup>
                        <span v-if="consume.yearMonthType == 1">
                            <DatePicker type="month" format="yyyy-MM" @on-change="changeYearMonthOfTrend(null)" class="Consume-Analyze-DatePicker" v-model="consume.trendYearMonth"></DatePicker>
                        </span>
                        <span v-if="consume.yearMonthType == 2">
                            <DatePicker type="year" format="yyyy" @on-change="changeYearMonthOfTrend(null)" class="Consume-Analyze-DatePicker" v-model="consume.trendYearMonth"></DatePicker>
                        </span>
                        <RadioGroup v-on:on-change="changeYearMonthOfTrend(null)" v-model="consume.consumeTypeOfTrend">
                            <Radio label="1">支出</Radio>
                            <Radio label="2">收入</Radio>
                        </RadioGroup>
                    </div>
                    <div class="echarts" style="margin:50px 0 0 0px;width:600px;height:600px">
                        <IEcharts style="width:600px;height:520px" :option="consume.lineAndBar" />
                    </div>
                </div>
                <div>
                    <ButtonGroup size="default" style="display:inline-block;float:left">
                        <Button style="width:190px" v-on:click="changeTrendDetail(1)" v-if="consume.trendDetailType == 1" type="primary">消费详情</Button>
                        <Button style="width:190px" v-on:click="changeTrendDetail(1)" v-if="consume.trendDetailType != 1" type="ghost">消费详情</Button>
                        <Button style="width:190px" v-on:click="changeTrendDetail(2)" v-if="consume.trendDetailType == 2" type="primary">预算详情</Button>
                        <Button style="width:190px" v-on:click="changeTrendDetail(2)" v-if="consume.trendDetailType != 2" type="ghost">预算详情</Button>
                    </ButtonGroup>
                    <el-dropdown @command="sortConsumeDetail" style="display:inline-block;float:right;padding-top:10px">
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="time">时间</el-dropdown-item>
                            <el-dropdown-item command="money">金额</el-dropdown-item>
                            <el-dropdown-item v-if="consume.trendDetailType == 2" command="overSpend">超支</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div id="consumeTrend" style="width:406px;height:570px;display:inline-block;float:right">
                    <div v-if="consume.trendDetailType == 1" v-for="(item, index) in consume.trendConsumeDetail" :key="index" style="width:406px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.categoryName}}</strong>
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">￥{{item.consume}}.00</strong>
                        </div>
                        <strong style="text-align:right;font-size:14px;font-weight:bolder;float:right;margin:0px 10px 0 0px">{{item.curDateTime}}</strong>
                    </div>
                    <div v-if="consume.trendDetailType == 2" v-on:click="openConsumeModalOfTrend(index)" v-for="(item, index) in consume.consumeBudgetDetialOfTrendList" :key="index" style="width:406px;height:70px;display:inline-block;margin-bottom:-5px;cursor:pointer;border-bottom: 1px solid #ddd;">
                        <h3 style="width:406px;height:10px;text-align:left;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0px 10px">{{item.curYearMonth}} ( {{item.yearMonthTypeOfTrend}} )</h3>
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:15px 0 0 10px;">
                        <img src="../assets/img/arrow.png" style="float:right;width:24px;height:24px;margin:15px 0px 0 0px">
                        <strong style="font-size:14px;font-weight:bolder;float:left;margin:10px 0 0 10px">{{item.categoryNames}} {{item.sumConsume}}￥/{{item.budget}}￥</strong>
                        <span v-if="item.rate == 100">
                            <Progress :hide-info=true style="float:left;margin-left:10px;display:inline-block;width:250px" :percent="100" status="normal"></Progress>
                            <Icon style="font-size:18px;margin-right:60px;float:right;color:red" type="ios-bolt"></Icon>
                            <strong style="font-size:14px;font-weight:bolder;float:right;margin:-32px 25px 0px 0px">{{item.num}}笔</strong>
                        </span>
                        <span v-if="item.rate < 100">
                            <Progress :hide-info=true style="float:left;margin-left:10px;display:inline-block;width:250px" :percent="item.rate" status="active"></Progress>
                            <strong style="font-size:14px;font-weight:bolder;float:right;margin:-14px 5px 0px 0px">{{item.num}}笔</strong>
                        </span>
                    </div>
                </div>
            </div>
            <Modal :mask-closable="false" v-model="consume.consumeDetailModalOfTrend" :styles="{top: '200px', width:'500px', height:'500px'}" title="消费类别详情!">
                <div style="margin-bottom:10px">
                    <ButtonGroup>
                        <Button v-on:click="sortByMoneyOfTrend" style="width:234px" :type="consume.moneyButtonStyleOfTrend">金额</Button>
                        <Button v-on:click="sortByTimeOfTrend" style="width:234px" :type="consume.timeButtonStyleOfTrend">时间</Button>
                    </ButtonGroup>
                </div>
                <div id="consumeTrendDetailModal" style="width:468px;height:450px;display:inline-block;">
                    <div v-for="(item, index) in consume.consumeBudgetDetailModalList" :key="index" style="width:468px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.categoryName}}</strong>
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">￥{{item.consume}}.00</strong>
                        </div>
                        <strong style="text-align:right;font-size:14px;font-weight:bolder;float:right;margin:0px 10px 0 0px">{{item.curDateTime}}</strong>
                    </div>
                </div>
            </Modal>
        </TabPane>
    </Tabs>
</template>

<script>
import Scrollbar from "smooth-scrollbar";
import { mapGetters, mapState } from "vuex";
// import IEcharts from 'vue-echarts-v3/src/lite.js';
// import 'echarts/lib/chart/pie';
import IEcharts from "vue-echarts-v3/src/full.js";
import * as consumeUtil from "@/utils/consumeUtil.js";
import * as util from "@/utils/util.js";

export default {
    // name: 'view',
    data() {
        return {};
    },

    methods: {
        sumConsumeCategoryOfAnalyze() {
            this.$store.dispatch({
                type: "sumConsumeCategoryOfAnalyze",
                thisObj: this
            });
        },
        changeConsumeCategoryOfAnalyze(num) {
            this.consume.consumeCategoryType = num;
            this.consume.animated = false;
            // if (num == 1) {
            //     this.sumCategoryConsume();
            // } else if (num == 2) {
            //     this.queryBudgetDetailOfTrend();
            // }
            this.sumConsumeCategoryOfAnalyze();
            this.reloadPage();
            setTimeout(() => {
                this.consume.tabName = "consume-analyze";
            }, 1);
        },
        sortByMoneyOfTrend() {
            this.consume.consumeBudgetDetailModalList.sort(util.sortByMoney);
            this.consume.moneyButtonStyleOfTrend = "primary";
            this.consume.timeButtonStyleOfTrend = "ghost";
        },
        sortByTimeOfTrend() {
            this.consume.consumeBudgetDetailModalList.sort(
                util.sortByTimeOfTrend
            );
            this.consume.moneyButtonStyleOfTrend = "ghost";
            this.consume.timeButtonStyleOfTrend = "primary";
        },
        openConsumeModalOfTrend(index) {
            this.consume.consumeDetailModalOfTrend = true;
            this.$store.dispatch({
                type: "openConsumeModalOfTrend",
                thisObj: this,
                index: index
            });
            this.consume.animated = false;
            this.reloadPage();
        },
        // 查询预算详情
        queryBudgetDetailOfTrend() {
            this.$store.dispatch({
                type: "queryBudgetDetailOfTrend",
                thisObj: this
            });
        },
        changeTrendDetail(num) {
            this.consume.trendDetailType = num;
            this.consume.animated = false;
            if (num == 1) {
                this.sumConsumeTrend();
            } else if (num == 2) {
                this.queryBudgetDetailOfTrend();
            }
            this.reloadPage();
            setTimeout(() => {
                this.consume.tabName = "consume-trend";
            }, 1);
        },
        changeYearMonthOfTrend(num) {
            if (num != null) {
                this.consume.yearMonthType = num;
            }
            this.sumConsumeTrend();
            this.queryBudgetDetailOfTrend();
            this.consume.animated = false;
            this.reloadPage();
            setTimeout(() => {
                this.consume.tabName = "consume-trend";
            }, 1);
        },
        sumConsumeTrend() {
            this.$store.dispatch({
                type: "sumConsumeTrend",
                thisObj: this
            });
        },
        sortConsumeDetail(command) {
            if ("time" == command && this.consume.trendDetailType == 1) {
                this.consume.trendConsumeDetail.sort(util.sortByTimeOfTrend);
            } else if (
                "money" == command &&
                this.consume.trendDetailType == 1
            ) {
                this.consume.trendConsumeDetail.sort(util.sortByMoney);
            } else if ("time" == command && this.consume.trendDetailType == 2) {
                this.consume.consumeBudgetDetialOfTrendList.sort(
                    util.sortByTimeOfTrend
                );
            } else if (
                "money" == command &&
                this.consume.trendDetailType == 2
            ) {
                this.consume.consumeBudgetDetialOfTrendList.sort(
                    util.sortByMoneyOfTrend
                );
            } else if (
                "overSpend" == command &&
                this.consume.trendDetailType == 2
            ) {
                this.consume.consumeBudgetDetialOfTrendList.sort(
                    util.sortByRate
                );
            }
        },
        sortByMoney() {
            this.consume.moneyButtonStyle = "primary";
            this.consume.timeButtonStyle = "ghost";
            this.consume.analyzeConsumeRightDetailList.sort(util.sortByMoney);
        },
        sortByTime() {
            this.consume.timeButtonStyle = "primary";
            this.consume.moneyButtonStyle = "ghost";
            this.consume.analyzeConsumeRightDetailList.sort(
                util.sortByTimeOfTrend
            );
        },
        openConsumeModal(index, category) {
            this.consume.consumeDetailModal = true;
            this.$store.dispatch({
                type: "openConsumeModal",
                thisObj: this,
                index: index,
                category,
                category
            });
            this.consume.animated = false;
            this.reloadPage();
        },
        openIncomeModal(index) {
            this.consume.consumeDetailModal = true;
            this.$store.dispatch({
                type: "openIncomeModal",
                thisObj: this,
                index: index
            });
            this.consume.animated = false;
            this.reloadPage();
        },
        handle(name) {
            this.reloadPage();
            setTimeout(() => {
                this.consume.tabName = name;
            }, 1);
            this.consume.animated = true;
        },
        changeYearMonth(num) {
            if (num != null) {
                this.consume.type = num;
            }
            // this.sumCategoryConsume();
            this.sumConsumeCategoryOfAnalyze();
            this.consume.animated = false;
            this.reloadPage();
            setTimeout(() => {
                this.consume.tabName = "consume-analyze";
            }, 1);
        },
        reloadPage() {
            //let value = this.$store.state.home.home.isRouterAlive;
            this.$store.state.home.home.isRouterAlive = false;
            this.$nextTick(
                () => (this.$store.state.home.home.isRouterAlive = true)
            );
        },
        queryConsumeIncome() {
            this.$store.dispatch({
                type: "queryConsumeIncome",
                thisObj: this
            });
        },
        handleImgCheck() {
            this.$store.dispatch({
                type: "handleImgCheck",
                thisObj: this
            });
        },
        sumMonthExpend() {
            this.$store.dispatch({
                type: "sumMonthExpend",
                thisObj: this
            });
        },
        sumYearExpend(date, type) {
            this.$store.dispatch({
                type: "sumYearExpend",
                thisObj: this
            });
        },
        sumMonthIncome() {},
        queryBudgetByCurYearMonth() {
            this.$store.dispatch({
                type: "queryBudgetByCurYearMonth",
                thisObj: this
            });
        },
        sumYearBudget() {
            let sumYearBudget = 0;
            this.consume.consumeBudgetList.forEach(element => {
                if (
                    element.budget != null &&
                    element.budget != "" &&
                    element.budget != undefined
                ) {
                    if (element.type == 1) {
                        sumYearBudget =
                            parseInt(element.budget) + sumYearBudget;
                    }
                }
            });
            this.consume.sumYearBudget = sumYearBudget;
        },
        sumMonthBudget() {
            let sumMonthBudget = 0;
            this.consume.consumeBudgetList.forEach(element => {
                if (
                    element.budget != null &&
                    element.budget != "" &&
                    element.budget != undefined
                ) {
                    if (element.type == 2) {
                        sumMonthBudget =
                            parseInt(element.budget) + sumMonthBudget;
                    }
                }
            });
            this.consume.sumMonthBudget = sumMonthBudget;
        },
        sumDayBudget() {
            let sumDayBudget = 0;
            this.consume.consumeBudgetList.forEach(element => {
                if (
                    element.budget != null &&
                    element.budget != "" &&
                    element.budget != undefined
                ) {
                    if (element.type == 0) {
                        sumDayBudget = parseInt(element.budget) + sumDayBudget;
                    }
                }
            });
            this.consume.sumDayBudget = sumDayBudget;
        },
        sumBudget() {
            this.sumDayBudget();
            this.sumMonthBudget();
            this.sumYearBudget();
            let sumBudget =
                this.consume.sumYearBudget +
                this.consume.sumMonthBudget * 12 +
                this.consume.sumDayBudget * 365;
            this.consume.sumBudget = sumBudget;
        },
        consumeBudgetSort() {
            if (this.consume.consumeSort == "desc") {
                this.consume.consumeBudgetList.sort(util.sortByPropertyByAsc);
                this.consume.consumeSort = "asc";
            } else if (this.consume.consumeSort == "asc") {
                this.consume.consumeBudgetList.sort(util.sortByPropertyByDesc);
                this.consume.consumeSort = "desc";
            }
        },
        applyConsumeSetting() {
            this.$store.dispatch({
                type: "applyConsumeSetting",
                thisObj: this
            });
        },
        saveConsumeSetting() {
            this.$store.dispatch({
                type: "saveConsumeSetting",
                thisObj: this
            });
        },
        queryConsumeListByDate() {
            this.$store.dispatch({
                type: "queryConsumeListByDate",
                thisObj: this
            });
            this.sumMonthExpend();
            this.sumYearExpend();
        },
        openConsumeSetting() {
            this.consume.setting = true;
        },
        queryConsumeBudget() {
            this.$store.dispatch({
                type: "queryConsumeBudget",
                thisObj: this
            });
            this.sumBudget();
            this.queryBudgetByCurYearMonth();
        },
        queryConsumeCategoryIdByName(categoryName) {
            this.$store.dispatch({
                type: "queryConsumeCategoryIdByName",
                thisObj: this,
                categoryName: categoryName
            });
        },
        sumCategoryConsume() {
            this.$store.dispatch({
                type: "sumCategoryConsume",
                thisObj: this
            });
        },
        sumTotalMonthExpend() {
            this.$store.dispatch({
                type: "sumTotalMonthExpend",
                thisObj: this
            });
        },
        sumTotalYearExpend() {
            this.$store.dispatch({
                type: "sumTotalYearExpend",
                thisObj: this
            });
        }
    },

    components: {
        IEcharts
    },

    computed: {
        ...mapGetters(["consume"])
    },

    created() {
        console.log("consume created====================================");
        this.queryConsumeListByDate();
        this.queryConsumeCategoryIdByName("购物");
        this.queryConsumeCategoryIdByName("收入");
        this.queryConsumeBudget();
        this.sumBudget();
        this.queryBudgetByCurYearMonth();
        this.queryConsumeIncome();
        // this.sumCategoryConsume();
        this.sumConsumeCategoryOfAnalyze();
        this.sumConsumeTrend();
    },

    mounted() {
        console.log("consume mounted====================================");
        Scrollbar.init(document.querySelector("#Consume-Detail"));
        Scrollbar.init(document.querySelector("#consumeBudget"));
        Scrollbar.init(document.querySelector("#consumeAnalyze"));
        Scrollbar.init(document.querySelector("#consumeAnalyzeDetail"));
        Scrollbar.init(document.querySelector("#consumeTrend"));
        Scrollbar.init(document.querySelector("#consumeTrendDetailModal"));
        this.$Message.config({ top: 400, duration: 3 });
    }
};
</script>
<style lang='less'>
@import "../style/consume.less";
.echarts {
    width: 400px;
    height: 400px;
}
#incomeModal .ivu-modal-footer {
    display: none;
}

#consumeSettingModal .ivu-modal-footer {
    display: block;
}
</style>
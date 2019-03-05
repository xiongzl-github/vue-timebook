
<template>
    <div>
        <div style="width:1008px;height:46px;">
            <DatePicker size="large" @on-change="setReload" class="Dashboard-DatePicker" type="date" v-model="dashboard.curDateTime"></DatePicker>
        </div>

        <div style="display:inline-block;width:320px;height:620px;margin-right:20px;border-right: 1px solid #ddd;box-shadow: 0 0 5px #ccc;float:left">
            <div>
                <ButtonGroup style="float:left">
                    <Button v-on:click="showToday()" style="border-radius:0;width:140px" :type="dashboard.todayStyle">Today</Button>
                    <Button v-on:click="showTomorrow()" style="border-radius:0;width:140px" :type="dashboard.tomorrowStyle">Tomorrow</Button>
                </ButtonGroup>
                <el-dropdown @command="sortDashboardOfToday" style="display:inline-block;padding-top:10px">
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="time">自然时间</el-dropdown-item>
                        <el-dropdown-item command="urgency">紧急程度</el-dropdown-item>
                        <el-dropdown-item command="difficut">难易程度</el-dropdown-item>
                        <!-- <el-dropdown-item command="consumeTime">耗时长短</el-dropdown-item> -->
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div id="Dashboard-Today" style="width:auto;height:590px;border-radius: 0px;float:left;position: relative;">
                <!-- <div v-if="dashboard.todayStyle == 'primary'"> -->
                <div v-if="dashboard.things.length > 0 && item.dateType == 'curDate' && item.discardStatus == 0" v-for="(item, index) in dashboard.things" :key="index">
                    <div v-if="item.progressStatus == 0 || item.progressStatus == null" style="width:320px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <!-- <img :src="'/static/img/'+item.iconName" style="float:left;width:32px;height:32px;margin:9px 0 0 10px"> -->
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:240px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">
                                <span style="width:150px;overflow:hidden;display:inline-block;height:21px" :title="item.categoryName">{{item.categoryName}}</span>
                                <span style="overflow:hidden;display:inline-block;height:21px" v-if="item.endDate != '' && item.repeatType != 2 && item.repeatType != 3">
                                    (还剩
                                    <span style="color:red"> {{item.endTimeNum}}</span> 天)
                                </span>
                            </strong>
                            <strong v-if="item.listName.length <= 14" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:-5px 0 0px 10px;text-align:left">{{item.listName}}</strong>
                            <strong :title="item.listName" v-if="item.listName.length > 14" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:-5px 0 0px 10px;text-align:left">{{item.brifListName}}</strong>
                        </div>
                        <el-dropdown trigger="click" @command="updateProgressStatus" style="display:inline-block;padding-top:30px">
                            <span @click="dashboard.index = index" class="el-dropdown-link">
                                <Icon type="more"></Icon>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="item.progressStatus == null" :disabled="dashboard.taskStatusFlag" command="done">完成</el-dropdown-item>
                                <el-dropdown-item v-if="item.progressStatus == 0" command="done">完成</el-dropdown-item>
                                <!-- <el-dropdown-item v-if="item.progressStatus == null" :disabled="dashboard.taskStatusFlag" command="discard">废弃</el-dropdown-item>
                                <el-dropdown-item v-if="item.progressStatus == 0" command="discard">废弃</el-dropdown-item> -->
                                <el-dropdown-item command="discard">废弃</el-dropdown-item>
                                <el-dropdown-item command="modificat">
                                    <router-link to="/Home/TodoList">
                                        修改
                                    </router-link>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div v-if="item.progressStatus == 1" style="background:yellow;width:320px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <!-- <img :src="'/static/img/'+item.iconName" style="float:left;width:32px;height:32px;margin:9px 0 0 10px"> -->
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:240px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">
                                <span style="width:150px;overflow:hidden;display:inline-block;height:21px" :title="item.categoryName">{{item.categoryName}}</span>
                                <span style="overflow:hidden;display:inline-block;height:21px" v-if="item.endDate != ''  && item.repeatType != 2 && item.repeatType != 3">
                                    (还剩
                                    <span style="color:red"> {{item.endTimeNum}}</span> 天)
                                </span>
                            </strong>
                            <strong v-if="item.listName.length <= 14" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:-5px 0 0 10px;text-align:left">{{item.listName}}</strong>
                            <strong :title="item.listName" v-if="item.listName.length > 14" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:-5px 0 0 10px;text-align:left">{{item.brifListName}}</strong>
                        </div>
                        <el-dropdown trigger="click" @command="updateProgressStatus" style="display:inline-block;padding-top:30px">
                            <span @click="dashboard.index = index" class="el-dropdown-link">
                                <Icon type="more"></Icon>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="todo">未完成</el-dropdown-item>
                                <el-dropdown-item command="discard">废弃</el-dropdown-item>
                                <el-dropdown-item command="modificat">
                                    <router-link to="/Home/TodoList">
                                        修改
                                    </router-link>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>

                </div>
            </div>

            <div id="Dashboard-Tomorrow" style="width:auto;height:590px;border-radius: 0px;float:left;position: relative;">
                <div v-if="dashboard.things.length > 0 && item.dateType == 'nextDay' && item.discardStatus == 0" v-for="(item, i) in dashboard.things" :key="i">
                    <div v-if="item.progressStatus == 0 || item.progressStatus == null" style="width:320px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <!-- <img :src="'/static/img/'+item.iconName" style="float:left;width:32px;height:32px;margin:9px 0 0 10px"> -->
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:240px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">
                                <span style="width:150px;overflow:hidden;display:inline-block;height:21px" :title="item.categoryName">{{item.categoryName}}</span>
                                <span style="overflow:hidden;display:inline-block;height:21px" v-if="item.endDate != ''  && item.repeatType != 2 && item.repeatType != 3">
                                    (还剩
                                    <span style="color:red"> {{item.endTimeNum}}</span> 天)
                                </span>
                            </strong>
                            <strong v-if="item.listName.length <= 14" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:-5px 0 0 10px;text-align:left">{{item.listName}}</strong>
                            <strong :title="item.listName" v-if="item.listName.length > 14" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:-5px 0 0 10px;text-align:left">{{item.brifListName}}</strong>
                        </div>
                        <el-dropdown trigger="click" @command="updateProgressStatus" style="display:inline-block;padding-top:30px">
                            <span @click="dashboard.index = i" class="el-dropdown-link">
                                <Icon type="more"></Icon>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="item.progressStatus == null" :disabled="dashboard.taskStatusFlag" command="done">完成</el-dropdown-item>
                                <el-dropdown-item v-if="item.progressStatus == 0" command="done">完成</el-dropdown-item>
                                <!-- <el-dropdown-item v-if="item.progressStatus == null" :disabled="dashboard.taskStatusFlag" command="discard">废弃</el-dropdown-item>
                                <el-dropdown-item v-if="item.progressStatus == 0" command="discard">废弃</el-dropdown-item> -->
                                <el-dropdown-item command="discard">废弃</el-dropdown-item>
                                <el-dropdown-item command="modificat">
                                    <router-link to="/Home/TodoList">
                                        修改
                                    </router-link>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div v-if="item.progressStatus == 1" style="background:yellow;width:320px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <!-- <img :src="'/static/img/'+item.iconName" style="float:left;width:32px;height:32px;margin:9px 0 0 10px"> -->
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:240px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.categoryName}}
                                <span style="width:150px;overflow:hidden;display:inline-block;height:21px" :title="item.categoryName">{{item.categoryName}}</span>
                                <span style="overflow:hidden;display:inline-block;height:21px" v-if="item.endDate != ''  && item.repeatType != 2 && item.repeatType != 3">
                                    (还剩
                                    <span style="color:red"> {{item.endTimeNum}}</span> 天)
                                </span>
                            </strong>
                            <strong v-if="item.listName.length <= 14" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:-5px 0 0 10px;text-align:left">{{item.listName}}</strong>
                            <strong :title="item.listName" v-if="item.listName.length > 14" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:-5px 0 0 10px;text-align:left">{{item.brifListName}}</strong>
                        </div>
                        <el-dropdown trigger="click" @command="updateProgressStatus" style="display:inline-block;padding-top:30px">
                            <span @click="dashboard.index = i" class="el-dropdown-link">
                                <Icon type="more"></Icon>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="todo">未完成</el-dropdown-item>
                                <el-dropdown-item command="discard">废弃</el-dropdown-item>
                                <el-dropdown-item command="modificat">
                                    <router-link to="/Home/TodoList">
                                        修改
                                    </router-link>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>

        </div>
        <div style="display:inline-block;width:300px;height:620px;margin-right:18px;border-right: 1px solid #ddd;box-shadow: 0 0 5px #ccc;">
            <div>
                <Button style="border-radius:0px;width:300px;float:left" type="success">Summary</Button>
            </div>
            <div id="Dashboard-Summary" style="width:auto;height:590px;border-radius: 0px;float:left">
                <div v-for="(item, index) in dashboard.summarys" :key="index" style="width:300px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                    <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                    <div v-if="item.group == '工作'" style="width:300px;display:inline-block:float:left">
                        <strong v-if="item.project == null" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.group}} </strong>
                        <strong v-if="item.project != null" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.group}} ({{item.project}})</strong>
                        <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">{{item.module}}-{{item.stage}}: {{item.progress}}%</strong>
                    </div>
                    <div style="width:300px;display:inline-block:float:left">
                        <strong v-if="item.group != '工作'" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.group}}</strong>
                        <strong v-if="item.group == '购物'" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">当天累计消费: ￥{{item.consume}}.00</strong>
                        <strong v-if="item.group == '笔记'" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">当天整理笔记数: {{item.noteNum}}条</strong>
                        <strong v-if="item.group == '运动'" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">当天运动时长: {{item.sportTime}}min</strong>
                        <strong v-if="item.group == '早起'" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">当天早起时间: {{item.getupTime}}</strong>
                        <strong v-if="item.group == '晚睡'" style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">当天晚睡时间: {{item.sleepTime}}</strong>
                    </div>
                </div>
            </div>
        </div>
        <div style="display:inline-block;width:340px;height:620px;border-right: 1px solid #ddd;box-shadow: 0 0 5px #ccc;float:right">
            <div>
                <ButtonGroup style="float:left">
                    <Button v-on:click="showTarget" style="border-radius:0;width:170px" :type="dashboard.showStyle">
                        <Icon style="font-size:14px;" type="eye"></Icon> Target
                    </Button>
                    <Button v-on:click="hiddenTarget" style="border-radius:0;width:170px" :type="dashboard.hiddenStyle">
                        <Icon style="font-size:14px" type="eye-disabled"></Icon> Target
                    </Button>
                </ButtonGroup>
            </div>
            <div id="Dashboard-Target" style="width:auto;height:590px;border-radius: 0px;float:left">
                <div v-for="(item, index) in dashboard.targets" :key="index" style="width:340px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                    <img src="../assets/img/target.png" style="float:left;width:32px;height:32px;margin:10px 0 0 10px;">
                    <strong v-on:click="showTargetDetail(index)" v-if="item.dayNum >= 0" :title="item.target" style="cursor:pointer;text-align:left;width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0 0 10px">
                        {{item.briefTarget}} (还剩
                        <span style="color:red">{{item.dayNum}}</span> 天)
                    </strong>
                    <strong v-on:click="showTargetDetail(index)" v-if="item.dayNum < 0" :title="item.target" style="cursor:pointer;text-align:left;width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0 0 10px">
                        {{item.briefTarget}}(延期
                        <span style="color:red">{{item.absDayNum}}</span> 天)
                    </strong>
                    <span v-on:click="showTargetDetail(index)" v-if="item.completeStatus == 1">
                        <Progress :hide-info=false style="cursor:pointer;float:left;margin-left:-5px;display:inline-block;width:240px;color:#1D8CE0;font-weight:bolder" :percent="item.progress" status="normal"></Progress>
                        <img src="../assets/img/success.png" title="达成" style="float:left;width:20px;height:20px;">
                    </span>
                    <span v-on:click="showTargetDetail(index)" v-if="item.completeStatus == 2">
                        <Progress :hide-info=false style="cursor:pointer;float:left;margin-left:-5px;display:inline-block;width:240px;color:#1D8CE0;font-weight:bolder" :percent="item.progress" status="normal"></Progress>
                        <img src="../assets/img/doing.png" title="进行中" style="float:left;width:20px;height:20px;">
                    </span>
                    <span v-on:click="showTargetDetail(index)" v-if="item.completeStatus == 3">
                        <Progress :hide-info=false style="cursor:pointer;float:left;margin-left:-5px;display:inline-block;width:240px;color:#1D8CE0;font-weight:bolder" :percent="item.progress" status="normal"></Progress>
                        <img src="../assets/img/delay.png" title="延期" style="float:left;width:20px;height:20px;">
                    </span>
                    <el-dropdown trigger="click" @command="changeTargetStatus" style="display:inline-block;text-align:right;float:right;margin:-8px 10px 0 0">
                        <span @click="dashboard.index = index" class="el-dropdown-link">
                            <Icon style="font-size:18px" type="more"></Icon>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="reason">原因</el-dropdown-item>
                            <el-dropdown-item command="hidden" v-if="item.show == 1">隐藏</el-dropdown-item>
                            <el-dropdown-item command="show" v-if="item.show == 0">显示</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <Modal :mask-closable="false" v-model="dashboard.targetReasonModal" style="" @on-ok="addTargetReason" :styles="{top: '300px', width:'700px'}" title="添加原因!">
            <div style="width:668px;height:400px;">
                <div id="Dashboard-Target-All-Reason" style="float:left;width:200px;height:400px;display:inline-block;border-right: 1px solid #ddd;">
                    <div style="width:200px;height:400px;padding:10px;">
                        <h4 v-on:click="pushTargetReason(index)" style="cursor:pointer;width:180px;height:30px;font-weight:bolder;font-size:14px" v-for="(item, index) in dashboard.allTargetReasons" :key="index">
                            {{item.reason}}
                        </h4>
                    </div>
                </div>
                <div style="float:right;width:450px;height:110px;display:inline-block;margin-bottom:15px;">
                    <h3 style="margin-bottom:5px">原因: </h3>
                    <el-autocomplete size="small" style="width:450px;height:50px" v-model="dashboard.targetReason" :fetch-suggestions="queryReasons" placeholder="请输入原因" :trigger-on-focus="false" @select="reasonSelect"></el-autocomplete>
                    <Button v-on:click="addReason" style="float:right" type="success">添加</Button>
                </div>
                <div id="Dashboard-Target-Reason" style="float:right;width:450px;height:275px;display:inline-block;padding:10px;border-top: 1px solid #ddd;">
                    <Tag v-on:on-close="closeTargetReason(index)" style="margin-right:10px;margin-bottom:10px" v-for="(item, index) in dashboard.targetReasons" :key="index" type="dot" closable color="green">{{item.reason}}</Tag>
                </div>
            </div>
        </Modal>
        <Modal :mask-closable="false" v-model="dashboard.targetDetailModal" :styles="{top: '200px'}" title="目标详情">
            <h3 style="text-align:center;margin-bottom:10px">Target: {{dashboard.targetStr}}</h3>
            <div id="Dashboard-Target-Detail" style="width:490px;height:400px;">
                <div v-for="(item, index) in dashboard.targetDetailList" :key="index" style="width:490px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                    <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:10px 0 0 10px;">
                    <strong style="text-align:left;width:390px;font-size:14px;font-weight:bolder;float:left;margin:5px 0 0 10px">
                        {{item.listName}}
                    </strong>
                    <span v-if="item.progress == 100">
                        <Progress :hide-info=false style="float:left;margin-left:10px;display:inline-block;width:410px;color:#1D8CE0;font-weight:bolder" :percent="item.progress" status="normal"></Progress>
                        <img src="../assets/img/success.png" title="达成" style="float:left;width:24px;height:24px;margin:-8px 0 0 -10px">
                    </span>
                    <span v-if="item.progress >= 1 && item.progress < 100">
                        <Progress :hide-info=false style="float:left;margin-left:10px;display:inline-block;width:410px;color:#1D8CE0;font-weight:bolder" :percent="item.progress" status="normal"></Progress>
                        <img src="../assets/img/doing.png" title="进行中" style="float:left;width:24px;height:24px;margin:-8px 0 0 -10px">
                    </span>
                    <span v-if="item.progress == 0">
                        <Progress :hide-info=false style="float:left;margin-left:10px;display:inline-block;width:410px;color:#1D8CE0;font-weight:bolder" :percent="item.progress" status="normal"></Progress>
                        <img src="../assets/img/not_start.png" title="未开始" style="float:left;width:24px;height:24px;margin:-8px 0 0 -10px">
                    </span>
                </div>
            </div>
        </Modal>
    </div>

</template>

<script>
import { mapGetters, mapState } from "vuex";
import Scrollbar from "smooth-scrollbar";
import { setTimeout, setInterval } from "timers";
import * as util from "@/utils/util.js";

var ps = {};
export default {
    data() {
        return {};
    },

    components: {},

    computed: {
        ...mapGetters(["dashboard"])
    },

    watch: {},

    created() {
        console.log("dashboard created====================================");
        // 获取当天所有的todolist
        if (this.dashboard.isReload == 1) {
            this.queryDashboardDetailByDate();
        }
        this.$Message.config({ top: 400, duration: 3 });
    },

    mounted() {
        console.log("dashboard mounted====================================");
        this.showToday();
        Scrollbar.init(document.querySelector("#Dashboard-Today"));
        Scrollbar.init(document.querySelector("#Dashboard-Tomorrow"));
        Scrollbar.init(document.querySelector("#Dashboard-Summary"));
        Scrollbar.init(document.querySelector("#Dashboard-Target"));
        Scrollbar.init(document.querySelector("#Dashboard-Target-Detail"));
        Scrollbar.init(document.querySelector("#Dashboard-Target-Reason"));
        Scrollbar.init(document.querySelector("#Dashboard-Target-All-Reason"));
    },

    methods: {
        showToday() {
            document.getElementById("Dashboard-Tomorrow").style.display =
                "none";
            document.getElementById("Dashboard-Today").style.display = "block";
            this.dashboard.todayStyle = "primary";
            this.dashboard.tomorrowStyle = "ghost";
        },
        showTomorrow() {
            document.getElementById("Dashboard-Tomorrow").style.display =
                "block";
            document.getElementById("Dashboard-Today").style.display = "none";
            this.dashboard.todayStyle = "ghost";
            this.dashboard.tomorrowStyle = "primary";
        },
        closeTargetReason(index) {
            this.$store.dispatch({
                type: "closeTargetReason",
                thisObj: this,
                index: index
            });
        },
        pushTargetReason(index) {
            let reasonObj = this.dashboard.allTargetReasons[index];
            let flag = false;
            this.dashboard.targetReasons.forEach(element => {
                if (reasonObj.id == element.id) {
                    flag = true;
                }
            });
            if (!flag) {
                this.$store.dispatch({
                    type: "pushTargetReason",
                    thisObj: this,
                    reasonObj: reasonObj
                });
            }
        },
        addTargetReason() {
            this.$store.dispatch({
                type: "addTargetReason",
                thisObj: this
            });
        },
        queryReasons(queryStr, cb) {
            let results = [];
            let flag = false;
            this.dashboard.allTargetReasons.forEach(ele => {
                if (
                    ele.reason.toLowerCase().indexOf(queryStr.toLowerCase()) >=
                    0
                ) {
                    this.dashboard.targetReasons.forEach(obj => {
                        if (ele.id == obj.id) {
                            flag = true;
                        }
                    });
                    if (!flag) {
                        results.push(ele);
                    }
                    flag = false;
                }
            });
            cb(results);
        },
        queryAllReasons() {
            this.$store.dispatch({
                type: "queryAllReasons",
                thisObj: this
            });
        },
        queryTargetReasons(reasonIds) {
            this.$store.dispatch({
                type: "queryTargetReasons",
                thisObj: this,
                reasonIds: reasonIds
            });
        },
        reasonSelect(item) {
            this.$store.dispatch({
                type: "reasonSelect",
                thisObj: this,
                reasonObj: item
            });
        },
        showTargetDetail(index) {
            this.$store.dispatch({
                type: "showTargetDetail",
                thisObj: this,
                index: index
            });
            this.reloadPage();
        },
        hiddenTarget() {
            this.$store.dispatch({
                type: "hiddenTarget",
                thisObj: this
            });
        },
        showTarget() {
            this.$store.dispatch({
                type: "showTarget",
                thisObj: this
            });
            this.dashboard.showStyle = "primary";
            this.dashboard.hiddenStyle = "ghost";
        },
        jumpToTodoList() {
            this.$store.state.home.home.activeName = "TodoList";
        },
        changeTargetStatus(command) {
            if (command == "reason") {
                this.queryAllReasons();
                let reasonIds = this.dashboard.targets[this.dashboard.index]
                    .reasonIds;
                if ("" != reasonIds && null != reasonIds) {
                    this.queryTargetReasons(reasonIds);
                }
                this.dashboard.targetReasonModal = true;
            } else if (command == "show") {
                // this.dashboard.targets[this.dashboard.index].show = 1;
                this.$store.dispatch({
                    type: "changeTargetStatus",
                    thisObj: this,
                    show: 1
                });
                this.reloadPage();
            } else if (command == "hidden") {
                // this.dashboard.targets[this.dashboard.index].show = 0;
                this.$store.dispatch({
                    type: "changeTargetStatus",
                    thisObj: this,
                    show: 0
                });
                this.reloadPage();
            }
        },
        addReason() {
            this.$store.dispatch({
                type: "addReason",
                thisObj: this
            });
            this.queryAllReasons();
        },
        sortDashboardOfToday(command) {
            let curThingArr = [];
            let nextThingArr = [];
            this.dashboard.things.forEach(item => {
                if (item.dateType == "curDate") {
                    curThingArr.push(item);
                } else {
                    nextThingArr.push(item);
                }
            });
            if (this.dashboard.todayStyle == "primary") {
                if (command == "time") {
                    curThingArr.sort(util.sortByTimeOfThings);
                } else if (command == "urgency") {
                    curThingArr.sort(util.sortByUrgencyOfThings);
                } else if (command == "difficut") {
                    curThingArr.sort(util.sortByDifficutOfThings);
                } else if (command == "consumeTime") {
                    curThingArr.sort(util.sortByConsumeTimeOfThings);
                }
            } else {
                if (command == "time") {
                    nextThingArr.sort(util.sortByTimeOfThings);
                } else if (command == "urgency") {
                    nextThingArr.sort(util.sortByUrgencyOfThings);
                } else if (command == "difficut") {
                    nextThingArr.sort(util.sortByDifficutOfThings);
                } else if (command == "consumeTime") {
                    nextThingArr.sort(util.sortByConsumeTimeOfThings);
                }
            }
            this.dashboard.things.splice(0, this.dashboard.things.length);
            this.dashboard.things = curThingArr.concat(nextThingArr);
            this.dashboard.isReload = 0;
            this.reloadPage();
        },
        setReload() {
            this.dashboard.isReload = 1;
            this.reloadPage();
        },
        discardTask(todolistId, todolistDate, discardStatus) {
            this.$store.dispatch({
                type: "discardTask",
                thisObj: this,
                todolistId: todolistId,
                todolistDate: todolistDate,
                discardStatus: discardStatus
            });
        },
        deleteListTaskById(id) {
            this.$store.dispatch({
                type: "deleteListTaskById",
                thisObj: this,
                id: id
            });
        },
        updateProgressStatus(command) {
            if (command == "modificat") {
                this.$store.state.home.home.activeName = "TodoList";
                return;
            } else if (command == "discard") {
                this.$confirm("确定删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        let listObj = this.dashboard.things[
                            this.dashboard.index
                        ];
                        let todolistDate = this.dashboard.curDateTime.format(
                            "yyyy-MM-dd"
                        );
                        if (listObj.repeatType != 0) {
                            this.discardTask(
                                listObj.id,
                                todolistDate,
                                listObj.discardStatus
                            );
                        } else {
                            this.deleteListTaskById(listObj.id);
                        }
                        return;
                    })
                    .catch(() => {});
            }
            this.$store.dispatch({
                type: "updateProgressStatus",
                thisObj: this,
                command: command
            });
            this.reloadPage();
        },
        getTodolistByDate() {
            this.$store.dispatch({
                type: "getTodolistByDate",
                thisObj: this
            });
        },
        getTodolistByDateOfDashboard() {
            this.$store.dispatch({
                type: "getTodolistByDateOfDashboard",
                thisObj: this
            });
        },
        getTodolistByNextDate() {
            this.$store.dispatch({
                type: "getTodolistByNextDate",
                thisObj: this
            });
        },
        getTotalConsumeByDate() {
            this.$store.dispatch({
                type: "getTotalConsumeByDate",
                thisObj: this
            });
        },
        getTotalNoteByDate() {
            this.$store.dispatch({
                type: "getTotalNoteByDate",
                thisObj: this
            });
        },
        getTotalSportTimeByDate() {
            this.$store.dispatch({
                type: "getTotalSportTimeByDate",
                thisObj: this
            });
        },
        getGetupTimeByDate() {
            this.$store.dispatch({
                type: "getGetupTimeByDate",
                thisObj: this
            });
        },
        getSleepTimeByDate() {
            this.$store.dispatch({
                type: "getSleepTimeByDate",
                thisObj: this
            });
        },
        getWorkProgressByDate() {
            this.$store.dispatch({
                type: "getWorkProgressByDate",
                thisObj: this
            });
        },

        getSummaryByDate() {
            this.$store.dispatch({
                type: "getSummaryByDate",
                thisObj: this
            });
        },
        getTargetByDate() {
            this.$store.dispatch({
                type: "getTargetByDate",
                thisObj: this
            });
        },
        queryDashboardDetailByDate(curDateTime) {
            this.getTodolistByDateOfDashboard();
            this.getSummaryByDate();
            this.getTargetByDate();
        },
        reloadPage() {
            //let value = this.$store.state.home.home.isRouterAlive;
            this.$store.state.home.home.isRouterAlive = false;
            this.$nextTick(
                () => (this.$store.state.home.home.isRouterAlive = true)
            );
        }
    }
};
</script>
<style lang='less'>
@import "../style/dashboard.less";
</style>
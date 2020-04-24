<!--  -->
<template>
    <Tabs value="name01">
        <TabPane name="name01" label="目标制定" icon="disc">
            <div>
                <div class="Target-Left">
                    <div style="width:auto;height:45px">
                        <ButtonGroup style="float:left">
                            <Button @click="queryDoingTarget()" style="border-radius:0;width:101px" :type="target.doingStyle">Doing</Button>
                            <Button style="border-radius:0;width:100px" :type="target.todoStyle">ToDo</Button>
                            <Button style="border-radius:0;width:101px" :type="target.doneStyle">Done</Button>
                        </ButtonGroup>
                    </div>
                    <div id="Target-Left-TimeLine" style="width:302px; padding:8px;text-align:left;height:555px;">
                        <Timeline style="width:auto;height:545px;">
                            <span v-if='target.doingStyle == "primary"'>
                                
                            </span>
                            <span v-if='target.todoStyle == "primary"'>

                            </span>
                            <span v-if='target.doneStyle == "primary"'>

                            </span>
                        </Timeline>
                    </div>
                </div>

                <div class="TimeMachine-Right">
                    <div class="TimeMachine-Right-Header">
                        <strong>目标清单</strong>
                        <DatePicker class="TimeMachine-Right-Header-DatePicker" type="date" v-model="period.curDateTime"></DatePicker>
                    </div>

                    <div class="Target-Steps">
                        <template>
                            <Steps :current=theme.current>
                                <span style="cursor:pointer" @click="nextStep(0)"><Step title="第一步" content="请写出你的目标"></Step></span>
                                <span style="cursor:pointer" @click="nextStep(1)"><Step title="第二步" content="分解你的目标吧"></Step></span>
                                <span style="cursor:pointer" @click="nextStep(2)"><Step title="第三步" content="去完成你的目标吧"></Step></span>
                            </Steps>
                        </template>
                    </div>

                    <div id="Target-Step-First" class="Target-Step" style="display:block">
                        <div style="width:auto;height:35px;margin-bottom:10px">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">主题: </h3>
                            <Input v-model="theme.theme" style="width: 510px;float:left"/>
                        </div>
                        <div style="width:auto;height:35px;margin-bottom:10px">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">目标: </h3>
                            <Input v-model="theme.target" style="width: 510px;float:left"/>
                        </div>
                        <div style="width:auto;height:35px;margin-bottom:10px">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">期数: </h3>
                            <InputNumber :readonly="true" v-model="period.period" style="width: 510px;float:left"/>
                        </div>
                        <div style="width:auto;height:35px;">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;">每天可用时间: </h3>
                            <InputNumber v-model="period.availableTime" style="width: 170px;float:left">
                                <span slot="append">hour</span>
                            </InputNumber>
                            <Button @click="setTime(0.5, 1, 0)" type="info" shape="circle">0.5H</Button>
                            <Button @click="setTime(1, 1, 0)" type="info" shape="circle">1H</Button>
                            <Button @click="setTime(2, 1, 0)" type="info" shape="circle">2H</Button>
                            <Button @click="setTime(4, 1, 0)" type="info" shape="circle">4H</Button>
                            <Button @click="setTime(6, 1, 0)" type="info" shape="circle">6H</Button>
                            <Button @click="setTime(8, 1, 0)" type="info" shape="circle">8H</Button>
                        </div>
                        <div style="width:auto;height:35px;">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">优先级: </h3>
                            <RadioGroup v-model="period.priority" style="float:left ;font-size: 22px;font-weight: 500;">
                                <Radio label="1" value="1">重要且紧急</Radio>
                                <Radio label="2" value="2">紧急不重要</Radio>
                                <Radio label="3" value="3">重要不紧急</Radio>
                                <Radio label="4" value="4">不紧急不重要</Radio>
                            </RadioGroup>
                        </div>
                        <div style="width:auto;height:35px;margin-bottom:10px">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">规划: </h3>
                            <RadioGroup v-model="period.planning" style="float:left;font-size: 22px;font-weight: 500;">
                                <Radio label="1" value="1">马上做</Radio>
                                <Radio label="0" value="0">考虑中</Radio>
                            </RadioGroup>
                        </div>
                    </div>

                    <div id="Target-Step-Second" style="display:none" class="Target-Step">
                        <div style="display:block;width:620px;height:50px;margin-bottom:10px">
                            <i-button style="float:left;margin-top:10px;width:620px;display:block" type="primary">批量导入子任务</i-button>
                        </div>
                        <div id="Target-Step-Second-ChildTarget" style="width:640px;height:420px;background:#fff">
                            <div style="width:620px;height:10px"></div>
                            <div v-for="(item, index) in target.childTargets" :key="index" style="margin-bottom:15px;padding-top:10px;border-right: 1px solid #ddd;box-shadow: 0 0 5px #ccc;width:620px;height:96px;">
                                <div style="width:620px;height:34px;margin-bottom:10px;">
                                    <h3 style="line-height:34px;display:inline-block;float:left;margin-right:10px;width:46px;text-align:right">子目标: </h3>
                                    <Input v-model="item.target" style="width: 546px;float:left;margin-right:10px"/>
                                    <span @click="deleteChildTarget(index)" style="float:right;margin-top:-52px;margin-right:-6px;cursor:pointer">
                                        <Icon style="font-size:20px;color:black" type="close-circled"></Icon>
                                    </span>
                                </div>
                                <div style="width:620px;height:34px;display:block">
                                    <h3 style="line-height:34px;display:inline-block;float:left;margin-right:10px;width:46px;text-align:right">耗时: {{index}}</h3>
                                    <InputNumber v-model="item.consumeTime" style="width: 200px;float:left; margin-right:12px">
                                        <span slot="append">hour</span>
                                    </InputNumber>
                                    <Button @click="setTime(0.5, 2, index)" type="info" shape="circle">0.5H</Button>
                                    <Button @click="setTime(1, 2, index)" type="info" shape="circle">1H</Button>
                                    <Button @click="setTime(2, 2, index)" type="info" shape="circle">2H</Button>
                                    <Button @click="setTime(4, 2, index)" type="info" shape="circle">4H</Button>
                                    <Button @click="setTime(6, 2, index)" type="info" shape="circle">6H</Button>
                                    <Button @click="setTime(8, 2, index)" type="info" shape="circle">8H</Button>
                                </div>
                            </div>
                            <div style="width:620px;height:37px;float:left;margin-top:-10px">
                                <span style="cursor:pointer, width:37px;height:37px" @click="addChildTarget">
                                    <Icon style="font-size:36px;float:right;color:black;" type="plus-circled"></Icon>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div id="Target-Step-Third" style="display:none" class="Target-Step">
                        <div style="width:auto;height:35px;margin-bottom:10px">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">主题: </h3>
                            <Input v-model="theme.theme" style="width: 510px;float:left"/>
                        </div>
                        <div style="width:auto;height:35px;margin-bottom:10px">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">目标: </h3>
                            <Input v-model="theme.target" style="width: 510px;float:left"/>
                        </div>
                        <div style="width:auto;height:35px;margin-bottom:10px">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">期数: </h3>
                            <InputNumber :readonly="true" v-model="period.period" style="width: 510px;float:left"/>
                        </div>
                        <div style="width:auto;height:35px;">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;">每天可用时间: </h3>
                            <InputNumber v-model="period.availableTime" style="width: 510px;float:left"/>
                        </div>
                        <div style="width:auto;height:35px;">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">优先级: </h3>
                            <RadioGroup v-model="period.priority" style="float:left;font-size: 22px;font-weight: 500;">
                                <Radio label="1" value="1">重要且紧急</Radio>
                                <Radio label="2" value="2">紧急不重要</Radio>
                                <Radio label="3" value="3">重要不紧急</Radio>
                                <Radio label="4" value="4">不紧急不重要</Radio>
                            </RadioGroup>
                        </div>
                        <div style="width:auto;height:35px;margin-bottom:10px">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">规划: </h3>
                            <RadioGroup v-model="period.planning" style="float:left;font-size: 22px;font-weight: 500;">
                                <Radio label="1" value="1">马上做</Radio>
                                <Radio label="0" value="0">考虑中</Radio>
                            </RadioGroup>
                        </div>
                        <div style="width:auto;height:35px;margin-bottom:10px;">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">子目标: </h3>
                            <Button @click="showChildTargetDetail" icon="ios-paper" style="float:left">查看详情</Button>
                        </div>
                        <div style="width:auto;height:35px;margin-bottom:10px">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">总用时: </h3>
                            <Input v-model="target.totalTime" style="width: 510px;float:left"/>
                        </div>
                        <div style="width:auto;height:35px;">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">截止时间: </h3>
                            <div style="float:left;">
                                <DatePicker placement="top-start" v-model="period.deadline" type="date" size="default" format="yyyy-MM-dd" style="width: 510px"></DatePicker>
                            </div>
                        </div>
                        <div style="width:auto;height:35px;margin-bottom:10px">
                            <h3 style="line-height:35px;display:inline-block;float:left;margin-right:10px;width:90px;text-align:right">是否完成: </h3>
                            <RadioGroup v-model="period.isCompleted" style="float:left;font-size: 22px;font-weight: 500;">
                                <Radio label="1" value="1">是</Radio>
                                <Radio label="0" value="0">否</Radio>
                            </RadioGroup>
                        </div>
                        <div style="margin-bottom:10px; margin-top:20px">
                            <!-- <span v-if="target.type == 1">
                                <Button style="margin-right:10px" type="primary" @click="submitTarget">
                                    <span>submit</span>
                                </Button>
                            </span>
                            <span v-if="target.type == 2">
                                <Button style="margin-right:10px" type="primary" @click="updateTarget">
                                    <span>update</span>
                                </Button>
                            </span> -->
                            <Button style="margin-right:10px" type="primary" @click="addTarget">
                                <span>submit</span>
                            </Button>
                            <Button v-on:click="resetTarget">reset</Button>

                            <Modal id="childTargetModal" :mask-closable="false" v-model="theme.childTargetsModal" :styles="{top: '300px'}" title="子目标详情!">
                                <div style="width:488px;height:335px;">
                                    <h3 style="line-height:35px; text-align:center;width:488px;font-weight:16px">子目标</h3>
                                    <div style="width:488px;height:300px" id="Target-ChildTargetModal">
                                        <span style="font-size:14px; display:block; width:488px; font-weight:500;margin-bottom:10px" v-for="(item, index) in childTargets" :key="index">
                                            <span>{{index + 1}}. {{item.target}}</span>
                                            <span style="float:right">{{item.consumeTime}}H</span>
                                        </span>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </TabPane>
        <!-- <TabPane name="name02" label="时光梳理" icon="social-windows">two</TabPane>
        <TabPane name="name03" label="时光分析" icon="social-tux">trhee</TabPane> -->
    </Tabs>
</template>

<script>
import Scrollbar from "smooth-scrollbar";
import * as util from "../utils/util";
import * as dbUtil from "../utils/dbUtil";
import { mapGetters, mapState } from "vuex";
import types from "@/store/types";
import { setInterval } from "timers";

export default {
    computed: {
        ...mapGetters(["target", "childTarget", "childTargets", "timeMachine", 'theme', 'period', 'periodTarget'])
    },
    data() {
        return {   
            
        };
    },

    methods: {
        queryDoingTarget(){
            this.$store.dispatch({
                type: 'queryDoingTarget',
                thisObj: this
            })
        },
        addTarget(){
            this.$store.dispatch({
                type: 'addTarget',
                thisObj: this
            })
        },
        deleteChildTarget(index){
            this.target.childTargets.splice(index, 1);
        },
        showChildTargetDetail(){
            this.theme.childTargetsModal = true;
        },
        setTime(value, type, index){
            if (type == 1) {
                this.period.availableTime = value;
            } else if (type == 2) {
                this.target.childTargets[index].consumeTime = value;
            }
        },
        switchChildTarget(uuid){
            this.childTarget.uuid = uuid;
            this.reloadPage();
        },
        resetChildTarget(){
            this.$store.dispatch({
                type: 'resetChildTarget',
                thisObj: this
            })
            this.nextStep(this.theme.current)
        },
        // 关闭检查点弹框
        closeCheckPointModal(){
            this.checkPoint.uuid = '';
            this.childTarget.uuid = '';
            this.checkPoint.checkPoint = '';
            this.childTarget.target = '';
            this.nextStep(this.theme.current);
        },
        // 删除检查点
        deleteCheckPoint(index) {
            this.$store.dispatch({
                type: "deleteCheckPoint",
                thisObj: this,
                index: index
            })
        },
        // 添加检查点
        addCheckPoint(){
            this.$store.dispatch({
                type: "addCheckPoint",
                thisObj: this
            });
            this.reloadPage();
        },
        // 添加子目标
        addChildTarget(){
            this.$store.dispatch({
                type: "addChildTarget",
                thisObj: this
            });
            this.reloadPage();
        },
        viewChildTargetDetail(){
            this.$store.dispatch({
                type: 'viewChildTargetDetail',
                thisObj: this
            })
        },
        viewCheckPointDetail(targetName, uuid){
            this.$store.dispatch({
                type: "viewCheckPointDetail",
                thisObj: this,
                targetName, targetName,
                uuid, uuid
            });
            this.reloadPage();
        },
        nextStep(step){
            if(step == 0) {
                this.theme.current = step;
                document.getElementById("Target-Step-First").style.display = "block";
                document.getElementById("Target-Step-Second").style.display = "none";
                document.getElementById("Target-Step-Third").style.display = "none";
            } else if(step == 1) {
                this.theme.current = step;
                document.getElementById("Target-Step-First").style.display = "none";
                document.getElementById("Target-Step-Second").style.display = "block";
                document.getElementById("Target-Step-Third").style.display = "none";
            } else {
                let flag = false;
                for (let index = 0; index < this.target.childTargets.length; index++) {
                    let ele = this.target.childTargets[index];
                    if (ele.target == '') {
                        flag = true;
                        break;
                    }
                }
                if(flag) {
                    this.$Message.warning({
                        content: "请输入子目标!"
                    });
                } else {
                    this.theme.current = step;
                    document.getElementById("Target-Step-First").style.display = "none";
                    document.getElementById("Target-Step-Second").style.display = "none";
                    document.getElementById("Target-Step-Third").style.display = "block";
                    this.childTargets.splice(0, this.childTargets.length);
                    this.target.totalTime = 0;
                    this.period.deadline = '';
                    this.target.childTargets.forEach(ele => {
                        if(ele.target != '') {
                            this.childTargets.push(ele);
                            this.target.totalTime += ele.consumeTime;
                        }
                    });
                    let days = 0;
                    if (this.target.totalTime % this.period.availableTime == 0) {
                        days = this.target.totalTime / this.period.availableTime;
                    } else {
                        days = parseInt(this.target.totalTime / this.period.availableTime) + 1;
                    }
                    let date = new Date();
                    date.setTime(date.getTime()+24*60*60*1000*days);
                    let tempDate = date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate();
                    this.period.deadline = tempDate;
                }
            }
        },
        resetTarget() {
            this.$store.dispatch({
                type: "resetTarget",
                thisObj: this,
                timeMachine: this.timeMachine
            });
        },
        updateTarget() {
            this.$store.dispatch({
                type: "updateTarget",
                thisObj: this,
                timeMachine: this.timeMachine
            });
            this.reloadPage();
        },
        setTargetInfo(index) {
            this.$store.dispatch({
                type: "setTargetInfo",
                thisObj: this,
                index: index,
                timeMachine: this.timeMachine
            });
            this.reloadPage();
        },
        deleteTargetById(id) {
            this.$store.dispatch({
                type: "deleteTargetById",
                thisObj: this,
                id: id
            });
            this.reloadPage();
        },
        queryAllTarget(status) {
            if (status == 1) {
                this.target.style = "primary";
                this.target.doneStyle = "ghost";
            } else if (status == 0) {
                this.target.style = "ghost";
                this.target.doneStyle = "primary";
            }
            this.$store.dispatch({
                type: "queryAllTarget",
                thisObj: this,
                status: status
            });
        },

        submitTarget() {
            this.$nextTick(() => {
                this.$store.dispatch({
                    type: "submitTarget",
                    thisObj: this,
                    timeMachine: this.timeMachine
                });
            });
            this.reloadPage();
        },
        queryTags(query) {
            if (query !== "") {
                this.timeMachine.loadingTagStatus = true;
                setTimeout(() => {
                    this.timeMachine.loadingTagStatus = false;
                    this.$store.dispatch({
                        type: "queryTags",
                        thisObj: this,
                        query: query
                    });
                }, 200);
            } else {
                this.timeMachine.searchedTags = [];
            }
        },
        queryAllTags() {
            this.$store.dispatch({
                type: "queryAllTags",
                thisObj: this
            });
        },
        addTag() {
            if (this.timeMachine.tagName == "") {
                return;
            }
            this.$nextTick(() => {
                this.$store.dispatch({
                    type: "addTag",
                    thisObj: this
                });
            });
            this.reloadPage();
        },
        reloadPage() {
            this.$store.state.home.home.isRouterAlive = false;
            this.$nextTick(
                () => (this.$store.state.home.home.isRouterAlive = true)
            );
        },
        deleteTag(tagId) {
            this.$nextTick(() => {
                this.$store.dispatch({
                    type: "deleteTag",
                    thisObj: this,
                    tagId: tagId
                });
            });
            this.reloadPage();
        }
    },

    components: {},

    created() {
        console.log("target created======================");
        // this.queryAllTags();
        // this.queryAllTarget(1);
    },

    mounted() {
        console.log("target mounted======================");
        console.log(this.theme.current);
        this.$Message.config({ top: 400, duration: 3 });
        Scrollbar.init(document.querySelector("#Target-Left-TimeLine"));
        Scrollbar.init(document.querySelector("#Target-Step-Third"));
        Scrollbar.init(document.querySelector("#Target-Step-Second-ChildTarget"));
        Scrollbar.init(document.querySelector("#Target-ChildTargetModal"));
        // this.queryDoingTarget();
        if(this.theme.current != 0) {
            this.nextStep(this.theme.current);
        }
    }
};
</script>

<style lang="less">
@import "../style/target.less";
@import "../style/timeMachine.less";
#targetTagModal .ivu-modal-footer {
    display: block;
}

#input-a:focus {
    border: red;
}
input {
    outline: none;
}
input:focus {
    border: none;
}
</style>
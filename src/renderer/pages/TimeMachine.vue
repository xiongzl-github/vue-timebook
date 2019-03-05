<!--  -->
<template>
    <Tabs value="name01">
        <TabPane name="name01" label="时光流影" icon="ios-infinite">
            <div>
                <div class="TimeMachine-Left">
                    <DatePicker @on-change="queryTimeListByDate" class="TimeMachine-Left-DatePicker" type="date" v-model="timeMachine.leftCurTime" placeholder="Select date"></DatePicker>
                    <div id="TimeMachine-Left-TimeLine" style="width:302px; padding:8px;text-align:left;height:545px;">
                        <Timeline style="width:auto;height:545px;">
                            <TimelineItem v-for="(item, index) in timeMachine.timeList" :key="index" style="width:292px;height:auto;cursor:pointer">
                                <div style="display:inline-block" v-on:click="setTimeMachineInfo(index)">
                                    <p v-if="item.timeMachine.remark != ''" class="time" style="font-size:14px;font-weight:bolder;width:292px">{{item.timeMachine.timeSlot}}
                                        <span :title="item.todolist.listName">{{item.todolist.briefListName}}</span>
                                        <span v-if="item.todolist.endDate != undefined && item.todolist.endDate != ''">( 还剩
                                            <span style="color:red">{{item.todolist.endTimeNum}}</span> 天 )
                                        </span>
                                    </p>
                                    <p v-if="item.timeMachine.remark == ''" class="time" style="font-size:14px;font-weight:bolder;width:292px">{{item.timeMachine.timeSlot}}
                                        <span :title="item.todolist.listName">{{item.todolist.briefListName}}</span>
                                    </p>
                                    <p class="content" style="display:inline-block;width:230px">
                                        <Tag v-if="item.timeMachine.remark != ''" v-for="(tag,key) in item.tags" :key="key">{{tag.tagName}}</Tag>
                                        <span :title="item.timeMachine.remark" v-if="item.timeMachine.remark != ''">{{item.timeMachine.remark}}</span>
                                        <Tag v-if="item.timeMachine.remark == ''" v-for="(tag,key) in item.tags" :key="key">{{tag.tagName}}</Tag>
                                        <span :title="item.todolist.listName" v-if="item.timeMachine.remark == ''">{{item.todolist.listName}}</span>
                                    </p>
                                    <span style="display:inline-block;margin-left:7px" v-on:click="deleteTimeMachineById(item.timeMachine.id)">
                                        <Icon style="font-size:18px;" type="close-circled"></Icon>
                                    </span>
                                </div>
                            </TimelineItem>
                        </Timeline>
                    </div>
                </div>

                <div class="TimeMachine-Right">
                    <div class="TimeMachine-Right-Header">
                        <strong>时间清单</strong>
                        <DatePicker v-on:on-change="queryTaskByDate" class="TimeMachine-Right-Header-DatePicker" type="date" v-model="timeMachine.rightCurTime"></DatePicker>
                        <span v-on:click="openTimeMachineSetting">
                            <Icon style="font-size:22px;display:inline-block;float:right;margin-top:12px;cursor:pointer" type="gear-a"></Icon>
                        </span>
                    </div>

                    <!-- doWhat -->
                    <div v-show="timeMachine.categorySetting.doWhatStatus" class="TimeMachine-Right-DoWhat">
                        <div class="container">
                            <input v-model="timeMachine.timeSlotStart" value="00:00" @onchange="getConsumeTime" class="TimeMachine-Right-DoWhat-Input" id="input-a"></input>
                            <strong style="">~</strong>
                            <input v-model="timeMachine.timeSlotEnd" @onchange="getConsumeTime" class="TimeMachine-Right-DoWhat-Input" id="input-b"></input>
                            <strong style="font-size:13px">做了什么? ( {{timeMachine.consumeTime}}min )</strong>
                            <span v-on:click="getTimeSlotEnd">
                                <Icon style="font-size:18px;display:inline-block;cursor:pointer;margin-left:10px" type="refresh"></Icon>
                            </span>
                        </div>
                        <Select v-on:on-change="todolistChange()" style="width:610px;float:left" v-model="timeMachine.todoListId" filterable>
                            <Option v-if="obj.finished == false" v-for="obj in timeMachine.taskList" :value="obj.todolist.id" :key="obj.todolist.id">{{ obj.todolist.listName }}</Option>
                            <Option v-if="obj.finished == true" style="text-decoration:line-through" v-for="obj in timeMachine.taskList" :value="obj.todolist.id" :key="obj.todolist.id">{{ obj.todolist.listName }}</Option>
                        </Select>
                        <Tooltip content="跳转至待办清单" placement="top-end">
                            <router-link to="/Home/TodoList">
                                <span v-on:click="jumpToTodoList">
                                    <Icon style="font-size: 22px; float: left;margin-top: 5px;margin-left: 10px" type="navigate"></Icon>
                                </span>
                            </router-link>
                        </Tooltip>
                    </div>

                    <!-- 标签 -->
                    <div v-show="timeMachine.categorySetting.tagStatus" class="TimeMachine-Right-Tag">
                        <h3 style="line-height:35px">标签</h3>
                        <Select style="width:610px;float:left" v-model="timeMachine.tags" multiple filterable remote :loading="timeMachine.loadingTagStatus" :remote-method="queryTags">
                            <Option v-for="item in timeMachine.searchedTags" :value="item.tagName" :key="item.id">{{item.tagName}}</Option>
                        </Select>
                        <Tooltip content="新建一个标签" placement="top-end">
                            <span v-on:click="timeMachine.tagModal = true">
                                <Icon style="font-size: 24px; float: left;margin-top: 5px;margin-left: 10px" type="plus-round"></Icon>
                            </span>
                        </Tooltip>
                    </div>

                    <!-- 进度 -->
                    <div v-show="timeMachine.categorySetting.progressStatus" style="text-align:left">
                        <strong style="line-height:35px;font-size:14px">进度 {{timeMachine.progress}} %</strong>
                        <Slider style="width:605px;margin-left:5px" v-model="timeMachine.progress" :max="100" :min="0" show-stops :step="10" :tip-format="formatProgress"></Slider>
                    </div>

                    <!-- 笔记 -->
                    <div v-show="timeMachine.categorySetting.noteStatus" style="width:auto;height:76px;margin-bottom:5px">
                        <h3 style="display:inline-block;float:left;">笔记</h3>
                        <span v-on:click="editNote">
                            <Icon style="cursor:pointer;font-size:22px;float:left;margin:-2px 0px 0px 5px" type="compose"></Icon>
                        </span>
                        <span v-on:click="previewNote">
                            <Icon v-on:click="previewNote" v-show="false" style="cursor:pointer;font-size:22px;float:left;margin:-2px 0px 0px 5px" type="eye"></Icon>
                        </span>
                        <!-- <span style="width:30px;display:inline-block;line-height:25px;height:25px"></span> -->
                        <Input style="width:605px;margin-right:35px" v-model="timeMachine.note" type="textarea" :rows="1" :autosize="{minRows: 2,maxRows: 2}" placeholder="Enter something..."></Input>
                    </div>

                    <!-- 花了多少钱 -->
                    <div v-show="timeMachine.categorySetting.consumeStatus" style="width:auto;height:67px;margin-bottom:10px">
                        <h3 style="line-height:35px;text-align:left">花了多少钱?</h3>
                        <InputNumber style="width:605px;margin-right:35px" :max="10000" :min="0" v-model="timeMachine.consume" :formatter="value => `${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                    </div>

                    <!-- 挣了多少钱 -->
                    <div v-show="timeMachine.categorySetting.incomeStatus" style="width:auto;height:67px;margin-bottom:10px">
                        <h3 style="line-height:35px;text-align:left">挣了多少钱?</h3>
                        <InputNumber style="width:605px;margin-right:35px" :max="10000000" :min="0" v-model="timeMachine.income" :formatter="value => `${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                    </div>

                    <!-- 备注 -->
                    <div v-show="timeMachine.categorySetting.remarkStatus" style="width:auto;height:67px;margin-bottom:10px">
                        <h3 style="line-height:35px;text-align:left">备注</h3>
                        <Input style="width: 605px;float:left" v-model="timeMachine.remark" placeholder="Enter something..."></Input>
                    </div>

                    <!-- 附件 -->
                    <div v-show="timeMachine.categorySetting.attachStatus" class="TimeMachine-Right-Attachment" style="text-align:left;">
                        <h3 style="line-height:35px">附件</h3>
                        <div class="TimeMachine-Right-Attachment-Upload-List" v-for="(item, index) in timeMachine.uploadList" :key="index">
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url">
                                <div class="TimeMachine-Right-Attachment-Upload-List-Cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                </div>
                            </template>
                        </div>
                        <img v-on:click="showPhotoHandle()" style="width:58px;height:58px;margin-right:5px;border: 1px dashed; border-radius: 4px; padding:12px" src="@/assets/img/upload.png">
                        <input type="file" v-show="false" name="uploadPicture" id="file" value="" title="上传照片" @change="showPhoto($event)" />
                    </div>

                    <!-- 提交button -->
                    <div style="margin-bottom:10px; margin-top:20px">
                        <span v-if="timeMachine.type == 1">
                            <Button style="margin-right:10px" type="primary" :loading="loading" @click="submitTimeMachine">
                                <span v-if="!loading">submit</span>
                                <span v-else>Loading...</span>
                            </Button>
                        </span>
                        <span v-if="timeMachine.type == 2">
                            <Button style="margin-right:10px" type="primary" :loading="loading" @click="updateTimeMachine">
                                <span v-if="!loading">update</span>
                                <span v-else>Loading...</span>
                            </Button>
                        </span>
                        <Button v-on:click="resetTimeMachine">reset</Button>
                    </div>

                    <Modal id="timeMachineTagModal" :mask-closable="false" v-model="timeMachine.tagModal" style="" @on-ok="addTag" :styles="{top: '300px'}" title="创建标签!">
                        <div style="width:auto;height:300px;">
                            <div style="display:inline-block;width:300px;height:200px;margin-top:5px;">
                                <h3 style="line-height:35px; text-align:left">tag</h3>
                                <Input v-model="timeMachine.tagName" style="width: 490px;margin-bottom:15px"></Input>
                                <div id="timeMachine-tagModal" class="timeMachine-tagModal">
                                    <Tag v-for="item in timeMachine.allTags" :key="item.id" type="dot" closable @on-close="deleteTag(item.id)" color="green">{{item.tagName}}</Tag>
                                    <div style="height:18px"></div>
                                </div>
                            </div>
                        </div>
                    </Modal>

                    <Modal :mask-closable="false" v-model="timeMachine.editModal" @on-ok="saveNote" :styles="{top: '150px',width:'1100px',height:'600px'}" title="新建笔记!">
                        <div>
                            <mavon-editor ref="md" style="height:600px" :codeStyle="timeMachine.codeStyle" :toolbars="timeMachine.toolbars" v-model="timeMachine.note" @previewToggle="$previewToggle" @imgAdd="$imgAdd" />
                        </div>
                        <div style="text-align:right; margin:10px -10px -10px 0px;">
                            <Checkbox size="large" v-model="timeMachine.review">加入复习计划</Checkbox>
                        </div>
                    </Modal>

                    <Modal id="timeMachineSettingModal" :mask-closable="false" v-model="timeMachine.settingModal" @on-ok="saveSetting" :styles="{top: '250px',width:'500px',height:'300px'}" title="设置">
                        <div>
                            <strong style="line-height:35px;font-size:14px">每 {{timeMachine.remindCycle}}min 提醒一次</strong>
                            <Slider v-on:on-change="updateRemindCycle" style="width:465px;" v-model="timeMachine.remindCycle" :max="240" :min="30" show-stops :step="30" :tip-format="formatRemindCycle"></Slider>
                        </div>
                        <div>
                            <Tooltip content="请先选择一件你做的事情!" placement="top-start">
                                <strong style="line-height:35px;font-size:14px">功能设置</strong>
                            </Tooltip>
                            <div>
                                <span style="width:150px;height:30px;display:inline-block;line-height:30px;margin-right:130px">
                                    <Switch v-model="timeMachine.categorySetting.doWhatStatus" :disabled="timeMachine.basicFuntion" size="default">
                                        <span slot="open">开</span>
                                        <span slot="close">关</span>
                                    </Switch>
                                    <p style="font-weight:bolder;display:inline-block;font-size:14px;margin-left:10px;line-height:30px;margin-bottom:-2px">做了什么?</p>
                                </span>
                                <span style="width:150px;height:30px;display:inline-block;line-height:30px;">
                                    <Switch v-model="timeMachine.categorySetting.tagStatus" :disabled="timeMachine.basicFuntion" size="default">
                                        <span slot="open">开</span>
                                        <span slot="close">关</span>
                                    </Switch>
                                    <p style="font-weight:bolder;display:inline-block;font-size:14px;margin-left:10px;line-height:30px;margin-bottom:-2px">标签</p>
                                </span>
                                <span style="width:150px;height:30px;display:inline-block;line-height:30px;margin-right:130px">
                                    <Switch v-model="timeMachine.categorySetting.progressStatus" :disabled="timeMachine.basicFuntion" size="default">
                                        <span slot="open">开</span>
                                        <span slot="close">关</span>
                                    </Switch>
                                    <p style="font-weight:bolder;display:inline-block;font-size:14px;margin-left:10px;line-height:30px;margin-bottom:-2px">进度</p>
                                </span>
                                <span style="width:150px;height:30px;display:inline-block;line-height:30px;">
                                    <Switch v-on:on-change="switchChange(null)" v-model="timeMachine.categorySetting.noteStatus" :disabled="timeMachine.function" size="default">
                                        <span slot="open">开</span>
                                        <span slot="close">关</span>
                                    </Switch>
                                    <p style="font-weight:bolder;display:inline-block;font-size:14px;margin-left:10px;line-height:30px;margin-bottom:-2px">笔记</p>
                                </span>
                                <span style="width:150px;height:30px;display:inline-block;line-height:30px;margin-right:130px">
                                    <Switch v-on:on-change="switchChange(null)" v-model="timeMachine.categorySetting.remarkStatus" :disabled="timeMachine.function" size="default">
                                        <span slot="open">开</span>
                                        <span slot="close">关</span>
                                    </Switch>
                                    <p style="font-weight:bolder;display:inline-block;font-size:14px;margin-left:10px;line-height:30px;margin-bottom:-2px">备注</p>
                                </span>
                                <span style="width:150px;height:30px;display:inline-block;line-height:30px;">
                                    <Switch v-on:on-change="switchChange(null)" v-model="timeMachine.categorySetting.attachStatus" :disabled="timeMachine.function" size="default">
                                        <span slot="open">开</span>
                                        <span slot="close">关</span>
                                    </Switch>
                                    <p style="font-weight:bolder;display:inline-block;font-size:14px;margin-left:10px;line-height:30px;margin-bottom:-2px">附件</p>
                                </span>
                                <span style="width:150px;height:30px;display:inline-block;line-height:30px;margin-right:130px">
                                    <Switch v-on:on-change="switchChange(null)" v-model="timeMachine.categorySetting.consumeStatus" :disabled="timeMachine.function" size="default">
                                        <span slot="open">开</span>
                                        <span slot="close">关</span>
                                    </Switch>
                                    <p style="font-weight:bolder;display:inline-block;font-size:14px;margin-left:10px;line-height:30px;margin-bottom:-2px">花了多少钱</p>
                                </span>
                                <span style="width:150px;height:30px;display:inline-block;line-height:30px;">
                                    <Switch v-on:on-change="switchChange(null)" v-model="timeMachine.categorySetting.incomeStatus" :disabled="timeMachine.function" size="default">
                                        <span slot="open">开</span>
                                        <span slot="close">关</span>
                                    </Switch>
                                    <p style="font-weight:bolder;display:inline-block;font-size:14px;margin-left:10px;line-height:30px;margin-bottom:-2px">挣了多少钱</p>
                                </span>
                            </div>
                            <div style="text-align:right">
                                <Checkbox size="large" v-model="timeMachine.applyCategory">此类事件都应用此设置</Checkbox>
                            </div>
                        </div>
                    </Modal>

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
import * as timeMachineUtil from "@/utils/timeMachineUtil";
import { mapGetters, mapState } from "vuex";
import types from "@/store/types";
import { shell, ipcRenderer, remote } from "electron";
import "../plugs/jquery-clockpicker/jquery-clockpicker.js";
import { mavonEditor } from "mavon-editor";
// import "mavon-editor/dist/css/index.css";
import axios from "axios";

import WebStorageCache from "web-storage-cache";
var wsCache = new WebStorageCache();

var timeSections = [];
var timer = null;
var count = 1;
export default {
    computed: {
        ...mapGetters([
            "timeMachine",
            "leftCurTime",
            "rightCurTime",
            "loading",
            "todoList"
        ])
    },
    data() {
        return {
            tag: "",
            tags: new Array(),
            // 初始化用于占位
            imgName: "",
            visible: false
        };
    },

    methods: {
        getTimeSlotEnd() {
            this.timeMachine.timeSlotEnd = util.getHourAndMin();
        },
        deleteTimeMachineCategoryById() {},
        switchChange(type) {
            this.timeMachine.switchChange = true;
            if (type != null) {
                this.$store.dispatch({
                    type: "queryCategoryByType",
                    category: type
                });
            }
        },
        updateRemindCycle() {
            this.timeMachine.remindCycleStatus = true;
        },
        saveSetting() {
            this.$store.dispatch({
                type: "saveSetting",
                thisObj: this
            });
            setTimeout(() => {
                this.reloadPage();
            }, 1000);
        },
        openTimeMachineSetting() {
            this.timeMachine.settingModal = true;
            // 判断有没有选中的todolist
            let todolistId = this.timeMachine.todoListId;
            if ("" == todolistId) {
                this.timeMachine.function = true;
            } else {
                this.timeMachine.function = false;
            }
        },
        $previewToggle(status, value) {},

        $save(p1, p2) {},
        saveNote() {},
        $imgAdd(pos, $file) {
            let returnPath = timeMachineUtil.handleNoteAttach(
                $file.name,
                $file.path
            );
            setTimeout(() => {
                this.$refs.md.$img2Url(pos, returnPath);
            }, 100);
            // var formdata = new FormData();
            // formdata.append("file", $file);
            // formdata.append("userId", "1");
            // formdata.append("type", "image");
            // axios({
            //     url: "http://127.0.0.1:8080/api/file/upload",
            //     method: "post",
            //     data: formdata,
            //     headers: { "Content-Type": "multipart/form-data" }
            // }).then(resp => {
            //     let url = resp.data.result;
            //     this.$refs.md.$img2Url(pos, url);
            // });
        },
        editNote() {
            this.timeMachine.editModal = true;
        },
        previewNote() {},
        todolistChange() {
            this.$store.dispatch({
                type: "todolistChange"
            });
            let tempTimeSlotStart = this.timeMachine.timeSlotStart;
            let tempTimeSlotEnd = this.timeMachine.timeSlotEnd;
            this.reloadPage();
            setTimeout(() => {
                this.timeMachine.timeSlotEnd = tempTimeSlotEnd;
                this.timeMachine.timeSlotStart = tempTimeSlotStart;
                this.getConsumeTime();
            }, 1);
        },
        updateTimeMachine() {
            this.$store.dispatch({
                type: "updateTimeMachine",
                thisObj: this
            });
            this.reloadPage();
        },
        queryLastSubmitTimeSlot() {
            this.$store.dispatch({
                type: "queryLastSubmitTimeSlot"
            });
        },
        setTimeMachineInfo(index) {
            this.$nextTick(() => {
                this.$store.dispatch({
                    type: "setTimeMachineInfo",
                    index: index
                });
            });
            this.reloadPage();
            setTimeout(() => {
                let timeSlotArr = this.timeMachine.timeList[
                    index
                ].timeMachine.timeSlot.split("~");
                this.timeMachine.timeSlotStart = timeSlotArr[0];
                this.timeMachine.timeSlotEnd = timeSlotArr[1];
                this.getConsumeTime();
            }, 1);
        },
        deleteTimeMachineById(id) {
            this.$nextTick(() => {
                this.$store.dispatch({
                    type: "deleteTimeMachineById",
                    id: id,
                    thisObj: this
                });
            });
            this.reloadPage();
        },
        getConsumeTime() {
            this.$store.dispatch("getConsumeTime");
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
        },
        initTimeSlot() {
            this.$store.dispatch("initTimeSlot");
        },
        formatProgress(val) {
            return val + "%";
        },
        formatRemindCycle(val) {
            return val + "min";
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
        jumpToTodoList() {
            this.$store.state.home.home.activeName = "TodoList";
        },
        queryTaskByDate() {
            this.$store.dispatch({
                type: "queryTaskByDate",
                thisObj: this
            });
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
        reloadPage() {
            this.$store.state.home.home.isRouterAlive = false;
            this.$nextTick(
                () => (this.$store.state.home.home.isRouterAlive = true)
            );
        },
        handleView(url) {
            shell.openItem(url);
        },
        handleRemove(index) {
            this.$store.dispatch({
                type: "handleRemove",
                index: index
            });
        },
        showPhotoHandle() {
            document.getElementById("file").click();
        },
        showPhoto(e) {
            this.$store.dispatch({
                type: "showPhoto",
                event: e,
                vueObj: this
            });
        },
        handleTimeSlotSelect(value) {
            this.$store.dispatch({
                type: "handleTimeSlotSelect",
                timeSlot: value
            });
        },
        handleTimeSlotStartSearch() {
            this.$store.dispatch({
                type: "handleTimeSlotStartSearch",
                timeSlot: this.timeMachine.timeSlotStart
            });
        },
        handleTimeSlotEndSearch() {
            this.$store.dispatch({
                type: "handleTimeSlotEndSearch",
                timeSlot: this.timeMachine.timeSlotEnd
            });
        },
        submitTimeMachine() {
            this.$nextTick(() => {
                this.$store.dispatch({
                    type: "submitTimeMachine",
                    thisObj: this
                });
            });
            setTimeout(() => {
                this.reloadPage();
                this.resetTimeMachine();
            }, 1000);
        },
        dealWithTimeSlot() {
            this.$store.dispatch("dealWithTimeSlot");
        },
        resetTimeMachine() {
            this.$store.dispatch("resetTimeMachine");
            this.reloadPage();
        },
        setTimeSlotEnd() {
            this.$store.dispatch("setTimeSlotEnd");
        },
        initClockPlug() {
            var inputA = $("#input-a");
            var inputB = $("#input-b");
            var thisObj = this;
            inputA.clockpicker({
                autoclose: true,
                afterDone: function() {
                    thisObj.timeMachine.timeSlotStart = inputA[0].value;
                    thisObj.timeMachine.timeSlotEnd = inputB[0].value;
                    thisObj.getConsumeTime();
                }
            });
            inputB.clockpicker({
                autoclose: true,
                afterDone: function() {
                    thisObj.timeMachine.timeSlotStart = inputA[0].value;
                    thisObj.timeMachine.timeSlotEnd = inputB[0].value;
                    thisObj.getConsumeTime();
                }
            });
        },
        queryTimeListByDate() {
            this.$store.dispatch({
                type: "queryTimeListByDate",
                thisObj: this
            });
        },
        initRemindCycleSetting() {
            this.$store.dispatch({
                type: "addRemindCycleSetting",
                thisObj: this
            });
        },
        getTimeSections() {
            let remindCycle = this.timeMachine.remindCycle;
            let remindCycleNum = remindCycle / 30;
            for (let index = 0; index < util.timeSectionArr.length; index++) {
                if (index % remindCycleNum == 0) {
                    timeSections.push(util.timeSectionArr[index]);
                }
            }
        },
        cyclocke() {
            if (wsCache.get("user").id != null) {
                let curTime = util.getHourAndMin();
                for (let i = 0; i < timeSections.length; i++) {
                    if (timeSections[i] == curTime) {
                        this.$router.push("/home");
                        this.$store.state.home.home.activeName = "TimeMachine";
                        ipcRenderer.send("showWindow", count);
                        this.getTimeSlotEnd();
                        break;
                    }
                }
            } else {
                this.$router.push("/");
            }
        }
    },

    components: {
        "mavon-editor": mavonEditor
    },

    created() {
        console.log("TimeMachine  created======================");
        this.queryAllTags();
        this.queryTaskByDate();
        this.queryLastSubmitTimeSlot();
        this.initTimeSlot();
        this.getConsumeTime();
        this.queryTimeListByDate();
        this.initRemindCycleSetting();
    },

    mounted() {
        console.log("TimeMachine mounted======================");
        this.initClockPlug();
        this.$Message.config({ top: 400, duration: 3 });
        Scrollbar.init(document.querySelector("#TimeMachine-Left-TimeLine"));
        Scrollbar.init(document.querySelector("#timeMachine-tagModal"));
        this.getTimeSections();
        if (timer == null) {
            timer = setInterval(() => {
                this.cyclocke();
            }, 60000);
        }
    }
};
</script>

<style lang="less">
@import "../style/timeMachine.less";
@import "../plugs/jquery-clockpicker/jquery-clockpicker.min";
// @import "../plugs/mavon-editor/index";
#input-a:focus {
    border: red;
}
input {
    outline: none;
}
input:focus {
    border: none;
}

#timeMachineTagModal .ivu-modal-footer {
    display: block;
}
#timeMachineSettingModal .ivu-modal-footer {
    display: block;
}
</style>
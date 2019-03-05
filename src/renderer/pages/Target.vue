<!--  -->
<template>
    <Tabs value="name01">
        <TabPane name="name01" label="目标制定" icon="disc">
            <div>
                <div class="Target-Left">
                    <div style="width:auto;height:45px">
                        <ButtonGroup style="float:left">
                            <Button v-on:click="queryAllTarget(1)" style="border-radius:0;width:151px" :type="target.style">目标</Button>
                            <Button v-on:click="queryAllTarget(0)" style="border-radius:0;width:151px" :type="target.doneStyle">已完成目标</Button>
                        </ButtonGroup>
                    </div>
                    <div id="Target-Left-TimeLine" style="width:302px; padding:8px;text-align:left;height:555px;">
                        <Timeline style="width:auto;height:545px;">
                            <TimelineItem v-for="(item, index) in target.targets" :key="index" style="width:292px;height:auto;">
                                <div style="display:inline-block">
                                    <p class="content" style="display:inline-block;width:230px;font-weight:bolder">
                                        <Tag v-for="(tag,key) in item.tags" :key="key">{{tag.tagName}}</Tag>
                                        <span v-if="item.dayNum >= 0">( 还剩
                                            <span style="color:red">{{item.dayNum}}</span> 天 )</span>
                                        <span v-if="item.dayNum < 0">( 延期
                                            <span style="color:red">{{item.absDayNum}}</span> 天 )</span>
                                    </p>
                                    <p class="content" v-on:click="setTargetInfo(index)" :title="item.target" style="display:inline-block;width:230px;cursor:pointer">
                                        {{item.target}}
                                    </p>
                                    <span style="float:right;display:inline-block" v-on:click="deleteTargetById(item.id)">
                                        <Icon style="display:inline;font-size:18px;margin-right:15px;" type="close-circled"></Icon>
                                    </span>
                                </div>
                            </TimelineItem>
                        </Timeline>
                    </div>
                </div>

                <div class="TimeMachine-Right">
                    <div class="TimeMachine-Right-Header">
                        <strong>目标清单</strong>
                        <DatePicker class="TimeMachine-Right-Header-DatePicker" type="date" v-model="target.curDateTime"></DatePicker>
                    </div>

                    <div class="Target-Projection">
                        <h3 class="TodoList-Projection-Label">目标规划</h3>
                        <Select v-model="target.projection" style="display: inline-block;width:610px">
                            <Option v-for="item in target.projectionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>

                    <!-- 目标 -->
                    <div style="width:auto;height:67px;margin-bottom:10px">
                        <h3 style="line-height:35px;text-align:left">目标</h3>
                        <Input style="width: 610px;float:left" v-model="target.target"></Input>
                    </div>
                    <!-- 标签 -->
                    <div class="TimeMachine-Right-Tag">
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

                    <Modal id="targetTagModal" :mask-closable="false" v-model="timeMachine.tagModal" style="" @on-ok="addTag" :styles="{top: '300px'}" title="创建标签!">
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

                    <div class="Target-Right-EndTime">
                        <h3 class="Target-Right-EndTime-Label">截至时间</h3>
                        <div style="float:left;">
                            <DatePicker v-model="target.endDate" type="date" size="default" format="yyyy-MM-dd" style="width: 610px"></DatePicker>
                        </div>
                    </div>

                    <div class="Target-Right-Complete">
                        <h3 class="Target-Right-Complete-Label">是否完成</h3>
                        <RadioGroup v-model="target.complete" style="float:left;">
                            <Radio label="1" value="1">完成</Radio>
                            <Radio label="0" value="0">未完成</Radio>
                        </RadioGroup>
                    </div>

                    <!-- 提交button -->
                    <div style="margin-bottom:10px; margin-top:20px">
                        <span v-if="target.type == 1">
                            <Button style="margin-right:10px" type="primary" @click="submitTarget">
                                <span>submit</span>
                            </Button>
                        </span>
                        <span v-if="target.type == 2">
                            <Button style="margin-right:10px" type="primary" @click="updateTarget">
                                <span>update</span>
                            </Button>
                        </span>
                        <Button v-on:click="resetTarget">reset</Button>
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
        ...mapGetters(["target", "timeMachine"])
    },
    data() {
        return {};
    },

    methods: {
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
        this.queryAllTags();
        this.queryAllTarget(1);
    },

    mounted() {
        console.log("target mounted======================");
        this.$Message.config({ top: 400, duration: 3 });
        Scrollbar.init(document.querySelector("#Target-Left-TimeLine"));
        Scrollbar.init(document.querySelector("#timeMachine-tagModal"));
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
<template>
    <Tabs v-model="knowledge.tabName" :animated="knowledge.animated" v-on:on-click="handle">
        <TabPane name="knowledge-detail" label="知识详情" icon="navicon-round">
            <DatePicker format="yyyy-MM-dd" size="large" @on-change="getKnowledgeDetail" class="Knowledge-DatePicker-Detail" type="date" v-model="knowledge.curDateTime" placeholder=""></DatePicker>
            <span style="float:right;margin-left:50px;line-height:45px;margin-right:75px">
                <strong style="font-size:14px;margin-top:10px">待温习笔记条数: </strong>
                <strong style="font-size:18px;margin-top:10px">{{knowledge.sumKnowledgeNumOfReview}}条</strong>
            </span>
            <span style="float:right;margin-left:50px;line-height:45px">
                <strong style="font-size:14px;margin-top:10px">当月笔记总数: </strong>
                <strong style="font-size:18px;margin-top:10px">{{knowledge.sumKnowledgeNumOfMonth}}条</strong>
            </span>
            <span style="float:right;margin-left:40px;line-height:45px">
                <strong style="font-size:14px;margin-top:10px">当天笔记条数: </strong>
                <strong style="font-size:18px;margin-top:10px">{{knowledge.sumKnowledgeNumOfDay}}条</strong>
            </span>
            <div id="Knowledge-Detail" style="width:1005px;height:550px;padding-left:70px">
                <div v-on:click="showNoteDetail(index)" v-for="(item, index) in knowledge.knowledgeList" :key="index" style="width:208px;display:inline-block;margin:0 10px 10px 0;float:left;cursor:pointer">
                    <Card style="width:208px;display:inline-block;margin:0 10px 10px 0;float:left;">
                        <div style="text-align:center">
                            <img style="width:64px;height:64px" :src="item.dataUrl">
                            <div style="width:150px;display:inline-block">
                                <h4 :title="item.listName">{{item.briefTitle}}</h4>
                                <span>
                                    <Icon style="font-size:14px;font-weight:bold" v-for="item in 2" :key="item" type="ios-arrow-right"></Icon> 详细</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Modal :mask-closable="false" v-model="knowledge.noteModal" @on-ok="saveNote" :styles="{top: '150px',width:'1100px',height:'600px'}" :title="knowledge.title">
                <div>
                    <mavon-editor :toolbarsFlag="true" :subfield="false" defaultOpen="preview" style="height:600px" codeStyle="googlecode" :toolbars="knowledge.toolbars" v-model="knowledge.note" />
                </div>
            </Modal>
        </TabPane>
        <TabPane name="knowledge-review" label="知识温习" icon="loop">
            <div>
                <div style="width:150px;height:515px;display:inline-block;float:left;">
                    <span v-on:click="leftClick">
                        <Icon style="font-size:96px;margin-top:250px;color:#ddd;cursor:pointer" type="chevron-left"></Icon>
                    </span>
                </div>
                <div style="width:706px;height:515px;display:inline-block;float:left;margin-top:50px">
                    <div v-if="knowledge.noteOfReview.length > 0" style="width:706px;height:365px;display:inline-block;float:left;border: 1px solid #ddd;">
                        <h3 style="text-align:left;font-size:14px;margin:20px 0 0 20px">待温习笔记条数: {{knowledge.sumKnowledgeNumOfReview}}条</h3>
                        <h3 style="text-align:center;font-size:18px;margin-top:100px">{{knowledge.noteOfReview[knowledge.noteIndex].categoryName}}</h3>
                        <h3 style="text-align:center;font-size:16px;margin-top:30px">{{knowledge.noteOfReview[knowledge.noteIndex].listName}}</h3>
                        <h3 v-on:click="openKnowledgeReviewModal" style="text-align:center;font-size:14px;margin-top:20px;margin-bottom:70px;cursor:pointer">详细</h3>
                        <p style="font-size:14px;width:100px;display:inline-block;float:left">已复习{{knowledge.noteOfReview[knowledge.noteIndex].reviewNum}}次</p>
                        <Checkbox v-on:on-change="isJoinPreviewPlan" style="float:right;margin-right:20px;cursor:pointer" size="large" v-model="knowledge.noteOfReview[knowledge.noteIndex].isReview">加入复习计划</Checkbox>
                    </div>
                    <div v-else style="width:706px;height:365px;display:inline-block;float:left;border: 1px solid #ddd;">
                        <h3 style="text-align:center;font-size:18px;margin-top:150px">没有需要复习的内容</h3>
                    </div>
                    <div style=" background-color:#f0f0f0;width:706px;height:150px;display:inline-block;float:left;">
                        <Button v-if="knowledge.noteOfReview.length > 0" v-on:click="disremember" style="margin-top:60px;cursor:pointer" type="success" shape="circle" size="large">
                            <Icon type="sad-outline"></Icon>
                            无印象
                        </Button>
                        <Button v-if="knowledge.noteOfReview.length == 0" v-on:click="disremember" style="margin-top:60px;cursor:pointer" type="ghost" shape="circle" size="large">
                            <Icon type="sad-outline"></Icon>
                            无印象
                        </Button>
                        <Button v-if="knowledge.noteOfReview.length > 0" v-on:click="remember" style="margin-top:60px;margin-left:20px;cursor:pointer" type="success" shape="circle" size="large">
                            <Icon type="happy-outline"></Icon>
                            有印象
                        </Button>
                        <Button v-if="knowledge.noteOfReview.length == 0" v-on:click="remember" style="margin-top:60px;margin-left:20px;cursor:pointer" type="ghost" shape="circle" size="large">
                            <Icon type="happy-outline"></Icon>
                            有印象
                        </Button>
                    </div>
                </div>
                <div style="width:150px;height:515px;display:inline-block;float:right">
                    <span v-on:click="rightClick">
                        <Icon style="font-size:96px;margin-top:250px;color:#ddd;cursor:pointer" type="chevron-right"></Icon>
                    </span>
                </div>
            </div>
            <Modal :mask-closable="false" v-model="knowledge.knowledgeReviewModal" :styles="{top: '150px',width:'1100px',height:'600px'}" :title="knowledge.title">
                <div>
                    <mavon-editor :toolbarsFlag="false" :subfield="false" defaultOpen="preview" style="height:600px" codeStyle="googlecode" :toolbars="knowledge.toolbars" v-model="knowledge.note" />
                </div>
            </Modal>
        </TabPane>
        <TabPane name="knowledge-graph" label="知识图谱" icon="android-apps">
            <div style="width:150px;height: 615px;padding:20px 0px 0px 20px;display:inline-block;float:left;">
                <h3 style="margin-bottom:10px">笔记类别</h3>
                <div id="knowledge-graph-category" style="width:130px;height:565px">
                    <Timeline style="width:130px;height:565px">
                        <TimelineItem v-for="(item, index) in knowledge.noteCategoryList" :key="index">
                            <h3 v-on:click="queryKnowledgeGraph(index)" style="text-align:left;cursor:pointer">{{item.categoryName}}</h3>
                        </TimelineItem>
                    </Timeline>
                </div>
            </div>
            <div id="knowledge-graph-echarts" class="echarts" style="display:linle-block;float:right;padding:20px 0px 0px 10px;width:836px;height:615px">
                <IEcharts id="tree-echarts" v-on:click="echartsClickOfTree" style="width:812px;height:615px" :option="knowledge.tree" />
            </div>
            <Modal :mask-closable="false" v-model="knowledge.knowledgeGraphModal" :styles="{top: '150px',width:'1100px',height:'600px'}" :title="knowledge.title">
                <div>
                    <mavon-editor :toolbarsFlag="false" :subfield="false" defaultOpen="preview" style="height:600px" codeStyle="googlecode" :toolbars="knowledge.toolbars" v-model="knowledge.note" />
                </div>
            </Modal>
        </TabPane>
        <TabPane name="knowledge-analysis" label="知识分析" icon="ios-lightbulb">
            <div>
                <div style="width:600px;height:610px;display:inline-block;float:left">
                    <div style="width:600px;height:50px;text-align:center;">
                        <ButtonGroup size="default" style="margin:0px 10px 0 10px;">
                            <Button v-on:click="changeYearMonth(2)" v-if="knowledge.yearMonthType == 2" type="primary">年</Button>
                            <Button v-on:click="changeYearMonth(2)" v-if="knowledge.yearMonthType != 2" type="ghost">年</Button>
                            <Button v-on:click="changeYearMonth(1)" v-if="knowledge.yearMonthType == 1" type="primary">月</Button>
                            <Button v-on:click="changeYearMonth(1)" v-if="knowledge.yearMonthType != 1" type="ghost">月</Button>
                        </ButtonGroup>
                        <span v-if="knowledge.yearMonthType == 1">
                            <DatePicker type="month" format="yyyy-MM" @on-change="changeYearMonth(null)" class="Knowledge-Analyze-DatePicker" v-model="knowledge.analyzeYearMonth"></DatePicker>
                        </span>
                        <span v-if="knowledge.yearMonthType == 2">
                            <DatePicker type="year" format="yyyy" @on-change="changeYearMonth(null)" class="Knowledge-Analyze-DatePicker" v-model="knowledge.analyzeYearMonth"></DatePicker>
                        </span>
                    </div>
                    <div class="echarts" style="margin:50px 10px 0px 50px">
                        <IEcharts style="width:600px;height:520px" :option="knowledge.circlePie" />
                    </div>
                </div>
                <div>
                    <ButtonGroup size="default" style="display:inline-block;float:left">
                        <Button style="width:380px" type="primary">知识类别</Button>
                    </ButtonGroup>
                    <el-dropdown @command="sortKnowledgeOfAnalysis" style="display:inline-block;float:right;padding-top:10px">
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="num">篇数</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div id="knowledgeAnalyze" style="width:406px;height:570px;display:inline-block;float:right">
                    <div v-on:click="openKnowledgeModal(index)" v-for="(item, index) in knowledge.analyzeKnowledgeRightList" :key="index" style="width:406px;height:50px;display:inline-block;margin-bottom:-5px;cursor:pointer;border-bottom: 1px solid #ddd;">
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img src="/static/img/arrow.png" style="float:right;width:24px;height:24px;margin:15px 0px 0 0px">
                        <strong style="font-size:14px;font-weight:bolder;float:left;margin:5px 0 0 10px">{{item.categoryNames}} {{item.rate}}%({{item.num}}/{{item.totalNum}})</strong>
                        <Progress :hide-info=true style="float:left;margin-left:10px;display:inline-block;width:250px" :percent="item.rate" status="active"></Progress>
                        <strong style="font-size:14px;font-weight:bolder;float:right;margin:-8px 10px 0px 0px">{{item.num}}篇</strong>
                    </div>
                </div>
            </div>
            <Modal :mask-closable="false" v-model="knowledge.knowledgeDetailModal" :styles="{top: '200px', width:'500px', height:'500px'}" title="知识分类详情">
                <div style="margin-bottom:10px">
                    <ButtonGroup size="default" style="display:inline-block;float:left">
                        <Button style="width:445px" type="primary">知识类别详情</Button>
                    </ButtonGroup>
                    <el-dropdown @command="sortKnowledgeOfAnalysis" style="display:inline-block;float:right;padding-top:10px">
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="time">时间</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div id="knowledgeAnalyzeDetail" style="width:468px;height:450px;display:inline-block;">
                    <div v-on:click="showKnowledgeNote(index)" v-for="(item, index) in knowledge.analyzeKnowledgeRightDetailList" :key="index" style="width:468px;height:50px;display:inline-block;cursor:pointer;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.categoryNames}}</strong>
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">{{item.listName}}</strong>
                        </div>
                        <strong style="text-align:right;font-size:14px;font-weight:bolder;float:right;margin:0px 10px 0 0px">{{item.curDateTime}}</strong>
                    </div>
                </div>
            </Modal>
            <Modal :mask-closable="false" v-model="knowledge.knowledgeAnalyzeModal" :styles="{top: '150px',width:'1100px',height:'600px'}" :title="knowledge.title">
                <div>
                    <mavon-editor :toolbarsFlag="false" :subfield="false" defaultOpen="preview" style="height:600px" codeStyle="googlecode" :toolbars="knowledge.toolbars" v-model="knowledge.note" />
                </div>
            </Modal>
        </TabPane>
        <TabPane name="knowledge-trend" label="知识趋势" icon="stats-bars">
            <div>
                <div style="width:600px;height:610px;display:inline-block;float:left">
                    <div style="width:600px;height:50px;text-align:center;">
                        <ButtonGroup size="default" style="margin:0px 10px 0 10px;">
                            <Button v-on:click="changeYearMonthOfTrend(2)" v-if="knowledge.yearMonthTypeOfTrend == 2" type="primary">年</Button>
                            <Button v-on:click="changeYearMonthOfTrend(2)" v-if="knowledge.yearMonthTypeOfTrend != 2" type="ghost">年</Button>
                            <Button v-on:click="changeYearMonthOfTrend(1)" v-if="knowledge.yearMonthTypeOfTrend == 1" type="primary">月</Button>
                            <Button v-on:click="changeYearMonthOfTrend(1)" v-if="knowledge.yearMonthTypeOfTrend != 1" type="ghost">月</Button>
                        </ButtonGroup>
                        <span v-if="knowledge.yearMonthTypeOfTrend == 1">
                            <DatePicker type="month" format="yyyy-MM" @on-change="changeYearMonthOfTrend(null)" class="Knowledge-Analyze-DatePicker" v-model="knowledge.trendYearMonth"></DatePicker>
                        </span>
                        <span v-if="knowledge.yearMonthTypeOfTrend == 2">
                            <DatePicker type="year" format="yyyy" @on-change="changeYearMonthOfTrend(null)" class="Knowledge-Analyze-DatePicker" v-model="knowledge.trendYearMonth"></DatePicker>
                        </span>
                    </div>
                    <div class="echarts" style="margin:50px 0 0 0px;width:600px;height:600px">
                        <IEcharts style="width:600px;height:520px" :option="knowledge.lineAndBar" />
                    </div>
                </div>
                <div>
                    <ButtonGroup size="default" style="display:inline-block;float:left">
                        <Button style="width:380px" type="primary">知识详情</Button>
                    </ButtonGroup>
                    <el-dropdown @command="sortKnowledgeDetail" style="display:inline-block;float:right;padding-top:10px">
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="time">时间</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div id="knowledgeTrend" style="width:406px;height:570px;display:inline-block;float:right">
                    <div v-on:click="openKnowledgeModalOfTrend(index)" v-for="(item, index) in knowledge.trendKnowledgeDetail" :key="index" style="width:406px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;cursor:pointer">
                        <img :src="item.dataUrl" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.categoryName}}</strong>
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">{{item.listName}}</strong>
                        </div>
                        <strong style="text-align:right;font-size:14px;font-weight:bolder;float:right;margin:0px 10px 0 0px">{{item.curDateTime}}</strong>
                    </div>
                </div>
            </div>
            <Modal :mask-closable="false" v-model="knowledge.knowledgeTrendModal" :styles="{top: '150px',width:'1100px',height:'600px'}" :title="knowledge.title">
                <div>
                    <mavon-editor :toolbarsFlag="false" :subfield="false" defaultOpen="preview" style="height:600px" codeStyle="googlecode" :toolbars="knowledge.toolbars" v-model="knowledge.note" />
                </div>
            </Modal>
        </TabPane>
    </Tabs>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import Scrollbar from "smooth-scrollbar";
import IEcharts from "vue-echarts-v3/src/full.js";
import * as consumeUtil from "@/utils/knowledgeUtil.js";
import * as util from "@/utils/util.js";

export default {
    data() {
        return {};
    },

    components: {
        "mavon-editor": mavonEditor,
        IEcharts
    },

    computed: {
        ...mapGetters(["knowledge"])
    },

    created() {
        console.log("knowledge created====================================");
        this.getKnowledgeDetail();
        this.queryNoteCategoryIdByName("笔记");
        this.queryNoteCategory();
        this.getNoteOfReview();
        this.queryKnowledgeGraph(0);
        this.sumKnowledgeCategoryOfAnalyze();
        this.sumKnowledgeTrend();
    },

    mounted() {
        console.log("knowledge mounted====================================");
        Scrollbar.init(document.querySelector("#Knowledge-Detail"));
        Scrollbar.init(document.querySelector("#knowledge-graph-category"));
        Scrollbar.init(document.querySelector("#knowledge-graph-echarts"));
        Scrollbar.init(document.querySelector("#knowledgeAnalyze"));
        Scrollbar.init(document.querySelector("#knowledgeTrend"));
        Scrollbar.init(document.querySelector("#knowledgeAnalyzeDetail"));
        this.$Message.config({ top: 400, duration: 3 });
    },

    methods: {
        isJoinPreviewPlan() {
            this.$store.dispatch({
                type: "isJoinPreviewPlan",
                thisObj: this
            });
            if (this.knowledge.isReview) {
                this.knowledge.isReview = false;
                return false
            } else {
                this.knowledge.isReview = true;
                return true;
            }
        },
        remember() {
            if (this.knowledge.noteOfReview.length > 0) {
                this.$store.dispatch({
                    type: "remember",
                    thisObj: this
                });
            }
        },
        disremember() {
            this.rightClick();
        },
        rightClick() {
            this.$store.dispatch({
                type: "rightClick",
                thisObj: this
            });
        },
        leftClick() {
            this.$store.dispatch({
                type: "leftClick",
                thisObj: this
            });
        },
        openKnowledgeReviewModal() {
            this.$store.dispatch({
                type: "openKnowledgeReviewModal",
                thisObj: this
            });
        },
        getNoteOfReview() {
            this.$store.dispatch({
                type: "getNoteOfReview",
                thisObj: this
            });
        },
        openKnowledgeModalOfTrend(index) {
            this.$store.dispatch({
                type: "openKnowledgeModalOfTrend",
                thisObj: this,
                index: index
            });
        },
        sumKnowledgeTrend() {
            this.$store.dispatch({
                type: "sumKnowledgeTrend",
                thisObj: this
            });
        },
        sortKnowledgeDetail(command) {
            if (command == "time") {
                if (this.knowledge.rank == 1) {
                    this.knowledge.rank = 2;
                    this.knowledge.trendKnowledgeDetail.sort(
                        util.sortByTimeByDesc
                    );
                } else {
                    this.knowledge.rank = 1;
                    this.knowledge.trendKnowledgeDetail.sort(
                        util.sortByTimeByAsc
                    );
                }
            }
        },
        changeYearMonthOfTrend(num) {
            if (num != null) {
                this.knowledge.yearMonthTypeOfTrend = num;
            }
            this.sumKnowledgeTrend();
            this.knowledge.animated = false;
            this.reloadPage();
            setTimeout(() => {
                this.knowledge.tabName = "knowledge-trend";
            }, 1);
        },
        showKnowledgeNote(index) {
            this.$store.dispatch({
                type: "showKnowledgeNote",
                thisObj: this,
                index: index
            });
        },
        openKnowledgeModal(index) {
            this.$store.dispatch({
                type: "openKnowledgeModal",
                thisObj: this,
                index: index
            });
        },
        sumKnowledgeCategoryOfAnalyze() {
            this.$store.dispatch({
                type: "sumKnowledgeCategoryOfAnalyze",
                thisObj: this
            });
        },
        sortKnowledgeOfAnalysis(command) {
            if (command == "num") {
                if (this.knowledge.rank == 1) {
                    this.knowledge.rank = 2;
                    this.knowledge.analyzeKnowledgeRightList.sort(
                        util.sortByNumByDesc
                    );
                } else {
                    this.knowledge.rank = 1;
                    this.knowledge.analyzeKnowledgeRightList.sort(
                        util.sortByNumByAsc
                    );
                }
            } else if (command == "time") {
                if (this.knowledge.rank == 1) {
                    this.knowledge.rank = 2;
                    this.knowledge.analyzeKnowledgeRightDetailList.sort(
                        util.sortByTimeByDesc
                    );
                } else {
                    this.knowledge.rank = 1;
                    this.knowledge.analyzeKnowledgeRightDetailList.sort(
                        util.sortByTimeByAsc
                    );
                }
            }
        },
        changeYearMonth(num) {
            if (num != null) {
                this.knowledge.yearMonthType = num;
            }
            this.sumKnowledgeCategoryOfAnalyze();
            this.knowledge.animated = false;
            this.reloadPage();
            setTimeout(() => {
                this.knowledge.tabName = "knowledge-analysis";
            }, 1);
        },
        reloadPage() {
            this.$store.state.home.home.isRouterAlive = false;
            this.$nextTick(
                () => (this.$store.state.home.home.isRouterAlive = true)
            );
        },
        queryKnowledgeGraph(index) {
            this.$store.dispatch({
                type: "queryKnowledgeGraph",
                thisObj: this,
                index: index
            });
        },
        handle(name) {
            this.reloadPage();
            setTimeout(() => {
                this.knowledge.tabName = name;
            }, 1);
            this.knowledge.animated = true;
        },
        queryNoteCategory() {
            this.$store.dispatch({
                type: "queryNoteCategory",
                thisObj: this
            });
        },
        queryNoteCategoryIdByName(categoryName) {
            this.$store.dispatch({
                type: "queryNoteCategoryIdByName",
                thisObj: this,
                categoryName: categoryName
            });
        },
        echartsClickOfTree(params) {
            this.$store.dispatch({
                type: "echartsClickOfTree",
                id: params.data.id,
                name: params.data.name,
                isLeave: params.data.isLeave,
                thisObj: this
            });
        },
        saveNote() {
            this.knowledge.knowledgeList[
                this.knowledge.index
            ].note = this.knowledge.note;
            this.$store.dispatch({
                type: "saveNote",
                thisObj: this
            });
        },
        showNoteDetail(index) {
            this.knowledge.noteModal = true;
            this.knowledge.title = this.knowledge.knowledgeList[index].listName;
            this.knowledge.note = this.knowledge.knowledgeList[index].note;
            this.knowledge.index = index;
        },
        queryKnowledgeListByDate() {
            this.$store.dispatch({
                type: "queryKnowledgeListByDate",
                thisObj: this
            });
        },
        getNoteNumOfCurDate() {
            this.$store.dispatch({
                type: "getNoteNumOfCurDate",
                thisObj: this
            });
        },
        getNoteNumOfCurMonth() {
            this.$store.dispatch({
                type: "getNoteNumOfCurMonth",
                thisObj: this
            });
        },
        getNoteNumOfReview() {
            this.$store.dispatch({
                type: "getNoteNumOfReview",
                thisObj: this
            });
        },
        getKnowledgeDetail() {
            this.queryKnowledgeListByDate();
            this.getNoteNumOfCurDate();
            this.getNoteNumOfCurMonth();
            this.getNoteNumOfReview();
        }
    }
};
</script>
<style lang='less'>
@import "../style/knowledge.less";
</style>
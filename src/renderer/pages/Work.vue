<!--  -->
<template>
    <Tabs v-model="work.tabName" :animated="work.animated" v-on:on-click="handle">
        <TabPane name="weekly-report" label="周报" icon="android-create">
            <Date-picker :disabled=true class="Work-DatePicker" v-model="work.weekArr" type="daterange" confirm placement="bottom" placeholder="请选择一个日期范围..."></Date-picker>
            <Button-group shape="circle" style="float:right; margin-right:20px">
                <Button type="ghost" v-on:click="getPreWeek">上周</Button>
                <Button type="ghost" v-on:click="getCurWeek">本周</Button>
                <Button type="ghost" v-on:click="getNextWeek">下周</Button>
                <Button id="weekReportSaveBtn" type="ghost" v-on:click="saveWeeReport">
                    <a id="weekReportSave">另存为</a>
                </Button>
            </Button-group>
            <div id="weekReport" style="width:1006px;margin-bottom:10px;height:570px;margin-top:10px">
                <div v-for="(item, index) in work.weekReport" :key="index" style="padding-left:120px;padding-right:120px;margin-bottom:10px">
                    <h3 v-if="item.listName == null && item.type == 1" style="line-height:30px;text-align:left;margin-left:20px">{{item.projectName}} - {{item.moduleName}} - {{item.stepName}} :
                        <img style="width:30px;height:30px;float:left;margin-right:5px" src="../assets/img/new.png"></img>
                    </h3>
                    <h3 v-if="item.listName == null && item.type == 0" style="line-height:30px;text-align:left;margin-left:20px">{{item.projectName}} - {{item.moduleName}} - {{item.stepName}} :
                    </h3>
                    <h3 v-if="item.listName != null && item.type == 1" style="line-height:30px;text-align:left;margin-left:20px">{{item.projectName}} - {{item.moduleName}} - {{item.stepName}}({{item.listName}}) :
                        <img style="width:30px;height:30px;float:left;margin-right:5px" src="../assets/img/new.png"></img>
                    </h3>
                    <h3 v-if="item.listName != null && item.type == 0" style="line-height:30px;text-align:left;margin-left:20px">{{item.projectName}} - {{item.moduleName}} - {{item.stepName}}({{item.listName}}) :
                    </h3>
                    <div style="height:auto;width: 746px">
                        <h4 v-for="(obj, i) in item.remarks" :key="i" style="text-align:left; margin-left: 20px">{{i + 1}}. {{obj}}</h4>
                    </div>
                    <h4 style="text-align:right; margin-right: 20px; color:gray" v-if="item.curDateTime != null">创建时间为 {{item.curDateTime}}, 已完成 {{item.progress}} %, 耗时 {{item.consumeTime}} 分钟</h4>
                    <h4 style="text-align:right; margin-right: 20px; color:gray" v-if="item.curDateTime == null">还未开始, 已完成 {{item.progress}} %, 耗时 {{item.consumeTime}} 分钟</h4>
                </div>
            </div>
            <div>
            </div>
        </TabPane>
    </Tabs>
</template>
<script>
import Scrollbar from "smooth-scrollbar";
import { mapGetters, mapState } from "vuex";
import * as util from "@/utils/util.js";
// import "../plugs/pdfjs/jspdf.debug.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf/dist/jspdf.debug.js";

export default {
    data() {
        return {};
    },

    components: {
        // "mavon-editor": mavonEditor
    },

    computed: {
        ...mapGetters(["work"])
    },

    created() {
        console.log("work created====================================");
        if(this.work.weekArr[0] == undefined) {
            this.getWeekRange();
        }
        if(this.work.weekReport.length == 0) {
            this.getWeekReport();
        }
    },

    mounted() {
        console.log("work mounted====================================");
        Scrollbar.init(document.querySelector("#weekReport"));
        this.$Message.config({ top: 400, duration: 3 });
    },

    methods: {
        saveWeeReport() {
            setTimeout(() => {
                this.$nextTick(function() {
                    let weekStart = new Date(this.work.weekArr[0]).format("yyyy-MM-dd");
                    let weekEnd = new Date(this.work.weekArr[1]).format("yyyy-MM-dd");
                    let imgName =
                        "熊泽林" + weekStart + "-" + weekEnd + "周报.png";

                    html2canvas($("#weekReport")[0], {
                        allowTaint: true,
                        taintTest: false,
                        width: $("#weekReport")[0].scrollWidth,
                        height: $("#weekReport")[0].scrollHeight,
                    }).then(function(canvas) {
                        $("#weekReportSave").attr("href", canvas.toDataURL());
                        $("#weekReportSave").attr("download", imgName);
                    });
                });
            }, 10);
        },
        getWeekReport() {
            this.$store.dispatch({
                type: "getWeekReport",
                thisObj: this
            });
            this.saveWeeReport();
        },
        getPreWeek() {
            let weekStart = this.work.weekArr[0];
            let date = new Date(weekStart);
            var preDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
            this.$store.dispatch({
                type: "getWeekRange",
                thisObj: this,
                date: preDate
            });
            this.getWeekReport();
            this.reloadPage();
        },
        getNextWeek() {
            let weekEnd = this.work.weekArr[1];
            let date = new Date(weekEnd);
            var nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
            this.$store.dispatch({
                type: "getWeekRange",
                thisObj: this,
                date: nextDate
            });
            this.getWeekReport();
            this.reloadPage();
        },
        getCurWeek() {
            this.$store.dispatch({
                type: "getWeekRange",
                thisObj: this,
                date: new Date()
            });
            this.getWeekReport();
            this.reloadPage();
        },
        getWeekRange() {
            this.$store.dispatch({
                type: "getWeekRange",
                thisObj: this,
                date: new Date()
            });
        },
        deleteApi(id) {
            this.$alert("你确定要删除吗?", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                    this.$store.dispatch({
                        type: "deleteApi",
                        thisObj: this,
                        id: id
                    });
                    this.queryApis();
                }
            });
        },

        handle(name) {
            this.reloadPage();
            setTimeout(() => {
                this.other.tabName = name;
            }, 1);
            this.other.animated = true;
        },
        reloadPage() {
            this.$store.state.home.home.isRouterAlive = false;
            this.$nextTick(
                () => (this.$store.state.home.home.isRouterAlive = true)
            );
        }
    }
};
</script>
<style lang='less'>
@import "../style/work.less";
// .echarts {
//     width: 400px;
//     height: 400px;
// }
.ivu-modal-footer {
    display: none;
}
</style>
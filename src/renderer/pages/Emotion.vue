<!--  -->
<template>
    <Tabs v-model="emotion.tabName" :animated="emotion.animated" v-on:on-click="handle">
        <TabPane name="emotion-detail" label="情绪评估" icon="navicon-round">
            <div style="width:350px;height:350px;margin:0 auto;margin-top:100px">
                <Card :shadow="emotion.shadow" style="width:320px;height:400px;margin:0 auto;margin-top:30px">
                    <div style="width:286px;height:366px">
                        <DatePicker size="large" @on-change="queryEmotionByDate" class="Emotion-DatePicker" type="date" v-model="emotion.curDateTime"></DatePicker>
                        <hr style='background-color:#ddd;height:1px;border:none;'>
                        <div style="width:286px;height:286px;">
                            <div style="width:286px;height:60px;margin-bottom:20px">
                                <h4 style="text-align:left;margin:20px 0px 10px 0px">情绪指数</h4>
                                <Rate style="float:left" show-text v-model="emotion.emotionObj.rate">
                                    <span style="color: #f5a623;margin-left:135px;margin-bottom:20px">{{ emotion.emotionObj.rate }}</span>
                                </Rate>
                            </div>
                            <div style="width:286px;height:60px;margin-bottom:20px">
                                <h4 style="text-align:left;margin:20px 0px 10px 0px">情绪状态</h4>
                                <RadioGroup v-model="emotion.emotionObj.state" style="text-align:left;">
                                    <Radio style="margin-bottom:10px" label="0">高兴</Radio>
                                    <Radio style="margin-bottom:10px" label="1">平静</Radio>
                                    <Radio style="margin-bottom:10px" label="2">兴奋</Radio>
                                    <Radio style="margin-bottom:10px" label="3">低落</Radio>
                                    <Radio style="margin-bottom:10px" label="4">忧伤</Radio>
                                    <Radio style="margin-bottom:10px" label="5">生气</Radio>
                                    <Radio style="margin-bottom:10px" label="6">思念</Radio>
                                </RadioGroup>
                            </div>
                            <div style="width:286px;height:50px;margin-top:40px">
                                <h4 style="text-align:left;margin:20px 0px 10px 0px">备注</h4>
                                <Input style="width: 286px" v-model="emotion.emotionObj.remark" placeholder="请输入..."></Input>
                            </div>
                            <Button v-if="emotion.emotionObj.id != null" style="float:right;margin-top:40px" type="success" @click="updateEmotion">更新</Button>
                            <Button v-if="emotion.emotionObj.id == null" style="float:right;margin-top:40px" type="success" @click="addEmotion">添加</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </TabPane>
        <TabPane name="emotion-analyze" label="情绪分析" icon="ios-lightbulb">
            <div>
                <div style="width:600px;height:610px;display:inline-block;float:left">
                    <div style="width:600px;height:50px;text-align:center;">
                        <ButtonGroup size="default" style="margin:10px 5px 10px 0px;">
                            <Button v-on:click="changeYearMonth(2)" v-if="emotion.emotionAnaYearMonthType == 2" type="primary">年</Button>
                            <Button v-on:click="changeYearMonth(2)" v-if="emotion.emotionAnaYearMonthType != 2" type="ghost">年</Button>
                            <Button v-on:click="changeYearMonth(1)" v-if="emotion.emotionAnaYearMonthType == 1" type="primary">月</Button>
                            <Button v-on:click="changeYearMonth(1)" v-if="emotion.emotionAnaYearMonthType != 1" type="ghost">月</Button>
                        </ButtonGroup>
                        <span v-if="emotion.emotionAnaYearMonthType == 1">
                            <DatePicker type="month" format="yyyy-MM" @on-change="changeYearMonth(null)" class="Emotion-Analyze-DatePicker" v-model="emotion.analyzeYearMonth"></DatePicker>
                        </span>
                        <span v-if="emotion.emotionAnaYearMonthType == 2">
                            <DatePicker type="year" format="yyyy" @on-change="changeYearMonth(null)" class="Emotion-Analyze-DatePicker" v-model="emotion.analyzeYearMonth"></DatePicker>
                        </span>
                    </div>
                    <div class="echarts" style="margin:50px 0px 0 50px">
                        <IEcharts style="width:600px;height:520px" :option="emotion.emotionPie" />
                    </div>
                </div>
                <div>
                    <ButtonGroup size="default" style="display:inline-block;float:left">
                        <Button style="width:400px" type="primary">情绪分析</Button>
                    </ButtonGroup>
                </div>
                <div id="emotionAnalyze" style="width:406px;height:570px;display:inline-block;float:right">
                    <div v-on:click="queryEmotionAnaDetailData(index)" v-for="(item, index) in emotion.emotionAnaList" :key="index" style="width:406px;height:50px;display:inline-block;margin-bottom:-5px;cursor:pointer;border-bottom: 1px solid #ddd;">
                        <img v-if="item.state == '0'" src="../assets/img/emotion/happy.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '1'" src="../assets/img/emotion/calm.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '2'" src="../assets/img/emotion/excited.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '3'" src="../assets/img/emotion/sad.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '4'" src="../assets/img/emotion/cry.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '5'" src="../assets/img/emotion/angry.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '6'" src="../assets/img/emotion/miss.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img src="../assets/img/arrow.png" style="float:right;width:24px;height:24px;margin:13px 0px 0 0px">
                        <strong style="font-size:14px;font-weight:bolder;float:left;margin:15px 0 0 10px">{{item.emotionStr}} {{item.stateDegree}}%({{item.countState}}/{{item.totalState}})</strong>
                        <strong style="font-size:14px;font-weight:bolder;float:right;margin:15px 10px 0 0px">{{item.countState}}天</strong>
                    </div>
                </div>
            </div>
            <Modal :mask-closable="false" v-model="emotion.emotionDetailModal" :styles="{top: '200px', width:'500px', height:'500px'}" title="情绪详情!">
                <div style="margin-bottom:10px">
                    <ButtonGroup>
                        <Button style="width:468px" type="primary">情绪详情</Button>
                    </ButtonGroup>
                </div>
                <div id="emotionAnalyzeDetail" style="width:468px;height:450px;display:inline-block;">
                    <div v-for="(item, index) in emotion.emotionAnaDetailList" :key="index" style="width:468px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <img v-if="item.state == '0'" src="../assets/img/emotion/happy.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '1'" src="../assets/img/emotion/calm.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '2'" src="../assets/img/emotion/excited.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '3'" src="../assets/img/emotion/sad.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '4'" src="../assets/img/emotion/cry.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '5'" src="../assets/img/emotion/angry.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '6'" src="../assets/img/emotion/miss.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.emotionStr}}</strong>
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">{{item.remark}}</strong>
                        </div>
                        <strong style="text-align:right;font-size:14px;font-weight:bolder;float:right;margin:0px 10px 0 0px">{{item.curDateTime}}</strong>
                    </div>
                </div>
            </Modal>
        </TabPane>
        <TabPane name="emotion-trend" label="情绪趋势" icon="stats-bars">
            <div>
                <div style="width:600px;height:610px;display:inline-block;float:left">
                    <div style="width:600px;height:50px;text-align:center;">
                        <ButtonGroup size="default" style="margin:0px 10px 0 10px;">
                            <Button v-on:click="changeYearMonthOfTrend(2)" v-if="emotion.emotionTrendYearMonthType == 2" type="primary">年</Button>
                            <Button v-on:click="changeYearMonthOfTrend(2)" v-if="emotion.emotionTrendYearMonthType != 2" type="ghost">年</Button>
                            <Button v-on:click="changeYearMonthOfTrend(1)" v-if="emotion.emotionTrendYearMonthType == 1" type="primary">月</Button>
                            <Button v-on:click="changeYearMonthOfTrend(1)" v-if="emotion.emotionTrendYearMonthType != 1" type="ghost">月</Button>
                        </ButtonGroup>
                        <span v-if="emotion.emotionTrendYearMonthType == 1">
                            <DatePicker type="month" format="yyyy-MM" @on-change="changeYearMonthOfTrend(null)" class="Emotion-Analyze-DatePicker" v-model="emotion.trendYearMonth"></DatePicker>
                        </span>
                        <span v-if="emotion.emotionTrendYearMonthType == 2">
                            <DatePicker type="year" format="yyyy" @on-change="changeYearMonthOfTrend(null)" class="Emotion-Analyze-DatePicker" v-model="emotion.trendYearMonth"></DatePicker>
                        </span>
                    </div>
                    <div class="echarts" style="margin:50px 0 0 0px;width:600px;height:600px">
                        <IEcharts style="width:600px;height:520px" :option="emotion.emotionLineBar" />
                    </div>
                </div>
                <div>
                    <ButtonGroup size="default" style="display:inline-block;float:left">
                        <Button style="width:400px" type="primary">情绪详情</Button>
                    </ButtonGroup>
                </div>
                <div id="emotionTrend" style="width:406px;height:570px;display:inline-block;float:right">
                    <div v-if="emotion.emotionTrendYearMonthType == 1" v-for="(item, index) in emotion.emotionTrendList" :key="index" style="width:406px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <img v-if="item.state == '0'" src="../assets/img/emotion/happy.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '1'" src="../assets/img/emotion/calm.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '2'" src="../assets/img/emotion/excited.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '3'" src="../assets/img/emotion/sad.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '4'" src="../assets/img/emotion/cry.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '5'" src="../assets/img/emotion/angry.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <img v-if="item.state == '6'" src="../assets/img/emotion/miss.png" style="float:left;width:32px;height:32px;margin:9px 0 0 10px">
                        <div style="width:300px;display:inline-block:float:left">
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.emotionStr}}</strong>
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">情绪指数: {{item.rate}}</strong>
                        </div>
                        <strong style="text-align:right;font-size:14px;font-weight:bolder;float:right;margin:0px 10px 0 0px">{{item.curDateTime}}</strong>
                    </div>
                    <div v-if="emotion.emotionTrendYearMonthType == 2" v-for="(item, index) in emotion.emotionTrendList" :key="index" style="width:406px;height:50px;display:inline-block;margin-bottom:-5px;border-bottom: 1px solid #ddd;">
                        <div style="width:300px;height:30px;margin-left:10px;text-align:left">
                            <Rate disabled v-model="item.rateDegreeOfMonth"></Rate>
                        </div>
                        <div style="width:300px;display:inline-block:float:left;margin-top:-8px">
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:5px 0px 0 10px;text-align:left">{{item.emotionStr}}</strong>
                            <strong style="width:220px;font-size:14px;font-weight:bolder;float:left;margin:0px 0 0 10px;text-align:left">情绪指数: {{item.rateDegreeOfMonth}} ( {{item.sumRate}} / {{item.countRate}} )</strong>
                        </div>
                        <strong style="text-align:right;font-size:14px;font-weight:bolder;float:right;margin:0px 10px 0 0px">{{item.curDateTime}}</strong>
                    </div>
                </div>
            </div>
        </TabPane>
    </Tabs>
</template>

<script>
import Scrollbar from "smooth-scrollbar";
import { mapGetters, mapState } from "vuex";
import IEcharts from "vue-echarts-v3/src/full.js";
import * as emotionUtil from "@/utils/emotionUtil.js";
import * as util from "@/utils/util.js";

export default {
    data() {
        return {};
    },

    components: {
        IEcharts
    },

    computed: {
        ...mapGetters(["emotion"])
    },

    created() {
        console.log("emotion created====================================");
        this.queryEmotionByDate();
        this.queryEmotionAnaData();
        this.queryEmotionTrendData();
    },

    mounted() {
        console.log("emotion mounted====================================");
        Scrollbar.init(document.querySelector("#emotionAnalyze"));
        Scrollbar.init(document.querySelector("#emotionTrend"));
        Scrollbar.init(document.querySelector("#emotionAnalyzeDetail"));
        this.$Message.config({ top: 400, duration: 3 });
    },

    methods: {
        queryEmotionTrendData() {
            this.$store.dispatch({
                type: "queryEmotionTrendData",
                thisObj: this
            });
        },
        changeYearMonthOfTrend(emotionTrendYearMonthType) {
            if (null != emotionTrendYearMonthType) {
                this.emotion.emotionTrendYearMonthType = emotionTrendYearMonthType;
            }
            this.queryEmotionTrendData();
            this.emotion.animated = false;
            this.reloadPage();
        },
        queryEmotionAnaDetailData(index) {
            this.$store.dispatch({
                type: "queryEmotionAnaDetailData",
                thisObj: this,
                index: index
            });
        },
        changeYearMonth(emotionAnaYearMonthType) {
            if (null != emotionAnaYearMonthType) {
                this.emotion.emotionAnaYearMonthType = emotionAnaYearMonthType;
            }
            this.queryEmotionAnaData();
        },
        queryEmotionAnaData() {
            this.$store.dispatch({
                type: "queryEmotionAnaData",
                thisObj: this
            });
        },
        updateEmotion() {
            this.$store.dispatch({
                type: "updateEmotion",
                thisObj: this
            });
        },
        isShowEmotionDetail() {
            if (this.emotion.emotionObj == null) {
                document.getElementById("Emotion-Detail").style.display =
                    "none";
                document.getElementById("Emotion-Add").style.display = "block";
            } else {
                document.getElementById("Emotion-Detail").style.display =
                    "block";
                document.getElementById("Emotion-Add").style.display = "none";
            }
        },
        addEmotion() {
            this.$store.dispatch({
                type: "addEmotion",
                thisObj: this
            });
            this.queryEmotionByDate();
        },
        showEmotionDetailModal() {
            this.emotion.emotionDetailModal = true;
        },
        queryEmotionByDate() {
            this.$store.dispatch({
                type: "queryEmotionByDate",
                thisObj: this
            });
        },
        handle(name) {
            this.reloadPage();
            setTimeout(() => {
                this.emotion.tabName = name;
            }, 1);
            this.emotion.animated = true;
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
@import "../style/emotion.less";
// .echarts {
//     width: 400px;
//     height: 400px;
// }
#incomeModal .ivu-modal-footer {
    display: none;
}
</style>
<!--  -->
<template>
    <Tabs v-model="question.tabName" :animated="question.animated" v-on:on-click="handle">
        <TabPane name="question-list" label="问题清单" icon="help">
            <div style="width:342px; height:615px;display:inline-block; float:left; border-right: 1px solid #ddd; box-shadow: 0 0 5px #ccc;">
                <div style="width:342px;height:32px;background:#41B883">
                    <h3 style="height:32px;line-height:32px;float:left;display:inline-block;margin-left:20px">问题
                        <span v-on:click="question.questionModal = true" style="cursor:pointer;margin-left:10px">
                            <Icon style="font-size:16px" type="plus-round"></Icon>
                        </span>
                    </h3>
                </div>
                <div id="question-list" style="width:342px;height:583px;">
                    <div style="width:342px;height:10px"></div>
                    <div v-for="(item, index) in question.questions" :key="index" style="width:342px;height:32px;margin-bottom:5px">
                        <span v-on:click="showQuestionModal(item, index)" style="font-weight:bolder;height:32px;width:280px;line-height:32px;float:left;text-align:left;margin-left:20px;cursor:pointer">{{index + 1}}. {{item.questionStr}}</span>
                        <span v-on:click="deleteQuestion(item.id, index)" style="height:32px;width:42px;line-height:32px;mergin-right:10px">
                            <Icon style="cursor:pointer;font-size:14px;" type="close-round"></Icon>
                        </span>
                    </div>
                </div>
            </div>
            <div style="width:620px;height:565px;display: inline-block;float:right">
                <div style="width:620px;height:40px;line-height:40px">
                    <DatePicker v-on:on-change="queryAnswersByDate" class="question-datePicker" type="date" v-model="answer.curDateTime"></DatePicker>
                </div>
                <div id="question-list-day" style="width:620px; height:525px;">
                    <div v-for="(item, index) in answer.answers" :key="index" style="width:620px;height:50px;margin-bottom:10px;">
                        <span style="font-weight:bolder;height:32px;width:620px;line-height:32px;float:left;text-align:left;">{{index + 1}}. {{item.questionStr}}</span>
                        <span style="float:left; margin-left:20px">
                            <Radio-group v-model="item.answerType">
                                <Radio label="1" value="1">yes</Radio>
                                <Radio label="0" value="0">no</Radio>
                            </Radio-group>
                        </span>
                    </div>
                </div>
                <div style="margin-top:10px;">
                    <Button type="success" @click="addAnswers">提交</Button>
                </div>
            </div>

            <Modal :mask-closable="false" @on-visible-change="closeQuestionModal" v-model="question.questionModal" :styles="{top: '300px', width:'600px', height:'300px'}" title="添加问题">
                <div style="width:568px;">
                    <div style="width:568px;height:60px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">问题</h4>
                        <Input v-model="question.questionStr" placeholder="请输入..." style="width: 568px"></Input>
                    </div>
                    <div style="text-align:right">
                        <Button v-if="question.operType == 1" type="success" @click="addQuestion">添加</Button>
                        <Button v-if="question.operType == 2" type="success" @click="updateQuestion">更新</Button>
                    </div>
                </div>

            </Modal>

        </TabPane>
    </Tabs>
</template>
<script>
import Scrollbar from "smooth-scrollbar";
import { mapGetters, mapState } from "vuex";
import * as util from "@/utils/util.js";

export default {
    data() {
        return {
            animal: "1"
        };
    },

    components: {},

    computed: {
        ...mapGetters(["question", "answer"])
    },

    created() {
        console.log("question created====================================");
        this.queryQuestions();
        this.queryAnswersByDate();
    },

    mounted() {
        console.log("question mounted====================================");
        Scrollbar.init(document.querySelector("#question-list"));
        Scrollbar.init(document.querySelector("#question-list-day"));
        this.$Message.config({ top: 400, duration: 3 });
    },

    methods: {
        addAnswers() {
            this.$store.dispatch({
                type: "addAnswers",
                thisObj: this
            });
        },
        queryAnswersByDate() {
            this.$store.dispatch({
                type: "queryAnswersByDate",
                thisObj: this
            });
        },
        showQuestionModal(questionObj, index) {
            this.$store.dispatch({
                type: "showQuestionModal",
                thisObj: this,
                questionObj: questionObj,
                index: index
            });
        },
        deleteQuestion(id, index) {
            this.$alert("你确定要删除吗?", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                    this.$store.dispatch({
                        type: "deleteQuestion",
                        thisObj: this,
                        id: id,
                        index: index
                    });
                    this.queryAnswersByDate();
                }
            });
        },
        closeQuestionModal(flag) {
            if (!flag) {
                if (this.question.operType == 1) {
                    this.reloadPage();
                }
            }
        },
        addQuestion() {
            this.$store.dispatch({
                type: "addQuestion",
                thisObj: this
            });
        },
        queryQuestions() {
            this.$store.dispatch({
                type: "queryQuestions",
                thisObj: this
            });
        },
        updateQuestion() {
            this.$store.dispatch({
                type: "updateQuestion",
                thisObj: this
            });
        },
        handle(name) {
            this.reloadPage();
            setTimeout(() => {
                this.question.tabName = name;
            }, 1);
            this.question.animated = true;
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
@import "../style/question.less";
.ivu-modal-footer {
    display: none;
}
</style>
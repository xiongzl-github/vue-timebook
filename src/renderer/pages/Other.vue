<!--  -->
<template>
    <Tabs v-model="other.tabName" :animated="other.animated" v-on:on-click="handle">
        <TabPane name="other-memo" label="备忘录" icon="android-create">
            <div style="width:1005px;height:50px;margin-bottom:5px">
                <div style="display:inline-block;width:500px;margin-left:55px;">
                    <Input v-model="memo.searchStr">
                    <Button v-on:click="queryMemos" slot="append" icon="ios-search"></Button>
                    </Input>
                </div>
                <span v-on:click="memo.memoModal = true" style="float:right;margin-right:58px;margin-top:5px;cursor:pointer">
                    <Icon style="font-size:24px;" type="plus-round"></Icon>
                </span>
            </div>
            <div id="Memo-Detail" style="width:1005px;height:525px;padding-left:60px;">
                <Card v-for="(item, index) in memo.memos" :key="index" style="width:162px;display:inline-block;margin:0 20px 20px 0px;float:left;">
                    <span v-on:click="deleteMemo(item.id)" style="float:right; margin-top:-25px;margin-right:-25px">
                        <Icon style="font-size:18px;cursor:pointer" type="close-round" />
                    </span>
                    <div style="text-align:center">
                        <h4 style="">{{item.subject}}</h4>
                        <div style="width:128px;height:94px;">
                            <h4 style="padding-top:15px">{{item.desc}} ...</h4>
                            <Button-group style="margin-top:10px">
                                <Button v-on:click="showMemoModal(index, item.isLocked, item.password)" style="margin-right:10px" type="primary" size="small">更新</Button>
                                <Button v-on:click="showMemoDetail(index, item.isLocked, item.password)" style="margin-left:10px" type="primary" size="small">详情</Button>
                            </Button-group>
                        </div>
                    </div>
                </Card>
            </div>
            <div style="margin-top:25px">
                <Page :total=memo.totalNum :current.sync=memo.curPageNum :page-size=memo.pageSize @on-change="changeMemoPage" size="small"></Page>
            </div>
            <Modal :mask-closable="false" v-model="memo.memoDetailModal" :styles="{top: '300px', width:'600px', height:'300px'}" title="备忘录详情">
                <div style="width:568px;">
                    <h4 style="margin-bottom:10px; text-align:center">{{memo.memoObj.subject}}</h4>
                    <div style="width:568px;height:250px;margin-bottom:20px">
                        <div id="memo-content-tags-detail" style="width:568px;height:180px;">
                            <div v-for="(item, index) in memo.memoObj.memoContentTags" :key="index">
                                <Tag type="dot" color="green">{{item}}</Tag>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal @on-visible-change="closeMemoModal" id="memoModal" :mask-closable="false" v-model="memo.memoModal" :styles="{top: '300px', width:'600px', height:'300px'}" title="添加备忘录">
                <div style="width:568px;">
                    <div style="width:568px;height:60px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">主题</h4>
                        <Input v-model="memo.subject" placeholder="请输入..." style="width: 568px"></Input>
                    </div>
                    <div style="width:568px;height:250px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">内容</h4>
                        <div style="margin-bottom:10px">
                            <Input v-model="memo.content" placeholder="请输入..." style="width: 500px;"></Input>
                            <Button v-on:click="addMemoContentTag" style="display:inline-block;float:right" type="primary">添加</Button>
                        </div>
                        <div id="memo-content-tags" style="width:568px;height:180px;">
                            <div v-for="(item, index) in memo.memoContentTags" :key="index">
                                <Tag v-on:on-close="deleteMemoContentTag(index)" type="dot" closable color="green">{{item}}</Tag>
                            </div>
                        </div>
                    </div>
                    <div style="width:568px;height:45px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">是否加密</h4>
                        <Radio-group v-model="memo.isLocked">
                            <Radio label="1">加密</Radio>
                            <Radio label="0">不加密</Radio>
                        </Radio-group>
                    </div>
                    <div v-if="memo.isLocked == '1'" style="width:568px;height:60px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">密码</h4>
                        <Input v-model="memo.password" placeholder="请输入..." style="width: 568px"></Input>
                    </div>
                    <div style="text-align:right" slot="footer">
                        <Button v-if="memo.operType == 1" type="success" @click="addMemo">添加</Button>
                        <Button v-if="memo.operType == 2" type="success" @click="updateMemo">更新</Button>
                    </div>
                </div>
            </Modal>
        </TabPane>
        <TabPane name="other-motto" label="座右铭" icon="android-checkmark-circle">
            <div style="width:1005px;height:50px;margin-bottom:5px">
                <div style="display:inline-block;width:500px;margin-left:55px;">
                    <Input v-model="motto.searchStr">
                    <Button v-on:click="queryMottos" slot="append" icon="ios-search"></Button>
                    </Input>
                </div>
                <span v-on:click="motto.mottoModal = true" style="float:right;margin-right:100px;margin-top:5px;cursor:pointer">
                    <Icon style="font-size:24px;" type="plus-round"></Icon>
                </span>
            </div>
            <div id="Motto-Detail" style="width:805px;height:525px;margin-left:100px;">
                <div v-for="(item, index) in motto.mottos" :key="index" style="width:805px;height:42px;margin-bottom:18px;border-bottom: 1px solid #ddd;">
                    <div style="display:inline-block;float:left;width:680px;text-align:left;">
                        <!-- <Tag type="dot" style="font-size:14px;font-weight:bolder;border:none" color="green">标签二标签二标签二标签二标签二标签二标签二标签二标签二标签二标签二标签二</Tag> -->
                        <h3 v-if="item.mottoStr.length > 45" :title="item.mottoStr">{{index + 1}}. {{item.briefMottoStr}} ...</h3>
                        <h3 v-if="item.mottoStr.length <= 45" :title="item.mottoStr">{{index + 1}}. {{item.mottoStr}}</h3>
                    </div>
                    <div style="display:inline-block;float:left;width:680px;text-align:right;font-weight:bolder;padding-bottom:3px">--- {{item.author}}</div>
                    <div>
                        <Button-group size="small" shape="circle">
                            <Button v-on:click="deleteMotto(item.id)" type="ghost">
                                <Icon type="close-round"></Icon>
                                删除
                            </Button>
                            <Button v-on:click="showMottoModal(index)" type="ghost">
                                <Icon type="edit"></Icon>
                                更新
                            </Button>
                        </Button-group>
                    </div>
                </div>
            </div>
            <div style="margin-top:15px">
                <Page :total=motto.totalNum :current.sync=motto.curPageNum :page-size=motto.pageSize @on-change="changeMottoPage" size="small"></Page>
            </div>
            <Modal @on-visible-change="closeMottoModal" id="memoModal" :mask-closable="false" v-model="motto.mottoModal" :styles="{top: '300px', width:'600px', height:'300px'}" title="座右铭">
                <div style="width:568px;">
                    <div style="width:568px;height:122px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">名言</h4>
                        <Input type="textarea" :rows="4" v-model="motto.mottoStr" placeholder="请输入..." style="width: 568px"></Input>
                    </div>
                    <div style="width:568px;height:60px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">作者</h4>
                        <Input v-model="motto.author" placeholder="请输入..." style="width: 568px"></Input>
                    </div>
                    <div style="text-align:right" slot="footer">
                        <Button v-if="motto.operType == 1" type="success" @click="addMotto">添加</Button>
                        <Button v-if="motto.operType == 2" type="success" @click="updateMotto">更新</Button>
                    </div>
                </div>
            </Modal>
        </TabPane>
        <TabPane name="other-api" label="api 管理" icon="pull-request">
            <div style="width:1005px;height:50px;margin-bottom:5px">
                <div style="display:inline-block;width:500px;margin-left:55px;">
                    <Input v-model="api.searchStr">
                    <Button v-on:click="queryApis" slot="append" icon="ios-search"></Button>
                    </Input>
                </div>
                <span v-on:click="showApiModal(1, null)" style="float:right;margin-right:58px;margin-top:5px;cursor:pointer">
                    <Icon style="font-size:24px;" type="plus-round"></Icon>
                </span>
            </div>
            <div id="Api-Detail" style="width:1005px;height:525px;padding-left:60px;">
                <Card v-for="(item, index) in api.apis" :key="index" style="width:162px;display:inline-block;margin:0 20px 20px 0px;float:left;">
                    <span v-on:click="deleteApi(item.id)" style="float:right; margin-top:-25px;margin-right:-25px">
                        <Icon style="font-size:18px;cursor:pointer" type="close-round" />
                    </span>
                    <div style="text-align:center">
                        <h4 style="">{{item.lanStr}} - {{item.toolStr}}</h4>
                        <div style="width:128px;height:94px;">
                            <h4 style="padding-top:15px">{{item.methodName}}</h4>
                            <Button-group style="margin-top:10px">
                                <Button v-on:click="showApiModal(2, item)" style="margin-right:10px" type="primary" size="small">更新</Button>
                                <Button v-on:click="showApiDetail(item)" style="margin-left:10px" type="primary" size="small">详情</Button>
                            </Button-group>
                        </div>
                    </div>
                </Card>
            </div>
            <div style="margin-top:25px">
                <Page :total=api.totalNum :current.sync=api.curPageNum :page-size=api.pageSize @on-change="changeApiPage" size="small"></Page>
            </div>
            <Modal @on-visible-change="closeApiModal" id="apiModal" :mask-closable="false" v-model="api.apiModal" :styles="{top: '300px', width:'600px', height:'300px'}" title="API">
                <div style="width:568px;">
                    <div style="width:568px;height:60px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">语言类别</h4>
                        <el-select v-on:change="lanChange" size="small" style="width:530px" v-model="api.lanId" filterable placeholder="请选择">
                            <el-option v-for="(item, i) in api.lan.apiLanCategorys" :key="i" :value="item.value" :label="item.label">
                            </el-option>
                        </el-select>
                        <span v-on:click="showApiLanModal">
                            <Icon style="font-size:24px;margin-left:10px;vertical-align:middle;cursor:pointer" type="plus-round"></Icon>
                        </span>
                    </div>
                    <div style="width:568px;height:60px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">工具类名称</h4>
                        <el-select v-on:change="toolChange" size="small" style="width:530px" v-model="api.toolId" filterable placeholder="请选择">
                            <el-option v-for="(item, index) in api.tool.apiToolCategorys" :key="index" :value="item.value" :label="item.label">
                            </el-option>
                        </el-select>
                        <span v-on:click="showApiToolModal">
                            <Icon style="font-size:24px;margin-left:10px;vertical-align:middle;cursor:pointer" type="plus-round"></Icon>
                        </span>
                    </div>
                    <div style="width:568px;height:60px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">方法名</h4>
                        <Input v-model="api.methodName" placeholder="请输入..." style="width: 568px"></Input>
                    </div>
                    <div style="width:568px;height:80px;margin-bottom:20px">
                        <h4 style="margin-bottom:10px">方法说明</h4>
                        <Input type="textarea" :rows="2" v-model="api.methodIntro" placeholder="请输入..." style="width: 568px"></Input>
                    </div>
                    <div style="width:568px;height:60px;margin-bottom:20px">
                        <h3 style="display:inline-block;float:left;margin-bottom:10px">方法</h3>
                        <span v-on:click="api.apiMethodModal = true">
                            <Icon style="cursor:pointer;font-size:22px;float:left;margin:-2px 0px 0px 5px" type="compose"></Icon>
                        </span>
                        <Input v-model="api.method" placeholder="请输入..." style="width: 568px"></Input>
                    </div>
                    <div style="text-align:right" slot="footer">
                        <Button v-if="api.operType == 1" type="success" @click="addApi">添加</Button>
                        <Button v-if="api.operType == 2" type="success" @click="updateApi">更新</Button>
                    </div>
                </div>
            </Modal>
            <Modal :mask-closable="false" v-model="api.lan.apiLanModal" :styles="{top: '300px', width:'600px', height:'300px'}" title="API语言类别">
                <div style="width:568px;height:300px">
                    <div id="apiLanCategory" style="width:150px;height:300px;display:inline-block;float:left;margin-right:20px;padding:10px">
                        <div style="margin-bottom:10px" v-for="(item, index) in api.lan.apiLanCategorys" :key="index">
                            <span>{{item.label}}</span>
                            <span v-on:click="deleteApiLanCategory(item.value)" style="float:right;margin-right:10px">
                                <Icon type="close-round"></Icon>
                            </span>
                        </div>
                    </div>
                    <div style="width:398px;height:60px;display:inline-block;float:left">
                        <h4 style="margin-bottom:10px">语言类别</h4>
                        <Input v-model="api.lan.lanStr" placeholder="请输入..." style="width: 398px"></Input>
                    </div>
                    <div style="float:right;margin-top:20px;display:inline-block" slot="footer">
                        <Button type="success" @click="addLan">添加</Button>
                    </div>
                </div>
            </Modal>
            <Modal :mask-closable="false" v-model="api.tool.apiToolModal" :styles="{top: '300px', width:'600px', height:'300px'}" title="API工具类类别">
                <div style="width:568px;height:300px">
                    <div id="apiToolCategory" style="width:150px;height:300px;display:inline-block;float:left;margin-right:20px;padding:10px">
                        <div style="margin-bottom:10px" v-for="(item, index) in api.tool.apiToolCategorys" :key="index">
                            <span>{{item.label}}</span>
                            <span v-on:click="deleteApiToolCategory(item.value)" style="float:right;margin-right:10px">
                                <Icon type="close-round"></Icon>
                            </span>
                        </div>
                    </div>
                    <div style="width:398px;height:60px;display:inline-block;float:left">
                        <h4 style="margin-bottom:10px">语言类别</h4>
                        <Input v-model="api.tool.toolStr" placeholder="请输入..." style="width: 398px"></Input>
                    </div>
                    <div style="float:right;margin-top:20px;display:inline-block" slot="footer">
                        <Button type="success" @click="addTool">添加</Button>
                    </div>
                </div>
            </Modal>
            <Modal :mask-closable="false" @on-visible-change="closeApiDetailModal" v-model="api.apiDetailModal" :styles="{top: '200px', width:'800px', height:'300px'}" title="API详情">
                <div style="width:768px;height:21px;margin-bottom:20px">
                    <Breadcrumb>
                        <Breadcrumb-item style="font-weight:bolder;color:black">{{api.lanStr}}</Breadcrumb-item>
                        <Breadcrumb-item style="font-weight:bolder;color:black">{{api.toolStr}}</Breadcrumb-item>
                        <Breadcrumb-item>{{api.methodName}}</Breadcrumb-item>
                    </Breadcrumb>
                </div>
                <div style="width:768px;height:550px;">
                    <mavon-editor style="height:550px" :toolbarsFlag="false" :subfield="false" defaultOpen="preview" codeStyle="googlecode" :toolbars="knowledge.toolbars" v-model="api.method" />
                </div>
            </Modal>
            <Modal :mask-closable="false" v-model="api.apiMethodModal" :styles="{top: '150px',width:'1100px',height:'600px'}" title="添加方法!">
                <div>
                    <mavon-editor style="height:600px" :codeStyle="timeMachine.codeStyle" :toolbars="timeMachine.toolbars" v-model="api.method" />
                </div>
            </Modal>
        </TabPane>
        <TabPane name="test" label="测试" icon="android-create">
            <h1>hello world</h1>
            <Button v-on:click="testCmd" style="margin:35px 0 0 395px" type="success">确定</Button>

        </TabPane>

    </Tabs>
</template>
<script>
import Scrollbar from "smooth-scrollbar";
import { mapGetters, mapState } from "vuex";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import * as util from "@/utils/util.js";
import * as mottoUtil from "@/utils/mottoUtil.js";
import cmd from "node-cmd";
// import jvm from "node-jvm"
// import newman from "newman";
// var newman = require('newman');
export default {
    data() {
        return {};
    },

    components: {
        "mavon-editor": mavonEditor
    },

    computed: {
        ...mapGetters([
            "memo",
            "motto",
            "other",
            "api",
            "timeMachine",
            "knowledge"
        ])
    },

    created() {
        console.log("other created====================================");
        this.queryMemos();
        this.queryMottos();
        this.queryApis();
    },

    mounted() {
        console.log("other mounted====================================");
        Scrollbar.init(document.querySelector("#memo-content-tags"));
        Scrollbar.init(document.querySelector("#memo-content-tags-detail"));
        Scrollbar.init(document.querySelector("#apiLanCategory"));
        Scrollbar.init(document.querySelector("#apiToolCategory"));
        this.$Message.config({ top: 400, duration: 3 });
    },

    methods: {
        testCmd() {
            // this.test03();
            // this.test04('cd E:\\project\\testNG-demo && mvn test');
            this.test04('java -jar E:\\project\\jmeter-demo\\target\\demo-0.0.1-SNAPSHOT.jar');
        },
        test04(cmd) {
            var exec = require("child_process").exec;
            exec(cmd, function(error, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                if (error) {
                    console.error(error);
                } else {
                    console.log("success");
                }
            });
        },
        test01() {
            let command = "ping www.baidu.com";
            let command02 = "java -version";
            cmd.get(command, function(err, data, stderr) {
                console.log(data);
            });
            cmd.run(command);
        },
        test03() {
            const newman = require("newman");
            let collectionPath =
                "D:\\Passing Postman collection.postman_collection.json";
            let envPath = "D:\\trello.postman_environment.json";
            newman
                .run(
                    {
                        collection:
                            "https://api.getpostman.com/collections/246153-4c7e6507-6f2d-42db-82a5-9328078f61ef?apikey=PMAK-5d8034d87a54e3002adb4169-240a7afbea6445b972458ee8e8a54ba88b",
                        environment:
                            "https://api.getpostman.com/environments/246153-39b2af0a-1c86-401a-9a5b-f39e939875af?apikey=PMAK-5d8034d87a54e3002adb4169-240a7afbea6445b972458ee8e8a54ba88b",
                        // collection: require('./Passing Postman collection.postman_collection.json'),
                        // environment: require('./trello.postman_environment.json'),
                        reporters: "cli"
                    },
                    function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log("collection run complete!");
                    }
                )
                .on("request", function() {
                    console.log(arguments[1].response);
                    console.log(arguments[1].request);
                })
                .on("done", function() {});
        },
        test02() {
            // var JVM = require("node-jvm");
            // var jvm = new JVM();
            // jvm.setLogLevel(7);
            // var entryPointClassName = jvm.loadJarFile(
            //     "demo-0.0.1-SNAPSHOT.jar"
            // );
            // jvm.setEntryPointClassName(entryPointClassName);
            // jvm.on("exit", function(code) {
            //     process.exit(code);
            // });
            // jvm.run([15]);
        },
        closeApiDetailModal(flag) {
            if (!flag) {
                this.$store.dispatch({
                    type: "closeApiDetailModal",
                    thisObj: this
                });
            }
        },
        lanChange(p) {
            this.api.lanChange = true;
        },
        toolChange(p) {
            this.api.toolChange = true;
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
        addApi() {
            this.$store.dispatch({
                type: "addApi",
                thisObj: this
            });
            this.queryApis();
        },
        updateApi() {
            this.$store.dispatch({
                type: "updateApi",
                thisObj: this
            });
            this.queryApis();
        },
        queryApis() {
            this.$store.dispatch({
                type: "queryApis",
                thisObj: this
            });
        },
        closeApiToolModal() {},
        showApiDetail(apiObj) {
            this.$store.dispatch({
                type: "showApiDetail",
                thisObj: this,
                apiObj: apiObj
            });
        },
        showApiModal(operType, apiObj) {
            this.api.apiModal = true;
            this.queryAllLanCategory();
            this.queryAllToolCategory();
            if (operType == 2) {
                this.$store.dispatch({
                    type: "showApiModal",
                    thisObj: this,
                    apiObj: apiObj
                });
            }
        },
        deleteApiToolCategory(id) {
            this.$alert("你确定要删除吗?", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                    this.$store.dispatch({
                        type: "deleteApiToolCategory",
                        thisObj: this,
                        id: id
                    });
                    this.queryAllToolCategory();
                }
            });
        },
        deleteApiLanCategory(id) {
            this.$alert("你确定要删除吗?", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                    this.$store.dispatch({
                        type: "deleteApiLanCategory",
                        thisObj: this,
                        id: id
                    });
                    this.queryAllLanCategory();
                }
            });
        },
        showApiToolModal() {
            this.api.tool.apiToolModal = true;
        },
        showApiLanModal() {
            this.api.lan.apiLanModal = true;
        },
        queryAllLanCategory() {
            this.$store.dispatch({
                type: "queryAllLanCategory",
                thisObj: this
            });
            this.reloadPage();
        },
        queryAllToolCategory() {
            this.$store.dispatch({
                type: "queryAllToolCategory",
                thisObj: this
            });
            this.reloadPage();
        },
        addLan() {
            this.$store.dispatch({
                type: "addLan",
                thisObj: this
            });
            this.queryAllLanCategory();
        },
        addTool() {
            this.$store.dispatch({
                type: "addTool",
                thisObj: this
            });
            this.queryAllToolCategory();
        },
        changeApiPage(pageNum) {},
        closeApiModal(flag) {},
        //==============================
        showMottoModal(index) {
            this.$store.dispatch({
                type: "showMottoModal",
                thisObj: this,
                index: index
            });
        },
        deleteMotto(id) {
            this.$alert("你确定要删除吗?", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                    this.$store.dispatch({
                        type: "deleteMotto",
                        thisObj: this,
                        id: id
                    });
                    this.queryMottos();
                }
            });
        },
        addMotto() {
            this.$store.dispatch({
                type: "addMotto",
                thisObj: this
            });
            this.queryMottos();
        },
        updateMotto() {
            this.$store.dispatch({
                type: "updateMotto",
                thisObj: this
            });
            this.queryMottos();
        },
        closeMottoModal(flag) {
            if (!flag) {
                this.$store.dispatch({
                    type: "closeMottoModal",
                    thisObj: this
                });
            }
        },
        queryMottos() {
            this.$store.dispatch({
                type: "queryMottos",
                thisObj: this
            });
        },
        changeMottoPage(pageNum) {
            this.$nextTick(function() {
                this.motto.curPageNum = pageNum;
            });
            this.queryMottos();
        },
        //===================
        closeMemoModal(flag) {
            if (!flag) {
                this.$store.dispatch({
                    type: "closeMemoModal",
                    thisObj: this
                });
            }
        },
        updateMemo() {
            this.$store.dispatch({
                type: "updateMemo",
                thisObj: this
            });
            this.queryMemos();
        },
        showMemoModal(index, isLocked, password) {
            if (isLocked == 1) {
                this.$prompt("请输入密码", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                })
                    .then(({ value }) => {
                        if (value != password) {
                            this.$Message.error({
                                content: "密码输入错误"
                            });
                        } else {
                            this.$store.dispatch({
                                type: "showMemoModal",
                                thisObj: this,
                                index: index
                            });
                            this.reloadPage();
                        }
                    })
                    .catch(() => {});
            } else {
                this.$store.dispatch({
                    type: "showMemoModal",
                    thisObj: this,
                    index: index
                });
                this.reloadPage();
            }
        },
        showMemoDetail(index, isLocked, password) {
            if (isLocked == 1) {
                this.$prompt("请输入密码", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                })
                    .then(({ value }) => {
                        if (value != password) {
                            this.$Message.error({
                                content: "密码输入错误"
                            });
                        } else {
                            this.$store.dispatch({
                                type: "showMemoDetail",
                                thisObj: this,
                                index: index
                            });
                            this.reloadPage();
                        }
                    })
                    .catch(() => {});
            } else {
                this.$store.dispatch({
                    type: "showMemoDetail",
                    thisObj: this,
                    index: index
                });
                this.reloadPage();
            }
        },
        deleteMemo(id) {
            this.$alert("你确定要删除吗?", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                    this.$store.dispatch({
                        type: "deleteMemo",
                        thisObj: this,
                        id: id
                    });
                    this.queryMemos();
                }
            });
        },
        queryMemos() {
            this.$store.dispatch({
                type: "queryMemos",
                thisObj: this
            });
        },
        deleteMemoContentTag(index) {
            this.$store.dispatch({
                type: "deleteMemoContentTag",
                thisObj: this,
                index: index
            });
        },
        addMemoContentTag() {
            this.$store.dispatch({
                type: "addMemoContentTag",
                thisObj: this
            });
            this.reloadPage();
        },
        addMemo() {
            this.$store.dispatch({
                type: "addMemo",
                thisObj: this
            });
            this.queryMemos();
        },

        changeMemoPage(pageNum) {
            this.$nextTick(function() {
                this.memo.curPageNum = pageNum;
            });
            this.queryMemos();
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
@import "../style/other.less";
// .echarts {
//     width: 400px;
//     height: 400px;
// }
.ivu-modal-footer {
    display: none;
}
</style>
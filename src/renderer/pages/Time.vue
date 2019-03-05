
<template>
    <div>
        <div style="width:1008px;height:46px;text-align:center;">
            <ButtonGroup size="default" style="margin:0px 0px 0 10px;">
                <Button v-if="time.dateType != 3" v-on:click="changeYearMonthDay(3)" type="ghost">年</Button>
                <Button v-if="time.dateType == 3" v-on:click="changeYearMonthDay(3)" type="primary">年</Button>
                <Button v-if="time.dateType != 2" v-on:click="changeYearMonthDay(2)" type="ghost">月</Button>
                <Button v-if="time.dateType == 2" v-on:click="changeYearMonthDay(2)" type="primary">月</Button>
                <Button v-if="time.dateType != 1" v-on:click="changeYearMonthDay(1)" type="ghost">日</Button>
                <Button v-if="time.dateType == 1" v-on:click="changeYearMonthDay(1)" type="primary">日</Button>
            </ButtonGroup>
            <DatePicker v-if="time.dateType == 1" dateType="time.dateType" placeholder="选择日期" size="large" @on-change="queryAllTime" class="Time-DatePicker" type="date" v-model="time.curDateTime"></DatePicker>
            <DatePicker v-if="time.dateType == 2" dateType="time.dateType" placeholder="选择日期" size="large" @on-change="queryAllTime" class="Time-DatePicker" type="month" v-model="time.curDateTime"></DatePicker>
            <DatePicker v-if="time.dateType == 3" dateType="time.dateType" placeholder="选择日期" size="large" @on-change="queryAllTime" class="Time-DatePicker" type="year" v-model="time.curDateTime"></DatePicker>
        </div>
        <div id="Time-Detail" style="width:1005px;height:606px;padding-left:60px;">
            <Card v-for="(item, index) in time.allTimeOfDays" :key="index" style="width:162px;height:182px;display:inline-block;margin:0 20px 20px 0px;float:left">
                <div style="text-align:center">
                    <img src="../assets/img/cover/cover-00.jpg" style="width:122px;height:98px;">
                    <div style="width:150px;display:inline-block">
                        <h3 style="margin-right:30px">{{item.curDateTime}}</h3>
                        <ButtonGroup size="default" style="margin:0px 20px 0px 0px;">
                            <Button v-on:click="showTimeBook(index)" type="text">查看</Button>
                            <Button v-if="time.dateType == 1" v-on:click="editTime(index)" type="text">编辑</Button>
                        </ButtonGroup>
                    </div>
                </div>
            </Card>
        </div>

        <div style="">
            <Page :total=time.totalNum :current.sync=time.curPageNum :page-size=time.pageSize @on-change="changePage" size="small"></Page>
        </div>

        <Modal :mask-closable="false" v-model="time.editTimeModal" style="" @on-ok="saveTimeSetting" :styles="{top: '200px', width:'1038px', height:'615px'}" title="时光编辑">
            <div id="Time-All" style="width:1008px;height:615px;padding:10px;">
                <div id="Time-TimeMachine" style="width:485px;height:595px;display:inline-block;float:left;">
                    <h3 style="display:inline-block">时光清单</h3>
                    <Button-group style="float:right;margin-right:8px">
                        <Button v-on:click="timeMachineAllPublic" size="small" type="ghost">公开</Button>
                        <Button v-on:click="timeMachineAllHidden" size="small" type="ghost">隐藏</Button>
                    </Button-group>
                    <div style="margin:10px 20px 0px 0px">
                        <Checkbox v-on:on-change="timeMachineAllCheckbox" v-model="time.timeMachineCheckbox"></Checkbox>
                        <span style="width:390px;display:inline-block;font-weight:bolder">做了什么?</span>
                        <span style="font-weight:bolder">操 作</span>
                    </div>

                    <div style="margin:10px 20px 0px 0px" v-for="(item, index) in time.timeMachineList" :key="index">
                        <Checkbox style="float:left;margin:8px 10px 0 0" v-model="item.timeMachine.isShow"></Checkbox>
                        <span v-if="item.timeMachine.show == 0" style="width:390px;display:inline-block;font-weight:bolder;text-decoration:line-through">{{item.timeMachine.timeSlot}}</span>
                        <span v-if="item.timeMachine.show == 0" style="width:390px;display:inline-block;text-decoration:line-through">{{item.todolist.listName}}</span>
                        <span v-if="item.timeMachine.show == 1" style="width:390px;display:inline-block;font-weight:bolder;">{{item.timeMachine.timeSlot}}</span>
                        <span v-if="item.timeMachine.show == 1" style="width:396px;display:inline-block;">{{item.todolist.listName}}</span>
                        <span v-on:click="timeMachinePublic(index)" v-if="item.timeMachine.show == 0" style="cursor:pointer;float:right;margin:-10px 15px 0 0">公 开</span>
                        <span v-on:click="timeMachineHidden(index)" v-if="item.timeMachine.show == 1" style="cursor:pointer;float:right;margin:-10px 15px 0 0">隐 藏</span>
                    </div>
                    <div style="height:10px"></div>
                </div>

                <div id="Time-Knowledge" style="width:485px;height:300px;display:inline-block;float:right;margin-bottom:10px">
                    <h3 style="display:inline-block">知识清单</h3>
                    <Button-group style="float:right;margin-right:8px">
                        <Button v-on:click="knowledgeAllPublic" size="small" type="ghost">公开</Button>
                        <Button v-on:click="knowledgeAllHidden" size="small" type="ghost">隐藏</Button>
                    </Button-group>
                    <div style="margin:10px 20px 0px 0px">
                        <Checkbox v-on:on-change="knowledgeAllCheckbox" v-model="time.knowledgeCheckbox"></Checkbox>
                        <span style="width:350px;display:inline-block;font-weight:bolder">笔记名称</span>
                        <span style="width:40px;display:inline-block;font-weight:bolder">查看</span>
                        <span style="font-weight:bolder">操 作</span>
                    </div>
                    <div style="margin:10px 20px 0px 0px" v-for="(item, index) in time.knowledgeList" :key="index">
                        <Checkbox style="float:left;margin:8px 10px 0 0" v-model="item.isShow"></Checkbox>
                        <span v-if="item.noteShow == 0" style="width:350px;display:inline-block;font-weight:bolder;text-decoration:line-through">{{item.categoryNames}}</span>
                        <span v-if="item.noteShow == 0" style="width:350px;display:inline-block;text-decoration:line-through">{{item.listName}}</span>
                        <span v-if="item.noteShow == 1" style="width:350px;display:inline-block;font-weight:bolder;">{{item.categoryNames}}</span>
                        <span v-if="item.noteShow == 1" style="width:350px;display:inline-block;">{{item.listName}}</span>
                        <span v-on:click="knowledgePublic(index)" v-if="item.noteShow == 0" style="cursor:pointer;float:right;margin:-10px 15px 0 0">公 开</span>
                        <span v-on:click="knowledgeHidden(index)" v-if="item.noteShow == 1" style="cursor:pointer;float:right;margin:-10px 15px 0 0">隐 藏</span>
                        <strong v-on:click="showKnowledgeDetail(index, null, null)" style="cursor:pointer;text-align:right;font-size:18px;font-weight:bolder;margin:-15px 20px 0 8px;float:right">
                            <Icon type="search"></Icon>
                        </strong>
                    </div>
                    <div style="height:10px"></div>
                </div>
                <div id="Time-Note" style="width:485px;height:285px;display:inline-block;float:right">
                    <h3 style="display:inline-block">消费清单</h3>
                    <Button-group style="float:right;margin-right:8px">
                        <Button v-on:click="consumeAllPublic" size="small" type="ghost">公开</Button>
                        <Button v-on:click="consumeAllHidden" size="small" type="ghost">隐藏</Button>
                    </Button-group>
                    <div style="margin:10px 20px 0px 0px">
                        <Checkbox v-on:on-change="consumeAllCheckbox" v-model="time.consumeCheckbox"></Checkbox>
                        <span style="width:390px;display:inline-block;font-weight:bolder">消费明细</span>
                        <span style="font-weight:bolder">操 作</span>
                    </div>
                    <div style="margin:10px 20px 0px 0px" v-for="(item, index) in time.consumeList" :key="index">
                        <Checkbox style="float:left;margin:8px 10px 0 0" v-model="item.isShow"></Checkbox>
                        <span v-if="item.consumeShow == 0" style="width:390px;display:inline-block;font-weight:bolder;text-decoration:line-through">{{item.categoryName}}</span>
                        <span v-if="item.consumeShow == 0" style="width:390px;display:inline-block;text-decoration:line-through">{{item.listName}} 价格: {{item.consume}}</span>
                        <span v-if="item.consumeShow == 1" style="width:390px;display:inline-block;font-weight:bolder;">{{item.categoryName}}</span>
                        <span v-if="item.consumeShow == 1" style="width:390px;display:inline-block;">{{item.listName}} 价格: {{item.consume}}</span>
                        <span v-on:click="consumePublic(index)" v-if="item.consumeShow == 0" style="cursor:pointer;float:right;margin:-10px 15px 0 0">公 开</span>
                        <span v-on:click="consumeHidden(index)" v-if="item.consumeShow == 1" style="cursor:pointer;float:right;margin:-10px 15px 0 0">隐 藏</span>
                    </div>
                    <div style="height:10px"></div>
                </div>
                <div id="Time-Target" style="width:485px;height:300px;display:inline-block;float:left;margin-top:10px">
                    <h3 style="display:inline-block">目标清单</h3>
                    <Button-group style="float:right;margin-right:8px">
                        <Button v-on:click="targetAllPublic" size="small" type="ghost">公开</Button>
                        <Button v-on:click="targetAllHidden" size="small" type="ghost">隐藏</Button>
                    </Button-group>
                    <div style="margin:10px 20px 0px 0px">
                        <Checkbox v-on:on-change="targetAllCheckbox" v-model="time.targetCheckbox"></Checkbox>
                        <span style="width:350px;display:inline-block;font-weight:bolder">目标</span>
                        <span style="width:40px;display:inline-block;font-weight:bolder">完成</span>
                        <span style="font-weight:bolder">操 作</span>
                    </div>
                    <div style="margin:10px 20px 0px 0px" v-for="(item, index) in time.targetList" :key="index">
                        <Checkbox style="float:left;margin:10px 10px 0 0" v-model="item.isShow"></Checkbox>
                        <span v-if="item.show == 0" style="width:350px;display:inline-block;font-weight:bolder;text-decoration:line-through">
                            <strong v-for="(tag, key) in item.tags" :key="key">{{tag.tagName}} </strong>
                        </span>
                        <span v-if="item.show == 0" style="width:350px;display:inline-block;text-decoration:line-through">{{item.target}}</span>

                        <span v-if="item.show == 1" style="width:350px;display:inline-block;font-weight:bolder;">
                            <strong v-for="(tag, key) in item.tags" :key="key">{{tag.tagName}} </strong>
                        </span>
                        <span v-if="item.show == 1" style="width:350px;display:inline-block;">{{item.target}}</span>

                        <span v-on:click="targetPublic(index)" v-if="item.show == 0" style="cursor:pointer;float:right;margin:-10px 15px 0 0">公 开</span>
                        <span v-on:click="targetHidden(index)" v-if="item.show == 1" style="cursor:pointer;float:right;margin:-10px 15px 0 0">隐 藏</span>
                        <strong style="text-align:right;font-size:14px;font-weight:bolder;margin:-10px 20px 0 8px;float:right">
                            <Icon v-if="item.completeStatus == null" type="close-round"></Icon>
                            <Icon v-if="item.completeStatus == 0" type="close-round"></Icon>
                            <Icon v-if="item.completeStatus == 1" type="checkmark-round"></Icon>
                        </strong>
                    </div>
                    <div style="height:10px"></div>
                </div>
                <div id="Time-Summary" style="width:485px;height:300px;display:inline-block;float:right;margin-top:10px;">
                    <h3 style="display:inline-block">总结</h3>
                    <Button-group style="float:right;margin-right:8px">
                        <Button v-on:click="summaryAllPublic" size="small" type="ghost">公开</Button>
                        <Button v-on:click="summaryAllHidden" size="small" type="ghost">隐藏</Button>
                    </Button-group>
                    <div style="margin:10px 20px 0px 0px">
                        <Checkbox v-on:on-change="summaryAllCheckbox" v-model="time.summaryCheckbox"></Checkbox>
                        <span style="width:390px;display:inline-block;font-weight:bolder">总结</span>
                        <span style="font-weight:bolder">操 作</span>
                    </div>
                    <div v-if="item.group == '工作'" style="margin:10px 20px 0px 0px" v-for="(item, index) in time.summaryList" :key="index">
                        <Checkbox style="float:left;margin:8px 10px 0 0" v-model="item.isShow"></Checkbox>
                        <span v-if="item.summaryShow == 0" style="cursor:pointer;width:390px;display:inline-block;font-weight:bolder;text-decoration:line-through">{{item.group}} ({{item.project}})</span>
                        <span v-if="item.summaryShow == 0" style="cursor:pointer;width:390px;display:inline-block;text-decoration:line-through">{{item.module}}-{{item.stage}}: {{item.progress}}%</span>
                        <span v-if="item.summaryShow == 1" style="cursor:pointer;width:390px;display:inline-block;font-weight:bolder;">{{item.group}} ({{item.project}})</span>
                        <span v-if="item.summaryShow == 1" style="cursor:pointer;width:390px;display:inline-block;">{{item.module}}-{{item.stage}}: {{item.progress}}%</span>
                        <span v-on:click="summaryPublic(index)" v-if="item.summaryShow == 0" style="cursor:pointer;float:right;margin:-10px 15px 0 0">公 开</span>
                        <span v-on:click="summaryHidden(index)" v-if="item.summaryShow == 1" style="cursor:pointer;float:right;margin:-10px 15px 0 0">隐 藏</span>
                    </div>
                    <div v-if="item.group != '工作'" style="margin:10px 20px 0px 0px" v-for="(item, index) in time.summaryList" :key="index">
                        <Checkbox style="float:left;margin:8px 10px 0 0" v-model="item.isShow"></Checkbox>
                        <span v-if="item.summaryShow == 0" style="cursor:pointer;width:390px;display:inline-block;font-weight:bolder;text-decoration:line-through">{{item.group}}</span>
                        <span v-if="item.summaryShow == 0 && item.group == '购物'" style="cursor:pointer;width:390px;display:inline-block;text-decoration:line-through">当天累计消费: ￥{{item.consume}}.00</span>
                        <span v-if="item.summaryShow == 0 && item.group == '笔记'" style="cursor:pointer;width:390px;display:inline-block;text-decoration:line-through">当天整理笔记数: {{item.noteNum}}条</span>
                        <span v-if="item.summaryShow == 0 && item.group == '运动'" style="cursor:pointer;width:390px;display:inline-block;text-decoration:line-through">当天运动时长: {{item.sportTime}}min</span>
                        <span v-if="item.summaryShow == 0 && item.group == '早起'" style="cursor:pointer;width:390px;display:inline-block;text-decoration:line-through">当天早起时间: {{item.getupTime}}</span>
                        <span v-if="item.summaryShow == 0 && item.group == '晚睡'" style="cursor:pointer;width:390px;display:inline-block;text-decoration:line-through">当天晚睡时间: {{item.sleepTime}}</span>
                        <span v-if="item.summaryShow == 1" style="cursor:pointer;width:390px;display:inline-block;font-weight:bolder;">{{item.group}}</span>
                        <span v-if="item.summaryShow == 1 && item.group == '购物'" style="cursor:pointer;width:390px;display:inline-block;">当天累计消费: ￥{{item.consume}}.00</span>
                        <span v-if="item.summaryShow == 1 && item.group == '笔记'" style="cursor:pointer;width:390px;display:inline-block;">当天整理笔记数: {{item.noteNum}}条</span>
                        <span v-if="item.summaryShow == 1 && item.group == '运动'" style="cursor:pointer;width:390px;display:inline-block;">当天运动时长: {{item.sportTime}}min</span>
                        <span v-if="item.summaryShow == 1 && item.group == '早起'" style="cursor:pointer;width:390px;display:inline-block;">当天早起时间: {{item.getupTime}}</span>
                        <span v-if="item.summaryShow == 1 && item.group == '晚睡'" style="cursor:pointer;width:390px;display:inline-block;">当天晚睡时间: {{item.sleepTime}}</span>
                        <span v-on:click="summaryPublic(index)" v-if="item.summaryShow == 0" style="cursor:pointer;float:right;margin:-10px 15px 0 0">公 开</span>
                        <span v-on:click="summaryHidden(index)" v-if="item.summaryShow == 1" style="cursor:pointer;float:right;margin:-10px 15px 0 0">隐 藏</span>
                    </div>
                    <div style="height:10px"></div>
                </div>

                <div id="Time-Voice" style="width:485px;height:300px;display:inline-block;float:left;margin-top:10px">
                    <h3 style="display:inline-block">有声读物</h3>
                    <Button-group style="float:right;margin-right:8px">
                        <Button v-on:click="voiceAllPublic" size="small" type="ghost">公开</Button>
                        <Button v-on:click="voiceAllHidden" size="small" type="ghost">隐藏</Button>
                    </Button-group>
                    <div style="margin:10px 20px 0px 0px">
                        <Checkbox v-on:on-change="voiceAllCheckbox" v-model="time.voiceCheckbox"></Checkbox>
                        <span style="width:350px;display:inline-block;font-weight:bolder">有声读物</span>
                        <span style="width:40px;display:inline-block;font-weight:bolder">播放</span>
                        <span style="font-weight:bolder">操 作</span>
                    </div>
                    <div style="margin:10px 20px 0px 0px" v-for="(item, index) in time.voiceList" :key="index">
                        <Checkbox style="float:left;margin:8px 10px 0 0" v-model="item.isShow"></Checkbox>
                        <span v-if="item.show == 0" style="width:350px;display:inline-block;font-weight:bolder;text-decoration:line-through">{{item.bookName}}</span>
                        <span v-if="item.show == 0" style="width:350px;display:inline-block;text-decoration:line-through">{{item.attachName}}</span>
                        <span v-if="item.show == 1" style="width:350px;display:inline-block;font-weight:bolder;">{{item.bookName}}</span>
                        <span v-if="item.show == 1" style="width:350px;display:inline-block;">{{item.attachName}}</span>
                        <span v-on:click="voicePublic(index)" v-if="item.show == 0" style="cursor:pointer;float:right;margin:-10px 15px 0 0">公 开</span>
                        <span v-on:click="voiceHidden(index)" v-if="item.show == 1" style="cursor:pointer;float:right;margin:-10px 15px 0 0">隐 藏</span>
                        <strong v-on:click="playItem(item.url)" style="cursor:pointer;text-align:right;font-size:18px;font-weight:bolder;margin:-15px 25px 0 8px;float:right">
                            <Icon type="arrow-right-b"></Icon>
                        </strong>
                    </div>
                    <div style="height:10px"></div>
                </div>

                <div id="Time-Pic" style="width:485px;height:300px;display:inline-block;float:right;margin-top:10px;">
                    <h3 style="display:inline-block">相册</h3>
                    <Button-group style="float:right;margin-right:8px">
                        <Button v-on:click="picAllPublic" size="small" type="ghost">公开</Button>
                        <Button v-on:click="picAllHidden" size="small" type="ghost">隐藏</Button>
                    </Button-group>
                    <div style="margin:10px 20px 0px 0px">
                        <Checkbox v-on:on-change="picAllCheckbox" v-model="time.picCheckbox"></Checkbox>
                        <span style="width:350px;display:inline-block;font-weight:bolder">相片名称</span>
                        <span style="width:40px;display:inline-block;font-weight:bolder">查看</span>
                        <span style="font-weight:bolder">操 作</span>
                    </div>
                    <div style="margin:10px 20px 0px 0px" v-for="(item, index) in time.picList" :key="index">
                        <Checkbox style="float:left;margin:8px 10px 0 0" v-model="item.isShow"></Checkbox>
                        <span v-if="item.show == 0" style="width:350px;display:inline-block;font-weight:bolder;text-decoration:line-through">{{item.category}}</span>
                        <span v-if="item.show == 0" style="width:350px;display:inline-block;text-decoration:line-through">{{item.attachName}}</span>
                        <span v-if="item.show == 1" style="width:350px;display:inline-block;font-weight:bolder;">{{item.category}}</span>
                        <span v-if="item.show == 1" style="width:350px;display:inline-block;">{{item.attachName}}</span>
                        <span v-on:click="picPublic(index)" v-if="item.show == 0" style="cursor:pointer;float:right;margin:-10px 15px 0 0">公 开</span>
                        <span v-on:click="picHidden(index)" v-if="item.show == 1" style="cursor:pointer;float:right;margin:-10px 15px 0 0">隐 藏</span>
                        <strong v-on:click="playItem(item.url)" style="cursor:pointer;text-align:right;font-size:18px;font-weight:bolder;margin:-15px 20px 0 8px;float:right">
                            <Icon type="search"></Icon>
                        </strong>
                    </div>
                    <div style="height:10px"></div>
                </div>

                <div id="Time-Video" style="width:485px;height:300px;display:inline-block;float:left;margin-top:10px">
                    <h3 style="display:inline-block">视频</h3>
                    <Button-group style="float:right;margin-right:8px">
                        <Button v-on:click="videoAllPublic" size="small" type="ghost">公开</Button>
                        <Button v-on:click="videoAllHidden" size="small" type="ghost">隐藏</Button>
                    </Button-group>
                    <div style="margin:10px 20px 0px 0px">
                        <Checkbox v-on:on-change="videoAllCheckbox" v-model="time.videoCheckbox"></Checkbox>
                        <span style="width:350px;display:inline-block;font-weight:bolder">视频名称</span>
                        <span style="width:40px;display:inline-block;font-weight:bolder">播放</span>
                        <span style="font-weight:bolder">操 作</span>
                    </div>
                    <div style="margin:10px 20px 0px 0px" v-for="(item, index) in time.videoList" :key="index">
                        <Checkbox style="float:left;margin:8px 10px 0 0" v-model="item.isShow"></Checkbox>
                        <span v-if="item.show == 0" style="width:350px;display:inline-block;font-weight:bolder;text-decoration:line-through">{{item.category}}</span>
                        <span v-if="item.show == 0" style="width:350px;display:inline-block;text-decoration:line-through">{{item.attachName}}</span>
                        <span v-if="item.show == 1" style="width:350px;display:inline-block;font-weight:bolder;">{{item.category}}</span>
                        <span v-if="item.show == 1" style="width:350px;display:inline-block;">{{item.attachName}}</span>
                        <span v-on:click="videoPublic(index)" v-if="item.show == 0" style="cursor:pointer;float:right;margin:-10px 15px 0 0">公 开</span>
                        <span v-on:click="videoHidden(index)" v-if="item.show == 1" style="cursor:pointer;float:right;margin:-10px 15px 0 0">隐 藏</span>
                        <strong v-on:click="playItem(item.url)" style="cursor:pointer;text-align:right;font-size:18px;font-weight:bolder;margin:-15px 25px 0 8px;float:right">
                            <Icon type="arrow-right-b"></Icon>
                        </strong>
                    </div>
                    <div style="height:10px"></div>
                </div>
                <!-- <div>
                    <Button type="success" long>确认提交</Button>
                </div> -->
            </div>
        </Modal>

        <el-dialog width="53%" title="请选择封面图片" :visible.sync="time.timebookCoverModal">
            <div id="Time-Book-Cover" style="width:716px;height:600px;margin-top:-30px;margin-left:5px;overflow:auto">
                <div style="width:130px;height:150px;display:inline-block;float:left;margin-left:8px;margin-bottom:8px">
                    <span v-if="time.coverIndex == 1" style="margin-left:125px;">
                        <Icon style="color:red;" type="checkmark-circled"></Icon>
                    </span>
                    <span v-if="time.coverIndex != 1" style="margin-left:125px;">
                        <Icon type="checkmark-circled"></Icon>
                    </span>
                    <img v-on:click="chooseCover(1)" :id="'cover'+ 1" style="width:130px;height:150px;display:inline-block;margin-top:-10px" src="../assets/img/cover/cover-00.jpg">
                </div>
                <div style="width:130px;height:150px;display:inline-block;float:left;margin-left:8px;margin-bottom:8px">
                    <span v-if="time.coverIndex == 2" style="margin-left:125px;">
                        <Icon style="color:red;" type="checkmark-circled"></Icon>
                    </span>
                    <span v-if="time.coverIndex != 2" style="margin-left:125px;">
                        <Icon type="checkmark-circled"></Icon>
                    </span>
                    <img v-on:click="chooseCover(2)" :id="'cover'+ 2" style="width:130px;height:150px;display:inline-block;margin-top:-10px" src="../assets/img/cover/cover-01.jpg">
                </div>
                <div style="width:130px;height:150px;display:inline-block;float:left;margin-left:8px;margin-bottom:8px">
                    <span v-if="time.coverIndex == 3" style="margin-left:125px;">
                        <Icon style="color:red;" type="checkmark-circled"></Icon>
                    </span>
                    <span v-if="time.coverIndex != 3" style="margin-left:125px;">
                        <Icon type="checkmark-circled"></Icon>
                    </span>
                    <img v-on:click="chooseCover(3)" :id="'cover'+ 3" style="width:130px;height:150px;display:inline-block;margin-top:-10px" src="../assets/img/cover/cover-02.jpg">
                </div>
            </div>
            <div style="margin-top:15px">
                <Button v-on:click="confirmCover" type="success" style="width:716px">确定</Button>
            </div>
        </el-dialog>

        <el-dialog width="50%" title="分享" :visible.sync="time.timebookShareModal">
            <div class="social-share"></div>
        </el-dialog>

        <Modal id="Time-Book-Modal" v-on:on-visible-change="onVisibleChange" :mask-closable="false" v-model="time.timebookModal" @on-ok="saveTimeSetting" :styles="{top: '60px', width:'1182px', height:'840px'}" title="时光编辑">
            <div id="Time-Book" style="width:1150px;height:770px;overflow-x: hidden; overflow-y: hidden;">
                <div id="magazine">
                    <div id="1" class="hard" style="width:575px;height:770px;background:#ffffff;">
                        <img v-if="timebookCover.coverFirstPageSrc == ''" v-on:click="openTimebookCoverModal(1, 1)" style="width:575px;height:770px;cursor:pointer" src="../assets/img/cover/cover-00.jpg">
                        <img v-if="timebookCover.coverFirstPageSrc != ''" v-on:click="openTimebookCoverModal(1, 1)" style="width:575px;height:770px;cursor:pointer" :src="timebookCover.coverFirstPageSrc">
                    </div>
                    <div id="2" class="hard" style="width:575px;height:770px;background:#ffffff;">
                        <img v-if="timebookCover.coverSecondPageSrc == ''" v-on:click="openTimebookCoverModal(2, 2)" style="width:575px;height:770px;cursor:pointer" src="../assets/img/cover/cover-11.jpg">
                        <img v-if="timebookCover.coverSecondPageSrc != ''" v-on:click="openTimebookCoverModal(2, 2)" style="width:575px;height:770px;cursor:pointer" :src="timebookCover.coverSecondPageSrc">
                    </div>
                    <div v-for="key in time.dicList.length" style="width:575px;height:770px;background:#ffffff;padding:20px 0 0 20px;">
                        <h3 v-if="key == 1" style="text-align:center">Directory</h3>
                        <div :id="key + 2" v-if="(key + 2) % 2 != 0">
                            <div v-if="item.pageNum == (key + 2) && item.categoryName == 'directory'" style="margin-bottom:18px;cursor:pointer" v-for="(item, i) in time.timeObjList" :key="i">
                                <div v-on:click="turnPage(obj.pageNum)" v-for="(obj, index) in item.list" :key="index">
                                    <h3 style="height:16px;margin-left:5px" v-if="obj.category == 'timeMachine'">{{obj.date}}</h3>
                                    <h4 style="margin-left:30px;margin-top:10px">{{obj.dicName}}</h4>
                                    <hr style="margin-top:-10px;width:350px;margin-left:110px;height:2px;border:none;border-top:2px dotted black;" />
                                    <h4 style="float:right;margin-top:-10px;margin-right:50px">{{obj.pageNum}}</h4>
                                    <div style="height:10px"></div>
                                </div>
                            </div>
                            <div style="width:575px;height:20px;position:absolute;right:0px;bottom:0px;text-align:center;font-size:14px;font-weight:bolder">{{key + 2}}</div>
                        </div>
                        <div :id="key + 2" v-else>
                            <div v-if="item.pageNum == (key + 2) && item.categoryName == 'directory'" style="margin-bottom:18px;cursor:pointer" v-for="(item, i) in time.timeObjList" :key="i">
                                <div v-on:click="turnPage(obj.pageNum)" v-for="(obj, index) in item.list" :key="index">
                                    <h3 style="height:16px;margin-left:5px" v-if="obj.category == 'timeMachine'">{{obj.date}}</h3>
                                    <h4 style="margin-left:30px;margin-top:10px">{{obj.dicName}}</h4>
                                    <hr style="margin-top:-10px;width:350px;margin-left:110px;height:2px;border:none;border-top:2px dotted black;" />
                                    <h4 style="float:right;margin-top:-10px;margin-right:50px">{{obj.pageNum}}</h4>
                                    <div style="height:10px"></div>
                                </div>
                            </div>
                            <div style="width:575px;height:20px;position:absolute;right:0px;bottom:0px;text-align:center;font-size:14px;font-weight:bolder">{{key + 2}}</div>
                        </div>
                    </div>
                    <!-- </div> -->
                    <div v-for="key in time.timeBookTotalPageNum" style="width:575px;height:770px;background:#ffffff;text-align:left;">
                        <div style="width:575px;height:770px;border-left: 1px solid #ddd;" :id="key + time.dicList.length + 2" v-if="(key + time.dicList.length + 2) % 2 != 0">
                            <div style="width:575px;height:770px">
                                <div style="width:575px;height:30px;text-align:center;">
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'timeMachine'" style="padding-top:5px">{{item.date}} 时间清单</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'knowledge'" style="padding-top:5px">{{item.date}} 知识清单</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'target'" style="padding-top:5px">{{item.date}} 目标清单</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'consume'" style="padding-top:5px">{{item.date}} 消费清单</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'summary'" style="padding-top:5px">{{item.date}} 一日小结</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'voice'" style="padding-top:5px">{{item.date}} 有声读物</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'video'" style="padding-top:5px">{{item.date}} 视频</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'pic'" style="padding-top:5px">{{item.date}} 相册</h3>
                                </div>
                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'timeMachine'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.timeMachine.timeSlot}}({{obj.timeMachine.consumeTime}} min)</p>
                                            <p class="content" style="display:inline-block;width:555px">
                                                {{obj.todolist.listName}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>
                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'consume'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.categoryName}}</p>
                                            <p class="content" style="display:inline-block;width:555px">
                                                {{obj.listName}} 价格: {{obj.consume}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'knowledge'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.categoryNames}}</p>
                                            <p v-on:click="showKnowledgeDetail(i, obj.note, obj.listName)" class="content" style="display:inline-block;width:555px;cursor:pointer">
                                                {{obj.listName}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'target'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <span style="">
                                                <strong v-for="(tag, j) in obj.tags" :key="j">{{tag.tagName}} </strong>
                                            </span>
                                            <p class="content" style="display:inline-block;width:555px">
                                                {{obj.target}}
                                            </p>
                                            <strong style="font-size:14px;font-weight:bolder;margin:-28px 30px 0 8px;float:right">
                                                <Icon v-if="obj.completeStatus == null" type="close-round"></Icon>
                                                <Icon v-if="obj.completeStatus == 0" type="close-round"></Icon>
                                                <Icon v-if="obj.completeStatus == 1" type="checkmark-round"></Icon>
                                            </strong>
                                        </div>
                                    </TimelineItem>
                                </Timeline>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'summary'" style="padding:10px">
                                    <TimelineItem v-if="obj.group == '工作'" v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.group}} ({{obj.project}})</p>
                                            <p class="content" style="display:inline-block;width:555px">
                                                {{obj.module}}-{{obj.stage}}: {{obj.progress}}%
                                            </p>
                                        </div>
                                    </TimelineItem>
                                    <TimelineItem v-if="obj.group != '工作'" v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.group}}</p>
                                            <p v-if="obj.group == '购物'" class="content" style="display:inline-block;width:555px">
                                                当天累计消费: ￥{{obj.consume}}.00
                                            </p>
                                            <p v-if="obj.group == '笔记'" class="content" style="display:inline-block;width:555px">
                                                当天整理笔记数: {{obj.noteNum}}条
                                            </p>
                                            <p v-if="obj.group == '运动'" class="content" style="display:inline-block;width:555px">
                                                当天运动时长: {{obj.sportTime}}min
                                            </p>
                                            <p v-if="obj.group == '早起'" class="content" style="display:inline-block;width:555px">
                                                当天早起时间: {{obj.getupTime}}
                                            </p>
                                            <p v-if="obj.group == '晚睡'" class="content" style="display:inline-block;width:555px">
                                                当天晚睡时间: {{obj.sleepTime}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'voice'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.bookName}}</p>
                                            <p v-on:click="playItem(obj.url)" class="content" style="display:inline-block;width:555px;cursor:pointer">
                                                {{obj.attachName}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'video'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.category}}</p>
                                            <p v-on:click="playItem(obj.url)" class="content" style="display:inline-block;width:555px;cursor:pointer">
                                                {{obj.attachName}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>
                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'pic'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.category}}</p>
                                            <p v-on:click="playItem(obj.url)" class="content" style="display:inline-block;width:555px;cursor:pointer">
                                                {{obj.attachName}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>
                                <div style="width:575px;height:20px;position:absolute;right:0px;bottom:0px;text-align:center;font-size:14px;font-weight:bolder">{{key + time.dicList.length + 2}}</div>
                            </div>
                        </div>
                        <div style="width:575px;height:770px;border-right: 1px solid #ddd;" :id="key + time.dicList.length + 2" v-else>
                            <div style="width:575px;height:770px">
                                <div style="width:575px;height:30px;text-align:center;">
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'timeMachine'" style="padding-top:5px">{{item.date}} 时间清单</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'knowledge'" style="padding-top:5px">{{item.date}} 知识清单</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'target'" style="padding-top:5px">{{item.date}} 目标清单</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'consume'" style="padding-top:5px">{{item.date}} 消费清单</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'summary'" style="padding-top:5px">{{item.date}} 一日小结</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'voice'" style="padding-top:5px">{{item.date}} 有声读物</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'video'" style="padding-top:5px">{{item.date}} 视频</h3>
                                    <h3 v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'pic'" style="padding-top:5px">{{item.date}} 相册</h3>
                                </div>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'timeMachine'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.timeMachine.timeSlot}}({{obj.timeMachine.consumeTime}} min)</p>
                                            <p class="content" style="display:inline-block;width:555px">
                                                {{obj.todolist.listName}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2)  && item.categoryName == 'consume'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.categoryName}}</p>
                                            <p class="content" style="display:inline-block;width:555px">
                                                {{obj.listName}} 价格: {{obj.consume}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'knowledge'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.categoryNames}}</p>
                                            <p v-on:click="showKnowledgeDetail(i, obj.note, obj.listName)" class="content" style="display:inline-block;width:555px;cursor:pointer">
                                                {{obj.listName}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'target'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <span style="">
                                                <strong v-for="(tag, j) in obj.tags" :key="j">{{tag.tagName}} </strong>
                                            </span>
                                            <p class="content" style="display:inline-block;width:555px">
                                                {{obj.target}}
                                            </p>
                                            <strong style="font-size:14px;font-weight:bolder;margin:-28px 30px 0 8px;float:right">
                                                <Icon v-if="obj.completeStatus == null" type="close-round"></Icon>
                                                <Icon v-if="obj.completeStatus == 0" type="close-round"></Icon>
                                                <Icon v-if="obj.completeStatus == 1" type="checkmark-round"></Icon>
                                            </strong>
                                        </div>
                                    </TimelineItem>
                                </Timeline>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'summary'" style="padding:10px">
                                    <TimelineItem v-if="obj.group == '工作'" v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.group}} ({{obj.project}})</p>
                                            <p class="content" style="display:inline-block;width:555px">
                                                {{obj.module}}-{{obj.stage}}: {{obj.progress}}%
                                            </p>
                                        </div>
                                    </TimelineItem>
                                    <TimelineItem v-if="obj.group != '工作'" v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.group}}</p>
                                            <p v-if="obj.group == '购物'" class="content" style="display:inline-block;width:555px">
                                                当天累计消费: ￥{{obj.consume}}.00
                                            </p>
                                            <p v-if="obj.group == '笔记'" class="content" style="display:inline-block;width:555px">
                                                当天整理笔记数: {{obj.noteNum}}条
                                            </p>
                                            <p v-if="obj.group == '运动'" class="content" style="display:inline-block;width:555px">
                                                当天运动时长: {{obj.sportTime}}min
                                            </p>
                                            <p v-if="obj.group == '早起'" class="content" style="display:inline-block;width:555px">
                                                当天早起时间: {{obj.getupTime}}
                                            </p>
                                            <p v-if="obj.group == '晚睡'" class="content" style="display:inline-block;width:555px">
                                                当天晚睡时间: {{obj.sleepTime}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>

                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'voice'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.bookName}}</p>
                                            <p v-on:click="playItem(obj.url)" class="content" style="display:inline-block;width:555px;cursor:pointer">
                                                {{obj.attachName}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>
                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'video'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.category}}</p>
                                            <p v-on:click="playItem(obj.url)" class="content" style="display:inline-block;width:555px;cursor:pointer">
                                                {{obj.attachName}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>
                                <Timeline v-for="(item, index) in time.timeObjList" :key="index" v-if="item.pageNum == (key + time.dicList.length + 2) && item.categoryName == 'pic'" style="padding:10px">
                                    <TimelineItem v-for="(obj, i) in item.list" :key="i" style="width:555px;height:46px;">
                                        <div style="display:inline-block;width:555px;height:46px;">
                                            <p class="time" style="font-size:14px;font-weight:bolder">{{obj.category}}</p>
                                            <p v-on:click="playItem(obj.url)" class="content" style="display:inline-block;width:555px;cursor:pointer">
                                                {{obj.attachName}}
                                            </p>
                                        </div>
                                    </TimelineItem>
                                </Timeline>
                                <div style="width:575px;height:20px;position:absolute;right:0px;bottom:0px;text-align:center;font-size:14px;font-weight:bolder">{{key + time.dicList.length + 2}}</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="(time.timeBookTotalPageNum + 2 + time.dicList.length) % 2 != 0 && timebookCover.coverLastFistPageSrc == ''" :id="time.timeBookTotalPageNum + 2 + time.dicList.length + 1" v-on:click="openTimebookCoverModal(time.timeBookTotalPageNum + 2 + time.dicList.length + 1, 3)" style="width:575px;height:770px;background:#ffffff;"><img style="width:575px;height:770px;cursor:pointer" src="../assets/img/cover/cover-05.jpg"></div>
                    <div v-if="(time.timeBookTotalPageNum + 2 + time.dicList.length) % 2 != 0 && timebookCover.coverLastFistPageSrc != ''" :id="time.timeBookTotalPageNum + 2 + time.dicList.length + 1" v-on:click="openTimebookCoverModal(time.timeBookTotalPageNum + 2 + time.dicList.length + 1, 3)" style="width:575px;height:770px;background:#ffffff;"><img style="width:575px;height:770px;cursor:pointer" :src="timebookCover.coverLastFistPageSrc"></div>

                    <div v-if="(time.timeBookTotalPageNum + 2 + time.dicList.length) % 2 != 0 && timebookCover.coverLastSecondPageSrc == ''" :id="time.timeBookTotalPageNum + 2 + time.dicList.length + 2" v-on:click="openTimebookCoverModal(time.timeBookTotalPageNum + 2 + time.dicList.length + 2, 4)" style="width:575px;height:770px;background:#ffffff;" class="hard"><img style="width:575px;height:770px;cursor:pointer" src="../assets/img/cover/cover-08.jpg"></div>
                    <div v-if="(time.timeBookTotalPageNum + 2 + time.dicList.length) % 2 != 0 && timebookCover.coverLastSecondPageSrc != ''" :id="time.timeBookTotalPageNum + 2 + time.dicList.length + 2" v-on:click="openTimebookCoverModal(time.timeBookTotalPageNum + 2 + time.dicList.length + 2, 4)" style="width:575px;height:770px;background:#ffffff;" class="hard"><img style="width:575px;height:770px;cursor:pointer" :src="timebookCover.coverLastSecondPageSrc"></div>

                    <div v-if="(time.timeBookTotalPageNum + 2 + time.dicList.length) % 2 == 0 && timebookCover.coverLastSecondPageSrc == ''" :id="time.timeBookTotalPageNum + 2 + time.dicList.length + 1" v-on:click="openTimebookCoverModal(time.timeBookTotalPageNum + 2 + time.dicList.length + 1, 4)" style="width:575px;height:770px;background:#ffffff;" class="hard"><img style="width:575px;height:770px;cursor:pointer" src="../assets/img/cover/cover-08.jpg"></div>
                    <div v-if="(time.timeBookTotalPageNum + 2 + time.dicList.length) % 2 == 0 && timebookCover.coverLastSecondPageSrc != ''" :id="time.timeBookTotalPageNum + 2 + time.dicList.length + 1" v-on:click="openTimebookCoverModal(time.timeBookTotalPageNum + 2 + time.dicList.length + 1, 4)" style="width:575px;height:770px;background:#ffffff;" class="hard"><img style="width:575px;height:770px;cursor:pointer" :src="timebookCover.coverLastSecondPageSrc"></div>

                    <div v-if="(time.timeBookTotalPageNum + 2 + time.dicList.length) % 2 != 0 && timebookCover.coverLastThirdPageSrc == ''" :id="time.timeBookTotalPageNum + 2 + time.dicList.length + 3" v-on:click="openTimebookCoverModal(time.timeBookTotalPageNum + 2 + time.dicList.length + 3, 5)" style="width:575px;height:770px;background:#ffffff;" class="hard"><img style="width:575px;height:770px;cursor:pointer" src="../assets/img/cover/cover-09.jpg"></div>
                    <div v-if="(time.timeBookTotalPageNum + 2 + time.dicList.length) % 2 != 0 && timebookCover.coverLastThirdPageSrc != ''" :id="time.timeBookTotalPageNum + 2 + time.dicList.length + 3" v-on:click="openTimebookCoverModal(time.timeBookTotalPageNum + 2 + time.dicList.length + 3, 5)" style="width:575px;height:770px;background:#ffffff;" class="hard"><img style="width:575px;height:770px;cursor:pointer" :src="timebookCover.coverLastThirdPageSrc"></div>

                    <div v-if="(time.timeBookTotalPageNum + 2 + time.dicList.length) % 2 == 0 && timebookCover.coverLastThirdPageSrc == ''" :id="time.timeBookTotalPageNum + 2 + time.dicList.length + 2" v-on:click="openTimebookCoverModal(time.timeBookTotalPageNum + 2 + time.dicList.length + 2, 5)" style="width:575px;height:770px;background:#ffffff;" class="hard"><img style="width:575px;height:770px;cursor:pointer" src="../assets/img/cover/cover-09.jpg"></div>
                    <div v-if="(time.timeBookTotalPageNum + 2 + time.dicList.length) % 2 == 0 && timebookCover.coverLastThirdPageSrc != ''" :id="time.timeBookTotalPageNum + 2 + time.dicList.length + 2" v-on:click="openTimebookCoverModal(time.timeBookTotalPageNum + 2 + time.dicList.length + 2, 5)" style="width:575px;height:770px;background:#ffffff;" class="hard"><img style="width:575px;height:770px;cursor:pointer" :src="timebookCover.coverLastThirdPageSrc"></div>
                </div>
            </div>
            <div style="width:1150px;height:70px;padding:0 25px 0 25px">
                <div style="margin-right:10px;padding-top:25px;width:70px;height:70px;display:inline-block;float:left">
                    <Poptip placement="top-start" width="300" height="770">
                        <Button type="text">
                            <Icon type="navicon-round"></Icon>
                            目录
                        </Button>
                        <div slot="content">
                            <Button long type="text">目录</Button>
                            <div id="Time-Directory" style="width:250px;height:770px">
                                <div style="width:250px;padding:10px 0 0 10px;cursor:pointer" v-for="(item, index) in time.dicList" :key="index">
                                    <h3 style="height:26px" v-if="item.category == 'timeMachine'">{{item.date}}</h3>
                                    <h4 style="margin-left:20px">{{item.dicName}}</h4>
                                    <hr style="margin-top:-10px;width:130px;margin-left:80px;height:2px;border:none;border-top:2px dotted black;" />
                                    <h4 style="float:right;margin-top:-10px;margin-right:10px">{{item.pageNum}}</h4>
                                    <span v-on:click="turnPage(obj.pageNum)" style="width:250px;padding:10px 0 0 10px;cursor:pointer" v-for="(obj, i) in time.dicList[index].list" :key="i">
                                        <h3 style="height:26px" v-if="obj.category == 'timeMachine'">{{obj.date}}</h3>
                                        <h4 style="margin-left:20px">{{obj.dicName}}</h4>
                                        <hr style="margin-top:-10px;width:130px;margin-left:80px;height:2px;border:none;border-top:2px dotted black;" />
                                        <h4 style="float:right;margin-top:-10px;margin-right:10px">{{obj.pageNum}}</h4>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Poptip>
                </div>
                <div style="width:615px;height:70px;line-height:70px;padding-top:22px;display:inline-block;margin-right:10px;float:left">
                    <el-slider :step="1" v-on:change="sliderPage" :max="time.totalPageNum" :min="time.minPageNumOfSlider" v-model="time.pageNumOfSlider"></el-slider>
                </div>
                <div style="margin-right:10px;padding-top:25px;width:155px;height:70px;display:inline-block;float:left">
                    <Button-group>
                        <Button v-on:click="backPage" type="text">
                            <Icon type="chevron-left"></Icon>
                            上一页
                        </Button>
                        <Button v-on:click="nextPage" type="text">
                            下一页
                            <Icon type="chevron-right"></Icon>
                        </Button>
                    </Button-group>
                </div>
                <!-- <div style="margin-right:10px;padding-top:25px;width:70px;height:70px;display:inline-block;float:left">
                    <Button v-on:click="playBgm('../assets/audio/bgm.mp3')" type="text">
                        <Icon type="music-note"></Icon>
                        音乐
                    </Button>
                    <div hidden=true style="width:600px;height:20px;margin-top:30px">
                        <audio media-player="audioPlayer" preload="auto" crossOrigin="anonymous" style="width:550px" id="audioPlayer" src="" controls="controls"></audio>
                    </div>
                </div> -->
                <div style="margin-right:10px;padding-top:25px;width:70px;height:70px;display:inline-block;float:left">
                    <Poptip trigger="hover">
                        <Button type="text">
                            <Icon type="images"></Icon>
                            截图
                        </Button>
                        <div v-if="time.timebookCurPageNum != 1 && time.timebookCurPageNum != time.totalPageNum" slot="content">
                            <a style="margin-right:10px" v-on:click="timebookSaveAsPic(time.timebookCurPageNum)">截取第{{time.timebookCurPageNum}}页</a>
                            <a v-on:click="timebookSaveAsPic(time.timebookCurPageNum + 1)">截取第{{time.timebookCurPageNum + 1}}页</a>
                        </div>
                        <div v-if="time.timebookCurPageNum == 1 || time.timebookCurPageNum == time.totalPageNum" slot="content">
                            <a style="margin-left:30px" v-on:click="timebookSaveAsPic(time.timebookCurPageNum)">截取第{{time.timebookCurPageNum}}页</a>
                        </div>
                    </Poptip>
                </div>
                <div style="margin-right:10px;padding-top:25px;width:70px;height:70px;display:inline-block;float:left">
                    <Button v-on:click="timebookShare" type="text">
                        <Icon type="android-share-alt"></Icon>
                        分享
                    </Button>
                </div>

                <div style="padding-top:25px;width:70px;height:70px;display:inline-block;float:left">
                    <Button v-on:click="printTimebook" type="text">
                        <Icon type="printer"></Icon>
                        打印
                    </Button>
                </div>
            </div>
        </Modal>
        <Modal id="Time-Note-Modal" :mask-closable="false" v-model="time.noteModal" :styles="{top: '150px',width:'1100px',height:'600px'}" :title="time.title">
            <div>
                <mavon-editor :toolbarsFlag="false" :subfield="false" defaultOpen="preview" style="height:600px" codeStyle="googlecode" :toolbars="time.toolbars" v-model="time.note" />
            </div>
        </Modal>
    </div>

</template>

<script>
import { shell } from "electron";
import { mapGetters, mapState } from "vuex";
import Scrollbar from "smooth-scrollbar";
import { mavonEditor } from "mavon-editor";
import * as util from "@/utils/util.js";
import * as timeMachineUtil from "@/utils/timeMachineUtil.js";
import * as knowledgeUtil from "@/utils/knowledgeUtil.js";
import * as dashboardUtil from "@/utils/dashboardUtil.js";
import * as consumeUtil from "@/utils/consumeUtil.js";

import "../plugs/turn/turn.min.js";
// import "../plugs/pdfjs/jspdf.debug.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf/dist/jspdf.debug.js";

import canvas2image from "canvas2image/canvas2image.js";


export default {
    data() {
        return {};
    },

    components: {
        "mavon-editor": mavonEditor
    },

    computed: {
        ...mapGetters([
            "time",
            "timeMachine",
            "knowledge",
            "dashboard",
            "consume",
            "timebookCover"
        ])
    },

    created() {
        console.log("time created====================================");
        // 按天获取time
        this.queryAllTime();
        this.queryAllTimeNum();
    },

    mounted() {
        console.log("time mounted====================================");
        this.$Message.config({ top: 400, duration: 3 });
        Scrollbar.init(document.querySelector("#Time-All"));
        Scrollbar.init(document.querySelector("#Time-TimeMachine"));
        Scrollbar.init(document.querySelector("#Time-Knowledge"));
        Scrollbar.init(document.querySelector("#Time-Note"));
        Scrollbar.init(document.querySelector("#Time-Target"));
        Scrollbar.init(document.querySelector("#Time-Summary"));
        Scrollbar.init(document.querySelector("#Time-Voice"));
        Scrollbar.init(document.querySelector("#Time-Pic"));
        Scrollbar.init(document.querySelector("#Time-Video"));
        Scrollbar.init(document.querySelector("#Time-Book"));
        // Scrollbar.init(document.querySelector("#magazine"));
        Scrollbar.init(document.querySelector("#Time-Directory"));
        // Scrollbar.init(document.querySelector("#Time-Book-Cover"));
        this.initTurn();
        // this.initPrint();
    },

    methods: {
        timebookShare() {},
        _fixType(type) {
            type = type.toLowerCase().replace(/jpg/i, "jpeg");
            let r = type.match(/png|jpeg|bmp|gif/)[0];
            return "image/" + r;
        },

        //唤起浏览器下载
        fileDownload(downloadUrl, fileName) {
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = downloadUrl;
            aLink.download = fileName;
            // 触发点击-然后移除
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
        },

        timebookSaveAsPic(curPageNum) {
            let pageData = null;
            let dateStr = this.time.allTimeOfDays[this.time.timebookIndex]
                .curDateTime;
            let fileName = dateStr + "-" + curPageNum + ".png";
            setTimeout(() => {
                html2canvas($("#" + curPageNum)[0], {
                    scale: 1
                }).then(function(canvas) {
                    pageData = canvas.toDataURL("image/jpeg", 1.0);
                });
            }, 300);
            setTimeout(() => {
                let type = "png";
                let imgData = pageData.replace(
                    this._fixType(type),
                    "image/octet-stream"
                );
                this.fileDownload(imgData, fileName);
            }, 800);
        },
        chooseCover(id) {
            this.$store.dispatch({
                type: "chooseCover",
                thisObj: this,
                id: id
            });
        },
        openTimebookCoverModal(id, coverPage) {
            this.$store.dispatch({
                type: "openTimebookCoverModal",
                thisObj: this,
                id: id,
                coverPage: coverPage
            });
        },
        confirmCover() {
            let coverPage = this.time.coverPage;
            let coverImgId = "cover" + this.time.coverIndex;
            let coverObj = document.getElementById(coverImgId);
            let coverImgUrlArr = coverObj.src.split("/");
            let coverOriSrc =
                coverImgUrlArr[coverImgUrlArr.length - 2] +
                "/" +
                coverImgUrlArr[coverImgUrlArr.length - 1];
            this.$store.dispatch({
                type: "confirmCover",
                thisObj: this,
                coverOriSrc: coverOriSrc,
                timeObj: this.time
            });
            this.queryTimeBookCover(this.time.timebookIndex);
        },
        onVisibleChange(flag) {
            if (!flag) {
                this.time.timebookIndex = 0;
                this.timebookCover.coverFirstPageSrc = "";
                this.timebookCover.coverSecondPageSrc = "";
                this.timebookCover.coverLastFistPageSrc = "";
                this.timebookCover.coverLastSecondPageSrc = "";
                this.timebookCover.coverLastThirdPageSrc = "";
                this.reloadPage();
            }
        },
        playBgm(url) {
            let audio = document.getElementById("audioPlayer");
            console.log("url: ");
            console.log(url);
            audio.src = url;
            if (this.time.playStatus == 1) {
                //播放(继续播放)
                audio.play();
                this.time.playStatus = 0;
            } else {
                audio.pause();
                this.time.playStatus = 1;
            }
        },
        sliderPage(page) {
            this.time.timebookCurPageNum = page;
            $("#magazine").turn("page", page);
            this.time.typeArr.splice(0, this.time.typeArr.length);
            if (page % 2 == 0) {
                this.choosePage(page);
                this.choosePage(page + 1);
            } else {
                this.choosePage(page - 1);
                this.choosePage(page);
            }
        },
        turnPage(page) {
            this.time.timebookCurPageNum = page;
            this.time.typeArr.splice(0, this.time.typeArr.length);
            if (this.time.timeObjList.length >= 2) {
                this.time.timeObjList.splice(0, this.time.timeObjList.length);
            }
            $("#magazine").turn("page", page);
            if (page % 2 == 0) {
                this.choosePage(page);
                this.choosePage(page + 1);
            } else {
                this.choosePage(page - 1);
                this.choosePage(page);
            }
        },
        sleep(n) {
            var start = new Date().getTime();
            while (true) {
                if (new Date().getTime() - start > n) {
                    break;
                }
            }
        },
        isCanvasBlank(canvas) {
            var blank = document.createElement("canvas");
            blank.width = canvas.width;
            blank.height = canvas.height;
            return canvas.toDataURL() == blank.toDataURL();
        },

        printTimebook() {
            let pageDataList = [];
            let totalPageNum = $("#magazine").turn("pages");
            let pdf = new jsPDF("", "pt", "a4");
            let obj = {};
            for (let i = 1; i <= totalPageNum; i++) {
                if (i == 1) {
                    this.$nextTick(function() {
                        if (i % 2 == 0 || i == 1) {
                            this.sliderPage(i);
                        }
                    });
                } else {
                    setTimeout(() => {
                        this.$nextTick(function() {
                            if (i % 2 == 0) {
                                this.sliderPage(i);
                            }
                        });
                    }, 300);
                }
                setTimeout(() => {
                    html2canvas($("#" + i)[0]).then(function(canvas) {
                        var pageData = canvas.toDataURL("image/jpeg", 1.0);
                        obj = {
                            pageData: pageData,
                            canvas: canvas,
                            index: i
                        };
                        pageDataList.push(obj);
                    });
                }, 300);
            }
            setTimeout(() => {
                pageDataList.sort(util.sortByTimebookPage);
                for (let j = 0; j < pageDataList.length; j++) {
                    let obj = pageDataList[j];
                    pdf.addImage(
                        obj.pageData,
                        "JPEG",
                        0,
                        0,
                        obj.canvas.width,
                        obj.canvas.height
                    );
                    if (j < pageDataList.length - 1) {
                        pdf.addPage();
                    }
                    if (j == pageDataList.length - 1) {
                        pdf.save("timebook.pdf");
                    }
                }
            }, 8000 / 14 * this.time.totalPageNum);
        },
        backPage() {
            if (this.time.timeObjList.length >= 2) {
                this.time.timeObjList.splice(0, this.time.timeObjList.length);
            }
            let curPageNum = $("#magazine").turn("page");
            let totalPageNum = $("#magazine").turn("pages");
            if (this.time.timebookCurPageNum == 0) {
                this.time.timebookCurPageNum = totalPageNum;
            } else if (this.time.timebookCurPageNum == 2) {
                this.time.timebookCurPageNum = this.time.timebookCurPageNum - 1;
            } else {
                if (this.time.timebookCurPageNum - 2 >= 0) {
                    this.time.timebookCurPageNum =
                        this.time.timebookCurPageNum - 2;
                } else {
                    this.time.timebookCurPageNum = totalPageNum;
                }
            }
            curPageNum = this.time.timebookCurPageNum;
            this.time.typeArr.splice(0, this.time.typeArr.length);
            if (curPageNum == 1) {
                this.reloadPage();
            } else if (curPageNum == totalPageNum) {
                $("#magazine").turn("page", totalPageNum);
                this.choosePage(totalPageNum);
                this.choosePage(totalPageNum - 1);
            } else {
                $("#magazine").turn("previous");
                this.choosePage(curPageNum);
                this.choosePage(curPageNum + 1);
            }
        },
        nextPage() {
            if (this.time.timeObjList.length >= 2) {
                this.time.timeObjList.splice(0, this.time.timeObjList.length);
            }
            let curPageNum = $("#magazine").turn("page") + 1;
            let totalPageNum = $("#magazine").turn("pages");
            if (this.time.timebookCurPageNum == 0) {
                this.time.timebookCurPageNum = curPageNum;
            } else if (this.time.timebookCurPageNum == 1) {
                this.time.timebookCurPageNum = this.time.timebookCurPageNum + 1;
            } else {
                if (this.time.timebookCurPageNum + 2 <= totalPageNum) {
                    this.time.timebookCurPageNum =
                        this.time.timebookCurPageNum + 2;
                } else {
                    this.time.timebookCurPageNum = 0;
                }
            }
            curPageNum = this.time.timebookCurPageNum;
            this.time.typeArr = [];
            this.time.typeArr.splice(0, this.time.typeArr.length);
            if (curPageNum > totalPageNum) {
                $("#magazine").turn("page", 1);
                this.choosePage(1);
                this.choosePage(2);
            } else if (curPageNum == 0) {
                this.reloadPage();
            } else {
                $("#magazine").turn("next");
                this.choosePage(curPageNum);
                this.choosePage(curPageNum + 1);
            }
        },
        choosePage(curPageNum) {
            let timeObj = {};
            if (curPageNum > 2 && curPageNum <= 2 + this.time.dicList.length) {
                this.time.dicList.forEach(element => {
                    if (element.pageNum == curPageNum) {
                        this.time.typeArr.push(element.category);
                        timeObj = {
                            pageNum: curPageNum,
                            date: element.date,
                            list: element.list,
                            categoryName: element.category
                        };
                        this.time.timeObjList.push(timeObj);
                    }
                });
            }
            if (curPageNum > 2 + this.time.dicList.length) {
                this.time.pageDetailList.forEach(element => {
                    if (element.pageNum == curPageNum) {
                        this.time.typeArr.push(element.category);
                        timeObj = {
                            pageNum: curPageNum,
                            date: element.date,
                            list: element.list,
                            categoryName: element.category
                        };
                        this.time.timeObjList.push(timeObj);
                    }
                });
            }
        },
        initTurn() {
            $("#magazine").turn({
                autoCenter: true,
                gradients: true,
                display: "double",
                turnCorners: ""
                // display: "single"
            });
        },

        // 查询timebook的封面
        queryTimeBookCover(index) {
            this.$store.dispatch({
                type: "queryTimeBookCover",
                thisObj: this,
                index: index,
                timeObj: this.time
            });
        },
        // 展示timebook
        showTimeBook(index) {
            // this.initTurn();
            this.queryTimeBookCover(index);
            this.time.index = index;
            this.$store.dispatch({
                type: "showTimeBook",
                thisObj: this,
                index: index,
                timeMachine: this.timeMachine,
                knowledge: this.knowledge,
                dashboard: this.dashboard,
                consume: this.consume
            });
            this.reloadPage();
            setTimeout(() => {
                let curPageNum = $("#magazine").turn("page");
                let totalPageNum = $("#magazine").turn("pages");
                this.time.totalPageNum = totalPageNum;
                this.time.timebookCurPageNum = 1;
            }, 100);
        },

        playItem(url) {
            shell.openItem(url);
        },
        // 查询当天所有的视频
        queryVideoListByDate(index) {
            this.$store.dispatch({
                type: "queryVideoListByDate",
                thisObj: this,
                index: index
            });
        },
        videoPublic(index) {
            this.time.videoList[index].show = 1;
        },
        videoHidden(index) {
            this.time.videoList[index].show = 0;
        },
        videoAllHidden() {
            this.time.videoList.forEach(element => {
                if (element.isShow) {
                    element.show = 0;
                }
            });
        },
        videoAllPublic() {
            this.time.videoList.forEach(element => {
                if (element.isShow) {
                    element.show = 1;
                }
            });
        },
        videoAllCheckbox() {
            this.time.videoList.forEach(element => {
                if (this.time.videoCheckbox) {
                    element.isShow = true;
                } else {
                    element.isShow = false;
                }
            });
        },

        // 查询当天所有的相册
        queryPicListByDate(index) {
            this.$store.dispatch({
                type: "queryPicListByDate",
                thisObj: this,
                index: index
            });
        },
        picPublic(index) {
            this.time.picList[index].show = 1;
        },
        picHidden(index) {
            this.time.picList[index].show = 0;
        },
        picAllHidden() {
            this.time.picList.forEach(element => {
                if (element.isShow) {
                    element.show = 0;
                }
            });
        },
        picAllPublic() {
            this.time.picList.forEach(element => {
                if (element.isShow) {
                    element.show = 1;
                }
            });
        },
        picAllCheckbox() {
            this.time.picList.forEach(element => {
                if (this.time.picCheckbox) {
                    element.isShow = true;
                } else {
                    element.isShow = false;
                }
            });
        },

        // 查询当天所有的有声书
        queryVoiceListByDate(index) {
            this.$store.dispatch({
                type: "queryVoiceListByDate",
                thisObj: this,
                index: index
            });
        },
        voicePublic(index) {
            this.time.voiceList[index].show = 1;
        },
        voiceHidden(index) {
            this.time.voiceList[index].show = 0;
        },
        voiceAllHidden() {
            this.time.voiceList.forEach(element => {
                if (element.isShow) {
                    element.show = 0;
                }
            });
        },
        voiceAllPublic() {
            this.time.voiceList.forEach(element => {
                if (element.isShow) {
                    element.show = 1;
                }
            });
        },
        voiceAllCheckbox() {
            this.time.voiceList.forEach(element => {
                if (this.time.voiceCheckbox) {
                    element.isShow = true;
                } else {
                    element.isShow = false;
                }
            });
        },

        showKnowledgeDetail(index, note, listName) {
            this.time.noteModal = true;
            if (note != null && listName != null) {
                this.time.note = note;
                this.time.title = listName;
            } else {
                this.time.note = this.time.knowledgeList[index].note;
                this.time.title = this.time.knowledgeList[index].listName;
            }
        },

        summaryPublic(index) {
            this.time.summaryList[index].summaryShow = 1;
        },
        summaryHidden(index) {
            this.time.summaryList[index].summaryShow = 0;
        },
        summaryAllHidden() {
            this.time.summaryList.forEach(element => {
                if (element.isShow) {
                    element.summaryShow = 0;
                }
            });
        },
        summaryAllPublic() {
            this.time.summaryList.forEach(element => {
                if (element.isShow) {
                    element.summaryShow = 1;
                }
            });
        },
        summaryAllCheckbox() {
            this.time.summaryList.forEach(element => {
                if (this.time.summaryCheckbox) {
                    element.isShow = true;
                } else {
                    element.isShow = false;
                }
            });
        },

        consumePublic(index) {
            this.time.consumeList[index].consumeShow = 1;
        },
        consumeHidden(index) {
            this.time.consumeList[index].consumeShow = 0;
        },
        consumeAllHidden() {
            this.time.consumeList.forEach(element => {
                if (element.isShow) {
                    element.consumeShow = 0;
                }
            });
        },
        consumeAllPublic() {
            this.time.consumeList.forEach(element => {
                if (element.isShow) {
                    element.consumeShow = 1;
                }
            });
        },
        consumeAllCheckbox() {
            this.time.consumeList.forEach(element => {
                if (this.time.consumeCheckbox) {
                    element.isShow = true;
                } else {
                    element.isShow = false;
                }
            });
        },

        targetPublic(index) {
            this.time.targetList[index].show = 1;
        },
        targetHidden(index) {
            this.time.targetList[index].show = 0;
        },
        targetAllHidden() {
            this.time.targetList.forEach(element => {
                if (element.isShow) {
                    element.show = 0;
                }
            });
        },
        targetAllPublic() {
            this.time.targetList.forEach(element => {
                if (element.isShow) {
                    element.show = 1;
                }
            });
        },
        targetAllCheckbox() {
            this.time.targetList.forEach(element => {
                if (this.time.targetCheckbox) {
                    element.isShow = true;
                } else {
                    element.isShow = false;
                }
            });
        },

        knowledgePublic(index) {
            this.time.knowledgeList[index].noteShow = 1;
        },
        knowledgeHidden(index) {
            this.time.knowledgeList[index].noteShow = 0;
        },
        knowledgeAllHidden() {
            this.time.knowledgeList.forEach(element => {
                if (element.isShow) {
                    element.noteShow = 0;
                }
            });
        },
        knowledgeAllPublic() {
            this.time.knowledgeList.forEach(element => {
                if (element.isShow) {
                    element.noteShow = 1;
                }
            });
        },
        knowledgeAllCheckbox() {
            this.time.knowledgeList.forEach(element => {
                if (this.time.knowledgeCheckbox) {
                    element.isShow = true;
                } else {
                    element.isShow = false;
                }
            });
        },

        timeMachinePublic(index) {
            this.time.timeMachineList[index].timeMachine.show = 1;
        },
        timeMachineHidden(index) {
            this.time.timeMachineList[index].timeMachine.show = 0;
        },
        timeMachineAllHidden() {
            this.time.timeMachineList.forEach(element => {
                if (element.timeMachine.isShow) {
                    element.timeMachine.show = 0;
                }
            });
        },
        timeMachineAllPublic() {
            this.time.timeMachineList.forEach(element => {
                if (element.timeMachine.isShow) {
                    element.timeMachine.show = 1;
                }
            });
        },
        timeMachineAllCheckbox() {
            this.time.timeMachineList.forEach(element => {
                if (this.time.timeMachineCheckbox) {
                    element.timeMachine.isShow = true;
                } else {
                    element.timeMachine.isShow = false;
                }
            });
        },

        querySummaryListByDate(index) {
            this.$store.dispatch({
                type: "querySummaryListByDate",
                thisObj: this,
                index: index,
                dashboard: this.dashboard
            });
        },

        queryConsumesByDate(index) {
            this.$store.dispatch({
                type: "queryConsumesByDate",
                thisObj: this,
                index: index,
                consume: this.consume
            });
        },

        queryTargetListByDate(index) {
            this.$store.dispatch({
                type: "queryTargetListByDate",
                thisObj: this,
                index: index,
                dashboard: this.dashboard
            });
        },
        queryKnowledgesByDate(index) {
            this.$store.dispatch({
                type: "queryKnowledgesByDate",
                thisObj: this,
                index: index,
                knowledge: this.knowledge
            });
        },
        queryTimeMachineListByDate(index) {
            this.$store.dispatch({
                type: "queryTimeMachineListByDate",
                thisObj: this,
                index: index,
                timeMachine: this.timeMachine
            });
        },
        saveTimeSetting() {
            this.$store.dispatch({
                type: "saveTimeSetting",
                thisObj: this
            });
            setTimeout(() => {
                this.reloadPage();
            }, 1000);
        },
        editTime(index) {
            this.time.index = index;
            this.time.editTimeModal = true;
            this.queryTimeMachineListByDate(index);
            this.queryKnowledgesByDate(index);
            this.queryTargetListByDate(index);
            this.queryConsumesByDate(index);
            this.querySummaryListByDate(index);
            this.queryVoiceListByDate(index);
            this.queryVideoListByDate(index);
            this.queryPicListByDate(index);
            this.reloadPage();
        },
        changePage() {
            this.$store.dispatch({
                type: "changePage",
                thisObj: this
            });
        },
        changeYearMonthDay(dateType) {
            this.time.dateType = dateType;
            this.time.curDateTime = null;
            this.queryAllTime();
        },
        queryAllTime() {
            this.$store.dispatch({
                type: "queryAllTime",
                thisObj: this
            });
        },
        queryAllTimeNum() {
            this.$store.dispatch({
                type: "queryAllTimeNum",
                thisObj: this
            });
        },
        queryTimeByDate() {
            this.$store.dispatch({
                type: "queryTimeByDate",
                thisObj: this
            });
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
@import "../style/time.less";
// @import "../plugs/social-share/share.min";
// @import "social-share.js/dist/css/share.min.css";
#Time-Note-Modal .ivu-modal-footer {
    display: none;
}

#Time-Book-Modal .ivu-modal-footer {
    display: none;
}
#magazine {
    width: 1150px;
    height: 770px;
    background: #ffffff;
}

#magazine .turn-page {
    background-color: #ffffff;
}
</style>
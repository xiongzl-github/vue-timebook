<!--  -->
<template>
    <Tabs value="有声书" v-model="memory.tabName" :animated="memory.animated" v-on:on-click="handle">
        <TabPane name="note" label="波澜手记" icon="edit">
            <div class="Note-Left">
                <div>
                    <DatePicker @on-change="queryNote" class="Note-Left-DatePicker" type="month" v-model="note.curYearMonth"></DatePicker>
                </div>
                <div id="Note-Left-TimeLine" style="width:152px; padding:8px;text-align:left;height:555px;">
                    <Timeline style="width:auto;height:545px;">
                        <TimelineItem v-for="(item, index) in note.notes" :key="index" style="width:142px;height:56px;">
                            <div style="display:inline-block">
                                <p class="content" style="font-size:14px;display:inline-block;width:80px;font-weight:bolder">
                                    {{item.curDateTime}}
                                </p>
                                <p class="content" :title="item.note" v-on:click="setNoteInfo(item)" style="display:inline-block;width:80px;cursor:pointer">
                                    {{item.briefNote}}...
                                </p>
                                <span style="float:right;display:inline-block" v-on:click="deleteNoteById(item.id)">
                                    <Icon style="display:inline;font-size:18px;margin-right:15px;" type="close-circled"></Icon>
                                </span>
                            </div>
                        </TimelineItem>
                    </Timeline>
                </div>
            </div>
            <div class="Note-Right">
                <div class="Note-Right-Header">
                    <strong>波澜手记</strong>
                    <DatePicker class="Note-Right-Header-DatePicker" type="date" v-model="note.curDateTime"></DatePicker>
                </div>
                <div>
                    <mavon-editor ref="md" style="height:520px;width:788px" :codeStyle="note.codeStyle" :toolbars="note.toolbars" v-model="note.note" @imgAdd="$imgAdd" />
                    <div style="text-align:right;margin-top:10px">
                        <Button v-on:click="addNote" v-if="note.operType == 1" type="info">添加</Button>
                        <Button v-on:click="updateNote" v-if="note.operType == 2" type="success">更新</Button>
                        <Button v-on:click="resetNote" type="warning">重置</Button>
                    </div>
                </div>
            </div>
        </TabPane>
        <TabPane name="voice" label="有声书" icon="music-note">
            <div style="width:1005px;height:50px;margin-bottom:5px">
                <div style="display:inline-block;width:500px;margin-left:55px;">
                    <Input v-model="voice.searchStr">
                    <Button v-on:click="queryAllVoiceBook" slot="append" icon="ios-search"></Button>
                    </Input>
                </div>
                <span v-on:click="voice.voiceModal = true" style="float:right;margin-right:58px;margin-top:5px">
                    <Icon style="font-size:24px;" type="plus-round"></Icon>
                </span>
            </div>
            <div id="Voice-Detail" style="width:1005px;height:525px;padding-left:60px;">
                <Card v-for="(item, index) in voice.audios" :key="index" style="width:162px;display:inline-block;margin:0 20px 20px 0px;float:left;">
                    <span v-on:click="deleteVoiceBook(index)" style="float:right; margin-top:-20px;margin-right:-20px">
                        <Icon style="font-size:18px;cursor:pointer" type="ios-close" />
                    </span>
                    <div style="text-align:center">
                        <img v-on:click="showVoiceBook(index)" :src="item.coverObj.url" style="width:122px;height:98px;cursor:pointer">
                        <div style="width:150px;display:inline-block">
                            <h3 style="margin-right:30px">{{item.bookName}}</h3>
                        </div>
                    </div>
                </Card>
            </div>
            <div style="margin-top:25px">
                <Page :total=voice.totalNum :current.sync=voice.curPageNum :page-size=voice.pageSize @on-change="changePage" size="small"></Page>
            </div>
            <Modal :mask-closable="false" v-model="voice.voiceModal" style="" @on-ok="addVoice" @on-visible-change="closeVoiceModal" :styles="{top: '300px', width:'600px', height:'300px'}" title="添加有声书">
                <div style="">
                    <div style="width:600px;height:67px;margin:0px 0px 10px 8px">
                        <h3 style="line-height:35px;text-align:left">书名</h3>
                        <Input style="width: 550px;float:left" v-model="voice.bookName"></Input>
                    </div>
                    <div v-show="timeMachine.categorySetting.attachStatus" class="TimeMachine-Right-Attachment" style="text-align:left;margin-left:8px">
                        <h3 style="line-height:35px">封面</h3>
                        <img v-on:click="showPhotoHandle()" style="width:58px;height:58px;margin-right:5px;border: 1px dashed; border-radius: 4px; padding:12px" src="@/assets/img/upload.png">
                        <input type="file" v-show="false" name="uploadPicture" id="picFile" value="" title="上传照片" @change="showPhoto($event)" />
                        <div class="TimeMachine-Right-Attachment-Upload-List" v-for="(item, index) in timeMachine.uploadList" :key="index">
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url">
                                <div class="TimeMachine-Right-Attachment-Upload-List-Cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div style="width:600px;height:125px;margin:0px 0px 10px 8px">
                        <h3 style="line-height:35px;text-align:left;display:inline-block">音频</h3>
                        <Button style="display:inline-block" v-on:click="audioHandle()" type="text" icon="plus-round">添加</Button>
                        <input type="file" v-show="false" id="audioFile" value="" title="上传音频" @change="uploadAudio($event)" />
                        <div id="voiceBookScrollbar" style="width:549px;height:100px;border-radius:4px;">
                            <div style="margin-bottom:5px" v-if="voice.audioList.length > 0" v-for="(item, index) in voice.audioList" :key="index">
                                <span>{{item.name}}</span>
                                <span style="float:right;cursor:pointer;">
                                    <span v-on:click="playItem(item.url)" style="margin-right:10px">
                                        <Icon type="ios-play" /> 播放</span>
                                    <span v-if="item.playStatus != null" v-on:click="downloadAudio(index)" style="margin-right:10px">
                                        <Icon type="ios-cloud-download" /> 下载</span>
                                    <span v-if="item.playStatus != null" v-on:click="deleteAudio(index)" style="margin-right:10px">
                                        <Icon type="ios-close" /> 删除</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style="width:600px;height:67px;margin:20px 0px 10px 8px">
                        <h3 style="line-height:35px;text-align:left">备注</h3>
                        <Input style="width: 550px;float:left" v-model="voice.remark"></Input>
                    </div>
                    <Button v-if="voice.operateStatus == 1" style="margin-left:255px;margin-top:5px" type="success" @click="addVoice">确认</Button>
                    <Button v-if="voice.operateStatus == 2" style="margin-left:255px;margin-top:5px" type="success" @click="updateVoice">更新</Button>
                </div>
            </Modal>
        </TabPane>
        <TabPane name="pic" label="相册" icon="ios-rose">
            <div style="width:1005px;height:50px">
                <div style="display:inline-block;width:500px;margin-left:55px;">
                    <Input v-model="pic.searchStr">
                    <Button v-on:click="queryAllPic" slot="append" icon="ios-search"></Button>
                    </Input>
                </div>
                <span v-on:click="pic.picModal = true" style="float:right;margin-right:58px;margin-top:5px;cursor:pointer">
                    <Icon style="font-size:24px;" type="plus-round"></Icon>
                </span>
            </div>

            <div id="Pic-Detail" style="width:1005px;height:525px;padding-left:60px;">
                <Card v-if="pic.pics.length > 0" v-for="(item, index) in pic.pics" :key="index" style="width:162px;display:inline-block;margin:0 20px 20px 0px;float:left;">
                    <span v-on:click="deletePicBook(index)" style="float:right; margin-top:-20px;margin-right:-20px">
                        <Icon style="font-size:18px;cursor:pointer" type="ios-close" />
                    </span>
                    <div v-if="item != null" style="text-align:center">
                        <img v-if="item.picObjList.length > 0" v-on:click="showPicBook(index)" :src="item.picObjList[0].url" style="width:122px;height:98px;cursor:pointer">
                        <!-- <img v-if="item.picObjList.length == 0" v-on:click="showPicBook(index)" src="../assets/img/arrow.png" style="width:122px;height:98px;cursor:pointer"> -->
                        <div style="width:150px;display:inline-block">
                            <span style="margin-right:20px;cursor:pointer">
                                <span v-on:click="playPic(index)" style="font-size:16px;font-weight:bolder">{{item.category}}</span>
                                <Icon style="font-size:18px" type="arrow-right-b"></Icon>
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
            <div style="margin-top:25px">
                <Page :total=pic.totalNum :current.sync=pic.curPageNum :page-size=pic.pageSize @on-change="changePicPage" size="small"></Page>
            </div>
            <Modal :mask-closable="false" v-model="pic.picModal" style="" @on-ok="addPic" @on-visible-change="closePicModal" :styles="{top: '300px', width:'600px', height:'300px'}" title="添加照片">
                <div style="">
                    <div style="width:600px;height:67px;margin:0px 0px 10px 8px">
                        <h3 style="line-height:35px;text-align:left">类别</h3>
                        <Input style="width: 550px;float:left" v-model="pic.category"></Input>
                    </div>
                    <div v-show="timeMachine.categorySetting.attachStatus" class="TimeMachine-Right-Attachment" style="text-align:left;margin-left:8px">
                        <h3 style="line-height:35px;text-align:left;display:inline-block">图片</h3>
                        <Button style="display:inline-block" v-on:click="showPhotoHandle()" type="text" icon="plus-round">添加</Button>
                        <input type="file" v-show="false" id="picFile" title="上传图片" @change="showPhoto($event)" />
                        <div id="picImgScrollbar" style="width:549px;height:100px;border-radius:4px;">
                            <div style="margin-bottom:5px" v-if="timeMachine.uploadList.length > 0" v-for="(item, index) in timeMachine.uploadList" :key="index">
                                <span>{{item.name}}</span>
                                <span style="float:right;cursor:pointer;">
                                    <span v-on:click="playItem(item.url)" style="margin-right:10px">
                                        <Icon type="search" /> 查看</span>
                                    <span v-if="pic.operateStatus == 2" v-on:click="downloadPicImg(index)" style="margin-right:10px">
                                        <Icon type="ios-cloud-download" /> 下载</span>
                                    <span v-on:click="deletePicImg(index)" style="margin-right:10px">
                                        <Icon type="ios-close" /> 删除</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style="width:600px;height:67px;margin:20px 0px 10px 8px">
                        <h3 style="line-height:35px;text-align:left">备注</h3>
                        <Input style="width: 550px;float:left" v-model="pic.remark"></Input>
                    </div>
                    <Button v-if="pic.operateStatus == 1" style="margin-left:255px;margin-top:5px" type="success" @click="addPic">确认</Button>
                    <Button v-if="pic.operateStatus == 2" style="margin-left:255px;margin-top:5px" type="success" @click="updatePic">更新</Button>
                </div>
            </Modal>
            <Modal :mask-closable="false" v-model="pic.picPlayModal" @on-visible-change="closePicPlayModal" :styles="{top: '350px', width:'800px', height:'400px'}" title="播放">
                <div v-if="pic.pics.length > 0" style="width:800px;height:400px">
                    <el-carousel :interval="pic.interval" indicator-position="none" height="400px" style="margin:0 30px 0 0">
                        <el-carousel-item v-for="(item, index) in pic.pics[pic.index].picObjList" :key="index">
                            <img style="width:770px;height:400px" :src="item.url">
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </Modal>
        </TabPane>
        <TabPane name="video" label="视频" icon="play">
            <div style="width:1005px;height:50px;margin-bottom:5px">
                <div style="display:inline-block;width:500px;margin-left:55px;">
                    <Input v-model="video.searchStr">
                    <Button v-on:click="queryAllVideoBook" slot="append" icon="ios-search"></Button>
                    </Input>
                </div>
                <span v-on:click="video.videoModal = true" style="float:right;margin-right:58px;margin-top:5px">
                    <Icon style="font-size:24px;" type="plus-round"></Icon>
                </span>
            </div>
            <div id="Video-Detail" style="width:1005px;height:525px;padding-left:60px;">
                <Card v-for="(item, index) in video.videos" :key="index" style="width:162px;display:inline-block;margin:0 20px 20px 0px;float:left;">
                    <span v-on:click="deleteVideoBook(index)" style="float:right; margin-top:-20px;margin-right:-20px">
                        <Icon style="font-size:18px;cursor:pointer" type="ios-close" />
                    </span>
                    <div style="text-align:center">
                        <img v-on:click="showVideoBook(index)" :src="item.coverObj.url" style="width:122px;height:98px;cursor:pointer">
                        <div style="width:150px;display:inline-block">
                            <h3 style="margin-right:30px">{{item.category}}</h3>
                        </div>
                    </div>
                </Card>
            </div>
            <div style="margin-top:25px">
                <Page :total=video.totalNum :current.sync=video.curPageNum :page-size=video.pageSize @on-change="changeVideoPage" size="small"></Page>
            </div>
            <Modal :mask-closable="false" v-model="video.videoModal" style="" @on-ok="addVideo" @on-visible-change="closeVideoModal" :styles="{top: '200px', width:'600px', height:'500px'}" title="添加视频">
                <div style="">
                    <div style="width:600px;height:67px;margin:0px 0px 10px 8px">
                        <h3 style="line-height:35px;text-align:left">类别</h3>
                        <Input style="width: 550px;float:left" v-model="video.category"></Input>
                    </div>
                    <div v-show="timeMachine.categorySetting.attachStatus" class="TimeMachine-Right-Attachment" style="text-align:left;margin-left:8px">
                        <h3 style="line-height:35px">封面</h3>
                        <img v-on:click="showPhotoHandle()" style="width:58px;height:58px;margin-right:5px;border: 1px dashed; border-radius: 4px; padding:12px" src="@/assets/img/upload.png">
                        <input type="file" v-show="false" name="uploadPicture" id="picFile" value="" title="上传照片" @change="showPhoto($event)" />
                        <div class="TimeMachine-Right-Attachment-Upload-List" v-for="(item, index) in timeMachine.uploadList" :key="index">
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url">
                                <div class="TimeMachine-Right-Attachment-Upload-List-Cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                </div>
                            </template>
                        </div>
                    </div>

                    <div style="width:600px;height:125px;margin:0px 0px 10px 8px">
                        <h3 style="line-height:35px;text-align:left;display:inline-block">视频</h3>
                        <Button style="display:inline-block" v-on:click="videoHandle()" type="text" icon="plus-round">添加</Button>
                        <input type="file" v-show="false" id="videoFile" value="" title="上传视频" @change="uploadVideo($event)" />
                        <div id="videoBookScrollbar" style="width:549px;height:100px;border-radius:4px;">
                            <div style="margin-bottom:5px" v-if="video.videoList.length > 0" v-for="(item, index) in video.videoList" :key="index">
                                <span>{{item.name}}</span>
                                <span style="float:right;cursor:pointer;">
                                    <span v-on:click="playItem(item.url)" style="margin-right:10px">
                                        <Icon type="ios-play" /> 播放</span>
                                    <!-- <span v-if="item.playStatus == 1" v-on:click="playVideo(index)" style="margin-right:10px">
                                        <Icon type="ios-play" /> 播放</span>
                                    <span v-if="item.playStatus == 0" v-on:click="playVideo(index)" style="margin-right:10px">
                                        <Icon type="ios-pause" /> 暂停</span> -->
                                    <span v-if="item.playStatus != null" v-on:click="downloadVideo(index)" style="margin-right:10px">
                                        <Icon type="ios-cloud-download" /> 下载</span>
                                    <span v-if="item.playStatus != null" v-on:click="deleteVideo(index)" style="margin-right:10px">
                                        <Icon type="ios-close" /> 删除</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- <div :hidden=video.show style="width:600px;height:220px;margin-top:30px">
                        <video style="width:560px;height:220px" controls="controls" id="videoPlayer">
                            <source src="" type="video/avi">
                        </video>
                    </div> -->

                    <div style="width:600px;height:67px;margin:20px 0px 10px 8px">
                        <h3 style="line-height:35px;text-align:left">备注</h3>
                        <Input style="width: 550px;float:left" v-model="video.remark"></Input>
                    </div>
                    <Button v-if="video.operateStatus == 1" style="margin-left:255px;margin-top:5px" type="success" @click="addVideo">确认</Button>
                    <Button v-if="video.operateStatus == 2" style="margin-left:255px;margin-top:5px" type="success" @click="updateVideo">更新</Button>
                </div>
            </Modal>
        </TabPane>
    </Tabs>
</template>

<script>
import { shell, ipcRenderer, remote } from "electron";
import path from "path";
import Scrollbar from "smooth-scrollbar";
import { mapGetters, mapState } from "vuex";
// import { setTimeout } from "timers";
import * as util from "@/utils/util";
import * as timeMachineUtil from "@/utils/timeMachineUtil";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

// import $ from "jquery";
// import "turn.js";

export default {
    data() {
        return {};
    },

    components: {
        "mavon-editor": mavonEditor
    },

    computed: {
        ...mapGetters([
            "memory",
            "note",
            "pic",
            "voice",
            "video",
            "timeMachine"
        ])
    },

    created() {
        console.log("memory created====================================");
        this.queryAllVoiceBook();
        this.queryAllVideoBook();
        this.queryAllPic();
        this.queryNote();
    },

    mounted() {
        console.log("memory mounted====================================");
        this.$Message.config({ top: 400, duration: 3 });
        Scrollbar.init(document.querySelector("#Note-Left-TimeLine"));
        Scrollbar.init(document.querySelector("#voiceBookScrollbar"));
        Scrollbar.init(document.querySelector("#picImgScrollbar"));
        Scrollbar.init(document.querySelector("#videoBookScrollbar"));
    },

    methods: {
        resetNote() {
            this.$store.dispatch({
                type: "resetNote",
                thisObj: this
            });
        },
        queryNote() {
            this.$store.dispatch({
                type: "queryNote",
                thisObj: this
            });
        },
        addNote() {
            this.$store.dispatch({
                type: "addNote",
                thisObj: this
            });
            this.queryNote();
        },
        updateNote() {
            this.$store.dispatch({
                type: "updateNote",
                thisObj: this
            });
            this.queryNote();
        },
        $imgAdd(pos, $file) {
            let returnPath = timeMachineUtil.handleNoteAttach(
                $file.name,
                $file.path
            );
            setTimeout(() => {
                this.$refs.md.$img2Url(pos, returnPath);
            }, 100);
        },
        setNoteInfo(noteObj) {
            this.$store.dispatch({
                type: "setNoteInfo",
                thisObj: this,
                noteObj: noteObj
            });
        },
        deleteNoteById(id) {
            this.$alert("你确定要删除吗?", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                    this.$store.dispatch({
                        type: "deleteNoteById",
                        thisObj: this,
                        id: id
                    });
                    this.queryNote();
                }
            });
        },

        handle(name) {
            this.reloadPage();
            setTimeout(() => {
                this.memory.tabName = name;
            }, 1);
            this.memory.animated = true;
        },
        // video start
        queryAllVideoBook() {
            this.$store.dispatch({
                type: "queryAllVideoBook",
                thisObj: this
            });
        },
        // 显示videoBook详情
        showVideoBook(index) {
            this.$store.dispatch({
                type: "showVideoBook",
                thisObj: this,
                index: index,
                timeMachine: this.timeMachine
            });
            this.memory.animated = false;
            this.reloadPage();
            setTimeout(() => {
                this.memory.tabName = "video";
            }, 1);
        },
        changeVideoPage(pageNum) {
            this.$nextTick(function() {
                this.video.currentPageNum = pageNum;
            });
            this.queryAllVideoBook();
        },
        closeVideoModal(flag) {
            if (!flag) {
                this.$store.dispatch({
                    type: "closeVideoModal",
                    thisObj: this,
                    timeMachine: this.timeMachine
                });
            }
        },
        addVideo() {
            this.$store.dispatch({
                type: "addVideo",
                thisObj: this,
                timeMachine: this.timeMachine
            });
            setTimeout(() => {
                this.queryAllVideoBook();
            }, 1000);
        },
        updateVideo() {
            this.$store.dispatch({
                type: "updateVideo",
                thisObj: this,
                timeMachine: this.timeMachine
            });
            this.reloadPage();
            setTimeout(() => {
                this.memory.tabName = "video";
            }, 1);
        },
        videoHandle() {
            document.getElementById("videoFile").click();
        },
        uploadVideo(e) {
            this.$store.dispatch({
                type: "uploadVideo",
                event: e,
                thisObj: this
            });
            this.reloadPage();
            setTimeout(() => {
                this.memory.tabName = "video";
            }, 1);
        },
        playVideo(index) {
            let videoObj = this.video.videoList[index];
            let video = document.getElementById("videoPlayer");
            this.$nextTick(function() {
                this.video.show = false;
            });
            video.src = videoObj.url;
            if (videoObj.playStatus == 1) {
                //播放(继续播放)
                video.play();
                videoObj.playStatus = 0;
                if (this.video.key >= 0 && this.video.key != index) {
                    let lastVideoObj = this.video.videoList[this.video.key];
                    lastVideoObj.playStatus = 1;
                }
            } else {
                video.pause();
                videoObj.playStatus = 1;
            }
            this.video.key = index;
        },
        downloadVideo(index) {
            let videoObj = this.video.videoList[index];
            let sourPath = videoObj.url; //需要下载文件的路径
            let destPath = util.transPath(
                path.join(remote.app.getPath("desktop"))
            ); //下载文件存放路径
            ipcRenderer.send("download", sourPath + "+" + destPath);
        },
        deleteVideo(index) {
            this.$store.dispatch({
                type: "deleteVideo",
                thisObj: this,
                index: index
            });
        },
        // video end

        // pic start
        closePicPlayModal(flag) {
            if (!flag) {
                // this.$store.dispatch({
                //     type: "closePicModal",
                //     thisObj: this,
                //     timeMachine: this.timeMachine
                // });
                this.pic.carouselValue = 0;
            }
        },
        picImgChange(oldValue, value) {},
        playPic(index) {
            this.$store.dispatch({
                type: "playPic",
                thisObj: this,
                index: index
            });
        },
        queryAllPic() {
            this.$store.dispatch({
                type: "queryAllPic",
                thisObj: this
            });
        },
        deletePicBook(index) {},
        showPicBook(index) {
            this.$store.dispatch({
                type: "showPicBook",
                thisObj: this,
                index: index,
                timeMachine: this.timeMachine
            });
            this.memory.animated = false;
            this.reloadPage();
            setTimeout(() => {
                this.memory.tabName = "pic";
            }, 1);
        },
        changePicPage(pageNum) {
            this.$nextTick(function() {
                this.pic.currentPageNum = pageNum;
            });
            this.queryAllPic();
        },
        closePicModal(flag) {
            if (!flag) {
                this.$store.dispatch({
                    type: "closePicModal",
                    thisObj: this,
                    timeMachine: this.timeMachine
                });
            }
        },
        addPic() {
            this.$store.dispatch({
                type: "addPic",
                timeMachine: this.timeMachine,
                thisObj: this
            });
            setTimeout(() => {
                this.queryAllPic();
            }, 1000);
            // this.queryAllPic();
        },
        updatePic() {
            this.$store.dispatch({
                type: "updatePic",
                thisObj: this,
                timeMachine: this.timeMachine
            });
            this.reloadPage();
            setTimeout(() => {
                this.memory.tabName = "pic";
            }, 1);
        },
        playItem(url) {
            shell.openItem(url);
        },
        downloadPicImg(index) {
            let picObj = this.timeMachine.uploadList[index];
            let sourPath = picObj.url; //需要下载文件的路径
            let destPath = util.transPath(
                path.join(remote.app.getPath("desktop"))
            ); //下载文件存放路径
            ipcRenderer.send("download", sourPath + "+" + destPath);
        },
        deletePicImg(index) {
            this.$store.dispatch({
                type: "deletePicImg",
                thisObj: this,
                index: index,
                timeMachine: this.timeMachine
            });
        },
        // pic end

        changePage(pageNum) {
            this.$nextTick(function() {
                this.voice.curPageNum = pageNum;
            });
            this.queryAllVoiceBook();
        },
        test() {},
        // 删除voicebook
        deleteVoiceBook(index) {
            this.$store.dispatch({
                type: "deleteVoiceBook",
                thisObj: this,
                index: index
            });
        },
        // 关闭模态框
        closeVoiceModal(flag) {
            if (!flag) {
                this.$store.dispatch({
                    type: "closeVoiceModal",
                    thisObj: this,
                    timeMachine: this.timeMachine
                });
            }
        },
        // 更新有声书
        updateVoice() {
            this.$store.dispatch({
                type: "updateVoice",
                thisObj: this,
                timeMachine: this.timeMachine
            });
            this.reloadPage();
            setTimeout(() => {
                this.memory.tabName = "voice";
            }, 1);
        },
        // 显示voiceBook详情
        showVoiceBook(index) {
            this.$store.dispatch({
                type: "showVoiceBook",
                thisObj: this,
                index: index,
                timeMachine: this.timeMachine
            });
            this.memory.animated = false;
            this.reloadPage();
            setTimeout(() => {
                this.memory.tabName = "voice";
            }, 1);
        },
        // 下载audio
        downloadAudio(index) {
            let audioObj = this.voice.audioList[index];
            let sourPath = audioObj.url; //需要下载文件的路径
            let destPath = util.transPath(
                path.join(remote.app.getPath("desktop"))
            ); //下载文件存放路径
            ipcRenderer.send("download", sourPath + "+" + destPath);
        },

        // 播放audio
        playAudio(index) {
            let voiceObj = this.voice.audioList[index];
            let audio = document.getElementById("audioPlayer");
            this.$nextTick(function() {
                this.voice.show = false;
            });
            audio.src = voiceObj.url;
            if (voiceObj.playStatus == 1) {
                //播放(继续播放)
                audio.play();
                voiceObj.playStatus = 0;
                if (this.voice.key >= 0 && this.voice.key != index) {
                    let lastVoiceObj = this.voice.audioList[this.voice.key];
                    lastVoiceObj.playStatus = 1;
                }
            } else {
                audio.pause();
                voiceObj.playStatus = 1;
            }
            this.voice.key = index;
        },
        // 查询所有的voiceBook
        queryAllVoiceBook() {
            this.$store.dispatch({
                type: "queryAllVoiceBook",
                thisObj: this
            });
        },
        audioHandle() {
            document.getElementById("audioFile").click();
        },
        deleteAudio(index) {
            this.$store.dispatch({
                type: "deleteAudio",
                thisObj: this,
                index: index
            });
        },
        uploadAudio(e) {
            this.$store.dispatch({
                type: "uploadAudio",
                event: e,
                thisObj: this
            });
            this.reloadPage();
            setTimeout(() => {
                this.memory.tabName = "voice";
            }, 1);
        },
        addVoice() {
            this.$store.dispatch({
                type: "addVoice",
                thisObj: this,
                timeMachine: this.timeMachine
            });
            setTimeout(() => {
                this.queryAllVoiceBook();
            }, 1000);
        },
        reloadPage() {
            this.$store.state.home.home.isRouterAlive = false;
            this.$nextTick(
                () => (this.$store.state.home.home.isRouterAlive = true)
            );
        },
        addFace() {
            this.$store.dispatch({
                type: "addVoice",
                thisObj: this
            });
        },
        showPhotoHandle() {
            document.getElementById("picFile").click();
        },
        showPhoto(e) {
            this.$store.dispatch({
                type: "showPhoto",
                event: e,
                vueObj: this
            });
            this.reloadPage();
            setTimeout(() => {
                this.memory.tabName = "pic";
            }, 1);
        },
        handleRemove(index) {
            this.$store.dispatch({
                type: "handleRemove",
                index: index
            });
        },
        handleView(url) {
            shell.openItem(url);
        }
    }
};
</script>
<style lang='less'>
@import "../style/memory.less";
@import "../style/note.less";
@import "../style/voice.less";
@import "../style/pic.less";
// @import "../style/timeMachine.less";
.ivu-modal-footer {
    display: none;
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
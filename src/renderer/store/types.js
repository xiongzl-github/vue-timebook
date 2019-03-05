// const GET_SELLER = "GET_SELLER";
// const SHOW_DETAIL = "SHOW_DETAIL";
// const HIDE_DETAIL = "HIDE_DETAIL";
// const GET_GOODS = "GET_GOODS";

// 常用操作===start
const ADD = "add";
const DELETE = "delete";
const UPDATE = "update";
const QUERY = "query";
// 常用操作===end

// 类别分类start
const ORIGINALCATEGORY = 0;
const KNOWLEDGECATEGORY = 1;
const CONSUMECATEGORY = 2;
// 类别分类end

// 数据库表名===start
const TBL_USER = "tbl_user.db";
const TBL_TAG = "tbl_tag.db";
const TBL_TIMEMACHINE = "tbl_timeMachine.db";
const TBL_DBINFO = "tbl_dbInfo.db";
const TBL_ATTACH = "tbl_attach.db";
// 数据库表明===end

// 附件分组===start
const TIMEMACHINE_GROUP = "TimeMachine_Group";
const VOICE_IMG_GROUP = "Voice_Img_Group";
const VOICE_AUDIO_GROUP = "Voice_Audio_Group";
const VIDEO_VIDEO_GROUP = "Video_Video_Group";
const VIDEO_IMG_GROUP = "Video_Img_Group";
const PIC_IMG_GROUP = "Pic_Img_Group";

// 附件分组===end

// 返回信息===start
const SUCCESS = 1;
const FAILURE = 0;
const RETURN_MSG = "额呵, 没有搜索到相关内容...";
const SYNC_YES = 1;
const SYNC_NO = 0;
const TAG_REPEAT_CODE = 100;
const TAG_REPEAT_MSG = "此标签已存在, 不能重复添加!";
// 返回信息===end

// timeMachine===start
const TEST = "test";
const DEALWITHTIMESLOT = "dealWithTimeSlot";
const HANDLETIMESLOTSELECT = "handleTimeSlotSelect";
const HANDLETIMESLOTSTARTSEARCH = "handleTimeSlotStartSearch";
const HANDLETIMESLOTENDSEARCH = "handleTimeSlotEndSearch";
const HANDLETIMESLOTSTARTCHANGE = "handleTimeSlotStartChange";
const HANDLETIMESLOTENDCHANGE = "handleTimeSlotEndChange";
const ADDTAG = "addTag";
const SEARCHTAGS = "searchTags";
const CHANGEUP = "changeUp";
const CHANGEDOWN = "changeDown";
const HIDETAGS = "hideTags";
const CLOSETAG = "closeTag";
const CHOOSETAG = "chooseTag";
const HANDLEATTACHUPLOAD = "handelAttachUpload";
const SHOWPHOTO = "showPhoto";
const HANDLEREMOVE = "handleRemove";
const SUBMITTIMEMACHINE = "submitTimeMachine";
const RESETTIMEMACHINE = "resetTimeMachine";

const QUERYTAGS = "queryTags";

const QUERYALLTAGS = "queryAllTags";

const INITTIMESLOT = "initTimeSlot";
const SETTIMESLOTEND = "setTimeSlotEnd";
const DELETETAG = "deleteTag";
const GETCONSUMETIME = "getConsumeTime";
const SETPROGRESSSTATUS = "setProgressStatus";
const QUERYTIMELISTBYDATE = "queryTimeListByDate";
const DELETETIMEMACHINEBYID = "deleteTimeMachineById";
const SETTIMEMACHINEINFO = "setTimeMachineInfo";
const QUERYLASTSUBMITTIMESLOT = "queryLastSubmitTimeSlot";
const UPDATETIMEMACHINE = "updateTimeMachine";
const QUERYTASKBYDATE = "queryTaskByDate";
const TODOLISTCHANGE = "todolistChange";
const ADDREMINDCYCLESETTING = "addRemindCycleSetting";
const SAVESETTING = "saveSetting";
const QUERYCATEGORYBYTYPE = "queryCategoryByType";
// timeMachine===end

// todoList===start
const ADDCATEGORY = "addCategory";
//const QUERYALLCATEGORY = "queryAllCategory";
const QUERYCATEGORYOFSELECT = "queryCategoryOfSelect";
const RELOADPAGE = "reloadPage";
const ADDHEART = "addHeart";
const SUBMITTODOLIST = "submitTodoList";
const QUERYCATEGORYTASK = "queryCategoryTask";
const DELETETASKBYID = "deleteTaskById";
const DELETECATEGORYBYID = "deleteCategoryById";
const QUERYCATEGORYOFLEVEL = "queryCategoryOfLevel";
const QUERYCATEGORYOFSELECTMODAL = "queryCategoryOfSelectModal";
const QUERYTODOLISTBYDATE = "queryTodolistByDate";
const SETTODOLISTINFO = "setTodolistInfo";
const UPDATETODOLIST = "updateTodolist";
const RESETTODOLIST = "resetTodolist";
const SETTODOLISTINFOOFCATEGORYIDS = "setTodolistInfoOfCategoryIds";
const HANDELIMGCHECK = "handleImgCheck";
const GETICONS = "getIcons";
const QUERYNEWTODOLISTBYDATE = "queryNewTodolistByDate";
const QUERYTARGETS = "queryTargets";
const TODOLISTCATEGORYCHANGE = "todolistCategoryChange";
const ADDDISCARDTASK = "addDiscardTask";

// todoList===end

// consume===start
const QUERYCONSUMELISTBYDATE = "queryConsumeListByDate";
const QUERYCONSUMEBUDGET = "queryConsumeBudget";
const QUERYCONSUMECATEGORYIDBYNAME = "queryConsumeCategoryIdByName";
const SAVECONSUMESETTING = "saveConsumeSetting";
const APPLYCONSUMESETTING = "applyConsumeSetting";
const QUERYBUDGETBYCURYEARMONTH = "queryBudgetByCurYearMonth";
const SUMMONTHEXPEND = "sumMonthExpend";
const SUMYEAREXPEND = "sumYearExpend";
const QUERYCONSUMEINCOME = "queryConsumeIncome";
const SUMCATEGORYCONSUME = "sumCategoryConsume";
const SUMTOTALMONTHEXPENDOFCONSUME = "sumTotalMonthExpendOfConsume";
const SUMTOTALYEAREXPENDOFCONSUME = "sumTotalYearExpendOfConsume";
const OPENCONSUMEMODAL = "openConsumeModal";
const OPENINCOMEMODAL = "openIncomeModal";
const SUMCONSUMETREND = "sumConsumeTrend";
const QUERYBUDGETDETAILOFTREND = "queryBudgetDetailOfTrend";
const OPENCONSUMEMODALOFTREND = "openConsumeModalOfTrend";
const SUMCONSUMECATEGORYOFANALYZE = "sumConsumeCategoryOfAnalyze";
// consume===end

// knowledge start
const QUERYKNOWLEDGELISTBYDATE = "queryKnowledgeListByDate";
const GETNOTENUMOFCURDATE = "getNoteNumOfCurDate";
const GETNOTENUMOFCURMONTH = "getNoteNumOfCurMonth";
const GETNOTENUMOFREVIEW = "getNoteNumOfReview";
const SAVENOTE = "saveNote";
const QUERYNOTECATEGORYIDBYNAME = "queryNoteCategoryIdByName";
const QUERYNOTECATEGORY = "queryNoteCategory";
const QUERYKNOWLEDGEGRAPH = "queryKnowledgeGraph";
const ECHARTSCLICKOFTREE = "echartsClickOfTree";
const SUMKNOWLEDGECATEGORYOFANALYZE = "sumKnowledgeCategoryOfAnalyze";
const OPENKNOWLEDGEMODAL = "openKnowledgeModal";
const SHOWKNOWLEDGENOTE = "showKnowledgeNote";
const SUMKNOWLEDGETREND = "sumKnowledgeTrend";
const OPENKNOWLEDGEMODALOFTREND = "openKnowledgeModalOfTrend";
const GETNOTEOFREVIEW = "getNoteOfReview";
const OPENKNOWLEDGEREVIEWMODAL = "openKnowledgeReviewModal";
const RIGHTCLICK = "rightClick";
const LEFTCLICK = "leftClick";
const REMEMBER = "remember";
const DISREMEMBER = "disremember";
const ISJOINPREVIEWPLAN = "isJoinPreviewPlan";
// knowledge end

// dashboard start
const GETTODOLISTBYDATE = "getTodolistByDate";
const GETTARGETBYDATE = "getTargetByDate";
const GETTOTALCONSUMEBYDATE = "getTotalConsumeByDate";
const GETTOTALNOTEBYDATE = "getTotalNoteByDate";
const GETTOTALSPORTTIMEBYDATE = "getTotalSportTimeByDate";
const GETGETUPTIMEBYDATE = "getGetupTimeByDate";
const GETSLEEPTIMEBYDATE = "getSleepTimeByDate";
const GETWORKPROGRESSBYDATE = "getWorkProgressByDate";
const UPDATEPROGRESSSTATUS = "updateProgressStatus";
const CHANGETARGETSTATUS = "changeTargetStatus";
const ADDREASON = "addReason";
const GETTODOLISTBYNEXTDATE = "getTodolistByNextDate";
const GETSUMMARYBYDATE = "getSummaryByDate";
const SHOWTARGETDETAIL = "showTargetDetail";
const QUERYALLREASONS = "queryAllReasons";
const QUERYTARGETREASONS = "queryTargetReasons";
const REASONSELECT = "reasonSelect";
const PUSHTARGETREASON = "pushTargetReason";
const ADDTARGETREASON = "addTargetReason";
const CLOSETARGETREASON = "closeTargetReason";
const GETTODOLISTBYDATEOFDASHBOARD = "getTodolistByDateOfDashboard";
const DISCARDTASK = "discardTask";
const DELETELISTTASKBYID = "deleteListTaskById";
// dashboard end

// target start
const SUBMITTARGET = "submitTarget";
const QUERYALLTARGET = "queryAllTarget";
const DELETETARGETBYID = "deleteTargetById";
const SETTARGETINFO = "setTargetInfo";
const UPDATETARGET = "updateTarget";
const RESETTARGET = "resetTarget";
const SHOWTARGET = "showTarget";
const HIDDENTARGET = "hiddenTarget";
// target end

// voice start
const ADDVOICE = "addVoice";
const UPLOADAUDIO = "uploadAudio";
const DELETEAUDIO = "deleteAudio";
const QUERYALLVOICEBOOK = "queryAllVoiceBook";
const SHOWVOICEBOOK = "showVoiceBook";
const UPDATEVOICE = "updateVoice";
const CLOSEVOICEMODAL = "closeVoiceModal";
const DELETEVOICEBOOOK = "deleteVoiceBook";
// voice end

// login start
const LOGIN = "login";
const REGISTER = "register";
const UPDATEUSERLOGINSTATU = "UPDATEUSERLOGINSTATU";

// login end

// home === start
const RELOAD = "reload";
// home ==== end

// pic === start
const ADDPIC = "addPic";
const QUERYALLPIC = "queryAllPic";
const DELETEPICIMG = "deletePicImg";
const SHOWPICBOOK = "showPicBook";
const UPDATEPIC = "updatePic";
const CLOSEPICMODAL = "closePicModal";
const PLAYPIC = "playPic";
// pic === end

// video === start
const UPLOADVIDEO = "uploadVideo";
const ADDVIDEO = "addVideo";
const QUERYALLVIDEOBOOK = "queryAllVideoBook";
const SHOWVIDEOBOOK = "showVideoBook";
const DELETEVIDEO = "deleteVideo";
const UPDATEVIDEO = "updateVideo";
const CLOSEVIDEOMODAL = "closeVideoModal";
// video === end

// time === start
const QUERYALLTIME = "queryAllTime";
const QUERYALLTIMENUM = "queryAllTimeNum";
const QUERYSUMMARYLISTBYDATE = "querySummaryListByDate";
const QUERYVOICELISTBYDATE = "queryVoiceListByDate";
const QUERYPICLISTBYDATE = "queryPicListByDate";
const QUERYVIDEOLISTBYDATE = "queryVideoListByDate";
const SAVETIMESETTING = "saveTimeSetting";
const SHOWTIMEBOOK = "showTimeBook";
const QUERYTIMEMACHINELISTBYDATE = "queryTimeMachineListByDate";
const QUERYKNOWLEDGESBYDATE = "queryKnowledgesByDate";
const QUERYTARGETLISTBYDATE = "queryTargetListByDate";
const QUERYCONSUMESBYDATE = "queryConsumesByDate";
const OPENTIMEBOOKCOVERMODAL = "openTimebookCoverModal";
const CHOOSECOVER = "chooseCover";
// time === end

// emotion === start
const ADDEMOTION = "addEmotion";
const UPDATEEMOTION = "updateEmotion";
const QUERYEMOTIONBYDATE = "queryEmotionByDate";
const QUERYEMOTIONANADATA = "queryEmotionAnaData";
const QUERYEMOTIONANADETAILDATA = "queryEmotionAnaDetailData";
const QUERYEMOTIONTRENDDATA = "queryEmotionTrendData";
// emotion === end

// memo === start
const ADDMEMOCONTENTTAG = "addMemoContentTag";
const DELETEMEMOCONTENTTAG = "deleteMemoContentTag";
const ADDMEMO = "addMemo";
const QUERYMEMOS = "queryMemos";
const SHOWMEMODETAIL = "showMemoDetail";
const SHOWMEMOMODAL = "showMemoModal";
const UPDATEMEMO = "updateMemo";
const DELETEMEMO = "deleteMemo";
const CLOSEMOMOMODAL = "closeMemoModal";
// memo === end

// motto === start
const ADDMOTTO = "addMotto";
const QUERYMOTTOS = "queryMottos";
const DELETEMOTTO = "deleteMotto";
const SHOWMOTTOMODAL = "showMottoModal";
const UPDATEMOTTO = "updateMotto";
const CLOSEMOTTOMODAL = "closeMottoModal";
const QUERYALLMOTTOS = "queryAllMottos";
// motto === end

// lan === start
const ADDLAN = "addLan";
const QUERYALLLANCATEGORY = "queryAllLanCategory";
const DELETEAPILANCATEGORY = "deleteApiLanCategory";
// lan === end

// tool === start
const ADDTOOL = "addTool";
const QUERYALLTOOLCATEGORY = "queryAlToolCategory";
const DELETEAPITOOLCATEGORY = "deleteApiToolCategory";
// tool === end

// api === start
const ADDAPI = "addApi";
const DELETEAPI = "deleteApi";
const QUERYAPIS = "queryApis";
const UPDATEAPI = "updateApi";
const SHOWAPIMODAL = "showApiModal";
const SHOWAPIDETAIL = "showApiDetail";
const CLOSEAPIDETAILMODAL = "closeApiDetailModal";
// api === end

// question === start
const ADDQUESTION = "addQuestion";
const QUERYQUESTIONS = "queryQuestions";
const DELETEQUESTION = "deleteQuestion";
const SHOWQUESTIONMODAL = "showQuestionModal";
const UPDATEQUESTION = "updateQuestion";
const QUERYANSWERSBYDATE = "queryAnswersByDate";
const ADDANSWERS = "addAnswers";
// question === end

// work === start
const GETWEEKRANGE = "getWeekRange";
const GETWEEKREPORT = "getWeekReport";
// work === end

// note ==== start
const ADDNOTE = "addNote";
const UPDATENOTE = "updateNote";
const QUERYNOTE = "queryNote";
const SETNOTEINFO = "setNoteInfo";
const RESETNOTE = "resetNote";
const DELETENOTEBYID = "deleteNoteById";
// note ==== end

// timebookCover === start
const QUERYTIMEBOOKCOVER = "queryTimeBookCover";
const CONFIRMCOVER = "confirmCover";
// timebookCover === end

export default {
    
    // timebookCover === start
    QUERYTIMEBOOKCOVER,
    CONFIRMCOVER,
    // timebookCover === end

    // note ==== start
    ADDNOTE,
    UPDATENOTE,
    QUERYNOTE,
    SETNOTEINFO,
    RESETNOTE,
    DELETENOTEBYID,
    // note === end

    // work === start
    GETWEEKRANGE,
    GETWEEKREPORT,
    // work === end

    // question === start
    ADDANSWERS,
    QUERYANSWERSBYDATE,
    UPDATEQUESTION,
    SHOWQUESTIONMODAL,
    ADDQUESTION,
    QUERYQUESTIONS,
    DELETEQUESTION,
    // question === end

    // api === start
    ADDAPI,
    QUERYAPIS,
    UPDATEAPI,
    SHOWAPIMODAL,
    SHOWAPIDETAIL,
    CLOSEAPIDETAILMODAL,
    DELETEAPI,
    // api === end

    // tool === start
    ADDTOOL,
    QUERYALLTOOLCATEGORY,
    DELETEAPITOOLCATEGORY,
    // tool === end

    // lan === start
    ADDLAN,
    QUERYALLLANCATEGORY,
    DELETEAPILANCATEGORY,
    // lan === end

    // motto === start
    ADDMOTTO,
    QUERYMOTTOS,
    DELETEMOTTO,
    SHOWMOTTOMODAL,
    UPDATEMOTTO,
    CLOSEMOTTOMODAL,
    QUERYALLMOTTOS,
    // motto === end

    // memo === start
    ADDMEMOCONTENTTAG,
    DELETEMEMOCONTENTTAG,
    ADDMEMO,
    QUERYMEMOS,
    SHOWMEMODETAIL,
    SHOWMEMOMODAL,
    UPDATEMEMO,
    DELETEMEMO,
    CLOSEMOMOMODAL,
    // memo === end

    // emotion start
    ADDEMOTION,
    QUERYEMOTIONBYDATE,
    UPDATEEMOTION,
    QUERYEMOTIONANADATA,
    QUERYEMOTIONANADETAILDATA,
    QUERYEMOTIONTRENDDATA,
    // emotion end

    // time === start
    QUERYALLTIME,
    QUERYALLTIMENUM,
    QUERYSUMMARYLISTBYDATE,
    QUERYVOICELISTBYDATE,
    QUERYPICLISTBYDATE,
    QUERYVIDEOLISTBYDATE,
    SAVETIMESETTING,
    SHOWTIMEBOOK,
    QUERYTIMEMACHINELISTBYDATE,
    QUERYKNOWLEDGESBYDATE,
    QUERYTARGETLISTBYDATE,
    QUERYCONSUMESBYDATE,
    OPENTIMEBOOKCOVERMODAL,
    CHOOSECOVER,
    // time === end

    // video === start
    UPLOADVIDEO,
    ADDVIDEO,
    QUERYALLVIDEOBOOK,
    SHOWVIDEOBOOK,
    DELETEVIDEO,
    UPDATEVIDEO,
    CLOSEVIDEOMODAL,
    // video === end

    // pic === start
    ADDPIC,
    QUERYALLPIC,
    DELETEPICIMG,
    SHOWPICBOOK,
    UPDATEPIC,
    CLOSEPICMODAL,
    PLAYPIC,
    // pic === end

    // login start
    LOGIN,
    REGISTER,
    UPDATEUSERLOGINSTATU,
    // login end

    // voice start
    DELETEVOICEBOOOK,
    ADDVOICE,
    UPLOADAUDIO,
    DELETEAUDIO,
    QUERYALLVOICEBOOK,
    SHOWVOICEBOOK,
    UPDATEVOICE,
    CLOSEVOICEMODAL,
    // voice end

    // target start
    SUBMITTARGET,
    QUERYALLTARGET,
    DELETETARGETBYID,
    SETTARGETINFO,
    UPDATETARGET,
    RESETTARGET,
    HIDDENTARGET,
    SHOWTARGET,

    // target end

    // timeMachine 相关方法 start
    DEALWITHTIMESLOT,
    HANDLETIMESLOTSELECT,
    HANDLETIMESLOTSTARTSEARCH,
    HANDLETIMESLOTENDSEARCH,
    ADDTAG,
    SEARCHTAGS,
    CHANGEUP,
    CHANGEDOWN,
    HIDETAGS,
    CLOSETAG,
    CHOOSETAG,
    HANDLEATTACHUPLOAD,
    SHOWPHOTO,
    HANDLEREMOVE,
    SUBMITTIMEMACHINE,

    QUERYTAGS,
    QUERYALLTAGS,
    INITTIMESLOT,
    SETTIMESLOTEND,
    DELETETAG,
    GETCONSUMETIME,
    SETPROGRESSSTATUS,
    QUERYTIMELISTBYDATE,
    DELETETIMEMACHINEBYID,
    SETTIMEMACHINEINFO,
    QUERYLASTSUBMITTIMESLOT,
    UPDATETIMEMACHINE,
    RESETTIMEMACHINE,
    QUERYTASKBYDATE,
    SETTODOLISTINFO,
    TODOLISTCHANGE,
    ADDREMINDCYCLESETTING,
    SAVESETTING,
    QUERYCATEGORYBYTYPE,
    // timeMachine 相关方法 end

    // todoList 相关方法 start
    ADDCATEGORY,
    RELOADPAGE,
    ADDHEART,
    SUBMITTODOLIST,
    QUERYCATEGORYTASK,
    DELETETASKBYID,
    DELETECATEGORYBYID,
    QUERYCATEGORYOFSELECT,
    QUERYCATEGORYOFLEVEL,
    QUERYCATEGORYOFSELECTMODAL,
    QUERYTODOLISTBYDATE,
    UPDATETODOLIST,
    RESETTODOLIST,
    SETTODOLISTINFOOFCATEGORYIDS,
    HANDELIMGCHECK,
    GETICONS,
    QUERYNEWTODOLISTBYDATE,
    QUERYTARGETS,
    TODOLISTCATEGORYCHANGE,
    ADDDISCARDTASK,
    // todoList 相关方法 end

    // consume 相关方法 start
    QUERYCONSUMELISTBYDATE,
    QUERYCONSUMEBUDGET,
    QUERYCONSUMECATEGORYIDBYNAME,
    SAVECONSUMESETTING,
    APPLYCONSUMESETTING,
    QUERYBUDGETBYCURYEARMONTH,
    SUMMONTHEXPEND,
    SUMYEAREXPEND,
    QUERYCONSUMEINCOME,
    SUMCATEGORYCONSUME,
    SUMTOTALMONTHEXPENDOFCONSUME,
    SUMTOTALYEAREXPENDOFCONSUME,
    OPENCONSUMEMODAL,
    OPENINCOMEMODAL,
    SUMCONSUMETREND,
    QUERYBUDGETDETAILOFTREND,
    OPENCONSUMEMODALOFTREND,
    SUMCONSUMECATEGORYOFANALYZE,
    // consume 相关方法 end

    // knowledge 相关方法 start
    QUERYKNOWLEDGELISTBYDATE,
    GETNOTENUMOFCURDATE,
    GETNOTENUMOFCURMONTH,
    GETNOTENUMOFREVIEW,
    SAVENOTE,
    QUERYNOTECATEGORYIDBYNAME,
    QUERYNOTECATEGORY,
    QUERYKNOWLEDGEGRAPH,
    ECHARTSCLICKOFTREE,
    SUMKNOWLEDGECATEGORYOFANALYZE,
    OPENKNOWLEDGEMODAL,
    SHOWKNOWLEDGENOTE,
    SUMKNOWLEDGETREND,
    OPENKNOWLEDGEMODALOFTREND,
    GETNOTEOFREVIEW,
    OPENKNOWLEDGEREVIEWMODAL,
    RIGHTCLICK,
    LEFTCLICK,
    REMEMBER,
    DISREMEMBER,
    ISJOINPREVIEWPLAN,
    // knowledge 相关方法 end

    // dashboard 相关方法 start
    GETTODOLISTBYDATE,
    GETTARGETBYDATE,
    GETTOTALCONSUMEBYDATE,
    GETTOTALNOTEBYDATE,
    GETTOTALSPORTTIMEBYDATE,
    GETGETUPTIMEBYDATE,
    GETSLEEPTIMEBYDATE,
    GETWORKPROGRESSBYDATE,
    UPDATEPROGRESSSTATUS,
    CHANGETARGETSTATUS,
    ADDREASON,
    GETTODOLISTBYNEXTDATE,
    GETSUMMARYBYDATE,
    SHOWTARGETDETAIL,
    QUERYALLREASONS,
    QUERYTARGETREASONS,
    REASONSELECT,
    PUSHTARGETREASON,
    ADDTARGETREASON,
    CLOSETARGETREASON,
    GETTODOLISTBYDATEOFDASHBOARD,
    DISCARDTASK,
    DELETELISTTASKBYID,
    // dashboard 相关方法 end

    // home 相关 start

    // home 相关 end

    // 数据库相关表名 start
    TBL_USER,
    TBL_TAG,
    TBL_TIMEMACHINE,
    TBL_DBINFO,
    TBL_ATTACH,
    // 数据库相关表名 end

    // 返回信息 start
    SUCCESS,
    FAILURE,
    RETURN_MSG,
    SYNC_YES,
    SYNC_NO,
    TAG_REPEAT_CODE,
    TAG_REPEAT_MSG,
    // 返回信息 end

    // 附件分组 start
    TIMEMACHINE_GROUP,
    VOICE_IMG_GROUP,
    VOICE_AUDIO_GROUP,
    VIDEO_VIDEO_GROUP,
    PIC_IMG_GROUP,
    VIDEO_IMG_GROUP,
    // 附件分组 end

    // 常用操作 start
    ADD,
    DELETE,
    UPDATE,
    QUERY,
    // 常用操作 end
    // 类别分类 start
    ORIGINALCATEGORY,
    KNOWLEDGECATEGORY,
    CONSUMECATEGORY
    // 类别分类 end
};

<!-- todolist页面 -->
<template>
    <Tabs value="name01">
        <TabPane name="name01" label="待办清单" icon="ios-list-outline">
            <div class="TodoList-Left">
                <DatePicker @on-change="queryTodolist" class="Todolit-Left-DatePicker" type="date" v-model="todoList.leftCurTime"></DatePicker>
                <div style="width:auto;height:45px">
                    <ButtonGroup style="float:left">
                        <Button v-on:click="queryTodolistByDate" style="border-radius:0;width:151px" :type="todoList.style">今日任务</Button>
                        <Button v-on:click="queryNewTodolistByDate" style="border-radius:0;width:151px" :type="todoList.newStyle">循环任务</Button>
                    </ButtonGroup>
                </div>
                <div class="TodoList-Left-Content">
                    <Timeline style="width:auto;height:500px;">
                        <TimelineItem v-if="item.todolist.discardStatus == 0" v-for="(item, index) in todoList.todolists" :key="index" style="width:292px;height:66px;cursor:pointer">
                            <div style="display:inline-block;" v-on:click="setTodolistInfo(index)">
                                <div style="font-size:14px;font-weight:bolder;display:block;width:292px;height:21px; margin-bottom:10px">
                                    <span :title="item.parentCategory.categoryName + '--' + item.category.categoryName" style="width:180px;display:inline-block;overflow:hidden;height:21px">{{item.parentCategory.categoryName}}-{{item.category.categoryName}}</span>
                                    <span style="display:inline-block;overflow:hidden;height:21px" v-if="item.todolist.endDate != '' && item.todolist.repeatType != 2 && item.todolist.repeatType != 3">
                                        (还剩
                                        <span style="color:red"> {{item.todolist.endTimeNum}}</span> 天)
                                    </span>
                                </div>
                                <p class="content" style="display:inline-block;width:230px">
                                    <span v-if="item.todolist.importLevel == 1">
                                        <Icon style="margin-right:2px" v-for="i in item.todolist.difficult" :key="i" color="red" type="alert"></Icon>
                                    </span>
                                    <span v-if="item.todolist.importLevel == 2">
                                        <Icon style="margin-right:2px" v-for="i in item.todolist.difficult" :key="i" color="orange" type="alert"></Icon>
                                    </span>
                                    <span v-if="item.todolist.importLevel == 3">
                                        <Icon style="margin-right:2px" v-for="i in item.todolist.difficult" :key="i" color="#EEEE00" type="alert"></Icon>
                                    </span>
                                    <span v-if="item.todolist.importLevel == 4">
                                        <Icon style="margin-right:2px" v-for="i in item.todolist.difficult" :key="i" color="blue" type="alert"></Icon>
                                    </span>
                                    {{item.todolist.listName}}
                                </p>
                                <span style="float:right;" v-on:click="deleteTodolistById(item.todolist)">
                                    <Icon style="font-size:16px;margin-right:30px" type="close-circled"></Icon>
                                </span>
                            </div>

                        </TimelineItem>
                    </Timeline>
                </div>
            </div>
            <div class="TodoList-Right">
                <div class="TodoList-Right-Header">
                    <strong>待办清单</strong>
                    <DatePicker class="TodoList-Right-Header-DatePicker" type="date" v-model="todoList.curDateTime"></DatePicker>
                </div>
                <div class="TodoList-Right-Category">
                    <h3 class="TodoList-Right-Category-Label" style="">类别</h3>
                    <Cascader v-on:on-change="todolistCategoryChange" :data="todoList.categoryListOfSelect" v-model="todoList.categoryIds" class="TodoList-Right-Category-Select"></Cascader>
                    <Tooltip content="创建一个任务类别" placement="top-end">
                        <span @click="todoList.categoryModal = true">
                            <Icon class="TodoList-Right-Category-Icon" type="plus-round"></Icon>
                        </span>
                    </Tooltip>
                </div>

                <div class="TodoList-Right-Targets">
                    <h3 class="TodoList-Right-Targets-Label" style="">加入目标</h3>
                    <Select :clearable=true v-on:on-change="targetSelectChange" v-model="todoList.targetId" style="display:inline-block;width:610px;">
                        <Option v-for="item in todoList.targets" :value="item.id" :key="item.id">{{ item.target }}</Option>
                    </Select>
                    <Tooltip content="添加目标" placement="top-end">
                        <router-link to="/Home/Target">
                            <span v-on:click="jumpToTarget">
                                <Icon style="font-size: 24px;float: left;margin-bottom: -10px;margin-left: 5px;" type="navigate"></Icon>
                            </span>
                        </router-link>
                    </Tooltip>
                </div>

                <div class="TodoList-Right-TaskName">
                    <h3 class="TodoList-Right-TaskName-Label" style="">任务名称</h3>
                    <Input class="TodoList-Right-TaskName-Input" style="" autofocus v-model="todoList.listName" placeholder="请在这里输入一个任务..."></Input>
                    <Tooltip content="红心任务为必须执行任务" placement="top-end">
                        <span v-on:click="addHeart">
                            <Icon :color="todoList.color" class="TodoList-Right-TaskName-Icon" style="" type="heart"></Icon>
                        </span>
                    </Tooltip>
                </div>

                <div class="TodoList-Right-Repeat" style="">
                    <h3 class="TodoList-Right-Repeat-Label" style="">重复</h3>
                    <RadioGroup v-model="todoList.repeatType" style="float:left;">
                        <Radio label="0" value="0">不重复</Radio>
                        <Radio label="1" value="1">每一天</Radio>
                        <Radio label="2" value="2">每一周</Radio>
                        <Radio label="3" value="3">每个月</Radio>
                        <Radio label="4" value="4">每一年</Radio>
                        <Radio label="5" value="5">每一天(节假日除外)</Radio>
                        <Radio label="6" value="6">每一天(工作日除外)</Radio>
                    </RadioGroup>
                </div>

                <div class="TodoList-Right-EndTime">
                    <h3 class="TodoList-Right-EndTime-Label">截至时间</h3>
                    <div style="display:inline-block;float:left">
                        <DatePicker v-model="todoList.endDate" type="date" size="default" format="yyyy-MM-dd" style="width: 610px"></DatePicker>
                    </div>
                </div>

                <div style="margin-top:10px">
                    <h3 style="text-align:left;display:inline-block;float:left;margin-right:10px">难度</h3>
                    <div style="text-align:left">
                        <Rate style="margin-top:-5px" show-text v-model="todoList.difficult"></Rate>
                    </div>
                </div>

                <div class="TodoList-Right-Priority">
                    <h3 class="TodoList-Right-Priority-Label">优先级</h3>
                    <Select v-model="todoList.importLevel" style="display: inline-block;width:610px">
                        <Option v-for="item in todoList.importLevelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>

                <div class="TodoList-Right-Repeat" style="">
                    <h3 class="TodoList-Right-Repeat-Label" style="">时间段</h3>
                    <RadioGroup v-model="todoList.scheduleTime" style="float:left;">
                        <Radio label="0" value="0">清晨</Radio>
                        <Radio label="1" value="1">第克泰特时间</Radio>
                        <Radio label="2" value="2">上午</Radio>
                        <Radio label="3" value="3">午休</Radio>
                        <Radio label="4" value="4">下午</Radio>
                        <Radio label="5" value="5">傍晚</Radio>
                        <Radio label="6" value="6">睡前</Radio>
                        <Radio label="7" value="7">晚睡</Radio>
                        <Radio label="8" value="8">其它</Radio>
                    </RadioGroup>
                </div>

                <div style="margin-top:30px">
                    <span v-if="todoList.type == 1">
                        <Button @click="submitTodoList()" type="success" style="margin-right:20px">Submit</Button>
                    </span>
                    <span v-else>
                        <Button @click="updateTodolist()" type="success" style="margin-right:20px">update</Button>
                    </span>
                    <Button type="error" @click="resetTodolist()">Reset</Button>
                </div>

                <Modal id="categoryModal" :mask-closable="false" v-model="todoList.categoryModal" :styles="{top: '250px', width:'765px', height:'550px'}" title="创建任务清单类别!">
                    <div style="width:765px">
                        <div class="TodoList-Category-Modal" style="display:inline-block;width:250px;height:550px;margin: 5px 20px 0 8px;float: left;border-right: 1px solid #ddd;">
                            <div class="custom-tree-container">
                                <div class="block" style="margin-right:10px">
                                    <el-tree :data="todoList.categoryListOfLevel" node-key="id" :default-expand-all="false" :expand-on-click-node="false">
                                        <span class="custom-tree-node" slot-scope="{ node, data }">
                                            <span v-if="data.isLeaf == 0">{{ node.label }}</span>
                                            <span style="width:100px;display:inline-block;overflow:hidden;" v-if="data.isLeaf == 1" :title="node.label">{{ node.label }}</span>
                                            <span>
                                                <el-button type="text" size="mini" @click="() => deleteCategoryById(node, data)">
                                                    Delete
                                                </el-button>
                                            </span>
                                        </span>
                                    </el-tree>
                                </div>
                            </div>
                        </div>
                        <div style="display:inline-block;width:450px;height:550px;margin-top:5px;">
                            <h3 style="line-height:35px; text-align:left">父级</h3>
                            <Cascader :data="todoList.categoryListOfSelectModal" v-model="todoList.categoryModalIds" class="TodoList-Right-Category-Select"></Cascader>
                            <h3 style="line-height:35px; text-align:left">名称</h3>
                            <Input v-model="todoList.categoryName" placeholder="Enter something..." style="width: 450px"></Input>
                            <h3 style="line-height:35px; text-align:left">图标</h3>
                            <div id="TimeBook-Icon" style="width:450px;height:300px">
                                <div style="width:40px;height:32px;display:inline">
                                    <CheckboxGroup v-on:on-change="handleImgCheck" v-model="todoList.imgCheck">
                                        <Checkbox label="1.png" style="display:inline:block;margin-left:15px">
                                            <img id="1" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/1.png">
                                        </Checkbox>
                                        <Checkbox label="2.png" style="display:inline:block;margin-left:15px">
                                            <img id="2" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/2.png">
                                        </Checkbox>
                                        <Checkbox label="3.png" style="display:inline:block;margin-left:15px">
                                            <img id="3" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/3.png">
                                        </Checkbox>
                                        <Checkbox label="4.png" style="display:inline:block;margin-left:15px">
                                            <img id="4" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/4.png">
                                        </Checkbox>
                                        <Checkbox label="5.png" style="display:inline:block;margin-left:15px">
                                            <img id="5" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/5.png">
                                        </Checkbox>
                                        <Checkbox label="6.png" style="display:inline:block;margin-left:15px">
                                            <img id="6" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/6.png">
                                        </Checkbox>
                                        <Checkbox label="7.png" style="display:inline:block;margin-left:15px">
                                            <img id="7" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/7.png">
                                        </Checkbox>
                                        <Checkbox label="8.png" style="display:inline:block;margin-left:15px">
                                            <img id="8" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/8.png">
                                        </Checkbox>
                                        <Checkbox label="9.png" style="display:inline:block;margin-left:15px">
                                            <img id="9" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/9.png">
                                        </Checkbox>
                                        <Checkbox label="10.png" style="display:inline:block;margin-left:15px">
                                            <img id="10" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/10.png">
                                        </Checkbox>
                                        <Checkbox label="11.png" style="display:inline:block;margin-left:15px">
                                            <img id="11" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/11.png">
                                        </Checkbox>
                                        <Checkbox label="12.png" style="display:inline:block;margin-left:15px">
                                            <img id="12" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/12.png">
                                        </Checkbox>
                                        <Checkbox label="13.png" style="display:inline:block;margin-left:15px">
                                            <img id="13" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/13.png">
                                        </Checkbox>
                                        <Checkbox label="14.png" style="display:inline:block;margin-left:15px">
                                            <img id="14" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/14.png">
                                        </Checkbox>
                                        <Checkbox label="15.png" style="display:inline:block;margin-left:15px">
                                            <img id="15" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/15.png">
                                        </Checkbox>
                                        <Checkbox label="16.png" style="display:inline:block;margin-left:15px">
                                            <img id="16" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/16.png">
                                        </Checkbox>
                                        <Checkbox label="17.png" style="display:inline:block;margin-left:15px">
                                            <img id="17" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/17.png">
                                        </Checkbox>
                                        <Checkbox label="18.png" style="display:inline:block;margin-left:15px">
                                            <img id="18" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/18.png">
                                        </Checkbox>
                                        <Checkbox label="19.png" style="display:inline:block;margin-left:15px">
                                            <img id="19" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/19.png">
                                        </Checkbox>
                                        <Checkbox label="20.png" style="display:inline:block;margin-left:15px">
                                            <img id="20" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/20.png">
                                        </Checkbox>
                                        <Checkbox label="21.png" style="display:inline:block;margin-left:15px">
                                            <img id="21" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/21.png">
                                        </Checkbox>
                                        <Checkbox label="22.png" style="display:inline:block;margin-left:15px">
                                            <img id="22" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/22.png">
                                        </Checkbox>
                                        <Checkbox label="23.png" style="display:inline:block;margin-left:15px">
                                            <img id="23" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/23.png">
                                        </Checkbox>
                                        <Checkbox label="24.png" style="display:inline:block;margin-left:15px">
                                            <img id="24" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/24.png">
                                        </Checkbox>
                                        <Checkbox label="25.png" style="display:inline:block;margin-left:15px">
                                            <img id="25" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/25.png">
                                        </Checkbox>
                                        <Checkbox label="26.png" style="display:inline:block;margin-left:15px">
                                            <img id="26" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/26.png">
                                        </Checkbox>
                                        <Checkbox label="27.png" style="display:inline:block;margin-left:15px">
                                            <img id="27" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/27.png">
                                        </Checkbox>
                                        <Checkbox label="28.png" style="display:inline:block;margin-left:15px">
                                            <img id="28" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/28.png">
                                        </Checkbox>
                                        <Checkbox label="29.png" style="display:inline:block;margin-left:15px">
                                            <img id="29" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/29.png">
                                        </Checkbox>
                                        <Checkbox label="30.png" style="display:inline:block;margin-left:15px">
                                            <img id="30" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/30.png">
                                        </Checkbox>
                                        <Checkbox label="31.png" style="display:inline:block;margin-left:15px">
                                            <img id="31" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/31.png">
                                        </Checkbox>
                                        <Checkbox label="32.png" style="display:inline:block;margin-left:15px">
                                            <img id="32" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/32.png">
                                        </Checkbox>
                                        <Checkbox label="33.png" style="display:inline:block;margin-left:15px">
                                            <img id="33" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/33.png">
                                        </Checkbox>
                                        <Checkbox label="34.png" style="display:inline:block;margin-left:15px">
                                            <img id="34" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/34.png">
                                        </Checkbox>
                                        <Checkbox label="35.png" style="display:inline:block;margin-left:15px">
                                            <img id="35" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/35.png">
                                        </Checkbox>
                                        <Checkbox label="36.png" style="display:inline:block;margin-left:15px">
                                            <img id="36" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/36.png">
                                        </Checkbox>
                                        <Checkbox label="37.png" style="display:inline:block;margin-left:15px">
                                            <img id="37" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/37.png">
                                        </Checkbox>
                                        <Checkbox label="38.png" style="display:inline:block;margin-left:15px">
                                            <img id="38" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/38.png">
                                        </Checkbox>
                                        <Checkbox label="39.png" style="display:inline:block;margin-left:15px">
                                            <img id="39" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/39.png">
                                        </Checkbox>
                                        <Checkbox label="40.png" style="display:inline:block;margin-left:15px">
                                            <img id="40" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/40.png">
                                        </Checkbox>
                                        <Checkbox label="41.png" style="display:inline:block;margin-left:15px">
                                            <img id="41" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/41.png">
                                        </Checkbox>
                                        <Checkbox label="42.png" style="display:inline:block;margin-left:15px">
                                            <img id="42" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/42.png">
                                        </Checkbox>
                                        <Checkbox label="43.png" style="display:inline:block;margin-left:15px">
                                            <img id="43" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/43.png">
                                        </Checkbox>
                                        <Checkbox label="44.png" style="display:inline:block;margin-left:15px">
                                            <img id="44" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/44.png">
                                        </Checkbox>
                                        <Checkbox label="45.png" style="display:inline:block;margin-left:15px">
                                            <img id="45" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/45.png">
                                        </Checkbox>
                                        <Checkbox label="46.png" style="display:inline:block;margin-left:15px">
                                            <img id="46" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/46.png">
                                        </Checkbox>
                                        <Checkbox label="47.png" style="display:inline:block;margin-left:15px">
                                            <img id="47" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/47.png">
                                        </Checkbox>
                                        <Checkbox label="48.png" style="display:inline:block;margin-left:15px">
                                            <img id="48" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/48.png">
                                        </Checkbox>
                                        <Checkbox label="49.png" style="display:inline:block;margin-left:15px">
                                            <img id="49" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/49.png">
                                        </Checkbox>
                                        <Checkbox label="50.png" style="display:inline:block;margin-left:15px">
                                            <img id="50" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/50.png">
                                        </Checkbox>
                                        <Checkbox label="51.png" style="display:inline:block;margin-left:15px">
                                            <img id="51" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/51.png">
                                        </Checkbox>
                                        <Checkbox label="52.png" style="display:inline:block;margin-left:15px">
                                            <img id="52" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/52.png">
                                        </Checkbox>
                                        <Checkbox label="53.png" style="display:inline:block;margin-left:15px">
                                            <img id="53" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/53.png">
                                        </Checkbox>
                                        <Checkbox label="54.png" style="display:inline:block;margin-left:15px">
                                            <img id="54" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/54.png">
                                        </Checkbox>
                                        <Checkbox label="55.png" style="display:inline:block;margin-left:15px">
                                            <img id="55" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/55.png">
                                        </Checkbox>
                                        <Checkbox label="56.png" style="display:inline:block;margin-left:15px">
                                            <img id="56" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/56.png">
                                        </Checkbox>
                                        <Checkbox label="57.png" style="display:inline:block;margin-left:15px">
                                            <img id="57" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/57.png">
                                        </Checkbox>
                                        <Checkbox label="58.png" style="display:inline:block;margin-left:15px">
                                            <img id="58" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/58.png">
                                        </Checkbox>
                                        <Checkbox label="59.png" style="display:inline:block;margin-left:15px">
                                            <img id="59" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/59.png">
                                        </Checkbox>
                                        <Checkbox label="60.png" style="display:inline:block;margin-left:15px">
                                            <img id="60" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/60.png">
                                        </Checkbox>
                                        <Checkbox label="61.png" style="display:inline:block;margin-left:15px">
                                            <img id="61" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/61.png">
                                        </Checkbox>
                                        <Checkbox label="62.png" style="display:inline:block;margin-left:15px">
                                            <img id="62" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/62.png">
                                        </Checkbox>
                                        <Checkbox label="63.png" style="display:inline:block;margin-left:15px">
                                            <img id="63" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/63.png">
                                        </Checkbox>
                                        <Checkbox label="64.png" style="display:inline:block;margin-left:15px">
                                            <img id="64" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/64.png">
                                        </Checkbox>
                                        <Checkbox label="65.png" style="display:inline:block;margin-left:15px">
                                            <img id="65" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/65.png">
                                        </Checkbox>
                                        <Checkbox label="66.png" style="display:inline:block;margin-left:15px">
                                            <img id="66" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/66.png">
                                        </Checkbox>
                                        <Checkbox label="67.png" style="display:inline:block;margin-left:15px">
                                            <img id="67" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/67.png">
                                        </Checkbox>
                                        <Checkbox label="68.png" style="display:inline:block;margin-left:15px">
                                            <img id="68" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/68.png">
                                        </Checkbox>
                                        <Checkbox label="69.png" style="display:inline:block;margin-left:15px">
                                            <img id="69" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/69.png">
                                        </Checkbox>
                                        <Checkbox label="70.png" style="display:inline:block;margin-left:15px">
                                            <img id="70" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/70.png">
                                        </Checkbox>
                                        <Checkbox label="71.png" style="display:inline:block;margin-left:15px">
                                            <img id="71" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/71.png">
                                        </Checkbox>
                                        <Checkbox label="72.png" style="display:inline:block;margin-left:15px">
                                            <img id="72" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/72.png">
                                        </Checkbox>
                                        <Checkbox label="73.png" style="display:inline:block;margin-left:15px">
                                            <img id="73" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/73.png">
                                        </Checkbox>
                                        <Checkbox label="74.png" style="display:inline:block;margin-left:15px">
                                            <img id="74" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/74.png">
                                        </Checkbox>
                                        <Checkbox label="75.png" style="display:inline:block;margin-left:15px">
                                            <img id="75" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/75.png">
                                        </Checkbox>
                                        <Checkbox label="76.png" style="display:inline:block;margin-left:15px">
                                            <img id="76" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/76.png">
                                        </Checkbox>
                                        <Checkbox label="77.png" style="display:inline:block;margin-left:15px">
                                            <img id="77" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/77.png">
                                        </Checkbox>
                                        <Checkbox label="78.png" style="display:inline:block;margin-left:15px">
                                            <img id="78" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/78.png">
                                        </Checkbox>
                                        <Checkbox label="79.png" style="display:inline:block;margin-left:15px">
                                            <img id="79" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/79.png">
                                        </Checkbox>
                                        <Checkbox label="80.png" style="display:inline:block;margin-left:15px">
                                            <img id="80" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/80.png">
                                        </Checkbox>
                                        <Checkbox label="81.png" style="display:inline:block;margin-left:15px">
                                            <img id="81" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/81.png">
                                        </Checkbox>
                                        <Checkbox label="82.png" style="display:inline:block;margin-left:15px">
                                            <img id="82" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/82.png">
                                        </Checkbox>
                                        <Checkbox label="83.png" style="display:inline:block;margin-left:15px">
                                            <img id="83" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/83.png">
                                        </Checkbox>
                                        <Checkbox label="84.png" style="display:inline:block;margin-left:15px">
                                            <img id="84" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/84.png">
                                        </Checkbox>
                                        <Checkbox label="85.png" style="display:inline:block;margin-left:15px">
                                            <img id="85" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/85.png">
                                        </Checkbox>
                                        <Checkbox label="86.png" style="display:inline:block;margin-left:15px">
                                            <img id="86" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/86.png">
                                        </Checkbox>
                                        <Checkbox label="87.png" style="display:inline:block;margin-left:15px">
                                            <img id="87" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/87.png">
                                        </Checkbox>
                                        <Checkbox label="88.png" style="display:inline:block;margin-left:15px">
                                            <img id="88" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/88.png">
                                        </Checkbox>
                                        <Checkbox label="89.png" style="display:inline:block;margin-left:15px">
                                            <img id="89" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/89.png">
                                        </Checkbox>
                                        <Checkbox label="90.png" style="display:inline:block;margin-left:15px">
                                            <img id="90" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/90.png">
                                        </Checkbox>
                                        <Checkbox label="91.png" style="display:inline:block;margin-left:15px">
                                            <img id="91" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/91.png">
                                        </Checkbox>
                                        <Checkbox label="92.png" style="display:inline:block;margin-left:15px">
                                            <img id="92" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/92.png">
                                        </Checkbox>
                                        <Checkbox label="93.png" style="display:inline:block;margin-left:15px">
                                            <img id="93" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/93.png">
                                        </Checkbox>
                                        <Checkbox label="94.png" style="display:inline:block;margin-left:15px">
                                            <img id="94" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/94.png">
                                        </Checkbox>
                                        <Checkbox label="95.png" style="display:inline:block;margin-left:15px">
                                            <img id="95" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/95.png">
                                        </Checkbox>
                                        <Checkbox label="96.png" style="display:inline:block;margin-left:15px">
                                            <img id="96" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/96.png">
                                        </Checkbox>
                                        <Checkbox label="97.png" style="display:inline:block;margin-left:15px">
                                            <img id="97" style="width:32;height:32px;display:inline-block;margin-left:-35px" src="../assets/img/todolist-category/97.png">
                                        </Checkbox>
                                    </CheckboxGroup>
                                </div>
                            </div>
                            <Button v-on:click="addCategory" style="margin:35px 0 0 395px" type="success">确定</Button>
                        </div>
                        <div style="height:25px"></div>
                    </div>
                </Modal>
            </div>
        </TabPane>

        <!-- <TabPane name="name02" label="Windows" icon="social-windows">

        </TabPane>

        <TabPane name="name03" label="Linux" icon="social-tux">

        </TabPane> -->
    </Tabs>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Scrollbar from "smooth-scrollbar";
import index from "vue";

import * as todoListUtil from "@/utils/todolistUtil";

// let id = 1000;
export default {
    data() {
        return {
            value1: ""
        };
    },

    computed: {
        ...mapGetters(["todoList"])
    },

    components: {},

    created() {
        console.log("todolist created........................");
        this.queryCategoryOfSelect();
        this.queryTargets(1);
        this.queryCategoryOfLevel();
        this.queryCategoryOfSelectModal();
        this.$Message.config({ top: 400, duration: 3 });
        this.queryTodolistByDate();
    },

    mounted() {
        console.log("todolist mounted........................");
        Scrollbar.init(document.querySelector(".TodoList-Category-Modal"));
        Scrollbar.init(document.querySelector(".TodoList-Left-Content"));
        Scrollbar.init(document.querySelector("#TimeBook-Icon"));
    },
    methods: {
        todolistCategoryChange(value01, value02) {
            let categoryIds = value01.join(",");
            let todolistObj = todoListUtil.queryTodolistByCategoryIds(
                this.todoList,
                this,
                categoryIds
            );
            if (todolistObj.id != null && todolistObj.id != undefined) {
                this.todoList.leftCurTime = new Date(todolistObj.curDateTime);
                this.queryTodolist();
                setTimeout(() => {
                    for (
                        let index = 0;
                        index < this.todoList.todolists.length;
                        index++
                    ) {
                        let ele = this.todoList.todolists[index];
                        if (ele.todolist.id == todolistObj.id) {
                            this.setTodolistInfo(index);
                            break;
                        }
                    }
                }, 1000);
            }
        },
        targetSelectChange(target) {
            if (target == "" || target == undefined) {
                this.todoList.heart = 0;
                this.todoList.color = "#495060";
            } else {
                this.todoList.heart = 1;
                this.todoList.color = "orangeRed";
            }
        },
        queryTargets(status) {
            this.$store.dispatch({
                type: "queryTargets",
                thisObj: this,
                status: status
            });
        },
        jumpToTarget() {
            this.$store.state.home.home.activeName = "Target";
        },
        test() {},
        getIcons() {
            this.$store.dispatch({
                type: "getIcons",
                thisObj: this
            });
        },
        handleImgCheck() {
            this.$store.dispatch({
                type: "handleImgCheck",
                thisObj: this
            });
        },
        resetTodolist() {
            this.$store.dispatch({
                type: "resetTodolist"
            });
            this.reloadPage();
        },
        updateTodolist() {
            this.$store.dispatch({
                type: "updateTodolist",
                thisObj: this
            });
            this.reloadPage();
        },
        setTodolistInfo(index) {
            this.todoList.index = index;
            this.$nextTick(() => {
                this.$store.dispatch({
                    type: "setTodolistInfo",
                    index: index
                });
            });
            let style = this.todoList.style;
            let newStyle = this.todoList.newStyle;
            this.setTodolistInfoOfCategoryIds();
        },
        setTodolistInfoOfCategoryIds() {
            this.$store.dispatch({
                type: "setTodolistInfoOfCategoryIds"
            });
        },

        deleteTodolistById(todolistObj) {
            let id = todolistObj.id;
            let repeatType = todolistObj.repeatType;
            let curDateTime = this.todoList.leftCurTime.format("yyyy-MM-dd");
            let discardStatus = todolistObj.discardStatus;
            if (discardStatus == 1) {
                this.$confirm("是否恢复这个任务?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.addDiscardTask(id, curDateTime, discardStatus);
                    })
                    .catch(() => {});
            } else {
                this.$confirm("确定删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        if (
                            this.todoList.style == "primary" &&
                            repeatType != 0
                        ) {
                            this.addDiscardTask(id, curDateTime, discardStatus);
                        } else {
                            this.deleteTaskById(id);
                        }
                        this.reloadPage();
                    })
                    .catch(() => {});
            }
        },
        addDiscardTask(todolistId, todolistDate, discardStatus) {
            this.$store.dispatch({
                type: "addDiscardTask",
                thisObj: this,
                todolistId: todolistId,
                todolistDate: todolistDate,
                discardStatus: discardStatus
            });
        },
        queryTodolist() {
            if (this.todoList.newStyle == "primary") {
                this.queryNewTodolistByDate();
            } else {
                this.queryTodolistByDate();
            }
        },
        queryTodolistByDate() {
            this.$store.dispatch({
                type: "queryTodolistByDate",
                thisObj: this
            });
        },
        queryNewTodolistByDate() {
            this.$store.dispatch({
                type: "queryNewTodolistByDate",
                thisObj: this
            });
        },
        queryCategoryOfSelectModal() {
            this.$store.dispatch({
                type: "queryCategoryOfSelectModal"
            });
        },
        queryCategoryOfLevel() {
            this.$store.dispatch({
                type: "queryCategoryOfLevel",
                thisObj: this
            });
        },
        formatForecastTimeOfMin(val) {
            return val + "min";
        },
        formatForecastTimeOfHour(val) {
            return val + "hour";
        },
        deleteCategoryById(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            this.$store.dispatch({
                type: "deleteCategoryById",
                thisObj: this,
                category: data
            });
            this.reloadPage();
        },
        deleteTaskById(id) {
            this.$store.dispatch({
                type: "deleteTaskById",
                thisObj: this,
                id: id
            });
            this.reloadPage();
        },
        queryCategoryTask() {
            this.$store.dispatch("queryCategoryTask");
        },
        submitTodoList() {
            this.$store.dispatch({
                type: "submitTodoList",
                thisObj: this
            });
            this.reloadPage();
        },
        addHeart() {
            this.$store.dispatch({
                type: "addHeart",
                thisObj: this
            });
        },
        queryCategoryOfSelect() {
            this.$store.dispatch("queryCategoryOfSelect");
        },
        addCategory() {
            if (this.todoList.categoryName != "") {
                this.$store.dispatch({
                    type: "addCategory",
                    thisObj: this
                });
                this.reloadPage();
            }
        },
        reloadPage() {
            //let value = this.$store.state.home.home.isRouterAlive;
            this.$store.state.home.home.isRouterAlive = false;
            this.$nextTick(
                () => (this.$store.state.home.home.isRouterAlive = true)
            );
        }
    }
};
window.onload = function() {
    // Scrollbar.init(document.querySelector(".Todolist-Left-Collapse"));
    // Scrollbar.init(document.querySelector(".TodoList-Category-Modal"));
};
</script>
<style lang='less'>
@import "../style/todolist.less";
.el-input__inner {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
}
.el-input__icon {
    line-height: 32px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
#categoryModal .ivu-modal-footer {
    display: none;
}
</style>
<template>
  <div class="home">
    <Row class="header" type="flex" align="middle">
      <div class="logo">
        <img src="../assets/img/logo.png" height="30" alt="">
        <span>TimeBook</span>
        <Tag>beta</Tag>
      </div>
      <!-- <VmMsgPush style="margin-left:20px" :data="msgPushData"></VmMsgPush> -->
      <VmSearch></VmSearch>
      <Dropdown class="login-info" placement="bottom-end">
        <Button type="ghost">
          <img src="../assets/img/photo.jpg" height="30" alt=""> {{user.username}}
          <Icon style="margin-left:10px;margin-right:10px" type="arrow-down-b"></Icon>
        </Button>
        <Dropdown-menu slot="list">
          <Dropdown-item divided>
            <span v-on:click="logout">
              <Icon type="android-exit" style="font-size:18px"></Icon>Log out
            </span>
          </Dropdown-item>
          <!-- <Dropdown-item divided>
            <span v-on:click="setting">
              <Icon type="settings" style="font-size:18px"></Icon>Setting
            </span>
          </Dropdown-item> -->
        </Dropdown-menu>
      </Dropdown>
    </Row>
    <div class="sidebar" id="sider-scrollbar">
      <Menu theme="light" width="100%" class="menu" :active-name="home.activeName" @on-select="menuOnSelect($event)">
        <Menu-item name="Dashboard">
          <router-link to="/home/dashboard">
            <Icon type="stats-bars"></Icon>
            <span>一日详情</span>
          </router-link>
        </Menu-item>
        <Menu-item name="Target">
          <router-link to="/home/target">
            <Icon type="checkmark-circled"></Icon>
            目标清单
          </router-link>
        </Menu-item>
        <Menu-item name="TodoList">
          <router-link to="/home/todoList">
            <Icon type="ios-list-outline"></Icon>
            <span>待办清单</span>
          </router-link>
        </Menu-item>
        <Menu-item name="TimeMachine">
          <router-link to="/home/">
            <Icon type="ios-stopwatch"></Icon>
            时间清单
          </router-link>
        </Menu-item>

        <Menu-item name="Consume">
          <router-link to="/home/consume">
            <Icon type="ios-cart"></Icon>
            消费清单
          </router-link>
        </Menu-item>
        <Menu-item name="Emotion">
          <router-link to="/home/emotion">
            <Icon type="ios-pulse-strong"></Icon>
            心情清单
          </router-link>
        </Menu-item>
        <Menu-item name="Knowledge">
          <router-link to="/home/knowledge">
            <Icon type="ios-list"></Icon>
            知识清单
          </router-link>
        </Menu-item>
        <Menu-item name="Question">
          <router-link to="/home/Question">
            <Icon type="help-circled"></Icon>
            问题清单
          </router-link>
        </Menu-item>
        <Menu-item name="Work">
          <router-link to="/home/Work">
            <Icon type="edit"></Icon>
            工作清单
          </router-link>
        </Menu-item>
        <Menu-item name="Memory">
          <router-link to="/home/memory">
            <Icon type="wand"></Icon>
            影像清单
          </router-link>
        </Menu-item>
        <Menu-item name="Time">
          <router-link to="/home/time">
            <Icon type="android-send"></Icon>
            时光走廊
          </router-link>
        </Menu-item>
        <Menu-item name="Other">
          <router-link to="/home/other">
            <Icon type="grid"></Icon>
            Other
          </router-link>
        </Menu-item>
        <!-- <Submenu name="Timebooks">
          <template slot="title">
            <Icon type="ios-bookmarks"></Icon>
            TimeBook
          </template>
          <Menu-item name="Timebook">
            <router-link to="/home/timebook">
              <Icon type="ios-book"></Icon>
              Time Book
            </router-link>
          </Menu-item>
          <Menu-item name="WechatBook">
            <router-link to="/home/wechatBook">
              <Icon type="android-chat"></Icon>
              Wechat Book
            </router-link>
          </Menu-item>
          <Menu-item name="SinaBook">
            <router-link to="/home/sinaBook">
              <Icon type="at"></Icon>
              Sina Book
            </router-link>
          </Menu-item>
          <Menu-item name="QQBook">
            <router-link to="/home/qqBook">
              <Icon type="chatbubbles"></Icon>
              QQ Book
            </router-link>
          </Menu-item>
          <Menu-item name="OtherBook">
            <router-link to="/home/otherBook">
              <Icon type="ios-help-outline"></Icon>
              ...
            </router-link>
          </Menu-item>
          <div style="height:60px"></div>
        </Submenu> -->
      </Menu>
    </div>
    <div class="main-content">
      <Carousel :autoplay-speed=5000 autoplay :style="{margin:'16px 0px 16px 0px', background:'#506B9E', height: '200px'}" v-model="carouselValue" loop>
        <CarouselItem v-for="(item, index) in home.mottos" :key="index">
          <div class="carousel-item-text">
            {{item.mottoStr}}
            <p style="text-align:right;margin-right:20px;margin-top:20px">--- {{item.author}}</p>
          </div>
        </CarouselItem>
      </Carousel>
      <Content :style="{padding: '24px', margin:'0 0 -16px 0', height: '709px', background: '#fff'}">
        <router-view v-if="home.isRouterAlive"></router-view>
      </Content>
    </div>
  </div>
  </div>
</template>
<script>
import VmMsgPush from "@/components/Home/home-header-msg-push";
import VmSearch from "@/components/Home/home-header-search";
import Scrollbar from "smooth-scrollbar";
import { mapGetters, mapState } from "vuex";
import { initDBTables } from "@/utils/dbUtil";
import { initDirs } from "@/utils/util";

import WebStorageCache from "web-storage-cache";
// import { setInterval } from 'timers';
var wsCache = new WebStorageCache();

export default {
    name: "home",
    components: {
        VmMsgPush,
        VmSearch
    },
    computed: {
        ...mapGetters(["home", "user"])
    },

    created() {
        console.log("home created====================================");
        let user = wsCache.get("user");
        this.user.id = user.id;
        this.user.username = user.username;
        this.queryAllMottos();
        setInterval(() => {
            this.queryAllMottos();
        }, 60000);
    },

    methods: {
        updateUserLoginStatu() {
            let autoLogin = 0;
            let userObj = wsCache.get("user");
            this.$store.dispatch({
                type: "updateUserLoginStatu",
                thisObj: this,
                autoLogin: autoLogin,
                user: userObj
            });
        },
        logout() {
            // 设置自动登陆为false
            this.updateUserLoginStatu();
            setTimeout(() => {
                // this.$router.replace({ path: "/login" });
                wsCache.clear();
                this.$router.push("/");
            }, 100);
            var user = wsCache.get("user");
        },
        setting() {
            // console.log("setting");
        },
        queryAllMottos() {
            this.$store.dispatch({
                type: "queryAllMottos",
                thisObj: this
            });
        },
        menuOnSelect(menuName) {
            this.home.activeName = menuName;
        },
        isLogin() {
            this.$router.replace({ path: "/login" });
        }
    },
    mounted: function() {
        console.log("home mounted====================================");
        Scrollbar.init(document.querySelector("#sider-scrollbar"));
    },
    data() {
        return {
            //activeName: "TimeMachine",
            carouselValue: 1,
            msgPushData: [
                {
                    image: require("@/assets/img/photo.jpg"),
                    from: "JesseLuo",
                    time: "2017-1-8",
                    message: "I like your website very much!"
                }
            ]
        };
    }
};
window.onload = function() {};
</script>

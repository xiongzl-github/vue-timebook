import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";
import store from "./store";
// import db from "./datastore";
// import sql from "./database";
// import taffydb from './taffydbUtil'
import iView from "iview";
import "iview/dist/styles/iview.css";
import locale from "iview/dist/locale/zh-CN";
import "!style-loader!css-loader!less-loader!./theme/index.less";
import layer from "vue-layer";
import ElementUI from "element-ui";
import $ from "jquery";


if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(iView, { locale });


// Vue.prototype.$db = db;
Vue.prototype.$layer = layer(Vue);
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: "<App/>"
}).$mount("#app");


Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};

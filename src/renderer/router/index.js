import Vue from "vue";
import Router from "vue-router";
import Consume from "../pages/Consume";
import Target from "../pages/Target";
import Dashboard from "../pages/Dashboard";
import TodoList from "../pages/todoList";
import Emotion from "../pages/Emotion";
import Home from "../pages/Home";
import Knowledge from "../pages/Knowledge";
import Question from "../pages/Question";
import Work from "../pages/Work";
import OtherBook from "../pages/OtherBook";
import QQBook from "../pages/QQBook";
import SinaBook from "../pages/SinaBook";
import Time from "../pages/Time";
import TimeBook from "../pages/TimeBook";
import TimeMachine from "../pages/TimeMachine";
import WechatBook from "../pages/WechatBook";
import Memory from "../pages/Memory";
import Login from "../pages/Login";
import Other from "../pages/Other";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "Login",
            component: Login
        },
        {
            path: "/home",
            component: Home,
            children: [
                {
                    path: "/",
                    name: "TimeMachine",
                    component: TimeMachine
                },
                {
                    path: "target",
                    name: "Target",
                    component: Target
                },
                {
                    path: "todoList",
                    name: "TodoList",
                    component: TodoList
                },
                {
                    path: "dashboard",
                    name: "Dashboard",
                    component: Dashboard
                },
                {
                    path: "consume",
                    name: "Consume",
                    component: Consume
                },
                {
                    path: "emotion",
                    name: "Emotion",
                    component: Emotion
                },
                {
                    path: "memory",
                    name: "Memory",
                    component: Memory
                },
                {
                    path: "other",
                    name: "Other",
                    component: Other
                },
                {
                    path: "knowledge",
                    name: "Knowledge",
                    component: Knowledge
                },
                {
                    path: "question",
                    name: "Question",
                    component: Question
                },
                {
                    path: "work",
                    name: "Work",
                    component: Work
                },
                {
                    path: "otherBook",
                    name: "OtherBook",
                    component: OtherBook
                },
                {
                    path: "qqBook",
                    name: "QQBook",
                    component: QQBook
                },
                {
                    path: "sinaBook",
                    name: "SinaBook",
                    component: SinaBook
                },
                {
                    path: "time",
                    name: "Time",
                    component: Time
                },
                {
                    path: "timeBook",
                    name: "TimeBook",
                    component: TimeBook
                },
                {
                    path: "wechatBook",
                    name: "WechatBook",
                    component: WechatBook
                }
            ]
        },

        {
            path: "*",
            redirect: "/"
        }
    ]
});

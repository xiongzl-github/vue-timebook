<template>
    <Row class="vm-login vm-panel">
        <Col span="10" class="login-form">
        <div class="login-header">
            <img src="../assets/img/logo.png" height="80" alt="">
            <p>
                <span>TIME</span>BOOK</p>
        </div>
        <div class="login-form">
            <Input :maxlength="12" :autofocus="true" :clearable="true" v-model="user.username" placeholder="please enter username"></Input>
            <Input :maxlength="12" :clearable="true" v-model="user.password" type="password" placeholder="Please enter password"></Input>
            <ButtonGroup>
                <Button style="width:157px;" v-on:click="login" type="primary">Login</Button>
                <Button style="width:157px;" v-on:click="register" type="primary">Register</Button>
            </ButtonGroup>
        </div>
        <div class="login-footer">
            <Checkbox v-model="user.remenber">Remenber</Checkbox>
            <span class="forget">
                <a href="#">Forget Password</a>
            </span>
        </div>
        </Col>
        <Col span="14" class="login-ad">
        <span class="photo-author">Photo: qiberlin</span>
        </Col>
    </Row>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import * as userUtil from "@/utils/userUtil";
// import * as userUtil from "@/utils/userUtil";

export default {
    name: "home",
    components: {},
    computed: {
        ...mapGetters(["user"])
    },

    created() {
        console.log("login created====================================");
    },

    methods: {
        login() {
            this.$store.dispatch({
                type: "login",
                thisObj: this
            });
        },
        register() {
            this.$store.dispatch({
                type: "register",
                thisObj: this
            });
        },
        isRemenber() {
            setTimeout(() => {
                if (userUtil.isRemenber()) {
                    this.$router.push("/home");
                    this.$store.state.home.home.activeName = "TimeMachine";
                }
            }, 2000);
        }
    },
    mounted: function() {
        console.log("login mounted====================================");
        this.$Message.config({ top: 400, duration: 3 });
        this.isRemenber();
    },
    data() {
        return {};
    }
};
</script>

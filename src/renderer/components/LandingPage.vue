<template>

  <div id="wrapper">
    <Button type="dashed" v-on:click="getDBInfo">获取数据库信息</Button><br>
    <Button type="error" v-on:click="alertInfo">定时弹框</Button><br>
    <Button type="primary" v-on:click="insertData">添加数据</Button><br>
    <Button type="info" v-on:click="testTaffyDB">TaffyDB</Button><br>
    <Button type="info" v-on:click="writeFile">写文件</Button><br>

  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
import fs from "fs";
import Vue from "vue";
import { ipcRenderer } from "electron";
import { getMsg } from "../utils/encrypt";
import TAFFY from "taffy";
var path = require("path");
var _path = "./abc.txt";

//Vue.use(TAFFY);

//在渲染器进程 (网页) 中。
// const {ipcRenderer} = require('electron')
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
// ipcRenderer.send('asynchronous-message', 'ping')

var doc = {
  hello: "world",
  n: 5,
  today: new Date(),
  nedbIsAwesome: true,
  notthere: null,
  notToBeSaved: undefined, // Will not be saved
  fruits: ["apple", "orange", "pear"],
  infos: { name: "nedb" }
};
export default {
  name: "landing-page",
  components: { SystemInformation },
  methods: {
    // open(link) {
    //   this.$electron.shell.openExternal(link);
    // },
    insertData() {
      console.log(this.$db.filename);
      this.$db.insert(doc, function(err, newDoc) {
        console.log(newDoc);
      });
    },
    getDBInfo() {
      let fileContents = fs.readFileSync(this.$db.filename, "utf8");
      console.log(fileContents);
    },
    alertInfo() {
      getMsg();
      //ipcRenderer.sendSync('synchronous-message', 'create_window')
    },
    writeFile() {
      var msg = "sldfjlsdfjlsdjflskdjflskdfjlksdjflsdjfskdlfjlsdkjfldksfjhlksdjfaljdflsdkfjskdljflksadjf"
      fs.writeFileSync("abc.txt", msg,'utf8');
      console.log("file write success!");
    },
    testTaffyDB() {
      let db = TAFFY([
        {
          item: 1,
          name: "Blue Ray Player",
          price: 99.99
        },
        {
          item: 2,
          name: "3D TV",
          price: 1799.99
        }
      ]);
      // 查询第一个元素
      //console.log(db().first());
      // 添加一个元素
      db.insert({
        item: 3,
        name: "DVD",
        price: 88.88
      });
      //db.sort("price desc").first();
      // 遍历所有元素
      // console.log(db().each(function(res){
      //   console.log(res);
      // }));
      //console.log("=======================================");
      // 删除一个元素
      db({ item: 3 }).remove();
      // console.log(db().each(function(res){
      //   console.log(res);
      // }));
      //console.log("=======================================");
      // 更新一个元素
      db({ item: 1 }).update({ price: 88 });
      //console.log(db().first());

      console.log("=======================================");
      db.store("/user.db");
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
  /* flex-direction: columns; */
}
</style>

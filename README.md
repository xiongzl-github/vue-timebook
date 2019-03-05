# timebook

> An electron-vue project

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[7c4e3e9](https://github.com/SimulatedGREG/electron-vue/tree/7c4e3e90a772bd4c27d2dd4790f61f09bae0fcef) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

#### 环境搭建
``` 
  # 安装vue-cli以及脚手架样本代码  
  npm install -g vue-cli  
  vue init simulatedgreg/electron-vue my-project
```
---
#### 集成插件
1. 集成iview  
`npm install iview --save`
`npm install -g @vue/cli`
2. 安装iview-loader
`npm install iview-loader --save--dev`   
  <pre>
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            
                        }
                    },
                    {
                        loader: 'iview-loader',
                        options: {
                            prefix: false
                        }
                    }
                ]
            }
        ]
    }
  </pre>
- 参数 **prefix** 设置为 **true** 后，所有 iView 组件标签名都可以使用前缀 i-，例如 \<i-row>、\<i-select>
3. 配置数据库(NeDb)  
`npm install nedb --save`
4. 创建数据库  
**datastore.js**   
<pre>
export default new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath("userData"), "/data.db")
});
</pre>
**main.js**
<pre>
Vue.prototype.$db = db;
</pre>
插入数据
<pre>
var doc = { hello: 'world'
               , n: 5
               , today: new Date()
               , nedbIsAwesome: true
               , notthere: null
               , notToBeSaved: undefined  // Will not be saved
               , fruits: [ 'apple', 'orange', 'pear' ]
               , infos: { name: 'nedb' }
               };

this.$db.insert(doc, function(err, newDoc){
        console.log(newDoc);
      });
</pre>















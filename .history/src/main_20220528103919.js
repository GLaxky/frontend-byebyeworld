import { createApp } from 'vue'
import App from './App.vue'

// 导入element-plus组件，以及图标
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcons from '@element-plus/icons-vue'

import VueRouter from "./router"
import {getToken, setToken} from "./utils/loginCookieServices";
// 导入全局数据库，来增加全局变量
// import { setGlobalData} from './global/globalData'

const app=createApp(App)

// 逐个导入element-plus库的图标元素
Object.keys(ElIcons).some(item => {
    app.component(item, ElIcons[item])
})

app.use(VueRouter)
app.use(ElementPlus)
app.mount('#app')
window.router=VueRouter
// console.log(getToken())



// 众包工人和众测发布者的UI有所不同，这里用作测试
// setGlobalData('isLogin', localStorage.getItem('isLogin'))
// setGlobalData('isAWorker', localStorage.getItem('isAWorker'))
// console.log( localStorage.getItem('isLogin'))

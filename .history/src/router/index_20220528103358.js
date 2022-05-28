import { createRouter , createWebHashHistory} from 'vue-router'

import Home from '../pages/Home/MyHome.vue'
import Login from '../pages/LoginPage.vue'
import Register from '../pages/RegisterPage.vue'
import page404 from '../pages/404.vue'
import { getGlobalData} from '../global/globalData'
import {getToken} from "../utils/loginCookieServices";
import { ElMessage } from 'element-plus'

const routes=[
    {
        path: '/',
        redirect: '/playground',
        meta: {
            title: 'playground'
        }
    },
    {
        path: "/",
        name: "Home",
        meta: {
            title: 'home'
        },
        component: Home,
        children:[
            {
                path: "playground",
                name: "playground",
                meta: {
                    title: '众测广场'
                },
                component: () => import ( "../pages/Home/subpages/PlayGround.vue")
            },
            {
                path: "taskRecommandation",
                name: "taskRecommandation",
                meta: {
                    title: '任务推荐'
                },
                component: () => import ( "../pages/Home/subpages/TaskRecommandation.vue")
            },

            {
                path: "submitReport/:taskId",
                name: "submitReport",
                meta: {
                    title: '提交测试报告'
                },
                component: () => import ( "../pages/Home/subpages/SubmitReport.vue")
            },
            {
                path: "notices",
                name: "notices",
                meta: {
                    title: '通知'
                },
                component: () => import ( "../pages/Home/subpages/Notices.vue")
            },
            {
                path: "personalInfo",
                name: "personalInfo",
                meta: {
                    title: '个人空间'
                },
                component: () => import ( "../pages/Home/subpages/PersonalInfo.vue")
            },

            {
                path: "createNewTask",
                name: "createNewTask",
                meta: {
                    title: '发布新的众测'
                },
                component: () => import ( "../pages/Home/subpages/CreateNewTask.vue")
            },

            {
                path: "releasedTaskList",
                name: "releasedTaskList",
                meta: {
                    title: '我发布的任务'
                },
                component: () => import ( "../pages/Home/subpages/MyReleasedTaskList.vue")
            },
            {
                path: "finalReport",
                name: "finalReport",
                meta: {
                    title: '我发布的任务'
                },
                component: () => import ( "../pages/Home/subpages/FinalReport.vue")
            },
            {
                path: "config",
                name: "config",
                meta: {
                    title: '修改平台参数'
                },
                component: () => import ( "../pages/Home/subpages/ConfigParams.vue")
            },
            {
                path: "myTaskList",
                name: "myTaskList",
                meta: {
                    title: '任务列表'
                },
                component: () => import ( "../pages/Home/subpages/MyTaskList.vue"),
                // children:[
                //     {
                //         path: "submitReport",
                //         name: "submitReport",
                //         meta: {
                //             title: '提交测试报告'
                //         },
                //         component: () => import ( "../pages/Home/subpages/SubmitReport.vue")
                //     }
                // ]
            },
            {
                path: "reportList/:taskId",
                name: "reportList",
                meta: {
                    title: '报告列表'
                },
                component: () => import ( "../pages/Home/subpages/ReportList.vue")
            },
            {
                path: "settleTask/:taskId",
                name: "settleTask",
                meta: {
                    title: '结算任务'
                },
                component: () => import ( "../pages/Home/subpages/SettleTask.vue")
            },
            {
                path: "discuss/:taskId",
                name: "discussOfReport",
                meta: {
                    title: '讨论区'
                },
                component: () => import ( "../pages/Home/subpages/DiscussOfReport.vue")
            },

            {
                path: "redoSubmit/:reportId",
                name: "redoSubmit",
                meta: {
                    title: '修改报告'
                },
                component: () => import ( "../pages/Home/subpages/RedoSubmit.vue")
            },
            {
                path: "reportSort",
                name: "reportSort",
                meta: {
                    title: '报告排名'
                },
                component: () => import ( "../pages/Home/subpages/ReportSort.vue")
            },
            {
                path: '/:catchAll(.*)', // 页面不存在的情况下会跳到404页面
                redirect: "/404",
                meta: {
                    title: '找不到页面'
                },
                name: "notfound",
                hidden: true
            }
        ]
    },
    {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: Login
    },
    {
        path: "/register",
        name: "Register",
        meta: {
            title: '注册'
        },
        component: Register
    },

    { path: "/404",
        name: "404",
        meta: {
            title: '找不到页面'
        },
        component: () => import (/* webpackChunkName: "404" */ '../pages/404.vue')
    },


]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});

router.beforeEach((to, from, next) => {

    if (to.name !== "Login"&&to.name!=="Register") {
      // 非 login 页面，检查是否登录
      if (getToken()) {
        // 已登录，可以去想去的页面
      }
      else {
          // 未登录则需要跳转到登录页面
          localStorage.clear()
          next({ name: "Login" })
          return
      }
    }

    if(getToken()){
        let hasPreferences=JSON.parse(localStorage.getItem("hasPreferences"))
        let identity=JSON.parse(localStorage.getItem("identity"))
        if(to.name === "Login"||to.name==="Register"){
            // 已经登录过了，如果想去的页面还是登录注册页面，这样强制转移去首页
            next({name:"playground"})
            return
        }
        // console.log(!JSON.parse(hasPreferences))
        // console.log(hasPreferences.toString()==='false')
        // console.log(to.name!=='personalInfo')
        if(identity==2&&!hasPreferences&&to.name!=='personalInfo'){
            ElMessage.info("请先设置你的测试偏好噢")
            next({name: 'personalInfo'})
            return
        }
    }else {
        localStorage.clear()
    }
    next()
  });


export default router;

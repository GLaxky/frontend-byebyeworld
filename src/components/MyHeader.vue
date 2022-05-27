<template>
    <div class="header">
        <div class="collapse-btn">
            <img class="web-logo" src="../img/图标.png" />
            <div class="logo">CROWDS TEST-众包测试系统</div>
        </div>
        <!-- <div class="logo">众包测试系统</div> -->


        <div class="header-right">
          <div class="header-user-con">


          <!-- 消息中心 -->
            <el-badge :value="message" class="item" :hidden="message==0">
              <div class="btn-bell">
                <el-tooltip effect="dark" :content="message?`有${message}条消息`:`消息中心`" placement="bottom">
                  <router-link to="/notices">
                    <i class="el-icon-bell"><el-icon><Bell /></el-icon></i>
                  </router-link>
                </el-tooltip>
<!--                <span class="btn-bell-badge" v-if="message"></span>-->
              </div>
            </el-badge>


            <div class="user-avator-container">
            <!-- 用户头像 -->
            <div class="user-avator">
                <!-- <img src="../assets/logo.png" /> -->
                <!-- <el-avatar :icon="UserFilled"></el-avatar> -->
              <el-avatar  class="bbbb" > {{ username }} </el-avatar>
            </div>
            <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    {{username}}
                    <el-icon><arrow-down-bold /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="user">个人中心</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
          </div>

        </div>
    </div>
</template>

<script>
import { useRouter } from "vue-router";
import {removeToken} from "../utils/loginCookieServices";
import {getNotices} from "../api/subpages/GetNotice";
import { ref,onMounted} from 'vue'
import { h } from 'vue'
import { ElNotification } from 'element-plus'
import {reactive} from "vue";
// import { UserFilled } from '@element-plus/icons-vue'
export default {
  data(){
    return{
      username:localStorage.getItem('username')
    }
  },
    setup() {



        const message =ref(0);
      getNotices().then((res)=>{

        let  len=res.length;
        let count=0;
        for (let i=0;i<len;i++){
          let mesItem=res[i];

          if (mesItem.state==0){
            count++;
          }
        }

        message.value=count;
      })
      let timer;

      onMounted(()=>{

        timer = window.setInterval(() => {
          setTimeout(function () {
            //  自己封装的axios请求
            getNotices().then((res)=> {



              let mesList=[];
              let len = res.length;
              let count = 0;
              for (let i = 0; i < len; i++) {
                let mesItem = res[i];


                let mes=null;
                if(mesItem.type===1||mesItem.type===3||mesItem.type===5||mesItem.type===6){
                  mes= {
                    type:mesItem.type,
                    mes1:{
                      flag:true,
                      subMes1: ( (mesItem.detail.split('+')[0]).split('#')[0]).split("<p>")[0],
                      subMes2:"\""+ ( (mesItem.detail.split('+')[0]).split('#')[0]).split("<p>")[1]+"\"",
                      subMes3: ( (mesItem.detail.split('+')[0]).split('#')[0]).split("<p>")[2],
                    },
                    mes2: "\""+ ( mesItem.detail.split('+')[0]).split('#')[1]+"\"",
                    mes3: ( mesItem.detail.split('+')[0]).split('#')[2],
                    taskId: mesItem.taskId,
                    taskInfo:{
                      taskId: mesItem.taskId,
                      taskName:mesItem.detail.split('+')[1]
                    }
                  }

                }else {
                  mes= {
                    type:mesItem.type,
                    mes1:{
                      flag:false,
                      subMes1: ( (mesItem.detail.split('+')[0]).split('#')[0]),
                    },
                    mes2: "\""+ ( mesItem.detail.split('+')[0]).split('#')[1]+"\"",
                    mes3: ( mesItem.detail.split('+')[0]).split('#')[2],
                    taskId: mesItem.taskId,
                    taskInfo:{
                      taskId: mesItem.taskId,
                      taskName:mesItem.detail.split('+')[1]
                    }
                  }
                }




                if (mesItem.state === 0) {
                  mesList.push(mes)
                  count++;
                }

                mesList.reverse();
              }
              // console.log(count)
              //多了消息进行弹窗
              if (message.value<count){
                for (let k=0;k<count-message.value;k++){

                  let message= mesList[k].mes1.subMes1;
                  if (mesList[k].mes1.flag){
                    message=message+mesList[k].mes1.subMes2+mesList[k].mes1.subMes3
                  }
                  message=message+mesList[k].mes2+mesList[k].mes3

                  ElNotification({
                    title: '你有一个新的通知请即时查看',
                    // message: h('i', { style: 'color: teal' }, message),
                    message: h(
                        "p",
                        {
                          style:"width: 250px;display: flex;justify-content: space-between;",
                        },
                        [
                          h("span", { style: 'color: teal' }, message),
                          h(
                              "a",
                              {
                                style: "color: #409EFF;cursor: pointer;margin-left:12px",
                                on: {
                                  click: gotoNotice,
                                },
                              },
                              "点击去看看"
                          ),
                        ]
                    ),
                    type: "info",
                    onClick: gotoNotice,
                    customClass: "custom-class",
                    duration:3200,

                  })

                }


              }

              message.value=count;
            })
          }, 0)
        }, 5000)

      })


        // 用户名下拉菜单选择事件
        const router = useRouter();
        const handleCommand = (command) => {
            if (command === "loginout") {
              localStorage.clear();
              removeToken()
                router.push("/login");
            } else if (command === "user") {
                router.push("/personalInfo");
            }
        };
        const gotoNotice=()=>{
          router.push("/notices");

        }

        return {
            handleCommand,
            message,
            timer,
          gotoNotice
        };
    },

 beforeUnmount() {
     clearInterval(this.timer)
     this.timer = null;

 }

};
</script>


<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 75px;
    font-size: 22px;
    font-weight: 800;
    color: #da953b;
    /* background-color: #242f42; */
    background-color: rgb(255, 248, 235);
    /* border-style: double; */
    border-bottom: dotted;
    border-color: #e49631;
}
.web-logo{
    /* display: inline-block; */
    float: left;
    margin: 5px 15px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 400px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.user-name {
    margin-left: 10px;
    font-weight: 400;
}
.user-avator-container{
  margin-left: 10px;
}

.user-avator {
    margin-left: 20px;
    margin-top: 5px;

}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;

    border-radius: 50%;
}
.el-dropdown-link {
    color: #F2AF58;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.bbbb{
  color: gray;
  background: blanchedalmond;
  /*color:#e49631 ;*/
  /*background: lightgray;*/
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
/*.btn-bell-badge {*/
/*  position: absolute;*/
/*  right: 0;*/
/*  top: -2px;*/
/*  width: 8px;*/
/*  height: 8px;*/
/*  border-radius: 4px;*/
/*  background: #f56c6c;*/
/*  color: #fff;*/
/*}*/
.btn-bell .el-icon-bell {
  color: darkorange;
}
</style>

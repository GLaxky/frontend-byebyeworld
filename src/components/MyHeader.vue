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

              let len = res.length;
              let count = 0;
              for (let i = 0; i < len; i++) {
                let mesItem = res[i];

                if (mesItem.state === 0) {
                  count++;
                }
              }
              // console.log(count)
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

        return {
            handleCommand,
            message,
            timer
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

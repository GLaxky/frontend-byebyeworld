<template>

  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">众包测试系统</div>
      <el-form :model="param" :rules="rules" ref="login" status-icon label-position="top" label-width="0px" class="ms-content">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
            <el-icon><user/></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password"  label="密码">
          <el-input type="password" placeholder="password" v-model="param.password"
                    @keyup.enter="submitForm()">
            <template #prepend>
              <el-icon><lock/></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="warning" @click="submitForm()">登录</el-button>
        </div>
        <div class="goto-register">还未注册？ 点击进行
          <el-button type="text" id="reg-button"  @click="gotoRegister()">注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {setToken,getToken,removeToken} from "../utils/loginCookieServices"
import service from "../utils/request";
import {setGlobalData} from "../global/globalData";
export default {
  setup() {
    const router = useRouter();
    //已登录则跳转至首页
    // if(JSON.parse( localStorage.getItem('isLogin'))){
    //   router.push('/')
    // }
    const param = reactive({
      username: "",
      password: "",
    });

    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
      ],
    };
    const login = ref(null);
    const submitForm = () => {
      login.value.validate((valid) => {
        if (valid) {
          let formdata = new FormData()
          formdata.append('username', param.username)
          formdata.append('password', param.password)
          formdata.append('keepalive', true)


          service.request({
            method:"post",
            url:"login",
            data:formdata


          }).then(function (response) {
            console.log(response.data);
             if (response.data.code===1){
                ElMessage.success("登录成功");
                if(response.data.data.preference===null)
                  localStorage.setItem('hasPreferences', JSON.stringify(false))
                else 
                  localStorage.setItem('hasPreferences', JSON.stringify(true))
                console.log(localStorage.getItem('hasPreferences'))
                localStorage.setItem('isLogin',JSON.stringify(true))
                localStorage.setItem('username', param.username)
                localStorage.setItem('email', response.data.data.user.email)
                localStorage.setItem('identity', JSON.stringify(response.data.data.user.type))
                localStorage.setItem('userId', JSON.stringify(response.data.data.user.id))
                localStorage.setItem('balance', JSON.stringify(response.data.data.user.money))
                const data = response.data
                const tokenStr = data.tokenHead+data.token
                setToken(tokenStr)

                router.push("/");
             }else {
               ElMessage.error(response.data.message);
             }

          })
              .catch(function (error) { // 请求失败处理
                console.log(error);
                ElMessage.error("服务器错误，请求处理失败，请稍后重试");
              })

        } else {
          ElMessage.error("请填写用户名和密码");
          return false;
        }
      });
    };
    const gotoRegister =() => {
      router.push("/register");

    };

    return {
      param,
      rules,
      login,
      submitForm,
      gotoRegister,
    };


  },
};
</script>

<style scoped>
.login-wrap {
  width: 100%;
  height: 100%;
  background: linear-gradient( rgb(255, 207, 124,0.8), rgb(240, 222, 190, 0.8) ), url('../img/图标.png') repeat ;
  background-size: 15%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  text-shadow: #bb833a;
  font-size: 25px;
  font-weight: bolder;
  color: #e49631;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  border-style: dotted;
  border-color: #ff8a04e8;
  border-radius: 50px;
  box-shadow:5px 5px 10px 5px #ccc ;

}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.goto-register {
  font-size: 16px;
  line-height: 30px;
  color: gray;
}
.goto-register #reg-button{
  font-size: 16px;
  line-height: 30px;

}
.el-button--myStyle{background-image: linear-gradient(to right , #fdbf78, blanchedalmond)}
</style>

<template>
    <div class="register">
      <div class="ms-register">
        <div class="ms-title">注册</div>
        <el-form :model="form" :rules="rules" status-icon ref="register" label-suffix=":" label-width="82px" class="ms-content"   label-position="left">

          <el-form-item label="用户类型" prop="usertype">
            <el-select v-model="form.usertype"  placeholder="usertype"  class="">
              <el-option label="发包方" value="1"></el-option>
              <el-option label="众测工人" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="form.email" placeholder="email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password" placeholder="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="comfirm_password">
            <el-input type="password" v-model="form.comfirm_password" placeholder="comfirm your password"></el-input>
          </el-form-item>
          <div class="register-btn">
            <el-button type="warning" @click="submitForm()">注册</el-button>
          </div>
          <div class="goto-login">已注册？ 点击进行
            <el-button type="text" id="log-button"  @click="gotoLogin()">登录</el-button>
          </div>
        </el-form>

      </div>

    </div>
</template>
<script lang="ts" setup>
import { reactive, } from 'vue'
import { useRouter } from "vue-router"
import { ref } from 'vue'
import {ElMessage} from "element-plus";
import service from "../utils/request";
const router = useRouter();
// do not use same name with ref
const register = ref(null);
const form = reactive({
  username: '',
  email:'',
  password:'',
  usertype:'',
  comfirm_password:''

})
const comfirmPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error("密码不一致"))
  } else {
    callback()
  }
}
const password_condition=(rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else
  {
    if (form.comfirm_password !== '') {
      if (!register.value) {return}

      register.value.validateField('comfirm_password', () => null)
    }


    if  ((value.length<5)) {
    callback(new Error("长度需大于等于5"))
  }
    else if
    (!(/[A-Z]+/.test(value))) {
    callback(new Error("密码未包含大写字母"))
  }else if (!(/[0-9]+/.test(value))) {
    callback(new Error("密码未包含数字"))
  }
  else if (!(/[a-z]+/.test(value))) {
    callback(new Error("密码未包含小写字母"))
  }

  else {
    callback()
  }
  }
}
const rules=reactive({
    username:[
      {required:true,
        message: "请输入用户名",
        trigger: "blur",
      },
      {
        min:5,
        message: "长度需大于等于5",
        trigger: ['change','blur']
      }
    ],  email:[
    {required:true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      type: 'email',
      message: '请输入格式如xx@xx.xx的正确邮箱',
      trigger: ['change','blur']
    },
  ],
  comfirm_password:[
    {required:true,
      message: "请再次输入密码",
      trigger: "blur",
    },{
      validator:comfirmPass,
      trigger: ['change','blur']
    }
  ],
  password:[
    {required:true,
      message: "请输入密码",
      trigger: "blur",
    },

    {
      validator:password_condition,
      trigger: ['change','blur']
    }
  ],
  usertype:[
    {
      required: true,
      message: '请选择用户类别',
      trigger: ['change','blur']
    },
  ]

})

const gotoLogin =() => {
  router.push("/login");

}
const submitForm=()=>{
  register.value.validate((valid) => {
    if (valid) {
      let formdata = new FormData()
      formdata.append('username',form.username)
      formdata.append('password', form.password)
      formdata.append('email',form.email)
      formdata.append('type', form.usertype)

      service.request({
        method:"post",
        url:"register",
        data:formdata


      }).then(function (response) {
        console.log(response);
        if (response.data.code===1){
          ElMessage.success("注册成功");

           router.push("/login");
        }else {
          ElMessage.error(response.data.message);
        }

      })
      .catch(function (error) { // 请求失败处理
        console.log(error);
        ElMessage.error("请求处理失败");
      })

    } else {
      ElMessage.error("请检查红色地方，完整填写信息");
      return false;
    }
  });



}
</script>
<style scoped>
.register{
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url(../assets/img/login_bg_cro.jpeg); */
  /* background-image: linear-gradient(to right , rgb(240, 222, 190), blanchedalmond);
  background-size: 100%; */
  background: linear-gradient( rgba(255, 207, 124, 0.8), rgb(240, 222, 190, 0.8) ), url('../img/图标.png') repeat ;
  background-size: 15%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 30px;
  font-weight: bolder;
  color: #e49631;
  border-bottom: 1px solid #ddd;
}
.ms-register {
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
.register-btn {
  text-align: center;
}
.register-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.goto-login {
  font-size: 16px;
  line-height: 30px;
  color: gray;
}
.goto-login #log-button{
  font-size: 16px;
  line-height: 30px;

}
</style>

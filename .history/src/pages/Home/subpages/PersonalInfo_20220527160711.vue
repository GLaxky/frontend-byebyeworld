<template>
  <div>
      <el-container >
        <el-header height="120px" >
          <div class="header" >
          <el-avatar :size="100" class="classs" > {{ username }} </el-avatar>
          </div>
        </el-header>

        <el-main>
          <el-scrollbar>
          <el-descriptions
              border
              :column="3"
              direction="vertical"
              v-loading="loading"
          >
            <!-- <template #title class="title"> 个人信息</template> -->
            <el-descriptions-item label="用户名:">{{ username }}</el-descriptions-item>
            <el-descriptions-item label="邮箱:">{{ email }}</el-descriptions-item>
            <el-descriptions-item label="用户身份:">
              <el-tag size="large">{{ UserTypeName }}</el-tag>
            </el-descriptions-item>
            <div v-if="userIsWorker==2">
              <el-descriptions-item label="测试能力评级:" min-width="200px">
                {{Infos.level}}
              </el-descriptions-item>
              <el-descriptions-item label="平台活跃度:" min-width="200px">
                {{Infos.activity}}
              </el-descriptions-item>
              <el-descriptions-item label="常用测试设备:" min-width="200px">
                <template v-for="item in Infos.device" :key="item.index">
                  <el-tag class="ml-2" type="warning" style="margin: 1px;">{{item}}</el-tag>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="常用测试环境:" min-width="200px">
                <template v-for="item in Infos.environment" :key="item.index">
                  <el-tag class="ml-2" type="warning" style="margin: 1px;">{{item}}</el-tag>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="测试语言偏好:" min-width="200px">
                <template v-for="item in Infos.language" :key="item.index">
                  <el-tag class="ml-2" type="warning" style="margin: 1px;">{{item}}</el-tag>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="测试领域偏好:" min-width="200px">
                <template v-for="item in Infos.area" :key="item.index">
                  <el-tag class="ml-2" type="warning" style="margin: 1px;">{{item}}</el-tag>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="测试类型偏好:" min-width="200px">
                <template v-for="item in Infos.type" :key="item.index">
                  <el-tag class="ml-2" type="warning" style="margin: 1px;">{{item}}</el-tag>
                </template>
                
              </el-descriptions-item>
              <el-descriptions-item label="测试方式偏好:" min-width="200px">
                <template v-for="item in Infos.method" :key="item.index">
                  <el-tag class="ml-2" type="warning" style="margin: 1px;">{{item}}</el-tag>
                </template>
              </el-descriptions-item>
              
            </div>
              <el-descriptions-item>
                <div v-if="userIsWorker==2">
                  <el-button type="warning" round @click="dialogForWithdraw=true">账户提现</el-button>
                  <!-- <el-link type="success" href="#/myTaskList">点击查看"我参加的任务"</el-link> -->
                  <br>
                  <el-button type="warning" round @click="openEditDialog">修改个人测试偏好</el-button>
                </div>
                <div v-else>
                  <el-button type="warning" round @click="dialogForCharge=true">账户充值</el-button>
                  
                  <!-- <el-link type="success" href="#/releasedTaskList" >点击查看"我发布的任务"</el-link> -->
                </div>
                <!-- <div v-if="userIsWorker===2">
                  
                </div> -->
              </el-descriptions-item>
          </el-descriptions>
          </el-scrollbar>
        </el-main>
      </el-container>

      <el-dialog v-model="dialogForEditInfo" :close-on-click-modal="false" 
        :close-on-press-escape="false"
        :show-close='false'>
        <template #title>修改个人测试偏好</template>
        <el-card>
          <el-form
            ref="formRef"
            :model="Infos"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="常用测试设备:" prop="device" required>
              <el-checkbox-group v-model="Infos.device">
                <el-checkbox label="PC端" name="device" />
                <el-checkbox label="移动端" name="device" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="常用测试环境:" prop="environment" required>
              <el-checkbox-group v-model="Infos.environment">
                <el-checkbox label="Windows" name="environment" />
                <el-checkbox label="Linux" name="environment" />
                <el-checkbox label="MacOS" name="environment" />
                <el-checkbox label="Android" name="environment" />
                <el-checkbox label="IOS" name="environment" />
                <el-checkbox label="HormonesOS" name="environment" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="测试语言偏好:" required prop="language">
              <el-checkbox-group v-model="Infos.language">
                <el-checkbox label="Java" name="language" />
                <el-checkbox label="Python" name="language" />
                <el-checkbox label="C" name="language" />
                <el-checkbox label="C++" name="language" />
                <el-checkbox label="C#" name="language" />
                <el-checkbox label="HTML" name="language" />
                <el-checkbox label="JS" name="language" />
                <el-checkbox label="Scala" name="language" />
                <el-checkbox label="Go" name="language" />
                <el-checkbox label="Ruby" name="language" />
                <el-checkbox label="PHP" name="language" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="测试领域偏好:" prop="area" required>
              <el-checkbox-group v-model="Infos.area">
                <el-checkbox label="前端" name="area" />
                <el-checkbox label="后端" name="area" />
                <el-checkbox label="操作系统" name="area" />
                <el-checkbox label="数据库" name="area" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="测试类型偏好:" prop="type" required>
              <el-checkbox-group v-model="Infos.type">
                <el-checkbox label="功能测试" name="type" />
                <el-checkbox label="性能测试" name="type" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="测试方式偏好:" prop="method" required>
              <el-checkbox-group v-model="Infos.method">
                <el-checkbox label="黑盒测试" name="method" />
                <el-checkbox label="白盒测试" name="method" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-card>
        
        <template #footer>
            <span class="dialog-footer">
                <!-- <el-button @click="dialogForEditInfo = false" type="warning" plain>返回</el-button> -->
                <el-button @click="submitEdit(formRef)" type="warning">提交修改</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="dialogForCharge" title="账户充值">
      <div>
        <span>账户余额：</span>
        <el-input
          v-model="balance"
          class="w-50 m-2"
          size="large"
          :placeholder="balance"
          disabled
        />
      </div>
      <div>
        <span>充值金额：</span>
        <br>
        <el-input-number
          v-model="chargeCash"
          :min="1"
          :max="10"
          controls-position="right"
          size="large"
        />
      </div>
    </el-dialog>
      
    <el-dialog v-model="dialogForWithdraw">

    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import Preferences from '../../../interface/Preferences'
import { getPreferences, setPreferences } from "../../../api/subpages/PersonalInfo";
import { ElMessage, ElForm} from 'element-plus'

type FormInstance = InstanceType<typeof ElForm>
const chargeCash=ref(0)
const balance=ref(0)
const formRef = ref<FormInstance>()
const dialogForCharge=ref(false)
const dialogForWithdraw=ref(false)
const dialogForEditInfo=ref(false)
let userIsWorker=ref(JSON.parse( localStorage.getItem('identity')))
let email=ref(localStorage.getItem('email'))
let UserTypeName=ref('')
let username=ref(localStorage.getItem('username'))
let userId=ref(JSON.parse(localStorage.getItem('userId')))
const loading=ref(false)

if(userIsWorker.value===0){
  UserTypeName.value="管理员"
}else if(userIsWorker.value===2){
  UserTypeName.value= "众测工人"
  loading.value=true
  getPreferences(userId.value).then((res)=>{
    if(res==null) {
      loading.value=false
      return
    }
    Infos.activity=res.activity
    Infos.level=res.level
    Infos.device=res.device;
    Infos.environment=res.environment
    Infos.language=res.language
    Infos.area=res.area
    Infos.type=res.type
    Infos.method=res.method

    loading.value=false
  })
}
else if(userIsWorker.value===1){
  UserTypeName.value="发包方"
}

let Infos=reactive<Preferences>({
  username: username.value,
  email: email.value,
  userType: UserTypeName.value,
  userId: userId.value,
  level: '中',
  activity:'中',
  device:[],
  environment:[],
  language:[],
  area:[],
  type:[],
  method:[],
})


  
const openEditDialog=()=>{
  dialogForEditInfo.value=true
}

const rules = reactive({
  device: [
    { 
      type: 'array',
      required: true, 
      message: '至少选一个测试设备偏好', 
      trigger: 'change' },
  ],
  language: [
    {
      type: 'array',
      required: true,
      message: '至少选一个测试语言偏好',
      trigger: 'change',
    },
  ],
  area: [
    {
      type: 'array',
      required: true,
      message: '至少选一个测试领域偏好',
      trigger: 'change',
    },
  ],
  environment: [
    {
      type: 'array',
      required: true,
      message: '至少选一个测试环境偏好',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: '至少选一个测试类型偏好',
      trigger: 'change',
    },
  ],
  method: [
    { 
      type: 'array',
      required: true, 
      message: '至少选一个测试方法偏好', 
      trigger: 'change',
    },
  ],
})

const submitEdit=(formEl: FormInstance | undefined)=>{
  if (!formEl) return
  formEl.validate((valid)=>{
    if(valid){
      loading.value=true
      setPreferences(Infos).then((res)=>{
          if(res=="success"){
            ElMessage.success("成功修改偏好！")
            localStorage.setItem('hasPreferences', JSON.stringify(true))
            // resetForm(formRef.value)
            dialogForEditInfo.value = false
          }else{
            ElMessage.error("修改偏好出错！")
          }
          loading.value=false
      })
    }
  })
}
    

</script>
<style scoped>

.classs{
  color: gray;
  background: blanchedalmond;
  font-size: 20px;
  margin-left: 40%;
  margin-top: 20px;
  margin-bottom: 0px;

}


</style>

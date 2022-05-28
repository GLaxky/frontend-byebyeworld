<template>
  <el-card class="submitTask"  v-loading="loading">
    <template #header>
      <div class="card-header">
          <span style="font-size:xx-large; font-weight: bolder; color:#F2AF58;">发布新的任务</span>
      </div>
    </template>
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="form.projectName"></el-input>
      </el-form-item>
      <el-form-item label="预计需要人数"  prop="num">
        <div>
          <el-input-number v-model="form.num" :min="1"></el-input-number>
        </div>
        
      </el-form-item>
      <el-form-item label="悬赏总金额(￥)"  prop="costSum">
        <el-input-number v-model="form.costSum" :min="1"></el-input-number>
        <span style="margin-left:1em; font-size: x-small;color: gray;">您当前的余额为：{{balance}}</span>
      </el-form-item>
      <el-form-item label="预计测试难度"  prop="rank">
        <el-select v-model="form.rank" placeholder="">
          <el-option label="低" value="低"></el-option>
          <el-option label="中" value="中"></el-option>
          <el-option label="难" value="难"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试类型" prop="type">
        <el-select v-model="form.type" placeholder="">
          <el-option label="功能测试" value="功能测试"></el-option>
          <el-option label="性能测试" value="性能测试"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试设备" prop="device">
        <el-select v-model="form.device" placeholder="">
          <el-option label="移动端" value="移动端"></el-option>
          <el-option label="PC" value="PC"></el-option>
          
        </el-select>
      </el-form-item>
      <el-form-item label="测试环境" prop="environment">
        <el-select v-model="form.environment" placeholder="">
          <el-option label="Windows" value="Windows"></el-option>
          <el-option label="Linux" value="Linux"></el-option>
          <el-option label="MacOS" value="MacOS"></el-option>
          <el-option label="Android" value="Android"></el-option>
          <el-option label="IOS" value="IOS"></el-option>
          <el-option label="HormonesOS" value="HormonesOS"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试方式" prop="method">
        <el-select v-model="form.method" placeholder="">
          <el-option label="白盒测试" value="白盒测试"></el-option>
          <el-option label="黑盒测试" value="黑盒测试"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试语言" prop="language">
        <el-checkbox-group v-model="form.language" placeholder="">
          <el-checkbox label="Java" value="language"></el-checkbox>
          <el-checkbox label="Python" value="language"></el-checkbox>
          <el-checkbox label="C" value="language"></el-checkbox>
          <el-checkbox label="C++" value="language"></el-checkbox>
          <el-checkbox label="C#" value="language"></el-checkbox>
          <el-checkbox label="HTML" value="language"></el-checkbox>
          <el-checkbox label="JS" value="language"></el-checkbox>
          <el-checkbox label="Scala" value="language"></el-checkbox>
          <el-checkbox label="Go" value="language"></el-checkbox>
          <el-checkbox label="Ruby" value="language"></el-checkbox>
          <el-checkbox label="PHP" value="language"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="测试领域" prop="area">
        <el-select v-model="form.area" placeholder="">
          <el-option label="前端" value="前端"></el-option>
          <el-option label="后端" value="后端"></el-option>
          <el-option label="操作系统" value="操作系统"></el-option>
          <el-option label="数据库" value="数据库"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目开始时间"  required>
        <el-col :span="11">
          <el-form-item  prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
            
        </el-col>
        <el-col :span="1" class="text-center" align="center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="startTime">
            <el-time-picker
              v-model="form.startTime"
              placeholder="Pick a time"
              style="width: 100%"
            ></el-time-picker>
          </el-form-item>
          
        </el-col>
      </el-form-item>
      <el-form-item label="项目结束时间"  required>
        <el-col :span="11" >
          <el-form-item prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          
        </el-col>
        <el-col :span="1" class="text-center" align="center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="endTime">
            <el-time-picker
              v-model="form.endTime"
              placeholder="Pick a time"
              style="width: 100%"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="项目简介" prop="projectIntro">
        <el-input v-model="form.projectIntro" type="textarea" clearable></el-input>
      </el-form-item>
      
      <el-form-item label="待测应用" prop="appFile" >
              <el-upload
          ref="uploadApp"
          class="upload-demo"
          action=""
          :limit="1"
          :on-exceed="handleExceedForApp"
          :auto-upload="false"
          :on-change="handleChangeForApp"
          :on-remove="handleRemoveForApp"
          accept=".tar.gz, .zip, .exe, .jar, .msi, .app, .apk, .ipa, .bundle, .dmg"
      >   
          <template #trigger>
          <el-button type="warning" round><el-icon><folder-add /></el-icon>上传待测应用可执行文件</el-button>
          </template>
          <br>
          <template #tip>
          <div class="el-upload__tip" style="color: #F2AF58">
              限制上传仅一个可执行文件（.tar.gz, .zip, .exe, .jar, .msi, .app, .apk, .ipa, .bundle, .dmg）
          </div>
          </template>
      </el-upload>
      </el-form-item>

      <el-form-item label="测试文档" prop="testFile" >
              <el-upload
          ref="uploadTest"
          class="upload-demo"
          action=""
          :limit="1"
          :on-exceed="handleExceedForTest"
          :auto-upload="false"
          :on-change="handleChangeForTest"
          :on-remove="handleRemoveForTest"
          accept=".doc, .docx, .md, .pdf"
      >
          <template #trigger>
          <el-button type="warning" round><el-icon><folder-add /></el-icon>上传测试文档</el-button>
          </template>
          <br>
          <template #tip>
          <div class="el-upload__tip" style="color: #F2AF58">
              限制上传仅一个文档文件（.doc, .docx, .md, .pdf）
          </div>
          </template>
      </el-upload>
      </el-form-item>

      <el-form-item >
        <el-button color="#F2AF58" style="color: white" @click="submitForm(formRef)">确认</el-button>
        <el-button type="warning" plain @click="resetForm(formRef)">清空</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { reactive } from 'vue'
import type { ElForm } from 'element-plus'
import UploadTask from '../../../interface/UploadTask'
import {createNewTask} from '../../../api/subpages/CreateNewTask'
import { ElMessage } from 'element-plus'
import {formatDate} from '../../../utils/timeOperation'

const balance=Number(localStorage.getItem('balance'))
type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const loading=ref(false)
const uploadApp = ref()
const uploadTest = ref()
let appFiles
let testFiles
const form = reactive<UploadTask>({
  projectName: '',
  type: '',
  startDate: null,
  startTime: null,
  endDate: null,
  endTime: null,
  num:0,
  projectIntro: '',
  appFile: null,
  testFile: null,
  device: '',
  environment: '',
  language: [],
  method:'',
  rank:'',
  area:'',
  costSum: 100
})

const handleRemoveForApp=()=>{
  appFiles=null
}

const handleRemoveForTest=()=>{
  testFiles=null
}

const checkAppFile = (rule: any, value: any, callback: any) => {
  
  if (!appFiles) {
    return callback(new Error('请上传可执行文件'))
  }else{
    let typeArry = [ '.zip', '.exe', '.jar', '.msi', '.app', '.apk', '.ipa', '.bundle', '.dmg'];
    let type1 = appFiles.name.substring(appFiles.name.lastIndexOf('.'));
    let type2 = appFiles.name.substring(appFiles.name.lastIndexOf('.',appFiles.name.lastIndexOf('.')));
    let typeArray2=['.tar.gz']
    if( typeArry.indexOf(type1) > -1||typeArray2.indexOf(type2)>-1){
        callback()
    }else{
        return callback(new Error('请勿上传非法文件'))
    }
  }
}

const checkTestFile = (rule: any, value: any, callback: any) => {
  if (!testFiles) {
    return callback(new Error('请上传测试文档'))
  }else{
    let typeArry = ['.docx', '.doc', '.md', '.pdf'];
    let type = testFiles.name.substring(testFiles.name.lastIndexOf('.'));
    if( typeArry.indexOf(type) > -1){
        callback()
    }else{
        return callback(new Error('请勿上传非法文件'))
    }
  }
}
const rules = reactive({
  projectName: [
    {
      required: true,
      message: '请输入项目名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: '长度应该在1-20个字符之间',
      trigger: 'blur',
    },
  ],
  num: [
    {
      type: 'number',
      min: 1,
      required: true,
      message: '人数应为正数',
      trigger: 'blur',
    },
  ],
  costSum: [
    {
      type: 'number',
      min: 1,
      required: true,
      message: '悬赏总金额应为正数',
      trigger: 'blur',
    },
  ],
  rank: [
    {
      required: true,
      message: '请输入项目难度',
      trigger: 'blur',
    },
  ],
  startDate: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  startTime: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change',
    },
  ],
  endDate: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  endTime: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择项目类型',
      trigger: 'change',
    },
  ],
  projectIntro: [
    {
      required: true,
      message: '请输入项目简介',
      trigger: 'blur',
    },
  ],
  appFile: [
    {
      // required: true,
      // message: 'Please input activity form',
      // trigger: 'blur',
      validator: checkAppFile, 
      trigger: 'change' 
    },
  ],

  testFile: [
    {
      // required: true,
      // message: 'Please input activity form',
      // trigger: 'blur',
      validator: checkTestFile, 
      trigger: 'change' 
    },
  ],

  device: [
    {
      required: true,
      message: '请选择设备限制',
      trigger: 'change',
    },
  ],

  language: [
    {
      required: true,
      message: '请选择测试语言',
      trigger: 'change',
    },
  ],

  area: [
    {
      required: true,
      message: '请选择测试领域',
      trigger: 'change',
    },
  ],

  method: [
    {
      required: true,
      message: '请选择测试方式',
      trigger: 'change',
    },
  ],
  environment: [
    {
      required: true,
      message: '请选择测试环境',
      trigger: 'change',
    },
  ],
})




const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  console.log(form.type)
  formEl.validate((valid) => {
    // console.log(form.endDate==form.startDate)//这样不行，要转字符串
    if(!(form.endDate>form.startDate||(formatDate(form.endDate)===formatDate(form.startDate)&&form.endTime>form.startTime))){
      valid=false;
      ElMessage.error("开始日期晚于结束日期！")
    }
    if (valid) {
      loading.value=true;
      // console.log(testFiles.raw)
      form.appFile=appFiles.raw
      form.testFile=testFiles.raw
      createNewTask(form).then((res)=>{
        loading.value=false;
        if(res=="success"){
          ElMessage.success("成功新建项目！")
          resetForm(formRef.value)
        }else if(res=='lack of balance'){
          ElMessage.error("账户余额不足！")
        }else{
          ElMessage.error("新建项目出错！")
        }
      })
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  uploadApp.value.clearFiles()
  uploadTest.value.clearFiles()
}

const handleExceedForApp = (files) => {
  console.log(files)
  uploadApp.value.clearFiles()
  uploadApp.value.handleStart(files[0])
}

const handleExceedForTest = (files) => {
  console.log(files)
  uploadTest.value.clearFiles()
  uploadTest.value.handleStart(files[0])
}


const handleChangeForTest=(file, fileList)=>{
  testFiles=file
}

const handleChangeForApp=(file, fileList)=>{
  appFiles=file
}

</script>

<style scoped>
.submitTask{
  /* background-color:  #fdf6ec; */
  padding-right: 2em;
  padding-bottom: 1em;
  width: 95%;
  /* height: max-content; */
  border-radius: 1em;
  /* box-shadow: 10px 10px 5px #ccc; */
  padding-top: 1em;
}
.card-header{
    display: flex;
    align-items: center;
    justify-content: center;
    
}
</style>
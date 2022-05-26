<template>
    <div>
        <el-page-header :icon="ArrowLeft" content="提交报告"  @back="goBack" class='backHead'/>
        <div v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="14">
                    <el-scrollbar class="box-card">
                    <el-card class="" style="">
                        <template #header>
                        <div class="card-header">
                            <span>填写你的测试报告吧!</span>
                        </div>
                        </template>
                        <el-form ref="formRef" :model="form" label-width="120px" :rules="rules" v-loading="loadingForSubmit"
                            label-position="top">
                            <el-form-item label="报告引用" prop="referenceReportName">
                                <template v-if="pageState===1">
                                    <el-input  disabled placeholder="你未引用其他人的报告~" ></el-input>
                                </template>
                                <template v-else>
                                    <!-- <el-link  href="" style="font-style: italic;">{{refInfo}}</el-link> -->
                                    <el-link  @click="dialogForRef=true" style="font-style: italic;">点击查看报告引用</el-link>
                                </template>
                            </el-form-item>
                            <el-form-item label="报告引用类型" prop="refRelation">
                                <el-radio v-model="form.refRelation" :label="0" :disabled="lockForRefType||pageState===0">未引用报告</el-radio>
                                <el-radio v-model="form.refRelation" :label="1" :disabled="lockForRefType">反驳</el-radio>
                                <el-radio v-model="form.refRelation" :label="2" :disabled="lockForRefType">拓展</el-radio>
                            </el-form-item>
                            
                            <el-form-item label="上传缺陷截图" prop="bugScreenshots">
                                <div>
                                    <el-upload action="" list-type="picture-card" :auto-upload="false" 
                                    :on-change="handleChange" ref="uploadRef" :file-list="form.bugImgs" 
                                    accept="image/*"
                                      >
                                        <template #default>
                                        <el-icon><plus /></el-icon>
                                        </template>
                                        <template #file="{ file }">
                                            <div>
                                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                                <span class="el-upload-list__item-actions">
                                                    <span
                                                        class="el-upload-list__item-preview"
                                                        @click="handlePictureCardPreview(file)"
                                                    >
                                                        <el-icon><zoom-in /></el-icon>
                                                    </span>
                                                    <span
                                                        class="el-upload-list__item-delete"
                                                        @click="handleRemove(file)"
                                                    >
                                                        <el-icon><delete /></el-icon>
                                                    </span>
                                                </span>
                                            </div>
                                        </template>
                                        <template #tip>
                                            <div class="el-upload__tip" style="color: #F2AF58">
                                                限制上传文件类型（.jpg, .jpeg, .png, .svg等）
                                            </div>
                                        </template>
                                    </el-upload>
                                    <el-dialog v-model="dialogVisible" width="100%">
                                        <img  :src="dialogImageUrl" alt="" />
                                    </el-dialog>
                                </div>
                            </el-form-item>
                            <el-form-item label="缺陷情况描述" prop="bugDescription">
                                <el-input v-model="form.bugDescription" type="textarea"></el-input>
                            </el-form-item>
                            <el-form-item label="缺陷复现步骤" prop="revealSteps">
                                <el-input v-model="form.revealSteps" type="textarea"></el-input>
                            </el-form-item>
                            <el-form-item label="测试设备信息" prop="devices">
                                <el-input v-model="form.devices" type="textarea"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="warning" plain @click="resetForm(formRef)">清空</el-button>
                                <!-- <el-button color="#F2AF58" style="color: white" @click="checkReportQuality(formRef)">
                                    检查报告质量
                                </el-button> -->
                                <el-button color="#F2AF58" style="color: white" @click="onSubmit(formRef)">
                                    确认提交
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                    </el-scrollbar>
                </el-col>
                <el-col :span="10" v-loading="loadingRight">
                    
                    
                    <template v-if="pageState===1">
                        
                        <el-card class="box-card-right">
                            <template #header>
                            <div class="card-header">
                                <span>报告协作预览</span>
                            </div>
                            </template>
                            <el-empty description="你没引用其他工人的报告~" />
                        </el-card>
                    </template>
                    <template v-else-if="pageState===0">
                        <el-scrollbar class="box-card-right">
                            <!-- <template v-if="referenceReport.referenceReportId!=null"> -->
                                <report-info-card :report-info="referenceReport" card-title="引用报告预览">
                                </report-info-card>
                            <!-- </template> -->
                        </el-scrollbar>
                    </template>
                    <template v-else="pageState.value===2">
                        <el-scrollbar class="box-card-right" >
                            <el-card  >
                                <template #header>
                                <div class="card-header">
                                    <span>请修改你的报告以降低其与以下报告的相似度~</span>
                                </div>
                                </template>
                                <el-collapse v-loading="false"> 
                                    <template v-for="report in similarReports" :key="report.index">
                                        <el-collapse-item>
                                            <template #title>
                                            {{"工人ID ："+report.workerName}}<el-icon><avatar /></el-icon>
                                            </template>
                                            <report-info-card :report-info="report"></report-info-card>
                                        </el-collapse-item>
                                        </template>
                                    </el-collapse>
                            </el-card>
                        </el-scrollbar>
                        
                    </template>
                    
                </el-col>
            </el-row>
        </div>
        <el-dialog v-model="dialogForRef">
            <report-info-card card-title="报告引用" :report-info="referenceReport"></report-info-card>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router';
import {reactive, ref, onMounted, watch} from 'vue'
import UploadReport from '../../../interface/UploadReport';
import { ArrowLeft, SetUp } from '@element-plus/icons-vue'
import router from '../../../router';
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import { ElForm, ElMessage } from 'element-plus'
import Report from '../../../interface/Report';
import { toNumber } from '@vue/shared';
import ReportInfoCard from '../../../components/ReportInfoCard.vue'
import {submitMyReport} from '../../../api/subpages/SubmitReport'
import { getReportsDetail } from '../../../api/subpages/ReportList';

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const route=useRoute()
const taskId=toNumber(route.params.taskId) 
const refReportId=toNumber(route.query.refRId) 
const userId=ref(JSON.parse(localStorage.getItem('userId')))
const dialogVisible=ref(false)
const uploadRef = ref()
const lockForRefType=ref(false)
const dialogForRef=ref(false)
const loading=ref(false)
const loadingRight=ref(false)
// 0-引用了其他报告， 1-未引用其他报告，
// 2-用户撰写的报告相似度检测不过关
const pageState=ref(1)
const form=reactive<UploadReport>({
    projectId:taskId,
    referenceReportId: refReportId,
    refRelation: 0,
    workerId: userId,
    workerName: '',
    bugImgs: [],
    bugDescription: '',
    revealSteps: '',
    devices: '',
})

const referenceReport=reactive<Report>(
    {
        projectId:taskId,
        referenceReportId: 0,
        refRelation: 0,
        reportId: refReportId,
        haveSubmittedReport: true,
        workerId: 0,
        workerName: '',
        bugImgs: [],
        bugDescription: '',
        revealSteps: '',
        devices: '',
        score:0,
        averageScore:0,
        assessPeople:0,
    }
)

// watch(referenceReport,(newval, oldval)=>{
//     console.log('监听referenceReport')
// })

if(refReportId===0){
    pageState.value=1
    lockForRefType.value=true
}else{
    pageState.value=0
    lockForRefType.value=false
    form.refRelation=-1
    // referenceReport.value=JSON.parse(route.query.refReportInfo)
    
}
// console.log(referenceReport)
if(pageState.value===0){
    loading.value=true
    getReportsDetail(refReportId).then((res)=>{
        referenceReport.referenceReportId=res.referenceReportId
        referenceReport.refRelation=res.refRelation
        referenceReport.workerId=res.workerId
        referenceReport.workerName=res.workerName
        referenceReport.bugImgs=res.bugImgs
        referenceReport.bugDescription=res.bugDescription
        referenceReport.revealSteps=res.revealSteps
        referenceReport.devices=res.devices
        referenceReport.averageScore=res.averageScore
        referenceReport.assessPeople=res.assessPeople
        // console.log(referenceReport)
        loading.value=false;
    })
}
const loadingForSubmit=ref(false)
const dialogImageUrl= ref('')

// console.log(referenceReport)
const similarReports=ref<Report[]>([])
const refInfo=ref("")

refInfo.value="测试报告 by: "+referenceReport.workerName+"【详情见右边预览处~】"

const goBack=()=>{
    router.back()
}

const checkScreenshots = (rule: any, value: any, callback: any) => {
//   console.log("无语")
  if (form.bugImgs.length==0) {
    return callback(new Error('请上传截图'))
  }else{
    let hasIllegalImg=false
    form.bugImgs.forEach((element)=>{
        if(element.raw.type.indexOf('image')===-1){
            hasIllegalImg=true
        }
    })
    if(!hasIllegalImg){
        callback()
    }else{
        return callback(new Error('请勿上传非图片格式文件'))
    }
    
  }
}


const rules = reactive({
    bugScreenshots: [
      {
        // required: true,
        validator: checkScreenshots, 
        trigger: 'change' 
      },
    ],
    bugDescription: [
      {
        required: true,
        message: '请输入缺陷描述',
        trigger: 'blur',
      },
    ],
    revealSteps: [
      {
        required: true,
        message: '请输入缺陷复现步骤',
        trigger: 'blur',
      },
    ],
    devices: [
      {
        required: true,
        message: '请输入设备信息',
        trigger: 'blur',
      },
    ],
    refType:[
        {
            required: true,
            message: '请选择引用类型',
            trigger: 'change',
        }
    ]
})

const handleChange=(file: UploadFile)=>{
    // console.log('beforeUpload')
    // let fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
    // console.log('上传前')
    // console.log(fileSuffix)
    // let whiteList = ["jpg", "jpeg", "png", "svg"];
    
    // if (whiteList.indexOf(fileSuffix) === -1) {
    //     ElMessage.error("上传文件非图片类格式")
    //     console.log(form.bugImgs)
    //     return;
    // }
    form.bugImgs.push(file)
    // console.log(form.bugImgs)
}

const handleRemove = (file: UploadFile) => {
    form.bugImgs.forEach(function(item, index, arr) {    
        if(item.uid === file.uid) {
            arr.splice(index, 1);
        }
    })
}

const handlePictureCardPreview = (file: UploadFile) => {
    // console.log(file.url!)
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
}

const onSubmit=(formEl: FormInstance | undefined)=>{
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            loadingForSubmit.value=true;
            submitMyReport(form).then((res)=>{
                if((typeof(res)=== 'string')&& res=="success"){
                    ElMessage.success("成功提交！")
                    formRef.value.resetFields()
                    uploadRef.value.clearFiles()
                    pageState.value=1
                    router.back()
                }else if(typeof(res)==='string'&&res==="faild"){
                    ElMessage.error('提交失败')
                }else{
                    // console.log(res)
                    ElMessage.info(res.message)
                    similarReports.value=res.list
                    console.log(res)
                    pageState.value=2
                    lockForRefType.value=true
                }
                loadingForSubmit.value=false;
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    uploadRef.value.clearFiles()
}

</script>

<style scoped>
.backHead{
    margin-bottom: 1.5em;
    min-width: 90%;
    border-radius: 1em;
    box-shadow: 0.1em 0.25em 0.1em rgb(252, 208, 128);
}
.text{
    font-weight: bolder;
    font-style: italic;
    margin-left: 50px;
}
.box-card{
    box-sizing: border-box;
    height: 40em;
    border-style: double;
    border-width: 0.5em;
    border-color: blanchedalmond;
}
.box-card-right{
    height: 40em;
}
</style>
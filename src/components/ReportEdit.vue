<template>
    <div>
    <el-card class="a">
        <template #header>
            <div class="card-header">
                <span>提交新报告</span>
            </div>
        </template>
        <el-form ref="editForm" :model="formModel" label-position="top" label-width="120px" :rules="rules" v-loading="loadingForSubmit">
            <el-form-item label="报告引用">
                <!-- <template v-if="formModel.referenceReportId!==0">
                    <span>引用报告见右方</span>
                    <span>引用关系：{{formModel.refRelation}}</span>
                </template>
                <template v-else>
                    <span>未引用他人报告</span>
                </template> -->
                <span style="color:darkgrey">报告引用关系不支持修改噢~</span>
            </el-form-item>
            <el-form-item label="缺陷截图"  prop="bugScreenshots">
                <el-upload
                    action=""
                    :auto-upload="false"
                    ref="uploadRef"
                    list-type="picture-card"
                    :on-change="handleChange"
                    :file-list="formModel.bugImgs"
                >
                    <template #default>
                        <el-icon><Plus /></el-icon>
                    </template>
                    <template #file="{file}">
                        <div>
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview"
                                    @click="handlePictureCardPreview(file)"
                                >
                                    <el-icon><zoom-in /></el-icon>
                                </span>
                                <span class="el-upload-list__item-delete"
                                    @click="handleRemove(file)"
                                >
                                    <el-icon><delete /></el-icon>
                                </span>
                            </span>
                        </div>
                    </template>
                    <template #tip>
                        <div class="el-upload__tip">
                            限制上传图片类型（.jpg, .jpeg, .png, .svg等）
                        </div>
                    </template>
                </el-upload>
                <el-dialog v-model="dialogForImgDetail">
                    <el-image :src="previewImgUrl"></el-image>
                    <!-- <img  w-full :src="previewImgUrl"/> -->
                </el-dialog>
            </el-form-item>
            <el-form-item label="缺陷描述" prop="bugDescription">
                <el-input 
                    v-model="formModel.bugDescription"
                    :autosize="{minRows: 2, maxRows: 4}"
                    type="textarea"
                />
            </el-form-item>
            <el-form-item label="复现步骤" prop="revealSteps">
                <el-input 
                    v-model="formModel.revealSteps"
                    :autosize="{minRows: 2, maxRows: 4}"
                    type="textarea"
                />
            </el-form-item>
            <el-form-item label="测试设备" prop="devices">
                <el-input 
                    v-model="formModel.devices"
                    :autosize="{minRows: 2, maxRows: 4}"
                    type="textarea"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="warning" plain @click="restoreForm(editForm)">复原</el-button>
                <el-button color="#F2AF58" style="color: white" @click="onSubmit(editForm)">
                    确认提交
                </el-button>
            </el-form-item>
        </el-form>
    </el-card>
    </div>
</template>

<script lang="ts">
import { ElForm, ElMessage } from "element-plus"
import { UploadFile } from "element-plus/es/components/upload/src/upload.type"
import { defineComponent, reactive, ref, watch } from "vue"
import { editReport } from "../api/subpages/ReportEdit"
import { getReportsDetail } from "../api/subpages/ReportList"
import Report from '../interface/Report'
import UploadReport from "../interface/UploadReport"
import router from "../router"

export default defineComponent({
    name:'report-edit',
    props:{
        oldReportInfo:{
            type: Object,
            default(){
                let defaultValue:Report={
                    projectId: 0,
                    referenceReportId: 0,
                    refRelation: 0,
                    reportId: 0,
                    haveSubmittedReport: false,
                    workerId: 0,
                    workerName: undefined,
                    bugImgs: [],
                    bugDescription: undefined,
                    revealSteps: undefined,
                    devices: undefined,
                    score: 0,
                    averageScore: 0,
                    assessPeople: 0
                }
                return defaultValue
            }
        }
    },
    emits:['changePageState'],
    setup(props,ctx){
        type FormInstance=InstanceType<typeof ElForm>
        const editForm=ref<FormInstance>(null)
        const dialogForImgDetail=ref(false)
        const loadingForSubmit=ref(false)
        const previewImgUrl=ref('')
        const uploadRef=ref()
        const formModel=reactive<UploadReport>({
            projectId:props.oldReportInfo.projectId,
            referenceReportId: props.oldReportInfo.referenceReportId,
            refRelation: props.oldReportInfo.refRelation,
            workerId: props.oldReportInfo.workerId,
            workerName: props.oldReportInfo.workerName,
            bugImgs: [],
            bugDescription: props.oldReportInfo.bugDescription,
            revealSteps: props.oldReportInfo.revealSteps,
            devices: props.oldReportInfo.devices,
        })
        console.log(props)
        const checkScreenshots = (rule: any, value: any, callback: any) => {
            //   console.log("无语")
            if (formModel.bugImgs.length==0) {
                return callback(new Error('请上传截图'))
            }else{
                let hasIllegalImg=false
                formModel.bugImgs.forEach((element)=>{
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
        const rules=reactive({
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
        })
        // console.log(formModel.bugImgs)
        const handleChange=function(file: UploadFile){
            // console.log('wuyu')
            // console.log(file.url!)
            formModel.bugImgs.push(file)
        }

        const handlePictureCardPreview=function(file: UploadFile){
            console.log(file.url!)
            previewImgUrl.value = file.url! || ''
            dialogForImgDetail.value = true
        }

        const handleRemove=function(file: UploadFile){
            console.log(file.url!)
            formModel.bugImgs.forEach(function(item, index, arr) {    
                if(item.uid === file.uid) {
                    arr.splice(index, 1)
                }
            })
        }

        const restoreForm=function(formEl: FormInstance | undefined){
            if (!formEl) return
            formEl.resetFields()
            uploadRef.value.clearFiles()

            formModel.projectId=props.oldReportInfo.projectId
            formModel.referenceReportId=props.oldReportInfo.referenceReportId,
            formModel.refRelation=props.oldReportInfo.refRelation
            formModel.workerId=props.oldReportInfo.workerId
            formModel.workerName=props.oldReportInfo.workerName
            formModel.bugImgs=[]
            formModel.bugDescription=props.oldReportInfo.bugDescription
            formModel.revealSteps=props.oldReportInfo.revealSteps
            formModel.devices=props.oldReportInfo.devices

        }

        const onSubmit=function(formEl: FormInstance | undefined){
            if(!formEl) return
            formEl.validate(async (isValid)=>{
                if(isValid){
                    // todo
                    loadingForSubmit.value=true;
                    // setTimeout(()=>{
                    //     loadingForSubmit.value=false
                    // }, 1000)
                    let res=await editReport(formModel, props.oldReportInfo.reportId)
                    loadingForSubmit.value=false
                    if((typeof(res)=== 'string')&& res=="success"){
                        ElMessage.success("成功提交！")
                        editForm.value.resetFields()
                        uploadRef.value.clearFiles()
                        router.back()
                    }else if(typeof(res)==='string'&&res==="faild"){
                        ElMessage.error('提交失败')
                    }else{
                        // console.log(res)
                        ElMessage.info(res.message)
                    }
                    ctx.emit('changePageState', res)
                    console.log('submit!')
                }else{
                    console.log('error submit!')
                }
            })
        }

        return {
            editForm,
            formModel,
            dialogForImgDetail,
            previewImgUrl,
            uploadRef,
            rules,
            loadingForSubmit,
            handleChange,
            handlePictureCardPreview,
            handleRemove,
            restoreForm,
            onSubmit,
        }
    }

})
</script>

<style scoped>
.card-header{
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>
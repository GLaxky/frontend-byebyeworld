<template>
    <div>
        <el-card v-bind="$attrs" style="">
                <template #header>
                <div class="card-header">
                    <span>{{title}}</span>
                </div>
                </template>

                <el-divider content-position="left">报告引用</el-divider>
                <template v-if="hasParent">
                    <el-link @click="dialogVisible = true" style="font-style: italic;">{{'查看报告引用'}}</el-link>
                    <el-divider content-position="left">报告引用类型</el-divider>
                    <el-tag>{{refRelationStr}}</el-tag>
                </template>
                <template v-else>
                    <span style="color:darkgrey">未引用其他报告</span>
                </template>
            
                <el-divider content-position="left">报告撰写者ID</el-divider>
                <p class="text">{{reportTarget.workerName}}</p>
                <el-divider content-position="left">报告平均得分</el-divider>
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content='reportTarget.assessPeople+"人已评分"'
                    placement="top"
                >
                    <el-rate
                    v-model="reportTarget.averageScore"
                    disabled
                    allow-half
                    show-score
                    text-color="#ff9900"
                    score-template="{value} 总分"
                />

                </el-tooltip>
                
                <el-divider content-position="left">缺陷截图</el-divider>
                <div class="text">
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="点击查看图片详情和更多测试图片"
                        placement="right"
                    >
                        <el-image
                            style="width: 150px; height: 150px"
                            :src="reportTarget.bugImgs[0]"
                            :preview-src-list="reportTarget.bugImgs"
                            :initial-index="0"
                            fit="cover"
                        >
                        </el-image>
                    </el-tooltip>
                </div>
                <el-divider content-position="left">缺陷情况描述</el-divider>
                <p class="text">{{reportTarget.bugDescription}}</p>
                <el-divider content-position="left">缺陷复现步骤</el-divider>
                <p class="text">{{reportTarget.revealSteps}}</p>
                <el-divider content-position="left">测试设备信息</el-divider>
                <p class="text">{{reportTarget.devices}}</p>
        </el-card>
        <el-dialog v-model="dialogVisible" title="查看引用" draggable>
            <template v-if="hasParent">
                <report-info-card :report-info="referenceReport" title="相似报告详情"></report-info-card>
            </template>
            <template v-else>
                 <el-empty description="未引用他人报告" />
            </template>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">返回</el-button>
            </span>
            </template>
        </el-dialog>
        
    </div>
    
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted , onUpdated, onBeforeMount, watch, watchEffect} from "vue";
import {getReportsDetail} from '../api/subpages/ReportList'
import Report from "../interface/Report";
export default defineComponent({
    name: 'report-info-card',
    inheritAttrs: false,
    props:{
        reportInfo: {
            type: Object,
            default:{
                referenceReportId: 1,
                refRelation:0,
                reportId: 2,
                haveSubmittedReport: true,
                workerId: 2,
                workerName: "String",
                bugImgs: [],
                bugImgsDownloadApi: 'String',
                bugDescription: 'String',
                revealSteps: 'String',
                devices: 'String', 
            }
        },
        cardTitle:{
            type:String
        }
    },
    components:{
        
    },
    setup(props,{emit}){
        let reportTarget=ref(props.reportInfo)
        // console.log(reportTarget.value)
        const hasParent=ref(false)
        const referenceReport=ref<Report>(null)
        const title=ref(props.cardTitle)
        // console.log(props.cardTitle)
        const dialogVisible=ref(false)
        const refRelationStr=ref('')
        
        onMounted(()=>{
            // console.log('onMounted')
            getRefReportData();
            // console.log(reportTarget)
        })
        const getRefReportData=()=>{
            // console.log(reportTarget.value.referenceReportId)
            if(reportTarget.value.referenceReportId==0) {
                referenceReport.value=null
                hasParent.value=false
                return
            }
            console.log('获取数据')
            getReportsDetail(reportTarget.value.referenceReportId).then((res)=>{
                // console.log(res)
                hasParent.value=true
                referenceReport.value=res
                if(reportTarget.value.refRelation===1){
                    refRelationStr.value='反驳'
                }else{
                    refRelationStr.value='拓展'
                }
            })
        }
        // console.log("mount外")
        getRefReportData();

        // 监听对象的属性变化时，一定要传入一个get函数
        watch(() => props.reportInfo,(newval, oldval)=>{
            // console.log('监听目标报告变更')
            reportTarget.value=props.reportInfo
            // console.log(reportTarget.value)
            getRefReportData()
            // getReportsDetail(reportTarget.value.referenceReportId).then((res)=>{
            //     // console.log(res)
            //     referenceReport.value=res
            // })
            // console.log(referenceReport.value)
        })

        watch(() => props.reportInfo.referenceReportId,(newval, oldval)=>{
            // console.log('props属性')
            reportTarget.value=props.reportInfo
            // console.log(reportTarget.value)
            getRefReportData()
            // console.log(referenceReport.value)
        })

        // watch(() => props.reportInfo,(newval, oldval)=>{
        //     console.log('监听目标报告变更')
        //     reportTarget.value=props.reportInfo
        //     console.log(reportTarget.value)
        //     getRefReportData()
        //     console.log(referenceReport.value)
        // })

        // watch(() => referenceReport.value,(newval, oldval)=>{
        //     console.log('监听引用报告变更')
        //     getRefReportData();
        // })

        // watchEffect(()=>{
        //     console.log(props.reportInfo)
        //     reportTarget.value = props.reportInfo
        // })
        
        return {
            reportTarget,
            referenceReport,
            title,
            dialogVisible,
            hasParent,
            refRelationStr,
        }
    }
})
</script>

<style scoped>
.text{
    /* text-indent: 1em; */
    word-wrap:break-word;
}
.card-header{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: larger;
    letter-spacing: 1em;
}
</style>

<style>
.el-rate__decimal  {
  position: absolute !important;
}
.el-divider__text{
    padding: 0;
    font-weight: bold;
}
</style>
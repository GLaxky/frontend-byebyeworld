<template>
    <div>
        <el-card @click="dialogForInfocard=true" shadow="hover">
            <div id="container">
                <div id="left">
                    <div>
                        <span class="name">@{{reportDetail.workerName}}</span>
                        <el-icon><avatar /></el-icon>
                        <span> 提交的报告</span>
                    </div>
                    
                    <div style="margin-top:0.5em ;margin-bottom:0.5em ;">
                        <span class="preview">报告内容：{{brief}}...</span>
                        <!-- <el-link @click="checkReportInfo">查看详情</el-link> -->
                    </div>
                    <div>
                        <span class="time">接受任务时间：{{reportDetail.acceptTime}}</span>
                        <span class="time">提交报告时间：{{reportDetail.submitTime}}</span>
                    </div>
                </div>
                <div id="right">
                    <span>评分：</span>
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content='`${reportDetail.assessPeople}人已评分`'
                        placement="top"
                    >
                        <el-avatar id="score">{{reportDetail.averageScore}}</el-avatar>
                    </el-tooltip>
                    
                </div>
            </div>
        </el-card>
        <el-dialog v-model="dialogForInfocard">
            <report-info-card :reportInfo="reportDetail" cardTitle="报告详情">

            </report-info-card>
        </el-dialog>
    </div>
    
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ReportWithTime from "../interface/ReportWithTime";
import ReportInfoCard from "./ReportInfoCard.vue";
export default defineComponent({
    name: 'reportItem',
    props: {
        reportDetail:{
            type:Object,
            default(){
                let tmp:ReportWithTime={
                    projectId: 0,
                    referenceReportId: 0,
                    refRelation: 0,
                    reportId: 0,
                    haveSubmittedReport: false,
                    workerId: 0,
                    workerName: 'undefined',
                    bugImgs: [],
                    bugDescription: '为u粉红色的火箭发射大师傅似的为u粉红色的火箭发射大师傅似的为u粉红色的火箭发射大师傅似的为u粉红色的火箭发射大师傅似的为u粉红色的火箭发射大师傅似的',
                    revealSteps: 'undefined',
                    devices: 'undefined',
                    score: 0,
                    averageScore: 0,
                    assessPeople: 0,
                    acceptTime: "2013-10-11 10:20",
                    submitTime: "2013-10-11 10:20",
                }
                return tmp;
            }
        }
    },
    components:{
        ReportInfoCard,
    },
    setup(props, ctx){
        const dialogForInfocard=ref(false);

        const checkReportInfo=function(){
            dialogForInfocard.value=true;
        }
        let brief=props.reportDetail.bugDescription.slice(0,40)
        return {
            dialogForInfocard,
            brief,
            checkReportInfo,
        }
    }
})
</script>

<style scoped>
#container{
    display: flex;
    flex-direction: row;
}
#left{
    flex-grow: 4;
    display: flex;
    flex-direction: column;
}
#right{
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}
.preview{
    font-size: small;
    margin-left: 1em;
    margin-top: 0.5em;
    color: darkgray;
}
.time{
    font-size: small;
    margin: 0.4em;
    font-family: Arial, Helvetica, sans-serif;
}
.name{
    color: rgb(255, 168, 37);
}
#score{
    background-color: blanchedalmond;
    color: black;
    font-style: unset;
}
</style>
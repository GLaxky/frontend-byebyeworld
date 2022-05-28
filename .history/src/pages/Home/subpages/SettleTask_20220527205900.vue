<template>
    <div>
        <el-page-header :icon="ArrowLeft" :content="taskName"  @back="goBack" class='backHead'/>
        <el-card class="taskState">
            <span class="stateTitle">
                项目状态
            </span>
            <el-divider />
            <div class="topCard">
                <div style="overflow: hidden;">
                    任务接受情况：<span style="font-weight:bold;color:coral">{{taskInfo.peopleSituation}}</span>人
                </div>
                <el-divider direction="vertical" />
                <div style="overflow: hidden;">
                    报告提交情况：<span style="font-weight:bold;color:coral">{{taskInfo.finishedPeople+"/"+taskInfo.num}}</span>人
                </div>
                <el-divider direction="vertical"/>
                <div style="overflow: hidden;">
                    悬赏总金额：<span style="font-weight:bold;color:coral">{{taskInfo.costSum}}</span>元
                </div>
                <div class="submitSettle">
                    <el-button type="warning" plain @click="onSettleTask">提交结算</el-button>
                </div>
            </div>
        </el-card>
        <template v-if="allReports.length==0">
            <el-empty description="没有工人接受您的任务" class="empty"></el-empty>
            
        </template>
        <template v-else>
            <el-scrollbar class="my_container">
                <template v-for="(item,index) in reportTable.reports" :key="item.index">
                    <ReportWithMoneyVue class="card" :reportInfo="item" @refresh="initialize" @update="figureCost"
                        :maxCash="taskInfo.costSum" :defaultCash="submitCashAssignment[(reportTable.pageIndex-1)*reportTable.pageSize+index].money"
                        :reportIndex="(reportTable.pageIndex-1)*reportTable.pageSize+index">
                    </ReportWithMoneyVue>
                </template>
            </el-scrollbar>
        </template>
        <div class="pagination">
          <el-pagination
            small
            background
            layout="prev, pager, next"
            :current-page="reportTable.pageIndex"
            :page-size="reportTable.pageSize" 
            :total="pageTotal" 
            @current-change="handlePageChange"
          >
          </el-pagination>
        </div>
    </div>
</template>

<script lang="ts">
import router from '../../../router'
import { useRoute } from 'vue-router'
import { reactive } from 'vue'
import { ref } from 'vue'
import Report from '../../../interface/Report'
import ReportWithMoneyVue from '../../../components/ReportWithMoney.vue'
import { getReportListOfTask } from '../../../api/subpages/ReportList'
import { ElMessage, ElNotification } from 'element-plus'
import {settleTask} from '../../../api/subpages/SettleTask'
export default{
    components:{ReportWithMoneyVue},
    setup(){
        const route=useRoute()
        const pageTotal=ref(1)
        const taskInfo=ref(JSON.parse(route.query.taskInfo))
        const taskName='\" '+taskInfo.value.projectName+" \" " +" --- 结算任务"
        const taskId=ref(Number(route.params.taskId))
        // console.log(taskInfo)
        type cashAssignment={
            userId: number,
            money: number
        }
        const submitCashAssignment=ref<cashAssignment[]>([])
        const reportTable=reactive({
            reports: [],
            pageIndex: 1,
            pageSize: 12,
        })
        const allReports=ref<Report[]>([])
        function goBack(){
            router.back()
        }
        initialize()
        async function initialize(){
            // console.log('initialize')
            allReports.value=await getReportListOfTask(taskId.value)
            pageTotal.value=allReports.value.length
            allReports.value.sort((a, b)=>{
                if(a.averageScore!=b.averageScore){
                    return b.averageScore-a.averageScore
                }else{
                    return b.assessPeople-a.assessPeople
                }
            })

            // console.log(reportTable.reports)
            submitCashAssignment.value.length=allReports.value.length
            let averageMoney=Math.floor(taskInfo.value.costSum/taskInfo.value.finishedPeople*100)/100
            for(let i=0;i<submitCashAssignment.value.length;i++){
                submitCashAssignment.value[i]={
                    userId: allReports.value[i].workerId,
                    money: allReports.value[i].haveSubmittedReport?averageMoney:0
                }
            }
            console.log(submitCashAssignment.value)

            handlePageChange(1)
        }
        function handlePageChange(pageIndex){
            reportTable.pageIndex=pageIndex
            reportTable.reports=allReports.value.slice((pageIndex-1)*reportTable.pageSize, (pageIndex-1)*reportTable.pageSize+reportTable.pageSize)
        }
        function figureCost(newVal, reportIndex){
            console.log(newVal, reportIndex)
            submitCashAssignment.value[reportIndex].money=newVal
            check()
        }
        function check(){
            let sum=getSum()
            if(taskInfo.value.costSum-sum>=0.01){
                ElNotification({
                    title: '注意',
                    message: '分配的金额少于悬赏总金额',
                    type: 'warning',
                })
                return false
            }else if(sum>taskInfo.value.costSum){
                ElNotification({
                    title: '注意',
                    message: '分配的金额超过悬赏总金额',
                    type: 'warning',
                })
                return false
            }
            return true
        }
        function getSum(){
            let sum=0
            submitCashAssignment.value.forEach((item)=>{
                sum+=item.money
            })
            return sum
        }
        async function onSettleTask(){
            if(!check()) return
            let res=await settleTask(taskId.value, submitCashAssignment.value)
            if(res=='success'){
                ElMessage.success('任务结算成功')
            }else{
                ElMessage.success('任务结算失败')
            }
        }
        return {
            taskName,
            taskId,
            taskInfo,
            reportTable,
            allReports,
            pageTotal,
            submitCashAssignment,
            figureCost,
            goBack,
            initialize,
            onSettleTask
        }
    }
}
</script>

<style scoped>

.backHead{
    margin-bottom: 1.5em;
    min-width: 90%;
    border-radius: 1em;
    box-shadow: 0.1em 0.25em 0.1em rgb(252, 208, 128);
}
.taskState{
    margin: 1em;
}
.el-divider--horizontal{
    margin-top: 1em;
    margin-bottom: 1em;
    width: 100%;
}
.card{
    display: inline-block  ;
    width: 12.5em;
    height: 18em;
    margin: 0.8em;
}
.my_container{
    padding: 0.5em;
  border-radius: 1em;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-content: flex-start;
  /* height: 47em; */
  overflow: auto;
  background-color:rgb(253, 242, 231);
}
.empty{
    border-radius: 1em;
    background-color:rgb(253, 242, 231);
}
.submitSettle{
    flex:1;
    display: flex;
    justify-content: flex-end;
    
}
.topCard{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.stateTitle{
    color: chocolate;
}
</style>

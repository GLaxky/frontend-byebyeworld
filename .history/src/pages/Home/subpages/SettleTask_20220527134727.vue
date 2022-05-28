<template>
    <div>
        <el-page-header :icon="ArrowLeft" :content="taskName"  @back="goBack" class='backHead'/>
        <el-card>
            <span >
                项目状态
            </span>
            <el-divider />
            <span>任务接受情况：10/12人</span>
            <span>报告提交情况：10/12人</span>
            <span>悬赏总金额：100元</span>
        </el-card>
        <template v-if="allReports.length==0">
            <!-- <el-empty description="没有工人接受您的任务" class="empty"></el-empty> -->
            
        </template>
        <template v-else>
            <el-scrollbar class="my_container">
                <template v-for="(item,index) in reportTable.reports" :key="item.index">
                    <ReportWithMoneyVue class="card" :reportInfo="item"></ReportWithMoneyVue>
                </template>
            </el-scrollbar>
        </template>
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
export default{
    components:{ReportWithMoneyVue},
    setup(){
        const route=useRoute()
        const taskName='\" '+route.query.tName+" \" " +" --- 结算任务"
        const taskId=ref(Number(route.params.taskId))
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
            console.log('initialize')
            allReports.value=await getReportListOfTask(taskId.value)
            allReports.value.sort((a, b)=>{
                if(a.averageScore!=b.averageScore){
                    return b.averageScore-a.averageScore
                }else{
                    return b.assessPeople-a.assessPeople
                }
            })
            handlePageChange(1)
            console.log(reportTable.reports)
        }
        function handlePageChange(pageIndex){
            reportTable.pageIndex=pageIndex
            reportTable.reports=allReports.value.slice((pageIndex-1)*reportTable.pageSize, (pageIndex-1)*reportTable.pageSize+reportTable.pageSize)
        }
        return {
            taskName,
            taskId,
            reportTable,
            allReports,
            goBack,
        }
    }
}
</script>

<style scoped>
.el-divider--horizontal{
    margin-top: 1em;
    margin-bottom: 1em;
    width: 100%;
}
.card{
    width: 12.5em;
    height: 18em;
    margin: 0.8em;
}
.my_container{
  border-radius: 1em;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 40em;
  overflow: auto;
  background-color:rgb(253, 242, 231);
}
</style>

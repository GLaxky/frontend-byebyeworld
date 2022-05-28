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
            <ReportWithMoneyVue></ReportWithMoneyVue>
        </template>
        <template v-else>
            <ReportWithMoneyVue></ReportWithMoneyVue>
            <el-scrollbar>
                <template v-for="(item,index) in reportTable.reports" :key="item.index">

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
        
        function initialize(){
            
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
</style>
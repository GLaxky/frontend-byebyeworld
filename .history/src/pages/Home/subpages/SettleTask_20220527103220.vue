<template>
    <div>
        <el-page-header :icon="ArrowLeft" :content="taskName"  @back="goBack" class='backHead'/>
        <template v-if="allReports.length==0">
            <el-empty description="没有工人接受您的任务" class="empty"></el-empty>
        </template>
        <template v-else>
            <el-scroollbar>
                <template v-for="(item,index) in ReportTable.table" :key="item.index">

                </template>
            </el-scroollbar>
        </template>
    </div>
</template>

<script>
import router from '../../../router'
import { useRoute } from 'vue-router'
import { reactive } from 'vue'
// import Report from '../../../interface/Report'

export default{
    setup(){
        const route=useRoute()
        const taskName='\" '+route.query.tName+" \" " +" --- 结算任务"
        const taskId=ref(Number(route.params.taskId))
        const reportTable=reactive({
            reports: [],
            pageIndex: 1,
            pageSize: 12,
        })
        const allReports=ref<[]>([])
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

</style>
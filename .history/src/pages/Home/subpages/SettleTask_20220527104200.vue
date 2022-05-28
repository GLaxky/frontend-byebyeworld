<template>
    <div>
        <el-page-header :icon="ArrowLeft" :content="taskName"  @back="goBack" class='backHead'/>
        <el-card>
            项目状态
            任务接受情况：10/12
            报告提交情况：10/12
            悬赏总金额：100元
        </el-card>
        <template v-if="allReports.length==0">
            <el-empty description="没有工人接受您的任务" class="empty"></el-empty>
        </template>
        <template v-else>
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

</style>
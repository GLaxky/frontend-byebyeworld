<template>
    <div>
        <el-page-header :icon="ArrowLeft" content="修改报告"  @back="goBack" class='backHead'/>
        <template id="container">

            <el-scrollbar id="newReport">
                <ReportEdit :oldReportInfo="report" v-if="report" @changePageState="changepage"></ReportEdit>
            </el-scrollbar>
            <el-scrollbar id="oldReport">

                <template v-if="pageState===1">
                    <ReportInfoCard :reportInfo="report" cardTitle="您的旧报告"  v-if="report"></ReportInfoCard>
                </template>
                <template v-else-if="pageState===0">

                </template>
                <template v-else-if="pageState===2">
                    <el-scrollbar class="box-card-right" style="height: 40em;">
                        <el-card>
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
            </el-scrollbar>
        </template>
    </div>
    
</template>

<script lang="ts">
import {useRoute} from 'vue-router';
import Report from "../../../interface/Report"
import ReportEdit from '../../../components/ReportEdit.vue'
import ReportInfoCard from "../../../components/ReportInfoCard.vue";
import { toNumber } from '@vue/shared';
import { onMounted, reactive, ref } from 'vue';
import { getReportsDetail } from '../../../api/subpages/ReportList';
import { ElMessage } from 'element-plus';
import router from '../../../router';
export default{
    setup() {
        const route=useRoute()
        const reportId=toNumber(route.params.reportId)
        const taskId=toNumber(route.query.taskId)
        let report=ref<Report>(null)
        const pageState=ref(1);
        const similarReports=ref<Report[]>([])
        onMounted(async ()=>{
            report.value =await getReportsDetail(reportId)
            report.value.projectId=taskId
        })

        function changepage(res){
            console.log(res)
            if((typeof(res)=== 'string')&& res=="success"){
                pageState.value=1
                router.back()
            }else if(typeof(res)==='string'&&res==="faild"){
                ElMessage.error('提交失败')
            }else{
                similarReports.value=res.list
                pageState.value=2
            }
        }
        const goBack=()=>{
            router.back()
        }
        
        return {
            report,
            pageState,
            similarReports,
            changepage,
            goBack,
        };
    },
    components: { ReportEdit, ReportInfoCard },
    // method:{
    //     changepage(res){
    //         console.log('res')
    //     }
    // }
}

</script>

<style scoped>
#container{
    display: flex;
    height: 40em;
}
#oldReport{
    flex-basis: 45%;
    height: 40em;
}
#newReport{
    flex-basis: 55%;
    box-sizing: border-box;
    border-style: double;
    border-width: 0.5em;
    border-color: blanchedalmond;
    margin-right: 2em;
    height: 40em;
}
.backHead{
    margin-bottom: 1.5em;
    min-width: 90%;
    border-radius: 1em;
    box-shadow: 0.1em 0.25em 0.1em rgb(252, 208, 128);
}
</style>
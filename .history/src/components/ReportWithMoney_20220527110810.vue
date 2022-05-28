<template>
    <div>
        <el-card>

        </el-card>
        <el-dialog>
            <template v-if="reportInfo.haveSubmittedReport">
                <el-empty description="报告还尚未提交"></el-empty>
            </template>
            <template v-else>
                <report-info-card class="box-card" :report-info="reportInfo" card-title="报告详情">
                </report-info-card>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ReportInfoCard from "./ReportInfoCard.vue";

export default defineComponent({
    name:'ReportWithMoney',
    components:{ReportInfoCard,}
    props:{
        reportInfo:{
            type :Object,
            default(){
                let res={
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
                return res
            }
        }
    },
    setup(props, ctx){
        const dialog=ref(false)
        return {

        }
    }
})
</script>

<style scoped>

</style>
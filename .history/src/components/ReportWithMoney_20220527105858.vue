<template>
    <div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
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

    }
})
</script>

<style scoped>

</style>
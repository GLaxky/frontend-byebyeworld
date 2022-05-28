<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" class="card" shadow="hover" @click="dialog=true">
            <el-image class="image" :src="reportInfo.bugImgs[0]" fit="scale-down">
                <template #error>
                    <div class="image-slot">
                        <el-image
                        src="https://img.tukuppt.com/png_preview/00/06/02/Ci3mfMQItP.jpg!/fw/780"
                        />
                    </div>
                </template>
            </el-image>

            <div style="padding: 10px">
                <span>
                    <el-icon><avatar /></el-icon>{{reportInfo.workerName}}
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content='"报告平均得分: "+reportInfo.assessPeople+"人已评分"'
                        placement="top"
                    >
                        <template v-if="reportInfo.averageScore==-1">
                            <el-avatar class="score"> 无 </el-avatar>
                        </template>
                        <template v-else>
                            <el-avatar class="score"> {{reportInfo.averageScore}} </el-avatar>
                        </template>

                    </el-tooltip>
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="你给的评分"
                        placement="top"
                    >
                        <template v-if="reportInfo.score==-1">
                            <el-avatar class="score"> 无 </el-avatar>
                        </template>
                        <template v-else>
                            <el-avatar class="score"> {{reportInfo.score}} </el-avatar>
                        </template>
                    </el-tooltip>
                </span>
                <div class="bottom">
                    <template v-if="reportInfo.haveSubmittedReport">
                        <div class="submitted">该工人已完成报告</div>
                        <template v-if="reportInfo.score===-1">
                            <el-button type="warning" plain round size="small" @click.stop="assess(index)">写评价</el-button>
                        </template>

                    </template>
                    <template v-else>
                        <div class="unsubmitted">该工人未完成报告</div>
                    </template>
                </div>
                <el-divider content-position="center">
                    <template #default>
                        <span style="padding:0">设置奖金：</span>
                    </template>
                </el-divider>
                <div class="cash" @click.stop>
                    <el-input-number
                        style="display: flex;"
                        v-model="num"
                        :min="1"
                        :max="10"
                        :precision="2"
                        size="small"
                    />
                </div>
            </div>
        </el-card>
        <el-dialog v-model="dialog">
            <template v-if="reportInfo.haveSubmittedReport">
                <el-empty description="报告还尚未提交"></el-empty>
            </template>
            <template v-else>
                <report-info-card :report-info="reportInfo" card-title="报告详情">
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
    components:{ReportInfoCard,},
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
                    cash:0,
                }
                return res
            }
        }
    },
    setup(props, ctx){
        const dialog=ref(false)
        const num=ref(1.00)

        function cancelBubble(e){
            console.log(e.target)
        }
        return {
            dialog,
            num,
            cancelBubble
        }
    }
})
</script>

<style scoped>
.image {
  height: 13em;
  background-color: whitesmoke;
}
.score{
    background-color: orange;
    height: 2em;
    width: 2em;
    margin: 0.1em;
}
.submitted {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-size: 13px;
  color: rgb(80, 184, 80);
}
.unsubmitted{
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    font-size: 13px;
    color: red;
}

.bottom {
  margin-top: 2px;
  line-height: 12px;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}
.cash{
    /* display: inline-flex; */
    display: inline;
    /* margin: 0.5em; */
    /* padding: 0.1em; */
}
.el-divider--horizontal{
    padding: 0em;
    margin-top: 1em;
    margin-bottom: 1em;
    width: 100%;
}
.el-divider__text{
    padding: 0;
}
</style>
<!-- <style>
.el-divider__text{
    padding: 0;
}
</style> -->
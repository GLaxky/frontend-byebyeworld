<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" class="card" shadow="hover" @click="dialogForDetail=true">
            <el-image class="image" :src="reportInfo.bugImgs[0]" fit="scale-down">
                <template #error>
                    <div class="image-slot">
                        <el-image
                        src="https://img.tukuppt.com/png_preview/00/06/02/Ci3mfMQItP.jpg!/fw/780"
                        />
                    </div>
                </template>
            </el-image>

            <div style="padding: 8px">
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
                            <el-button type="warning" style="margin-left:1em" plain round size="small" @click.stop="dialogForAccess=true">写评价</el-button>
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
                        :min="0"
                        :max="maxCash"
                        :precision="2"
                        size="small"
                    />
                </div>
            </div>
        </el-card>
        <el-dialog v-model="dialogForDetail">
            <template v-if="!reportInfo.haveSubmittedReport">
                <el-empty description="报告还尚未提交"></el-empty>
            </template>
            <template v-else>
                <report-info-card :report-info="reportInfo" card-title="报告详情">
                </report-info-card>
            </template>
        </el-dialog>
        <el-dialog v-model="dialogForAccess">
            <el-card>
                <el-form
                    label-position="top"
                    label-width=""
                    :model="evaluationForm"
                    style=""
                >
                    <el-form-item label="测试报告总体上完成了发包方的测试要求">
                        <el-slider v-model="evaluationForm.item1" show-input show-stops :step="0.5" :max="5" @change="handleChange" />
                    </el-form-item>
                    <el-form-item label="bug描述简洁明白、易于理解">
                        <el-slider v-model="evaluationForm.item2" show-input show-stops :step="0.5" :max="5" @change="handleChange" />
                    </el-form-item>
                    <el-form-item label="bug截图直观、清晰地展现了bug的表现情况">
                        <el-slider v-model="evaluationForm.item3" show-input show-stops :step="0.5" :max="5" @change="handleChange" />
                    </el-form-item>
                    <el-form-item label="bug复现步骤撰写详细，方便他人进行复现">
                        <el-slider v-model="evaluationForm.item4" show-input show-stops :step="0.5" :max="5" @change="handleChange" />
                    </el-form-item>
                    <el-form-item label="测试设备型号、规格描述完整">
                        <el-slider v-model="evaluationForm.item5" show-input show-stops :step="0.5" :max="5" @change="handleChange" />
                    </el-form-item>
                    <el-form-item label="为测试待测应用设计了测试用例套件【例如Junit等】，且套件能较为准确地定位bug所在地">
                        <el-slider v-model="evaluationForm.item6" show-input show-stops :step="0.5" :max="5" @change="handleChange" />
                    </el-form-item>
                    <el-form-item label="附加：对bug的出现进行了分析并给出相应解决方案">
                        <el-slider v-model="evaluationForm.item7" show-input show-stops :step="0.5" :max="1" @change="handleChange"  />
                    </el-form-item>
                    <el-form-item label="总分">
                            <el-rate
                                v-model="evaluateScore"
                                disabled
                                allow-half
                                show-score
                                text-color="#ff9900"
                                score-template="{value} 总分"
                            />
                    </el-form-item>
                    <el-form-item label="留言/评论">
                        <el-input v-model="evaluationForm.comment" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>


            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogForAccess = false" type="warning" plain>返回</el-button>
                    <el-button type="warning" @click="submitAssession"
                        >提交评价
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, reactive, ref, watch } from "vue";
import { assessReport } from "../api/subpages/ReportList";
import Project from "../interface/Project";
import ReportInfoCard from "./ReportInfoCard.vue";

export default defineComponent({
    name:'ReportWithMoney',
    components:{ReportInfoCard, },
    emits:['refresh', 'update'],
    props:{
        reportIndex:{ 
            type: Number,
            default: 0,
        },
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
        },
        maxCash:{
            type: Number,
            default: 1.00
        },
        defaultCash:{
            type: Number,
        }
    },
    setup(props, ctx){
        const dialogForDetail=ref(false)
        const dialogForAccess=ref(false)
        const evaluationForm=reactive({
            item1: 0,
            item2: 0,
            item3: 0,
            item4: 0,
            item5: 0,
            item6: 0,
            item7: 0,
            comment: ''
        })
        console.log(props)
        const evaluateScore=ref(0)
        const num=ref(props.defaultCash)
        const submitAssession=()=>{
            assessReport(props.reportInfo.reportId, evaluateScore.value ,evaluationForm.comment).then((res)=>{
                if(res==='success'){
                    ElMessage.success("成功提交！")
                    dialogForAccess.value=false
                    ctx.emit('refresh')
                }else{
                    ElMessage.error("提交出错！")
                }
            })
        }
        const handleChange=()=>{
            evaluateScore.value=(evaluationForm.item1+evaluationForm.item2+evaluationForm.item3+
            evaluationForm.item4+evaluationForm.item5+evaluationForm.item6)/6+evaluationForm.item7
            evaluateScore.value=evaluateScore.value>5?5:evaluateScore.value
            evaluateScore.value=Number(evaluateScore.value.toFixed(2))
        }
        watch(num,(newVal,oldVal)=>{
            ctx.emit('update', newVal, props.reportIndex)
            
        })
        return {
            dialogForDetail,
            dialogForAccess,
            evaluationForm,
            evaluateScore,
            num,
            handleChange,
            submitAssession,
            // cancelBubble
        }
    }
})
</script>

<style scoped>
.image {
    width: 100%;
    height: 10em;
    background-color: whitesmoke;
}
.score{
    background-color: orange;
    height: 2em;
    width: 2em;
    margin: 0.4em;
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
    /* display: inline; */
    /* margin: 0.5em; */
    /* padding: 0.1em; */
    padding-left: 1.5em;
}
.el-divider--horizontal{
    padding: 0em;
    margin-top: 1em;
    margin-bottom: 1em;
    width: 100%;
}
</style>
<style>
.el-divider__text{
    padding: 0;
    font-weight: bold;
}
</style>
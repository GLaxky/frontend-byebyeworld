<template>
    <div v-loading="loading">
        <el-page-header :icon="ArrowLeft" :content="taskName"  @back="goBack" class='backHead'/>
        <template v-if="ReportTable.table.length==0">
            <el-empty description="目前还没有工人接受该任务~" class="empty"></el-empty>
        </template>
        <template v-else>
            <el-scrollbar class="my_container">
                <template v-for="(item,index) in ReportTable.table" :key="item.index">
                    <template v-if="(userId===item.workerId)">
                        <el-card :body-style="{ padding: '0px' }" class="myCard" shadow="hover" @click="checkReport(index)">

                            <el-image class="image" :src="item.bugImgs[0]" fit="scale-down">
                                <template #error>
                                <div class="image-slot">
                                    <el-image
                                    src="https://img.tukuppt.com/png_preview/00/06/02/Ci3mfMQItP.jpg!/fw/780"
                                    />
                                </div>
                                </template>
                            </el-image>
                            <div style="padding: 10px">
                                <span><el-icon><edit-pen /></el-icon>我：{{item.workerName}}</span>
                                <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    :content='"报告平均得分-"+item.assessPeople+"人已评分"'
                                    placement="top"
                                >
                                    <el-avatar class="score"> {{item.averageScore==-1?'无':item.averageScore}} </el-avatar>
                                </el-tooltip>
                                <div class="bottom">
                                    <template v-if="item.haveSubmittedReport">
                                        <div class="submitted">您已完成报告</div>
                                        <el-button type="warning" plain round size="small" @click.stop="goToEditReport(index)">修改报告</el-button>
                                    </template>
                                    <template v-else>
                                        <div class="unsubmitted">您还未完成报告</div>
                                        <el-button type="warning" plain round size="small" @click.stop="goToSubmitReportWithoutRef">提交报告</el-button>
                                    </template>
                                </div>
                            </div>
                        </el-card>
                    </template>
                    <template v-else>
                        <el-card :body-style="{ padding: '0px' }" class="card" shadow="hover" @click="checkReport(index)">
                            <el-image class="image" :src="item.bugImgs[0]" fit="scale-down">
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
                                    <el-icon><avatar /></el-icon>{{item.workerName}}
                                    <el-tooltip
                                        class="box-item"
                                        effect="dark"
                                        :content='"报告平均得分: "+item.assessPeople+"人已评分"'
                                        placement="top"
                                    >
                                        <template v-if="item.averageScore==-1">
                                            <el-avatar class="score"> 无 </el-avatar>
                                        </template>
                                        <template v-else>
                                            <el-avatar class="score"> {{item.averageScore}} </el-avatar>
                                        </template>

                                    </el-tooltip>
                                    <el-tooltip
                                        class="box-item"
                                        effect="dark"
                                        content="你给的评分"
                                        placement="top"
                                    >
                                        <template v-if="item.score==-1">
                                            <el-avatar class="score"> 无 </el-avatar>
                                        </template>
                                        <template v-else>
                                            <el-avatar class="score"> {{item.score}} </el-avatar>
                                        </template>
                                    </el-tooltip>
                                </span>
                                <div class="bottom">
                                    <template v-if="item.haveSubmittedReport">
                                        <div class="submitted">该工人已完成报告</div>
                                        <template v-if="item.score===-1">
                                            <el-button type="warning" plain round size="small" @click.stop="assess(index)">写评价</el-button>
                                        </template>

                                    </template>
                                    <template v-else>
                                        <div class="unsubmitted">该工人未完成报告</div>
                                    </template>

                                </div>
                            </div>
                        </el-card>
                    </template>
                </template>
            </el-scrollbar>
        </template>

        <el-pagination
            small
            background
            layout="total, prev, pager, next"
            :current-page="ReportTable.pageIndex"
            :page-size="ReportTable.pageSize"
            :total="pageTotalForReport"
            @current-change="handlePageChange"
        >
        </el-pagination>

        <el-dialog v-model="dialogForCheckReport" >
            <template v-if="!ReportTable.table[idx].haveSubmittedReport">
                <el-empty description="报告还尚未提交"></el-empty>
            </template>
            <template v-else>
                <report-info-card class="box-card" :report-info="ReportTable.table[idx]" card-title="报告详情">
                </report-info-card>
            </template>

            <template #footer>
                <span class="dialog-footer">
                    <template v-if="identity===2&&myReport&&!myReport.haveSubmittedReport&&ReportTable.table[idx]&&userId!=ReportTable.table[idx].workerId&&ReportTable.table[idx].haveSubmittedReport">
                        <el-button @click="goToSubmitReportWithRef" type="warning">我要引用此报告</el-button>
                    </template>

                    <el-button @click="dialogForCheckReport = false" type="warning" plain>返回</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="dialogForEvaluateReport" >
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
                                v-model="sum"
                                disabled
                                allow-half
                                show-score
                                text-color="#ff9900"
                                score-template="{value} 总分"
                            />
                    </el-form-item>
                </el-form>
            </el-card>


            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogForEvaluateReport = false" type="warning" plain>返回</el-button>
                    <el-button type="warning" @click="submitAssession"
                        >提交评价
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import router from '../../../router/index'
import {assessReport, getReportListOfTask} from '../../../api/subpages/ReportList'
import Report from '../../../interface/Report'
import { ElForm, ElMessage } from 'element-plus'
import ReportInfoCard from '../../../components/ReportInfoCard.vue'

const loading=ref(false)
const route=useRoute()
const taskName='\" '+route.query.tName+" \" " +" --- 报告广场"
const dialogForCheckReport=ref(false)
const dialogForEvaluateReport=ref(false)
const pageTotalForReport=ref(0)
const taskId=ref(Number(route.params.taskId))
const idx=ref(0)
const identity=ref(JSON.parse(localStorage.getItem('identity')))
// const isWorker=ref(JSON.parse(localStorage.getItem('identity'))===2)
const userId = ref(JSON.parse(localStorage.getItem('userId')))
// console.log(identity.value===2)

// loading.value=true;
const myReport=ref<Report>()
const allReportData=ref<Report[]>()
const ReportTable=reactive({
    table: [],
    pageIndex: 1,
    pageSize: 12,
})
const evaluationForm=reactive({
    item1: 0,
    item2: 0,
    item3: 0,
    item4: 0,
    item5: 0,
    item6: 0,
    item7: 0,
})
const sum=ref(0)

onMounted(()=>{
    loading.value=true;
    // console.log(taskId.value)
     getReportListOfTask(taskId.value).then((res)=>{
        allReportData.value=res
        allReportData.value.forEach((element, index)=>{
            if(element.workerId===userId.value){
                myReport.value=element
            }
        })
        pageTotalForReport.value=res.length
        ReportTable.table=allReportData.value.slice(ReportTable.pageIndex-1, ReportTable.pageIndex-1+ReportTable.pageSize)
        loading.value=false
    })

})

const goBack=()=>{
    router.back()
}

const checkReport=(index:number)=>{
    idx.value=index
    // console.log(idx.value)
    dialogForCheckReport.value=true
}

const assess=(index:number)=>{
    idx.value=index
    dialogForEvaluateReport.value=true
}

const submitAssession=()=>{
    assessReport(ReportTable.table[idx.value].reportId, sum.value).then((res)=>{
        if(res==='success'){
            ElMessage.success("成功提交！")
            dialogForEvaluateReport.value=false
            reflesh()
        }else{
            ElMessage.error("提交出错！")
        }
    })
}

  // 分页导航
  const handlePageChange = (val) => {
      console.log(val)
      ReportTable.pageIndex = val;
      ReportTable.table=allReportData.value.slice((val-1)*ReportTable.pageSize,val*ReportTable.pageSize);
  };

const handleChange=()=>{
    sum.value=(evaluationForm.item1+evaluationForm.item2+evaluationForm.item3+
        evaluationForm.item4+evaluationForm.item5+evaluationForm.item6)/6+evaluationForm.item7
    sum.value=sum.value>5?5:sum.value
    sum.value=Number(sum.value.toFixed(2))
}

const goToSubmitReportWithoutRef=()=>{
    router.push({
      path: '/submitReport/'+taskId.value,
      query:{
          refRId: 0
      }
    })
}

const goToSubmitReportWithRef=()=>{
    router.push({
      path: '/submitReport/'+taskId.value,
      query:{
          refRId: ReportTable.table[idx.value].reportId,
        //   refReportInfo: ReportTable.table[idx.value],
      }
    })
}

const reflesh=(()=>{
    loading.value=true;
    // console.log(taskId.value)
     getReportListOfTask(taskId.value).then((res)=>{
        allReportData.value=res
        allReportData.value.forEach((element, index)=>{
            if(element.workerId===userId.value){
                myReport.value=element
            }
        })
        pageTotalForReport.value=res.length
        ReportTable.table=allReportData.value.slice(ReportTable.pageIndex-1, ReportTable.pageIndex-1+ReportTable.pageSize)
        loading.value=false
    })
  })

const goToEditReport=function(index:number){
    console.log(ReportTable.table[index].reportId)
    router.push({
        path: '/redoSubmit/'+ReportTable.table[index].reportId,
        query:{
            // taskId: taskId.value
            taskInfo: ReportTable.table[index].reportId
        }
    })
}
</script>

<style scoped>
.score{
    background-color: orange;
    height: 2em;
    width: 2em;
    margin: 0.1em;
}
.empty{
    border-radius: 1em;
    background-color:rgb(253, 242, 231);
}
.backHead{
    margin-bottom: 1.5em;
    min-width: 90%;
    border-radius: 1em;
    box-shadow: 0.1em 0.25em 0.1em rgb(252, 208, 128);
}
.item {
  margin-top: 0px;
  margin-left: 0px;
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
.card{
    display: inline-block  ;
    width: 12.5em;
    height: 18em;
    margin: 0.8em;
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
  justify-content: space-between;
  align-items: center;
}

.image {
  height: 13em;
  background-color: whitesmoke;
}
.myCard{
    display: inline-block  ;
    width: 12.5em;
    height: 18em;
    margin: 0.8em;
    border-color: red;
    border-style: dashed;
    border-width: 0.1em;
}
.el-rate__decimal i {
  position: absolute !important;
}
</style>
<style>
.el-rate__decimal  {
  position: absolute !important;
}
</style>

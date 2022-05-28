<template>
  <div v-loading="loading">

    <el-page-header :icon="ArrowLeft" :content="taskName"  @back="goBack" class='backHead'/>
  <div class="question-container">

<!--    提问-->
    <el-card class="box-card" v-if="userIsWorker===2">
      <template #header>
        <div class="card-header">
          <span>提问</span>
          <el-button class="button" text @click="submitQues()">提交问题</el-button>
        </div>
      </template>

      <el-input
          v-model="textarea"
          autosize
          type="textarea"
          placeholder="请输入你的问题吧~~"

      />
         </el-card>



  </div>

    <div class="answer-container">

      <el-card class="box-card"  v-for="(question,index) in QuestionTable.table " :key="index">



        <template #header>
          <div class="card-header">
            <div class="question-data"><span style=" color: deepskyblue;"><el-icon size="13px"><Flag /></el-icon> Q: </span> {{ question.question }}</div>
            <el-button class="data-button" disabled type="info" plain>{{question.questionTime}}</el-button>
            <el-button size="small" type="success" disabled  plain v-if="!(question.answer==null)">已回答</el-button>
            <el-button size="small" type="danger" disabled  plain v-else>未回答</el-button>

          </div>
        </template>

   <div  class="text item">
        <div  v-if="question.answer==null">
          <div  v-if="userIsWorker===1">
          <span style="color: crimson"><el-icon size="12px"><Medal /></el-icon>
            A: </span>该问题暂无回答,请您进行回答哦 (●'◡'●)
          </div>
          <div  v-else>
          <span style="color: crimson"><el-icon size="12px"><Medal /></el-icon>
            A: </span>该问题暂无回答,请您等待主人进行回答哦 ಥ_ಥ
          </div>
        </div>

        <div  v-else >
          <span style="color: green;" class="question-data">
          <el-icon size="12px"><Medal /></el-icon>
          A: </span> {{question.answer}}
        </div>
   </div>
        <div  v-if="!(question.answer==null)">
          回答时间：
          <el-button  class="data-button" disabled type="info" plain>{{question.answerTime}}</el-button>

        </div>

        <div  v-if="question.answer==null&&userIsWorker===1">
          <el-input  v-if="show===index"
              v-model="textarea1"
              autosize
              type="textarea"
              placeholder="请输入你的回答吧~~"

          />

         <el-button v-if="show!==index" class="submit-button" @click="showInput(question.id,index)">点击进行回答 </el-button>
          <el-button v-else class="submit-button" @click="postAnswer(question.id,index)">提交回答 </el-button>

        </div>


      </el-card>

    </div>
    <!--    <template v-if="ReportTable.table.length==0">-->
<!--      <el-empty description="目前还没有工人接受该任务~" class="empty"></el-empty>-->
<!--    </template>-->
<!--    <template v-else>-->
<!--      <el-scrollbar class="my_container" >-->
<!--        <template v-for="(item,index) in ReportTable.table" :key="item.index">-->

<!--         -->
<!--        </template>-->
<!--      </el-scrollbar>-->
<!--    </template>-->

<!--    <el-pagination-->
<!--        small-->
<!--        background-->
<!--        layout="total, prev, pager, next"-->
<!--        :current-page="ReportTable.pageIndex"-->
<!--        :page-size="ReportTable.pageSize"-->
<!--        :total="pageTotalForReport"-->
<!--        @current-change="handlePageChange"-->
<!--    >-->
<!--    </el-pagination>-->



  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
let userIsWorker=ref(JSON.parse( localStorage.getItem('identity')))
let show=ref(-1)
import { ref, reactive, onMounted } from 'vue'
import router from '../../../router/index'
import {getQuestion, submitAnswer, submitQuestion} from "../../../api/subpages/Discuss";
import {ElMessage} from "element-plus";

//文本内容
const textarea = ref('')
const textarea1 = ref('')
const route=useRoute()
const taskName='\" '+route.query.tName+" \" " +" --- 问答区"
const taskId=ref(Number(route.params.taskId))


const QuestionTable=reactive({
  table: [],
  pageIndex: 1,
  pageSize: 12,
})



const submitQues=()=>{
  // console.log(textarea)
  // console.log(taskId)
  submitQuestion(taskId.value,textarea.value).then(
      (res)=>{
        if(res==='success'){
          ElMessage.success("成功提交！")
          window.location.reload()
        }else{
          ElMessage.error("提交出错！")
        }
      }
  )


}

const showInput=(id,index)=>{
console.log(index)
  show.value=index

}
const postAnswer=(id,index)=>{
  console.log(id)
  submitAnswer(taskId.value,id,textarea1.value).then(
      (res)=>{
        if(res==='success'){
          ElMessage.success("成功提交！")
          window.location.reload()
        }else{
          ElMessage.error("提交出错！")
        }
      }
  )

}
getQuestion(taskId.value).then(
    (res)=>{
      // console.log(res)


      let  len=res.length;
      for (let i=0;i<len;i++) {
        let mesItem=res[i];

        let oldTime = (new Date(mesItem.questionTime)).getTime();
        let curTime = new Date(oldTime);
        mesItem.questionTime  = curTime.toLocaleString()
        if(mesItem.answerTime==null){}else {
         oldTime = (new Date(mesItem.answerTime)).getTime();
         curTime = new Date(oldTime);
        mesItem.answerTime  = curTime.toLocaleString()
        }
        let newmes=[]
        // newmes.push(mesItem)
        QuestionTable.table.push(mesItem)
        // QuestionTable.table.push(newmes)
        console.log(QuestionTable.table)
      }
      QuestionTable.table.reverse()



    }
)


const goBack=()=>{
  router.back()
}




</script>

<style scoped>
.question-container,
.answer-container{
  margin: 30px;
}

.data-button{
}
.submit-button{
  margin-top: 2%;
}
.question-data{
  width: 80%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {

}
</style>

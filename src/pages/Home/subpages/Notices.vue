<template>
  <div>

    <el-page-header :icon="ArrowLeft" content="通知"  @back="goBack" class='backHead'/>

    <div  class="my_container">
      <div class="demo-collapse">
        <!--    <span class="intro"></span>-->
        <!--    <el-scrollbar class="container"  height="50em" v-loading="loading">-->


        <!--    </el-scrollbar>-->
        <div class="container">
          <el-tabs v-model="message">
            <el-tab-pane :label="`未完成的消息(${state.unfinish.length})`" name="first">
              <el-table :data="state.unfinish" :show-header="false" style="width: 100%">
                <el-table-column>
                  <template #default="scope">
                    <span class="message-title" >{{scope.row.mes1.subMes1}}</span>
                    <span class="message-title subMesColor" v-if="scope.row.mes1.flag">{{scope.row.mes1.subMes2}}</span>
                    <span class="message-title" v-if="scope.row.mes1.flag" >{{scope.row.mes1.subMes3}}</span>
                    <span class="message-title messageColor" >{{scope.row.mes2}}</span>
                    <span class="message-title">{{scope.row.mes3}}</span>
                  </template>
                </el-table-column>

                <!--          <el-table-column prop="date" width="180"></el-table-column>-->
                <el-table-column width="200">
                  <template #default="scope">
                    <div class="time-container">
                      <el-button class="data-button" disabled type="info" plain>{{scope.row.date}}</el-button>
                      <el-button class="time-button" disabled type="info" plain>{{scope.row.time}}</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="120">
                  <template #default="scope">
                    <el-button size="small" @click="handleJump(scope.row.taskInfo)">去看看吧</el-button>
                  </template>
                </el-table-column>
              </el-table>

            </el-tab-pane>
            <el-tab-pane :label="`已完成的消息(${state.finish.length})`" name="second">
              <template v-if="message === 'second'">
                <el-table :data="state.finish" :show-header="false" style="width: 100%">
                  <el-table-column>
                    <template #default="scope">
                      <span class="message-title" >{{scope.row.mes1.subMes1}}</span>
                      <span class="message-title subMesColor" v-if="scope.row.mes1.flag">{{scope.row.mes1.subMes2}}</span>
                      <span class="message-title" v-if="scope.row.mes1.flag" >{{scope.row.mes1.subMes3}}</span>
                      <span class="message-title messageColor" >{{scope.row.mes2}}</span>
                      <span class="message-title">{{scope.row.mes3}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="200">
                    <template #default="scope">
                      <div class="time-container">
                        <el-button class="data-button" disabled type="info" plain>{{scope.row.date}}</el-button>
                        <el-button class="time-button" disabled type="info" plain>{{scope.row.time}}</el-button>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column width="120">
                    <template #default="scope">
                      <el-button size="small" type="success" disabled  plain @click="handleJump(scope.row.taskInfo)">已完成</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>

          </el-tabs>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, reactive } from "vue";
import {getNotices} from "../../../api/subpages/GetNotice";
import router from '../../../router/index'
const message = ref("first");
const state = reactive({
  unfinish: [
  ],
  finish: [
  ]
});


getNotices().then((res)=>{
  let  len=res.length;
  for (let i=0;i<len;i++){
    let mesItem=res[i];
    let oldTime=(new Date(mesItem.createTime)).getTime();
    let curTime = new Date(oldTime);
    let date= curTime.toLocaleString().split(' ')[0]
    let time = curTime.toLocaleString().split(' ')[1]
    console.log("时间"+date+" " +time);
    let mes=null;
    if(mesItem.type===1||mesItem.type===3){
      mes= {
        date:  date,
        time: time,
        mes1:{
          flag:true,
          subMes1: ( (mesItem.detail.split('+')[0]).split('#')[0]).split("<p>")[0],
          subMes2:"\""+ ( (mesItem.detail.split('+')[0]).split('#')[0]).split("<p>")[1]+"\"",
          subMes3: ( (mesItem.detail.split('+')[0]).split('#')[0]).split("<p>")[2],
        },
        mes2: "\""+ ( mesItem.detail.split('+')[0]).split('#')[1]+"\"",
        mes3: ( mesItem.detail.split('+')[0]).split('#')[2],
        taskId: mesItem.taskId,
        taskInfo:{
          taskId: mesItem.taskId,
          taskName:mesItem.detail.split('+')[1]
        }
      }

    }else {
      mes= {
        date:  date,
        time: time,
        mes1:{
          flag:false,
          subMes1: ( (mesItem.detail.split('+')[0]).split('#')[0]),
        },
        mes2: "\""+ ( mesItem.detail.split('+')[0]).split('#')[1]+"\"",
        mes3: ( mesItem.detail.split('+')[0]).split('#')[2],
        taskId: mesItem.taskId,
        taskInfo:{
          taskId: mesItem.taskId,
          taskName:mesItem.detail.split('+')[1]
        }
      }
    }


    if (mesItem.state==0){
      state.unfinish.push(mes)
    }else {
      state.finish.push(mes)
    }
  }
  state.unfinish.reverse()
  state.finish.reverse()
  // console.log(res);
})
const handleJump = (taskInfo) => {
  // console.log("jump:taskid"+taskid);

  router.push({
    path: '/reportList/'+taskInfo.taskId,
    query:{
      tName: taskInfo.taskName
    }
  })

};
const goBack=()=>{
  router.back()
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.backHead{
  margin-bottom: 1.5em;
  min-width: 90%;
  border-radius: 1em;
  /*box-shadow: 0.1em 0.25em 0.1em rgb(252, 208, 128);*/
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
.data-button{
  width: 80px;
}
.time-button{
  width: 80px;
}
.time-container{
  width: 280px;
  display: flex;
  margin-right: 100px;

}
.container{
  margin: 0.5em;
  min-height:50em;
}
.intro {
  display: block;
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.small_container{
  padding: 1em;
  width: 90%;
  text-align: center;
  font-style: italic;
  background-color: rgba(255, 248, 235, 0.6);
  box-shadow:0.5em 0.5em 0.25em 0.25em #ccc ;
  border-radius: 1em;
}
.messageColor{
  color: #b88230;
}
.subMesColor{
  color: deepskyblue;
}
</style>

<style>
.el-collapse-item__header {
  display: flex;
  align-items: center;
  height: auto;
  line-height: var(--el-collapse-header-height);
  background-color: var(--el-collapse-header-bg-color);
  color: var(--el-collapse-header-text-color);
  cursor: pointer;
  border-bottom: 1px solid var(--el-collapse-border-color);
  font-size: var(--el-collapse-header-font-size);
  font-weight: 500;
  transition: border-bottom-color var(--el-transition-duration);
  outline: 0;
}

.message-title {
  cursor: pointer;
}

.handle-row {
  margin-top: 30px;
}

</style>

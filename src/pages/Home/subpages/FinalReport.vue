<template>
  <div>
    <!-- <h1>Echarts图表</h1> -->
    <el-dropdown size="large" split-button type="warning">
    <span class="el-dropdown-link">
      点击选择项目
      <!-- <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon> -->
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="(task,index) of projectsList" :key="task.index">
          <el-dropdown-item @click="changeProject(index)">{{task.projectName}}</el-dropdown-item>
        </template>
        <template v-if="empty">
            <el-dropdown-item>无项目</el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
    <el-card class="chart">
      <template v-if="empty">
      <el-empty description="您还未发布项目">
          
        </el-empty>
        
      </template>
      <template v-else>
        <div id="myChart" style="" v-loading="loading" ></div>
      </template>
    </el-card>
    
    <el-dialog v-model="dialogVisible">
        <template v-if="graph.nodes[index].category===0">
          <report-info-card :report-info="graph.nodes[index].report" cardTitle="报告详情">
          </report-info-card>
        </template>
        <template v-else>
          <el-empty description="该工人还未提交报告" />
        </template>
        
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">返回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
	
</template>

<script lang="ts">
// 引入echarts
import * as echarts from 'echarts'
import {onMounted, reactive, ref} from "vue";
import { getReportNodes, getreportsRelations, getSimilarityRelations } from '../../../api/subpages/FinalReport';
import { getTaskListReleasedByMe } from '../../../api/subpages/MyReleasedTask';
import ReportInfoCard from '../../../components/ReportInfoCard.vue';
import Project from '../../../interface/Project';
export default {
    components: { ReportInfoCard },
    setup() {
      const dialogVisible=ref(false)
      const empty=ref(false)
      const loading = ref(false);
      const userId=ref(JSON.parse(localStorage.getItem("userId")))
      let myChart
      const graph = reactive({
          nodes: [],
          links: [],
          categories: [
              {
                  name: "已提交报告",
                  // icon: "image://../image/file.png"
              },
              {
                  name: "未提交报告",
                  // icon: "image://../image/chunk.png"
              },
          ]
      });
      const projectsList=ref<Project[]>([])
      const reflesh=async ()=>{
        loading.value = true;
        projectsList.value= await getTaskListReleasedByMe(userId.value)
        await getreportsRelations(projectsList.value[index.value].projectId).then((res) => {
              graph.links = res;
        });
        await getSimilarityRelations(projectsList.value[index.value].projectId).then(res=>{
            graph.links.push(...res)
        })
        // console.log(graph.links)
        await getReportNodes(projectsList.value[index.value].projectId).then((res) => {
            graph.nodes = res;
        });
        myChart.clear()
        //  myChart = echarts.init(document.getElementById("myChart"));
          // 设置图表配置项,可以直接从Echarts的示例中，将配置项复制下来后放入下列的myChart.setOption()中实现图表的样式更换
          let option = {
              color: ["#fac858", "#c45656", "#9564bf", "#bd407e", "#e5a214"],
              title: {
                  text: "报告关联、相似度可视化",
                  subtext: "项目全称："+projectsList.value[index.value].projectName,
                  top: "top",
                  left: "left"
              },
              tooltip: {
                  trigger: "item",
                  formatter: function (params) {
                      if (params.dataType == "node") {
                          // console.log(params.data)
                          if(params.data.category==0){
                            return "工人@" + params.data.report.workerName + " 提交的报告";
                          }else{
                            return "工人@" + params.data.report.workerName + "尚未提交报告";
                          }
                      }
                      else {
                          // console.log(params)
                          if(params.data.linkType==='similarity'){
                            return '报告相似度 : '+Number(params.data.similarity*100).toFixed(2)+"%"
                          }
                          else if (params.data.lineStyle.color == "#95d475") {
                              return "拓展引用";
                          }
                          else {
                              return "反驳引用";
                          }
                      }
                      // return params.data.source + '引用' + params.data.target;
                  }
              },
              legend: [
                  {
                    // selectedMode: 'single',
                    right:'right',
                    data: graph.categories.map(function (a) {
                        return a.name;
                    })
                  },
              ],
              series: [
                  {
                      name: "报告详情",
                      type: "graph",
                      layout: "force",
                      symbolSize: 30,
                      itemStyle: {
                          borderType: "double",
                          borderColor: "#eebe77",
                          borderWidth: 5
                      },
                      data: graph.nodes,
                      links: graph.links,
                      categories: graph.categories,
                      roam: true,
                      edgeSymbol: ["circle", "arrow"],
                      // edgeSymbolSize: [4, 10],
                      edgeLabel: {
                          fontSize: 20
                      },
                      label: {
                          // position: 'right',
                          // show: true
                          formatter: () => {
                              return "报告\n节点";
                          }
                      },
                      force: {
                          repulsion: 1000
                      },
                      lineStyle: {
                          // opacity: 0.9,
                          width: 3,
                          curveness: 0.1
                      },
                  }
              ]
          };
          myChart.setOption(option);
          window.onresize = function () {
              myChart.resize();
          };
          myChart.on("click", clickEvent);
        loading.value = false;
      }
      onMounted(async () => {
          // loading.value = true;
          projectsList.value= await getTaskListReleasedByMe(userId.value)
          if(projectsList.value.length===0){
            empty.value=true
            return
          }
          // await getreportsRelations(projectsList.value[0].projectId).then((res) => {
          //     graph.links = res;
          // });
          // await getSimilarityRelations(projectsList.value[0].projectId).then(res=>{
          //     graph.links.push(res)
          // })
          // await getReportNodes(projectsList.value[0].projectId).then((res) => {
          //     graph.nodes = res;
          // });
          

          // loading.value = false;
          index.value=0
          myChart = echarts.init(document.getElementById("myChart"));
          reflesh()
      });

      const changeProject=(idx:number)=>{
        index.value=idx
        reflesh()
      }
      const index=ref(0)
      const clickEvent=(param)=>{
        if (param.dataType == "node") {
          let arrayIndex = param.dataIndex;
          index.value=arrayIndex
          dialogVisible.value=true
        }
      }

      return {
          loading,
          dialogVisible,
          index,
          graph,
          projectsList,
          changeProject,
          empty
      };
    },
    
}
</script>

<style scoped>
.chart{
  background-color:  #fdf6ec;
}
#myChart{
  width:90%;
  height:50em;
  margin:auto;
  border-style: dotted;
  border-color: white;
  
  background-color:    #fff;
}
</style>


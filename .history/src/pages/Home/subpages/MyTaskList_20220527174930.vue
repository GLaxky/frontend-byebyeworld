<template>
    <el-card>
        <!-- 一定要是的div为唯一父节点 -->
      <div>

        <el-tooltip
          class="box-item"
          effect="light"
          content="刷新以获取最新信息"
          placement="right-start"
        >
          <el-button type="warning" circle plain small @click="reflesh" >
            <el-icon><refresh /></el-icon>
          </el-button>
        </el-tooltip>
        <el-table
            :data="tableData.table"
            :default-sort="{ prop: 'date', order: 'descending' }"
            style="width: 100%"
            v-loading="loading"
            height="450"
            stripe
        >
            <el-table-column
            fixed="left"
            prop="submitted"
            label="提交情况"
            width="100"
            :filters="[
                { text: '已提交', value: true },
                { text: '未提交', value: false },
            ]"
            :filter-method="filterSubmitted"
            filter-placement="bottom-end"
            >
            <template #default="scope">
                <el-tag
                :type="scope.row.submitted ? 'success' : 'danger'"
                disable-transitions
                effect="plain"
                >{{ scope.row.submitted ? '已提交' : '未提交'}}</el-tag
                >
            </template>
            </el-table-column>
            <el-table-column
            prop="tag"
            label="标签"
            width="100"
            :filters="[
                { text: '未开始', value: '未开始' },
                { text: '正在进行', value: '正在进行' },
                { text: '已截止', value: '已截止' },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
            >
            <template #default="scope">
                <el-tag
                :type="chooseTagType(scope.row.tag)"
                disable-transitions
                >{{ scope.row.tag }}</el-tag
                >
            </template>
            </el-table-column>
            <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip />
            <el-table-column prop="peopleSituation" label="需要人数" />
            <!-- <el-table-column prop="creatorName" label="项目发起人" /> -->
            <el-table-column prop="costSum" width="120" label="悬赏总金额(￥)" />
            <el-table-column label="项目关键词" width="250" show-overflow-tooltip>
              <template #default="scope">
                <el-tag color=" #f8e3c5" type="warning">{{tableData.table[scope.$index].language}}</el-tag>
                <el-tag color=" #f8e3c5" type="warning">{{tableData.table[scope.$index].area}}</el-tag>
                <el-tag color=" #f8e3c5" type="warning">{{tableData.table[scope.$index].device}}</el-tag>
                <el-tag color=" #f8e3c5" type="warning">{{tableData.table[scope.$index].environment}}</el-tag>
                <el-tag color=" #f8e3c5" type="warning">{{tableData.table[scope.$index].type}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button
                    type="text"
                    size="small"
                    @click="checkInfo(scope.$index, scope.row)"
                    >
                    <el-icon><pointer /></el-icon>查看详情
                    </el-button>
                    <br>
                    <el-button
                    type="text"
                    size="small"
                    @click="goToReportPlayground(scope.$index)"
                    >
                    <el-icon><pointer /></el-icon>浏览报告广场
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            small
            background
            layout="prev, pager, next"
            :current-page="tableData.pageIndex"
            :page-size="tableData.pageSize" 
            :total="pageTotal" 
            @current-change="handlePageChange"
          >
          </el-pagination>
        </div>
      </div>

      <template v-if="tableData.table.length!==0">
        <el-dialog v-model="dialogForCheck">
            <template #title>项目名称：{{tableData.table[idx].projectName}}</template>
              <el-card>
                <el-descriptions  :column="3" border  direction="vertical">
                  <el-descriptions-item label="创建人" label-align="" align="center"
                    >{{tableData.table[idx].creatorName}}</el-descriptions-item
                  >
                  <el-descriptions-item label="任务状态" label-align="" align="center"
                    >{{tableData.table[idx].tag}}</el-descriptions-item
                  >
                  <el-descriptions-item label="报名情况" label-align="" align="center"
                    >{{tableData.table[idx].peopleSituation}}</el-descriptions-item
                  >
                  
                  <el-descriptions-item label="测试类型" label-align="" align="center"
                    ><el-tag size="large" color=" #f8e3c5" type="warning">{{tableData.table[idx].type}}</el-tag>
                    </el-descriptions-item
                  >
                  <el-descriptions-item label="测试方式" label-align="" align="center"
                    ><el-tag size="large" color=" #f8e3c5" type="warning">{{tableData.table[idx].method}}</el-tag>
                    </el-descriptions-item
                  >
                  <el-descriptions-item label="测试使用语言" label-align="" align="center"
                    ><el-tag size="large" color=" #f8e3c5" type="warning">{{tableData.table[idx].language}}</el-tag>
                    </el-descriptions-item
                  >
                  <el-descriptions-item label="测试使用环境" label-align="" align="center"
                    ><el-tag size="large" color=" #f8e3c5" type="warning">{{tableData.table[idx].environment}}</el-tag>
                    </el-descriptions-item
                  >
                  <el-descriptions-item label="测试使用设备" label-align="" align="center"
                    ><el-tag size="large" color=" #f8e3c5" type="warning">{{tableData.table[idx].device}}</el-tag>
                    </el-descriptions-item
                  >
                  <el-descriptions-item label="测试领域" label-align="" align="center"
                    ><el-tag size="large" color=" #f8e3c5" type="warning">{{tableData.table[idx].area}}</el-tag>
                    </el-descriptions-item
                  >
                  <el-descriptions-item label="难度" label-align="" align="center"
                    ><el-tag size="large" type="danger">{{tableData.table[idx].rank}}</el-tag>
                    </el-descriptions-item
                  >
                  <el-descriptions-item label="开始时间" label-align="" align="center"
                    ><el-tag size="large">{{tableData.table[idx].startDate}}</el-tag>
                    </el-descriptions-item
                  >
                  <el-descriptions-item label="结束时间" label-align="" align="center"
                    ><el-tag size="large">{{tableData.table[idx].endDate}}</el-tag>
                    </el-descriptions-item
                  >
                  
                  <el-descriptions-item label="测试文档&&应用可执行文件" label-align="" align="center"
                    >
                    <el-link  type="primary" :href="tableData.table[idx].testAndAppFile"><el-icon><mouse /></el-icon>点击下载</el-link>
                  </el-descriptions-item
                  >

                  <el-descriptions-item label="项目介绍" label-align="" align="center" >
                    {{tableData.table[idx].projectIntro}}
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogForCheck = false">返回</el-button>
                </span>
            </template>
        </el-dialog>
      </template>
    </el-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted} from 'vue'
  import {getMyTaskList, submitMyReport} from '../../../api/subpages/MyTaskList'
  import Project from '../../../interface/Project'
  import router from '../../../router/index'

  const userId=localStorage.getItem('userId')
  const allTableData=ref([])
  const tableData=reactive({
    table: [],
      pageIndex: 1,
      pageSize: 10,
  })


  const filterTag = (value: string, row: Project) => {
    return row.tag === value
  }

  const filterSubmitted = (value: boolean, row: Project) => {
    return row.submitted === value
  }

  const chooseTagType =(tag: string)=>{
    if(tag==="正在进行"){
      return 'warning'
    }else if(tag==="已截止"){
      return 'info'
    }else{
      return ''
    }
  }

    const tmpTitle=ref("")   
    let idx = ref(0)


  const dialogForCheck = ref(false)

  const checkInfo= (index, row) => {
      idx.value = index
      tmpTitle.value=row.projectName
      dialogForCheck.value = true
      // console.log(idx)
  }

  const pageTotal = ref(0);
  // 分页导航
  const handlePageChange = (val) => {
    // console.log(val)
    tableData.pageIndex = val;
    tableData.table=allTableData.value.slice((val-1)*tableData.pageSize,val*tableData.pageSize);
  };

  const loading=ref(false)
  onMounted(()=>{
    loading.value=true;
    getMyTaskList(userId).then((res)=>{
      allTableData.value=res
      pageTotal.value=res.length
      console.log(pageTotal.value)
      tableData.table=allTableData.value.slice(tableData.pageIndex-1,tableData.pageIndex-1+tableData.pageSize)
      loading.value=false;
    })
    
  })

  const reflesh=(()=>{
    loading.value=true;
    getMyTaskList(userId).then((res)=>{
      allTableData.value=res
      pageTotal.value=res.length
      tableData.table=allTableData.value.slice(tableData.pageIndex-1,tableData.pageIndex-1+tableData.pageSize)
      loading.value=false;
    })
  })

  const goToReportPlayground=(index:number)=>{
    idx.value = index
    router.push({
      path: '/reportList/'+tableData.table[idx.value].projectId,
      query:{
        tName: tableData.table[idx.value].projectName
      }
    })
  }

</script>
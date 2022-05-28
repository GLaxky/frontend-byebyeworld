 <template>

  <div>
    <el-card>
      
      <el-tooltip
        class="box-item"
        effect="light"
        content="刷新以获取最新信息"
        placement="top"
      >
        <el-button type="warning" circle plain small @click="reflesh" >
          <el-icon><refresh /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="light"
        content="定义筛选条件"
        placement="right"
      >
        <el-button type="warning" circle small @click="dialogForFilter=true" >
          <el-icon><Search /></el-icon>
        </el-button>
      </el-tooltip>
      <el-dialog v-model="dialogForFilter"  title="选择筛选条件" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false"
        :show-close='false'>
        <el-card>
          <el-form>
            <el-form-item label="测试设备：" :model="filterForm">
              <el-radio-group v-model="filterForm.testDevice">
                <el-radio label="all" size="small">全选</el-radio>
                <el-radio label="PC" size="small">PC</el-radio>
                <el-radio label="移动端" size="small">移动端</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="测试环境：">
              <el-radio-group v-model="filterForm.testEnvironment">
                <el-radio label="all" size="small">全选</el-radio>
                <el-radio label="Windows" size="small">Windows</el-radio>
                <el-radio label="Linux" size="small">Linux</el-radio>
                <el-radio label="MacOS" size="small">MacOS</el-radio>
                <el-radio label="Android" size="small">Android</el-radio>
                <el-radio label="IOS" size="small">IOS</el-radio>
                <el-radio label="HormonesOS" size="small">HormonesOS</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="测试语言：">
              <el-radio-group v-model="filterForm.testLanguage">
                <el-radio label="all" size="small">全选</el-radio>
                <el-radio label="Java" size="small">Java</el-radio>
                <el-radio label="Python" size="small">Python</el-radio>
                <el-radio label="C" size="small">C</el-radio>
                <el-radio label="C++" size="small">C++</el-radio>
                <el-radio label="C#" size="small">C#</el-radio>
                <el-radio label="HTML" size="small">HTML</el-radio>
                <el-radio label="JS" size="small">JS</el-radio>
                <el-radio label="Scala" size="small">Scala</el-radio>
                <el-radio label="Go" size="small">Go</el-radio>
                <el-radio label="Ruby" size="small">Ruby</el-radio>
                <el-radio label="PHP" size="small">PHP</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="测试领域：">
              <el-radio-group v-model="filterForm.testDomain">
                <el-radio label="all" size="small">全选</el-radio>
                <el-radio label="前端" size="small">前端</el-radio>
                <el-radio label="后端" size="small">后端</el-radio>
                <el-radio label="操作系统" size="small">操作系统</el-radio>
                <el-radio label="数据库" size="small">数据库</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="测试类型：">
              <el-radio-group v-model="filterForm.testType">
                <el-radio label="all" size="small">全选</el-radio>
                <el-radio label="性能测试" size="small">性能测试</el-radio>
                <el-radio label="功能测试" size="small">功能测试</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="测试方式：">
              <el-radio-group v-model="filterForm.testMethod">
                <el-radio label="all" size="small">全选</el-radio>
                <el-radio label="黑盒测试" size="small">黑盒测试</el-radio>
                <el-radio label="白盒测试" size="small">白盒测试</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="项目难度：">
              <el-radio-group v-model="filterForm.difficulty">
                <el-radio label="all" size="small">全选</el-radio>
                <el-radio label="难" size="small">难</el-radio>
                <el-radio label="中" size="small">中</el-radio>
                <el-radio label="低" size="small">低</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-card>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="warning" @click="submitFilter">确认</el-button>
                <!-- <el-button @click="dialogForFilter = false">返回</el-button> -->
            </span>
        </template>
      </el-dialog>
      <!-- <el-card> -->
        <el-table
          :data="tableData.table"
          :default-sort="{ prop: 'date', order: 'descending' }"
          style="width: 100%"
          v-loading="loading"
          height="450"
          stripe
        >
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
          <el-table-column prop="rank" label="项目难度"/>
          <el-table-column prop="projectName" label="项目名称"  show-overflow-tooltip/>
          <el-table-column prop="peopleSituation" label="需要人数" />
          <el-table-column prop="costSum" label="悬赏总金额￥" width="100" show-overflow-tooltip/>
          <el-table-column label="项目关键词" width="250" show-overflow-tooltip>
            <template #default="scope">
              <el-tag color=" #f8e3c5" type="warning">{{tableData.table[scope.$index].language}}</el-tag>
              <el-tag color=" #f8e3c5" type="warning">{{tableData.table[scope.$index].area}}</el-tag>
              <el-tag color=" #f8e3c5" type="warning">{{tableData.table[scope.$index].device}}</el-tag>
              <el-tag color=" #f8e3c5" type="warning">{{tableData.table[scope.$index].environment}}</el-tag>
              <el-tag color=" #f8e3c5" type="warning">{{tableData.table[scope.$index].type}}</el-tag>

            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="项目发起人" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button
                size="small"
                type="text"
                @click="checkInfo(scope.$index, scope.row)"
              >
                <el-icon><pointer /></el-icon>点击查看详情
              </el-button>
              
              <template v-if="identity==2">
                <br>
                <el-button
                  size="small"
                  type="text"
                  @click="acceptTask(scope.$index, scope.row)"
                  :disabled="tableData.table[scope.$index].accepted"
                >
                  <el-icon><pointer /></el-icon>参加项目
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      <!-- </el-card> -->
      

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
    </el-card>

      <template v-if="tableData.table.length!==0">
        <el-dialog v-model="dialogForCheck" >
          <template #title>项目名称: {{tableData.table[idx].projectName}}</template>
          <el-card>
            <el-descriptions  :column="3" direction="vertical" border>
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
                  ><el-tag size="large"  color=" #f8e3c5" type="warning">{{tableData.table[idx].type}}</el-tag>
                  </el-descriptions-item
                >
                <el-descriptions-item label="测试方式" label-align="" align="center"
                  ><el-tag size="large"  color=" #f8e3c5" type="warning">{{tableData.table[idx].method}}</el-tag>
                  </el-descriptions-item
                >
                <el-descriptions-item label="测试使用语言" label-align="" align="center"
                  ><el-tag size="large"  color=" #f8e3c5" type="warning">{{tableData.table[idx].language}}</el-tag>
                  </el-descriptions-item
                >
                <el-descriptions-item label="测试使用环境" label-align="" align="center"
                  ><el-tag size="large"  color=" #f8e3c5" type="warning">{{tableData.table[idx].environment}}</el-tag>
                  </el-descriptions-item
                >
                <el-descriptions-item label="测试使用设备" label-align="" align="center"
                  ><el-tag size="large"  color=" #f8e3c5" type="warning">{{tableData.table[idx].device}}</el-tag>
                  </el-descriptions-item
                >
                <el-descriptions-item label="测试领域" label-align="" align="center"
                  ><el-tag size="large"  color=" #f8e3c5" type="warning">{{tableData.table[idx].area}}</el-tag>
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
                <template v-if="identity==0">
                  <el-descriptions-item label="测试文档与待测应用文件" label-align="" align="center" 
                    >
                    <el-link  type="primary" :href="tableData.table[idx].testAndAppFile" ><el-icon><mouse /></el-icon>点击下载</el-link>
                  </el-descriptions-item
                  >
                </template>
                <el-descriptions-item label="项目介绍" label-align="" align="center" >
                  {{tableData.table[idx].projectIntro}}
                </el-descriptions-item>
              </el-descriptions>
          </el-card>
              
          <!-- </div> -->
            
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogForCheck = false">返回</el-button>
                </span>
            </template>
        </el-dialog>
      </template>

  </div>

</template>


<script lang="ts" setup>
  import { ref,onMounted, reactive} from 'vue'
  import {getTheWholeList, acceptAssignment, getFilteredTaskList} from '../../../api/subpages/PlayGround'
  import Project from '../../../interface/Project';
  import { ElMessage } from 'element-plus'


  const filterForm=reactive({
    difficulty: 'all',
    testDevice: 'all',
    testDomain: 'all',
    testEnvironment: 'all',
    testLanguage: 'all',
    testMethod: 'all',
    testType: 'all',
  })
  const dialogForFilter=ref(false)
  let identity=ref()
  identity.value=localStorage.getItem('identity')
  const loading=ref(false)
  const allTableData=ref([])
  const tableData=reactive({
    table: [
    ],
    pageIndex: 1,
    pageSize: 10,
  })

  const filterTag = (value: string, row: Project) => {
    return row.tag === value
  }

  const chooseTagType =(tag: string)=>{
    if(tag==="正在进行"){
      return 'success'
    }else if(tag==="已截止"){
      return 'info'
    }else{
      return ''
    }
  }

  let idx = ref(0)
  const dialogForCheck = ref(false)

  const checkInfo= (index, row) => {
      idx.value = index
      dialogForCheck.value = true
      console.log(idx)
  }

  onMounted(()=>{
    loading.value=true;
    getTheWholeList().then((res)=>{
      // console.log(res)
      allTableData.value=res
      pageTotal.value=res.length
      tableData.pageIndex=1
      tableData.table=allTableData.value.slice(tableData.pageIndex-1,tableData.pageIndex-1+tableData.pageSize)
      loading.value=false;
    })
  })

  const reflesh=(()=>{
    loading.value=true;
    getTheWholeList().then((res)=>{
      allTableData.value=res
      pageTotal.value=res.length
      tableData.pageIndex=1
      tableData.table=allTableData.value.slice(tableData.pageIndex-1,tableData.pageIndex-1+tableData.pageSize)
      loading.value=false;
    })
  })


  const pageTotal = ref(0);
  // 分页导航
  const handlePageChange = (val) => {
      // console.log(val)
      tableData.pageIndex = val;
      tableData.table=allTableData.value.slice((val-1)*tableData.pageSize,val*tableData.pageSize);
  };

  const acceptTask=(index, row)=>{
    idx.value=index
    if(tableData.table[index].tag==='已截止'){
      ElMessage.error("该项目已截止！无法参加")
      return
    }
    if(tableData.table[index].num>=tableData.table[index].sum){
      ElMessage.info("该项目已经满人~无法加入")
      return
    }
    loading.value=true;
    acceptAssignment(tableData.table[index].projectId).then((res)=>{
      if(res=="success"){
        ElMessage.success("成功加入项目！")
        tableData.table[index].accepted=true
        tableData.table[index].num++
        tableData.table[index].peopleSituation=tableData.table[index].num+'/'+tableData.table[index].sum
      }else{
        ElMessage.error("你已加入该项目，请不要重复加入")
      }
      loading.value=false
    })
  }

  function submitFilter(){
    // console.log(filterForm)
    loading.value=true
    let flag=false
    for(let item in filterForm){
      if(filterForm[item]!='all'){
        flag=true
      }
    }
    if(!flag){
      getTheWholeList().then((res)=>{
        allTableData.value=res
        pageTotal.value=res.length
        tableData.pageIndex=1
        dialogForFilter.value=false
        tableData.table=allTableData.value.slice(tableData.pageIndex-1,tableData.pageIndex-1+tableData.pageSize)
        loading.value=false;
      })
      return
    }
    getFilteredTaskList(filterForm).then((res)=>{
      allTableData.value=res
      pageTotal.value=res.length
      tableData.pageIndex=1
      tableData.table=allTableData.value.slice(0,tableData.pageSize)
      loading.value=false;
      dialogForFilter.value=false
    })
  }
</script>

<style>
</style>

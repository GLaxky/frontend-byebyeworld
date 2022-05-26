<template>
    <div>
        <div id="head">
            <el-dropdown id="dropdown"  size="default" split-button type="warning">
                <span class="el-dropdown-link">
                    {{projectName}}
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <template v-for="(task,index) of projectList" :key="task.projectId">
                            <el-dropdown-item @click="changeProject(index)">{{task.projectName}}</el-dropdown-item>
                        </template>
                        <template v-if="projectList&&projectList.length===0">
                            <el-dropdown-item disabled>您未发布任务</el-dropdown-item>
                        </template>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <div id="select">
                <span>排序：</span>
                <el-select v-model="orderMethod" placeholder="选择排序方式">
                    <el-option-group v-for="group in options" :key="group.lable" :label="group.label">
                        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-option-group>
                </el-select>
            </div>

        </div>

        <div id="reportList" v-loading="loading">
            <template v-if="reportList">
                <template v-for="(item, index) in pagesReports.reports" :key="index">
                    <ReportItemVue :reportDetail="item" class="reportItem"></ReportItemVue>
                </template>
                <template v-if="reportList.length===0">
                    <el-empty description="该任务目前未有工人提交报告" />
                </template>
            </template>


        </div>
        <div class="pagination">
            <el-pagination
            small
            background
            layout="prev, pager, next"
            :current-page="pagesReports.pageIndex"
            :page-size="pagesReports.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
            >
            </el-pagination>
        </div>
    </div>

</template>

<script lang="ts">
// import ReportItem from '../../../components/ReportItem.vue'
import ReportItemVue from '../../../components/reportItem.vue';
import {OrderBy, getOlderedReportList} from '../../../api/subpages/ReportSort'
import ReportWithTime from '../../../interface/ReportWithTime';
import { reactive, ref, watch } from 'vue';
import { getTaskListReleasedByMe } from '../../../api/subpages/MyReleasedTask';
import Project from '../../../interface/Project';
export default{
    setup(){
        const reportList=ref<ReportWithTime[]>(null)
        const loading=ref(false)
        const projectName=ref('点击选择项目')
        const orderMethod=ref(0)
        const curProjectId=ref(0)
        const pageTotal=ref(0)
        const userId=ref(JSON.parse(localStorage.getItem("userId")))
        const projectList=ref<Project[]>()
        const pagesReports=reactive({
            reports:[],
            pageIndex: 1,
            pageSize: 5,
        })
        interface OrderType{
            orderBy: OrderBy,
            isAsc: boolean
        }
        const orderMap:OrderType[]=[
            {
                orderBy: 'average_score',
                isAsc: false
            },
            {
                orderBy: 'average_score',
                isAsc: true
            },
            {
                orderBy: 'start_time',
                isAsc: true
            },
            {
                orderBy: 'start_time',
                isAsc: false
            },
            {
                orderBy: 'finish_time',
                isAsc: true
            },
            {
                orderBy: 'finish_time',
                isAsc: false
            },
        ]
        const options=[
            {
                label: '按照评分排序',
                options:[
                    {
                        label: '评分-从高到底',
                        value: 0,
                    },
                    {
                        label: '评分-从低到高',
                        value: 1,
                    }
                ]
            },
            {
                label: '按照接受任务时间排序',
                options:[
                    {
                        label: '接受任务时间-顺序',
                        value: 2,
                    },
                    {
                        label: '接受任务时间-逆序',
                        value: 3,
                    }
                ]
            },
            {
                label: '按照提交报告时间排序',
                options:[
                    {
                        label: '提交报告时间-顺序',
                        value: 4,
                    },
                    {
                        label: '提交报告时间-逆序',
                        value: 5,
                    }
                ]
            },
        ]

        // watch(orderMethod,())
        watch(orderMethod,(newVal, oldVal)=>{
            // console.log(oldVal)
            console.log(newVal)
            getRepotList(curProjectId.value, orderMap[newVal].orderBy, orderMap[newVal].isAsc)
        })
        function getRepotList(taskId:number, orderby:OrderBy, isAsc) {
            loading.value=true
            getOlderedReportList(taskId, orderby, isAsc).then((res)=>{
                // console.log(res)
                reportList.value=res
                pagesReports.reports=reportList.value.slice(pagesReports.pageIndex-1, pagesReports.pageIndex-1+pagesReports.pageSize)
                pageTotal.value=reportList.value.length
                pagesReports.pageIndex=1
                loading.value=false
            })
        }
        async function getProjectList(userId:number){
            projectList.value= await getTaskListReleasedByMe(userId)
            // console.log(projectList.value)
            if(projectList.value.length>0){
                changeProject(0)

            }else{
                projectName.value='您还没发布任务'
            }

        }
        function changeProject(index){
            curProjectId.value=projectList.value[index].projectId
            getRepotList(curProjectId.value, orderMap[0].orderBy, orderMap[0].isAsc)
            orderMethod.value=0
            projectName.value=projectList.value[index].projectName
        }

        function handlePageChange(val){
            pagesReports.pageIndex=val
            let tmp=(pagesReports.pageIndex-1)*pagesReports.pageSize
            pagesReports.reports=reportList.value.slice(tmp, tmp+pagesReports.pageSize)
            console.log(val)
            console.log(pagesReports.reports)
        }
        getProjectList(userId.value)
        // changeProject(0)
        // getRepotList(1, 'average_score')
        return {
            reportList,
            loading,
            pageTotal,
            options,
            orderMethod,
            projectList,
            projectName,
            pagesReports,
            getRepotList,
            changeProject,
            handlePageChange,
        }
    },
    components:{ReportItemVue},
}
</script>

<style scoped>
#head{
    display: flex;
    /* position: relative; */
}

#dropdown{
    /* position: absolute; */
    /* left: 1em; */
    width: 20em;
    flex-grow: 1;
}

#select{
    /* position: absolute; */
    /* right: 1em; */
    display: flex;
    justify-content:flex-end;
    align-items: center;
    flex-basis: 17em;
}
#reportList{
    /* position: absolute; */
    padding: 0.5em;
    margin-top: 0.5em;
    /* height: 105vh; */
    background-color: rgb(249, 245, 239);
}

.reportItem{
    margin: 0.5em;
}
</style>

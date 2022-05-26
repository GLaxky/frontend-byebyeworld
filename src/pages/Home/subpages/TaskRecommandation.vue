<template>
    <div>
        <span class="intro">根据你的偏好、活跃度为您推荐以下任务~</span>
        <el-card class="demo-collapse">
            
            <el-scrollbar class="container"  height="50em" v-loading="loading">
                <template v-if="recommandationList.length==0">
                    <el-empty description="oops~很抱歉，没有找到适合你的任务" />
                </template>
                <template v-else>
                    <el-collapse >
                        <template v-for="(item,index) in recommandationList" :key="item.index">
                            <el-collapse-item :name="index">
                                <template #title>
                                    <div>
                                        <el-icon><star-filled /></el-icon>
                                        <span class="myNote">
                                            {{item.projectName}}
                                        </span>
                                    </div>
                                    <div>
                                        <template v-for="tag in item.tags" :key="tag.index">
                                            <el-tag class="ml-2" type="warning" style="margin-left: 5px;">{{tag}}</el-tag>
                                        </template>
                                    </div>
                                    
                                </template>
                                <div class="small_container">
                                    <!-- <el-rate
                                    v-model="item.rank"
                                    disabled
                                    show-score
                                    text-color="#ff9900"
                                    score-template="{value} 难度分"
                                    /> -->
                                    <el-divider content-position="left"  border-style="dotted">项目难度</el-divider>
                                    <div>
                                        {{item.rank}}
                                    </div>
                                    <el-divider content-position="left"  border-style="dotted">创建者</el-divider>
                                    <div>
                                        {{item.creatorName}}
                                    </div>
                                    <el-divider content-position="left"  border-style="dotted">需要人数</el-divider>
                                    <div>
                                        {{item.peopleSituation}}
                                    </div>
                                    <el-divider content-position="left"  border-style="dotted">起止时间</el-divider>
                                    <div>
                                        {{item.startDate}} - {{item.endDate}}
                                    </div>
                                    <el-divider content-position="left"  border-style="dotted">项目简介</el-divider>
                                    <div>
                                        {{item.projectIntro}}
                                    </div>
                                    <el-button type="warning" round size="small" style="margin-top: 1em;" @click="acceptProject(index)">参与该项目</el-button>
                                </div>
                            </el-collapse-item>
                        </template>
                    </el-collapse>
                </template>
                
            </el-scrollbar>
            
        </el-card>
    </div>
    
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { acceptAssignment } from '../../../api/subpages/PlayGround';
import { getRecommendations } from '../../../api/subpages/TaskRecommendation';
import Recommandaton from '../../../interface/Recommandation'
import { ElMessage } from 'element-plus'

const recommandationList=ref<Recommandaton[]>([])
const userId=JSON.parse(localStorage.getItem('userId'))
const loading=ref(false)
const idx=ref(-1)

onMounted(()=>{
    loading.value=true
    getRecommendations(userId).then((res)=>{
        console.log(res)
        recommandationList.value=res
        loading.value=false;
    })
    
})

const acceptProject=(index:number)=>{
    idx.value=index
    acceptAssignment(recommandationList.value[idx.value].projectId).then((res)=>{
        if(res=="success"){
        ElMessage.success("成功加入项目！")
      }else{
        ElMessage.error("你已加入该项目，请不要重复加入")
      }
    })
}

</script>

<style scoped>

.container{
    margin: 0.5em;
    min-height:50em;
}
.intro {
  display: block;
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 1em;
}
.small_container{
    padding: 1em;
    width: 90%;
    text-align: center;
    font-style: italic;
    background-color: rgb(255, 248, 235, 0.6);
    box-shadow:0.5em 0.5em 0.25em 0.25em #ccc ;
    border-radius: 1em;
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

</style>
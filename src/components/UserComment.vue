<template>
    <el-card class="container">
        <div class="userName">
            @{{commentInfo.userName}}<span style="color: black;">: </span>
        </div>
        <p class="comment">
            {{commentInfo.comment==='默认评价'?'':commentInfo.comment}}
        </p>
        <div class="score">
            <span>评分: </span>
            <el-rate
            v-model="commentInfo.score"
            disabled
            show-score
            :colors="['#409eff', '#67c23a', '#FF9900']"
            />
        </div>
        
    </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Comment from "../interface/Comment";

export default defineComponent({
    props: {
        commentInfo:{
            type: Object,
            default(){
                let res:Comment={
                    userName: '无语',
                    comment: '圣诞节复活节韩国空军和刚开始的风格圣诞节复活节韩国空军和刚开始的风格圣诞节复活节韩国空军和刚开始的风格圣诞节复活节韩国空军和刚开始的风格圣诞节复活节韩国空军和刚开始的风格',
                    score: 3
                }
                return res
            }
        }
    },
    setup(props, ctx){
        
    }
})
</script>

<style scoped>
.comment{
    text-indent: 2em;
    margin-bottom: 1em;
}
.userName{
    color: blue;
    margin-bottom: 1em;
}
.score{ 
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.container{
    margin-bottom: 1em;
}
</style>
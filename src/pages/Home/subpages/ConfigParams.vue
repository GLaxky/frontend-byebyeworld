<template>
    <el-card  class="config_container">
        <template #header>
            <div class="card-header">
                <span style="font-size:x-large; font-weight: bolder; color:#F2AF58;">修改平台参数</span>
            </div>
        </template>
            <el-divider>
                <el-icon><tools /></el-icon>
                推荐算法权重
                <el-icon><tools /></el-icon>
            </el-divider>
            <el-row :gutter="2" align="middle"  justify="center">
                <el-col :span="20">
                    <span>测试语言偏好 x </span>
                    <el-input
                    v-model="form.language"
                    :min="0.01"
                    :max="0.99"
                    :step="0.01"
                    :precision="2"
                    size="small"
                    class="input_area"
                    placeholder="Please Input"
                    disabled
                    />
                    <span>+ 测试领域偏好 x </span>
                    <el-input
                    v-model="form.domain"
                    :min="0.01"
                    :max="0.99"
                    :step="0.01"
                    :precision="2"
                    size="small"
                    class="input_area"
                    disabled
                    />
                    <span>+ 测试方式偏好 x </span>
                    <el-input
                    v-model="form.method"
                    :min="0.01"
                    :max="0.99"
                    :step="0.01"
                    :precision="2"
                    size="small"
                    class="input_area"
                    disabled
                    />
                    
                    <span>+ 工人能力 x </span>
                    <el-input
                    v-model="form.ability"
                    :min="0.01"
                    :max="0.99"
                    :step="0.01"
                    :precision="2"
                    size="small"
                    class="input_area"
                    disabled
                    />
                    <span>+ 测试类型偏好 x </span>
                    <el-input
                    v-model="form.type"
                    :min="0.01"
                    :max="0.99"
                    :step="0.01"
                    :precision="2"
                    size="small"
                    class="input_area"
                    disabled
                    />
                </el-col>
                <el-col :span="4">
                    <el-button type="warning" plain size="small" @click="dialogForRecommendation = true">修改</el-button>
                </el-col>
            </el-row>
            <el-divider>
                <el-icon><tools /></el-icon>
                报告相似度算法权重
                <el-icon><tools /></el-icon>
            </el-divider>
            <el-row :gutter="2" align="middle" justify="center">
                
                <el-col :span="16">
                    <span>文本相似度 x </span>
                    <el-input-number
                    v-model="formForSimilarity.txt"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    :precision="2"
                    size="small"
                    disabled
                    />
                <span>+ 图像相似度 x </span>
                    <el-input-number
                    v-model="formForSimilarity.img"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    :precision="2"
                    size="small"
                    disabled
                    />
                </el-col>
                <el-col :span="2">
                </el-col>
                <el-col :span="2">
                    <el-button size="small" @click="dialogForSimilarity = true" plain type="warning">修改</el-button>
                </el-col>
            </el-row>
        <!-- </el-scrollbar> -->
        <el-dialog
            v-model="dialogForRecommendation"
            title="修改推荐算法权重"
        >
            <el-card>
                <el-form :model="form" label-width="120px">
                    <el-form-item label="测试语言偏好">
                        <el-input-number
                        v-model="form.language"
                        :min="0.01"
                        :max="0.99"
                        :step="0.01"
                        :precision="2"
                        size="small"
                        />
                    </el-form-item>
                    <el-form-item label="测试领域偏好">
                        <el-input-number
                        v-model="form.domain"
                        :min="0.01"
                        :max="0.99"
                        :step="0.01"
                        :precision="2"
                        size="small"
                        />
                    </el-form-item>
                    <el-form-item label="测试方式偏好">
                        <el-input-number
                        v-model="form.method"
                        :min="0.01"
                        :max="0.99"
                        :step="0.01"
                        :precision="2"
                        size="small"
                        />
                    </el-form-item>
                    <el-form-item label="工人能力">
                        <el-input-number
                        v-model="form.ability"
                        :min="0.01"
                        :max="0.99"
                        :step="0.01"
                        :precision="2"
                        size="small"
                        />
                    </el-form-item> 
                    <el-form-item label="测试类型偏好">
                        <el-input-number
                        v-model="form.type"
                        :min="0.01"
                        :max="0.99"
                        :step="0.01"
                        :precision="2"
                        size="small"
                        />
                    </el-form-item>
                
                </el-form>
            </el-card>
            
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogForRecommendation = false">返回</el-button>
                <el-button type="primary" @click="submitWeight"
                >提交修改</el-button
                >
            </span>
            </template>
        </el-dialog>

        <el-dialog
            v-model="dialogForSimilarity"
            title="修改相似度算法"
        >
            <!-- <el-select v-model="form.similarityMethrod" class="m-2" placeholder="Select" size="large">
                <el-option
                label="仅文本"
                value="txt"
                />
                <el-option
                label="仅图像"
                value="img"
                />
            </el-select> -->
            <el-card>
                <el-form :model="formForSimilarity" label-width="120px">
                    <el-form-item label="文本相似度">
                        <el-input-number
                        v-model="formForSimilarity.txt"
                        :min="0"
                        :max="1"
                        :step="0.01"
                        :precision="2"
                        size="small"
                        />
                    </el-form-item>
                    <el-form-item label="图像相似度">
                        <el-input-number
                        v-model="formForSimilarity.img"
                        :min="0"
                        :max="1"
                        :step="0.01"
                        :precision="2"
                        size="small"
                        />
                    </el-form-item>
                </el-form>

            </el-card>
            
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogForSimilarity = false">返回</el-button>
                <el-button type="primary" @click="submitSimilarity"
                >提交修改</el-button
                >
            </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import {reactive, ref, onBeforeUpdate, watch} from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import {getWeight, setWeight, getSimilarityMethod, setSimilarityMethod} from '../../../api/subpages/ConfigParams'
import ConfigParams from '../../../interface/ConfigParams'

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const loadingForSubmit=ref(false)
const dialogForSimilarity=ref(false)
const dialogForRecommendation=ref(false)

const form=reactive<ConfigParams>({
    ability: 0.15,
    domain: 0.25,
    language: 0.3,
    method: 0.2,
    type: 0.1,
})

const formForSimilarity=reactive(
    {
        txt: 1,
        img: 0
    }
)

watch(()=>formForSimilarity.txt,(newval, oldval)=>{
    formForSimilarity.img=1-newval
})

watch(()=>formForSimilarity.img,(newval, oldval)=>{
    formForSimilarity.txt=1-newval
})


getWeight().then((res)=>{
    form.ability=res.ability
    form.domain=res.domain
    form.language=res.language
    form.method=res.method
    form.type=res.type
})

getSimilarityMethod().then((res)=>{
    formForSimilarity.txt=res.txt
    formForSimilarity.img=res.img
})

onBeforeUpdate(()=>{
    console.log('onBeforeUpdate')
})

const rules = reactive({
    
})

const submitWeight=()=>{
    if(form.ability+form.domain+form.language+form.type+form.method!==1){
        ElMessage.info('合应该为1')
        reflesh()
        return
    }
    setWeight(form).then((res)=>{
        if(res==='success'){
            ElMessage.success('修改成功！')
            dialogForRecommendation.value=false
        }else{
            ElMessage.error('修改失败！')
        }
        reflesh()
    })
    
}

const submitSimilarity=()=>{
    setSimilarityMethod(formForSimilarity).then((res)=>{
        if(res==='success'){
            ElMessage.success('修改成功！')
            dialogForSimilarity.value=false
        }else{
            ElMessage.error('修改失败！')
        }
        reflesh()
    })
    
}

const reflesh=()=>{
    getWeight().then((res)=>{
        form.ability=res.ability
        form.domain=res.domain
        form.language=res.language
        form.method=res.method
        form.type=res.type
    })

    getSimilarityMethod().then((res)=>{
        console.log(res)
        formForSimilarity.txt=res.txt
        formForSimilarity.img=res.img
    })
}

</script>

<style scoped>
.input_area{
    width: 4em;
}
span{
    font-size: medium;
}
.config_container{
    /* width: 90%; */
    border-radius: 1em;
    /* box-shadow: 10px 10px 5px #ccc; */
    /* border-color:rgb(255, 206, 157);
    border-style: dashed; */
    /* padding: 2em; */
    overflow: auto;
}
.item_spam{
    width: 4em;
}
.card-header{
    display: flex;
    align-items: center;
    justify-content: center;
    
}
</style>
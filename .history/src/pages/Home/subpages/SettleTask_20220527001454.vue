<template>
    <div>
        <el-page-header :icon="ArrowLeft" :content="taskName"  @back="goBack" class='backHead'/>
    </div>
</template>

<script>
import router from '../../../router'
export default{
    setup(){
        function goBack(){
            router.back()
        }
        return {
            goBack
        }
    }
}
</script>

<style scoped>

</style>
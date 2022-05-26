<template>
    <div class="sidebar">

    <el-menu
    :default-active="onRoutes"
    class="el-menu-vertical-demo"
    :collapse="false" background-color="blanchedalmond"
    text-color="#c27e26" active-text-color="#ff6804"
    unique-opened router>
        <template v-for="item in items" :key="item.index">
            <!-- <template v-if="(item.forWorker===isAWorker)||item.force===true"> -->
            <template v-if="(item.forWho==identity )||item.force===true">
                <template v-if="item.subs">
                    <el-sub-menu :index="item.index">
                        <template #title>
                            <!-- <el-icon><wallet /></el-icon> -->
                            <!-- 动态导入图标的方法 -->
                            <el-icon :size="30">
                            <component
                                :is="item.icon"
                            ></component>
                            </el-icon>
                            <span>{{item.title}}</span>
                        </template>
                            <template v-for="subItem in item.subs" :key="subItem.index">

                                <el-menu-item :index="subItem.index">
                                    {{subItem.title}}
                                </el-menu-item>
                            </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" >
                        <!-- <el-icon v-html="item.icon"></el-icon> -->
                        <el-icon :size="30">
                        <component
                            :is="item.icon"
                        ></component>
                        </el-icon>

                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </template>
    </el-menu>
    </div>
</template>

<script setup>
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    const route = useRoute();
    let identity=localStorage.getItem('identity')
    console.log(identity)
    const items = [
        {
            force: true,
            icon: "flag",
            index: "/playground",
            title: "众包广场",
        },
        {
            force: false,
            forWho: 2,
            icon: "magicStick",
            index: "/taskRecommandation",
            title: "任务推荐",
        },
        {
            force: false,
            forWho: 0,
            icon: "setting",
            index: "/config",
            title: "修改网站参数",
        },
        {
            force: false,
            forWho: 2,
            icon: "wallet",
            index: "/myTaskList",
            title: "我的众包任务",
        },
        {
            force: false,
            forWho: 1,
            icon: "edit",
            index: "2",
            title: "管理众测任务",
            subs: [
                {
                    index: "/releasedTaskList",
                    title: "我的众测",
                },
                {
                    index: "/createNewTask",
                    title: "发布新的众测",
                },

            ],
        },
        {
            force: false,
            forWho: 1,
            icon: "data-line",
            title: "查看测试报告",
            index: '3',
            subs:[
                {
                    index: "/finalReport",
                    title: "项目报告可视化",
                },
                {
                    index: "/reportSort",
                    title: "项目报告一览",
                }
            ]
        },
    ]

    const onRoutes = computed(() => {
        return route.path;
    })

</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 75px;
    bottom: 0;
    width: 200px;
    overflow-y: scroll;
    background-color: #c27e26;
    background-color: blanchedalmond;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar > ul {
    height: 100%;
}
</style>

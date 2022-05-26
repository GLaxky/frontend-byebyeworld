<template>

  <article v-html="html" class="markdown-body"></article>


</template>

<script>

import showdown from 'showdown';
import "github-markdown-css"
// import "../assets/css/vue.css"
// import "../assets/css/sspai.css"
import {ref} from "vue";
export default {
name: "HelpDoc",
  setup(){
    let converter = new  showdown.Converter();
    let text="# ByeByeWorld项目启动文档\n" +
        "\n" +
        "### 团队名称：ByeByeWorld\n" +
        "\n" +
        "### 提交时间：2022年 2月 17日星期四\n" +
        "\n" +
        "### 团队组成人员：\n" +
        "\n" +
        "|  人员  |       角色       |                           工作职责                           | 备注 |\n" +
        "| :----: | :--------------: | :----------------------------------------------------------: | :--: |\n" +
        "| 林正顺 | 组长，后端工程师 | 分配开发任务和资源给团队成员，管理开发过程，控制开发进度，保证团队目标的一致性等，完成软件的后端开发 |      |\n" +
        "| 林威鹏 |    后端工程师    |   根据需求分析和架构设计来完成软件的后端具体设计和开发工作   |      |\n" +
        "| 李晓康 |    前端工程师    |   根据需求分析和架构设计来完成软件的前端具体设计和开发工作   |      |\n" +
        "| 吴圣鑫 |    前端工程师    |   根据需求分析和架构设计来完成软件的前端具体设计和开发工作   |      |\n" +
        "\n" ;
    converter.setOption("tables",true);
    let html = converter.makeHtml(text)

    return{
      html
    }

    },
}
</script>

<style  scoped>

</style>

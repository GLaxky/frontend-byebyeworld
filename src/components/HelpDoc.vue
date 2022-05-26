<template>

  <article v-html="html" class="markdown-body"></article>


</template>

<script>
import {getMdFiles} from "../api/subpages/getMdFile";
import showdown from 'showdown';
import "github-markdown-css"
// import "../assets/css/vue.css"
// import "../assets/css/sspai.css"
import {ref} from "vue";
export default {
name: "HelpDoc",
  setup(){
    let text;
    let html=ref("");
  getMdFiles().then(
      (res)=>{
        console.log(res)
        text=res;

        let converter = new  showdown.Converter();

        converter.setOption("tables",true);
         html.value = converter.makeHtml(text)
      }

  )


    return{
      html
    }

    },
}
</script>

<style  scoped>

</style>

<template>
  <div class="about">
    <my-header></my-header>
    <my-menu></my-menu>
    <div class="home-content-box">
      <el-scrollbar class="home-content">
        <router-view v-slot="{ Component }">
          <transition name="move" mode="out-in">
            <!-- <keep-alive :include="tagsList"> -->
            <component :is="Component" />
            <!-- </keep-alive> -->
          </transition>
        </router-view>
      </el-scrollbar>

<!--帮助文档抽屉-->
      <el-drawer v-model="drawer" title="帮助文档" size="50%">
        <template #default>
         <help-doc></help-doc>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button  type="primary" @click="cancelClick()">关闭</el-button>
          </div>
        </template>
<!--        <div>-->
<!--          <el-button @click="innerDrawer = true">Click me!</el-button>-->
<!--          <el-drawer-->
<!--              v-model="innerDrawer"-->
<!--              title="I'm inner Drawer"-->
<!--              :append-to-body="true"-->
<!--              :before-close="handleClose"-->
<!--          >-->
<!--            <p>_(:зゝ∠)_</p>-->
<!--          </el-drawer>-->
<!--        </div>-->
      </el-drawer>


    <div class="helpDoc" >
      <el-tooltip
          class="box-item"
          effect="dark"
          content="不懂怎么用？ 点击进入“帮助文档”让我来帮助你吧"
          placement="top-end"
      >
        <el-button size="large" type="primary" @click="showHelp()"  circle><el-icon  size="38px"><QuestionFilled /></el-icon></el-button>
      </el-tooltip>
    </div>

    </div>


  </div>

</template>

<script lang="ts">
import MyHeader from '../../components/MyHeader.vue'
import MyMenu from '../../components/MyMenus.vue'
import HelpDoc from "../../components/HelpDoc.vue";
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'


export default {

  components: {
    MyMenu,
    MyHeader,
    HelpDoc
  },

  setup() {

    const drawer = ref(false)
    const innerDrawer = ref(false)

    const showHelp= () => {
     drawer.value=true;
    }
    const  cancelClick=()=> {
      drawer.value = false
    }

    return{
      showHelp,
      drawer,
      innerDrawer,
      cancelClick
    }
//     const docStyle=document.documentElement.style;
//     docStyle.setProperty('--mouse-xIni','20px');
//     docStyle.setProperty('--mouse-yIni','20px');
//
//     document.addEventListener('mousedown',e=>{
//
//       //按下计算offset
//       // let rect1=e.target.getBoundingClientRect();
//       let offset={
//         left:e.clientX,
//         top:e.clientY
//       }
//       // console.log(offset)
//       // console.log(window.innerWidth)
//       // console.log(window.innerHeight)
//       // console.log(window.innerWidth-offset.left)
//       // console.log(window.innerHeight-offset.top)
//       // window.innerHeight
//       let newOffset={
//         left:0,
//         top: 0
//       }
//       // console.log(rect.left)
//       // console.log(rect.top)
//       // console.log(rect)
//       // console.log(offset)
//       //定义move函数
//       let moveFunc=function (e) {
//         // let rect=e.target.getBoundingClientRect();
//         // const docStyle=document.documentElement.style;
//         docStyle.setProperty('--mouse-x',(-offset.left+e.clientX)+'px');
//         docStyle.setProperty('--mouse-y',(-offset.top+e.clientY)+'px');
//
//         // console.log((offset.left-rect.left)+'px')
//         // console.log((offset.top-rect.top)+'px')
//         // offset.left=rect.left;
//         // offset.top=rect.top;
//         newOffset.left=(e.clientX);
//         newOffset.top=(e.clientY);
//         // console.log(newOffset)
//
//       }
//
//       document.addEventListener('mousemove',moveFunc);
//       document.addEventListener('mouseup',ev => {
//         docStyle.setProperty('--mouse-xIni',window.outerWidth-( newOffset.left)+'px');
//         docStyle.setProperty('--mouse-yIni',window.outerHeight-(newOffset.top)+'px');
//
//
//         document.removeEventListener('mousemove',moveFunc)
//       })
//
//     })
//


  },
}
</script>

<style>



.helpDoc{
  position: absolute;
  /*bottom: var(--mouse-xIni);*/
  /*right:  var(--mouse-yIni) ;*/
  bottom:30px;
  right: 30px;
  /*transform: translate(var(--mouse-x),var(--mouse-y));*/
  /*transform: translate(-130px,-130px)*/
}
.home-content-box {
  position: absolute;
  left: 200px;
  right: 0;
  top: 75px;
  bottom: 0;
  /* padding-bottom: 30px; */
  -webkit-transition: left .3s ease-in-out;
  transition: left .3s ease-in-out;
  background: #fffefe;
}

.home-content {
  width: auto;
  height: 100%;
  padding: 10px;
  /* overflow-y: scroll; */
  box-sizing: border-box;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #F2AF58;
  color: #FFF;
}
.el-pagination.is-background .el-pager li.active {
  color: #fff;
  cursor: default;
}
.el-pagination.is-background .el-pager li:hover {
  color: #F2AF58;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #F2AF58;
}
.el-pagination.is-background .el-pager li:not(.disabled).active:hover {
  background-color: #F2AF58;
  color: #FFF;
}

.pagination {
  margin: 20px 0;
  text-align: center;
}
</style>

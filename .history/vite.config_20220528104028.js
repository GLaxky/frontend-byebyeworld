import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    // port: '3000',
    // open: false, //自动打开
    // base: "./ ", //生产环境路径
    proxy: { // 本地开发环境通过代理实现跨域，生产环境 使用 nginx 转发
      // 正则表达式写法
      "/apis": {
        target: "http://172.31.14.32:8080/",
        // target: "http://47.103.75.231:8080/",
        // target: 'http://localhost:8080/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apis/, '')
        // rewrite:{
        //   '^/api':''
        // }
      },
    }
  },

})

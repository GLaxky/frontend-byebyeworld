import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data; boundary=----' + new Date().getTime()
axios.defaults.headers.get['Content-Type'] = 'multipart/form-data; boundary=----' + new Date().getTime()
axios.defaults.withCredentials = true


const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // baseURL: 'http://106.14.104.157:8080/',
    // baseURL: 'http://47.103.75.231:8080/',
    baseURL:'apis',
    timeout: 1000000,
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });

  export default service;

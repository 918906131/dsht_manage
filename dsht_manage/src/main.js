import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import axios from "axios";
import VueAxios from 'vue-axios'
Vue.prototype.$axios = axios;
Vue.use(VueAxios, axios)
Vue.use(ElementUI);
Vue.config.productionTip = false
 // 添加响应拦截器
 axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  //如果token失效,则让用户重新登录
  if (response.data.status === 400) {
      router.replace('/')
  }
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.url === '/login') {
      return config;
  }else{
      let token=sessionStorage.getItem('token');
      config.headers['token'] = token;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

new Vue({
  router,
  store,
  axios,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
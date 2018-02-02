// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import 'jquery'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import echarts from 'echarts'
import filter from './filter'

// http response 拦截器
axios.interceptors.response.use(

  response => {
    if(response.data.code == 9999) {
      delCookie('account');
      delCookie('power');
      delCookie('name');
      router.replace({
        path: '/',
        query: {redirect: router.currentRoute.fullPath} //从哪个页面跳转
      })
    }
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          delCookie('account');
          delCookie('power');
          delCookie('name');
          router.replace({
            path: '/',
            query: {redirect: router.currentRoute.fullPath}
          })
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  }
);


Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

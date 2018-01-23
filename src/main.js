// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import vueUploadComponent from 'vue-upload-component'
import axios from 'axios'
import store from './store/index'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import './style/normalize.css'
import 'swiper/dist/css/swiper.css'
// 图片懒加载
Vue.use(VueLazyLoad, {
  error: 'static/images/DefaultCover.png',
  loading: 'static/images/upgrade.gif'
})
// 300ms延迟
fastclick.attach(document.body)
// 轮播图
Vue.use(VueAwesomeSwiper)
// 上传组件
Vue.component('file-upload', vueUploadComponent)
// UI库
// 关闭生产模式下给出的提示
Vue.config.productionTip = false
// http
Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})

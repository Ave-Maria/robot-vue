import Vue from 'vue'
import Router from 'vue-router'
const index = () => import('@/pages/index')
const welcome = () => import('@/pages/welcome')
const test = () => import('@/pages/test')
Vue.use(Router)
let router = new Router({
  routes: [{
    path: '/',
    name: 'welcome',
    component: welcome
  },
  {
    path: '/index',
    name: 'index',
    component: index
  },
  {
    path: '/test',
    name: 'test',
    component: test
  }]
})

// 滚动位置
let scrollTop = function () {
  setTimeout(() => {
    document.body.scrollTop = 0
  }, 100)
}
// 页面前进/后退时，还原滚动位置
router.beforeEach(function (to, from, next) {
  next()
  scrollTop()
})
router.afterEach(function (to, from, next) {
  scrollTop()
})

export default router

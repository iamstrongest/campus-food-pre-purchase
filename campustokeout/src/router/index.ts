import { createRouter, createWebHistory } from 'vue-router'
import { localstroageUser } from '@/stores/user/localstroage.js'
import authority from './user/authority'
import routes from './routes';
import NProgress from 'nprogress'

import 'nprogress/nprogress.css'
// import {createVNode,render} from "vue"
// import loadingBar from '@/components/header/loadingBar.vue'
// const Vnode = createVNode(loadingBar);
// render(Vnode, document.body);


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 使每次点击跳转后，都回到顶部
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
})
router.beforeEach((to, from, next) => {
  const useLocalstroageUserStore = localstroageUser();
  const routeArr = authority;
  NProgress.start() // 进度条开始
  // Vnode.component?.exposed?.startLoading()
  if (routeArr.some(path => path == to.path)) {
    if (useLocalstroageUserStore.isLogin) {
      next();
    } else {
      next("/user/login");
    }
  } else {
    next();
  }
})
  // NProgress.start() // 进度条开始
router.afterEach((to, from) => {
  NProgress.done() // 进度条结束
   // Vnode.component?.exposed?.endLoading()
}
)
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载 icon
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 ,// 初始化时的最小百分比
})
export default router

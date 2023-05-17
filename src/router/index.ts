/*
 * @Description: 
 * @Author: 牛猛
 * @Date: 2023-05-15 10:29:32
 * @LastEditTime: 2023-05-17 12:16:33
 * @LastEditors: nm
 * @FilePath: \vue-simple-calendar\src\router\index.ts
 */
// https://router.vuejs.org/zh/
import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入路由组件
import mian from '../ExampleFull.vue'

NProgress.configure({ showSpinner: true, parent: '#app' })

// 定义路由，每个路由都需要映射到一个组件
const routes = [
  {
    path: '/:name',
    name: 'main',
    component: mian,
  },
  
]

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  },
})

router.beforeEach((_to, _from, next) => {
  NProgress.start() // start progress bar
  if(_to.path === '/'){
  return  next({path: '/ui'})
  }
  next()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 导出路由实例，并在 `main.ts` 挂载
export default router

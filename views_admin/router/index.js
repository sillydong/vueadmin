import Vue from 'vue'
import Util from '@/libs/util'
import VueRouter from 'vue-router'
import { routers, otherRouter, appRouter } from './router'
import store from '@/store'
import { getToken } from '@/libs/token'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routers
}

export const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  // NProgress.start();
  Util.title(to.meta.title)

  if (!getToken() && to.name === 'login') {
    next()
  } else if (!getToken() && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
    next({
      name: 'login'
    })
  } else if (getToken() && to.name === 'login') { // 判断是否已经登录且前往的是登录页
    Util.title()
    next({
      name: 'home_index'
    })
  } else {
    // roles为undefined的话不启用权限判断
    if (store.getters.roles !== undefined && store.getters.roles.length === 0) {
      store.dispatch('info').then(response => {
        // 权限菜单过滤相关
        // store.commit('updateMenulist');

        const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name)
        if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
          if (Util.showThisRoute(curRouterObj.access, store.getters.roles)) {
            store.commit('updateLastRoute', from)
            Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next) // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
          } else {
            console.log('remote 403')
            next({
              replace: true,
              name: 'error-403'
            })
          }
        } else { // 没有配置权限的路由, 直接通过
          Util.toDefaultPage([...routers], to.name, router, next)
        }
      }).catch(err => {
        console.log(err)
        store.dispatch('clean').then(() => {
          next({
            name: 'login'
          })
        })
      })
    } else {
      const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name)
      if (curRouterObj && curRouterObj.access !== undefined && store.getters.roles !== undefined) { // 需要判断权限的路由
        if (Util.showThisRoute(curRouterObj.access, store.getters.roles)) {
          store.commit('updateLastRoute', from)
          Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next) // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
        } else {
          console.log('local 403')
          next({
            replace: true,
            name: 'error-403'
          })
        }
      } else { // 没有配置权限的路由, 直接通过
        store.commit('updateLastRoute', from)
        Util.toDefaultPage([...routers], to.name, router, next)
      }
    }
  }
})

router.afterEach((to) => {
  Util.openNewPage(router.app, to.name, to.params, to.query)
  // NProgress.done();
  window.scrollTo(0, 0)
})

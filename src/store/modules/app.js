import { otherRouter, appRouter } from 'app/router/router'
import Util from '@/libs/util'
import store from '@/store'

const app = {
  state: {
    openedSubmenuArr: [], // 要展开的菜单数组
    currentPageName: '',
    currentPath: [
      {
        title: '概览',
        path: '/home',
        name: 'home_index'
      }
    ], // 面包屑数组
    menuList: [],
    routers: [
      otherRouter,
      ...appRouter
    ],
    lastRoute: undefined
  },
  mutations: {
    updateMenulist (state) {
      const accessCode = store.getters.roles
      const menuList = []
      appRouter.forEach((item, index) => {
        if (item.access !== undefined) {
          if (Util.showThisRoute(item.access, accessCode)) {
            if (item.children.length === 1) {
              menuList.push(item)
            } else {
              const len = menuList.push(item)
              let childrenArr = []
              childrenArr = item.children.filter(child => {
                if (child.access !== undefined) {
                  if (Util.showThisRoute(child.access, accessCode)) {
                    return child
                  }
                } else {
                  return child
                }
              })
              menuList[len - 1].children = childrenArr
            }
          }
        } else {
          if (item.children.length === 1) {
            menuList.push(item)
          } else {
            const len = menuList.push(item)
            let childrenArr = []
            childrenArr = item.children.filter(child => {
              if (child.access !== undefined) {
                if (Util.showThisRoute(child.access, accessCode)) {
                  return child
                }
              } else {
                return child
              }
            })
            if (childrenArr === undefined || childrenArr.length === 0) {
              menuList.splice(len - 1, 1)
            } else {
              const handledItem = JSON.parse(JSON.stringify(menuList[len - 1]))
              handledItem.children = childrenArr
              menuList.splice(len - 1, 1, handledItem)
            }
          }
        }
      })
      state.menuList = menuList
    },
    addOpenSubmenu (state, name) {
      let hasThisName = false
      let isEmpty = false
      if (name.length === 0) {
        isEmpty = true
      }
      if (state.openedSubmenuArr.indexOf(name) > -1) {
        hasThisName = true
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr.push(name)
      }
    },
    setCurrentPath (state, pathArr) {
      state.currentPath = pathArr
    },
    setCurrentPageName (state, name) {
      state.currentPageName = name
    },
    clearOpenedSubmenu (state) {
      state.openedSubmenuArr.length = 0
    },
    updateLastRoute (state, route) {
      state.lastRoute = route
    }
  }
}

export default app

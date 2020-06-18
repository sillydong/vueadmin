import Main from '@/views/layout/Main.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => {
    require(['@/views/account/login.vue'], resolve)
  }
}

export const page404 = {
  path: '/404',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: resolve => {
    require(['@/views/error/404.vue'], resolve)
  }
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: resolve => {
    require(['@/views/error/403.vue'], resolve)
  }
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: resolve => {
    require(['@/views/error/500.vue'], resolve)
  }
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  children: [
    {
      path: 'home',
      meta: {
        title: '概览'
      },
      name: 'home_index',
      component: resolve => {
        require(['app/views/site/home.vue'], resolve)
      }
    },
    {
      path: 'profile',
      meta: {
        title: '账号设置'
      },
      name: 'profile',
      component: resolve => {
        require(['@/views/account/profile.vue'], resolve)
      }
    }
  ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/a',
    icon: 'el-icon-ic-jibao_o',
    name: 'a',
    meta: {
      title: 'AAAA'
    },
    component: Main,
    children: [
      {
        path: 'index',
        meta: {
          title: 'AAAAA'
        },
        name: 'a_index',
        component: resolve => {
          require(['app/views/a/index.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/b',
    icon: 'el-icon-ic-gouwuche_o',
    name: 'b',
    meta: {
      title: 'BBBB'
    },
    component: Main,
    children: [
      {
        path: 'index',
        meta: {
          title: 'BBBBB'
        },
        name: 'b_index',
        component: resolve => {
          require(['@/views/default/empty.vue'], resolve)
        }
      }
    ]
  }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  ...appRouter,
  page500,
  page403,
  page404
]

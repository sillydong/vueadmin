import Main from '@/views_common/layout/Main.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => {
    require(['@/views_common/account/login.vue'], resolve)
  }
}

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: resolve => {
    require(['@/views_common/error/404.vue'], resolve)
  }
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: resolve => {
    require(['@/views_common/error/403.vue'], resolve)
  }
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: resolve => {
    require(['@/views_common/error/500.vue'], resolve)
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
        require(['@/views/site/home.vue'], resolve)
      }
    },
    {
      path: 'profile',
      meta: {
        title: '账号设置'
      },
      name: 'profile',
      component: resolve => {
        require(['@/views_common/account/profile.vue'], resolve)
      }
    },
    {
      path: 'goods/edit',
      meta: {
        title: '编辑商品'
      },
      name: 'goods_edit',
      component: resolve => {
        require(['@/views/goods/edit.vue'], resolve)
      }
    },
    {
      path: 'order/detail',
      meta: {
        title: '订单详情'
      },
      name: 'order_detail',
      component: resolve => {
        require(['@/views/order/detail.vue'], resolve)
      }
    }
  ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/admin',
    icon: 'el-icon-ic-setting-o',
    name: 'admin',
    meta: {
      title: '系统设置'
    },
    component: Main,
    // access: ['/admin/rbac/*', '/admin/admin/*'],
    children: [
      {
        path: 'route',
        meta: {
          title: '路由管理'
        },
        name: 'admin_route',
        // access: '/admin/rbac/*',
        component: resolve => {
          require(['@/views_common/admin/route.vue'], resolve)
        }
      },
      {
        path: 'permission',
        meta: {
          title: '权限管理'
        },
        name: 'admin_permission',
        // access: '/admin/rbac/*',
        component: resolve => {
          require(['@/views_common/admin/permission.vue'], resolve)
        }
      },
      {
        path: 'role',
        meta: {
          title: '角色管理'
        },
        name: 'admin_role',
        // access: '/admin/rbac/*',
        component: resolve => {
          require(['@/views_common/admin/role.vue'], resolve)
        }
      },
      {
        path: 'index',
        meta: {
          title: '管理员管理'
        },
        name: 'admin_admin',
        // access: '/admin/admin/*',
        component: resolve => {
          require(['@/views_common/admin/admin.vue'], resolve)
        }
      },
      {
        path: 'record',
        meta: {
          title: '后台登陆日志'
        },
        name: 'admin_record',
        // access: '/admin/admin-record/*',
        component: resolve => {
          require(['@/views_common/admin/record.vue'], resolve)
        }
      },
      {
        path: 'log',
        meta: {
          title: '后台操作日志'
        },
        name: 'admin_log',
        // access: '/admin/admin-log/*',
        component: resolve => {
          require(['@/views_common/admin/log.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/category',
    icon: 'el-icon-ic-app-o',
    name: 'category',
    meta: {
      title: '基础设置'
    },
    component: Main,
    children: [
      {
        path: 'category',
        meta: {
          title: '分类设置'
        },
        name: 'category_category',
        component: resolve => {
          require(['@/views/category/category.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/goods',
    icon: 'el-icon-ic-shoppingbag-o',
    name: 'goods',
    meta: {
      title: '商品管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        meta: {
          title: '商品列表'
        },
        name: 'goods_index',
        component: resolve => {
          require(['@/views/goods/goods.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/order',
    icon: 'el-icon-ic-bank-card-o',
    name: 'order',
    meta: {
      title: '订单管理'
    },
    component: Main,
    children: [
      {
        path: 'waiting',
        meta: {
          title: '待处理订单'
        },
        name: 'order_waiting',
        component: resolve => {
          require(['@/views/order/waiting.vue'], resolve)
        }
      },
      {
        path: 'list',
        meta: {
          title: '订单列表'
        },
        name: 'order_list',
        component: resolve => {
          require(['@/views/order/list.vue'], resolve)
        }
      }
    ]
  },
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

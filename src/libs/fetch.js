import axios from 'axios'
import * as qs from 'qs'
import { router } from 'app/router/index'
import NProgress from 'nprogress'
import { Message } from 'element-ui'
import store from '@/store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.baseUrl, // api的base_url
  timeout: 5000, // 请求超时时间
  withCredentials: true
})
// request拦截器
service.interceptors.request.use((config) => {
  NProgress.start()
  if (store.getters.token !== undefined && store.getters.token !== '') {
    config.headers['Authorization'] = 'Bearer ' + store.getters.token
  }
  config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  NProgress.done()
  Message({
    message: error,
    type: 'error',
    duration: 2 * 1000
  })
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  (response) => {
    NProgress.done()
    const status = response.data.status
    // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
    if (status === 0) {
      return response
    } else if (status === 401) {
      Message({
        message: '未登录',
        type: 'error',
        duration: 2 * 1000
      })
      // // 登出
      store.dispatch('clean').then(() => {
        store.commit('clearOpenedSubmenu')
        router.push({ path: '/login' })
      })
    } else {
      const err = response.data.error
      switch (typeof (err)) {
        case 'string':
          Message({
            message: err,
            type: 'error',
            duration: 2 * 1000
          })
          break
        case 'object':
        case 'array':
          Message({
            message: Object.values(err).join(),
            type: 'error',
            duration: 2 * 1000
          })
          break
      }
      return Promise.reject(response)
    }
  }, error => {
    NProgress.done()
    Message({
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    })
    if (error.response.status === 401) {
      store.dispatch('clean').then(() => {
        store.commit('clearOpenedSubmenu')
        router.push({ path: '/login' })
      })
    }
    return Promise.reject(error)
  }
)

export function get (url, params) {
  return new Promise((resolve, reject) => {
    service.get(url, { params: params }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function post (url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, params).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

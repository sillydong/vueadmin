import axios from 'axios'
// import * as qs from 'qs'
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
  // if (config.method === 'post' || config.method === 'put') {
  //   config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  //   config.headers.put['Content-Type'] = 'application/x-www-form-urlencoded'
  //   config.data = qs.stringify(config.data)
  // }
  if (config.method === 'post' || config.method === 'put') {
    config.headers.post['Content-Type'] = 'application/json'
    config.headers.put['Content-Type'] = 'application/json'
    config.data = JSON.stringify(config.data)
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
    return response
  }, error => {
    NProgress.done()
    if (error.response === undefined) {
      Message({
        message: '[' + error.code + ']' + error.message,
        type: 'error',
        duration: 2 * 1000
      })
    } else {
      let status = error.response.status
      switch (status) {
        case 400:
          let code = error.response.data.code
          let message = ''
          if (code === 4001) {
            let msg = []
            error.response.data.data.forEach(field => {
              msg.push(field.field_name + ' ' + field.error)
            })
            message = msg.join(', ')
          } else {
            message = '[' + error.response.data.code + ']' + error.response.data.message
          }
          Message({
            message: message,
            type: 'error',
            duration: 2 * 1000
          })
          break
        case 401:
        case 403:
          Message({
            message: error.response.data.message,
            type: 'error',
            duration: 2 * 1000
          })
          store.dispatch('clean').then(() => {
            store.commit('clearOpenedSubmenu')
            router.push({ path: '/login' })
          })
          break
        case 500:
          Message({
            message: '[' + error.response.data.code + ']' + error.response.data.message,
            type: 'error',
            duration: 2 * 1000
          })
          break
        default:
          Message({
            message: '[' + error.response.status + ']' + error.response.data.message,
            type: 'error',
            duration: 2 * 1000
          })
          break
      }
    }

    return Promise.reject(error)
  }
)

export function doGet (url, params) {
  return new Promise((resolve, reject) => {
    service.get(url, { params: params }).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function doPost (url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, params).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function doPut (url, params) {
  return new Promise((resolve, reject) => {
    service.put(url, params).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function doDelete (url, params) {
  return new Promise((resolve, reject) => {
    service.delete(url, params).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

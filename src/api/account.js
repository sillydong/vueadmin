import { doGet, doPost, doPut } from '@/libs/fetch'

export function login (form) {
  return doPost('/admin/account/login', form)
}

export function logout () {
  return doGet('/admin/account/logout')
}

export function info () {
  return doGet('/admin/account/info')
}

export function profile (form) {
  return doPut('/admin/account/profile', form)
}

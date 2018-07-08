import { get, post } from '@/libs/fetch'

export function login(form) {
  return post('/admin/default/login', { Form: form })
}

export function logout() {
  return get('/admin/default/logout')
}

export function info() {
  return get('/admin/default/info')
}

export function profile(form) {
  return post('/admin/default/profile', { Form: form })
}

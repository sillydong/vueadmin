import { doGet, doPost, doPut, doDelete } from '@/libs/fetch'

export function list (params) {
  return doGet('/admin/test', params)
}

export function get (id) {
  return doGet('/admin/test/' + id)
}

export function create (form) {
  return doPost('/admin/test', form)
}

export function update (id, form) {
  return doPut('/admin/test/' + id, form)
}

export function del (id) {
  return doDelete('/admin/test/' + id)
}

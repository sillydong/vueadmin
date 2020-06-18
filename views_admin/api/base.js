import { doGet, doPost, doPut, doDelete } from '@/libs/fetch'

export function index (controller, query) {
  return doGet('/admin/' + controller + '/index', query)
}

export function create (controller, form) {
  return doPost('/admin/' + controller + '/create', { Form: form })
}

export function update (controller, id, form) {
  return doPut('/admin/' + controller + '/update/' + id, { id: id, Form: form })
}

export function remove (controller, id) {
  return doDelete('/admin/' + controller + '/delete/' + id, { id })
}

export function view (controller, id) {
  if (id === undefined || id === null) {
    return doGet('/admin/' + controller + '/view')
  }
  return doGet('/admin/' + controller + '/view/' + id, { id })
}

export function enable (controller, id) {
  return doPut('/admin/' + controller + '/enable/' + id, { id: id })
}

export function disable (controller, id) {
  return doPut('/admin/' + controller + '/disable/' + id, { id: id })
}

export function recommend (controller, id) {
  return doPut('/admin/' + controller + '/recommend/' + id, { id: id })
}

export function unrecommend (controller, id) {
  return doPut('/admin/' + controller + '/unrecommend/' + id, { id: id })
}

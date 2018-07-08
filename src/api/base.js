import { get, post } from '@/libs/fetch'

export function index(controller, query) {
  return get('/admin/' + controller + '/index', query)
}

export function create(controller, form) {
  return post('/admin/' + controller + '/create', { Form: form })
}

export function update(controller, id, form) {
  return post('/admin/' + controller + '/update/' + id, { id: id, Form: form })
}

export function remove(controller, id) {
  return post('/admin/' + controller + '/delete/' + id, { id })
}

export function view(controller, id) {
  if(id===undefined || id===null){
    return get('/admin/'+controller+'/view')
  }
  return get('/admin/' + controller + '/view/' + id, { id })
}

export function enable(controller, id) {
  return post('/admin/' + controller + '/enable/' + id, { id: id })
}

export function disable(controller, id) {
  return post('/admin/' + controller + '/disable/' + id, { id: id })
}

export function recommand(controller, id) {
  return post('/admin/' + controller + '/recommand/' + id, { id: id })
}

export function unrecommand(controller, id) {
  return post('/admin/' + controller + '/unrecommand/' + id, { id: id })
}

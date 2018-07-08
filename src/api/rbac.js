import { get, post } from '@/libs/fetch'

export function routes() {
  return get('/admin/rbac/routes')
}

export function route_check() {
  return post('/admin/rbac/route-check')
}

export function route_add(routes) {
  return post('/admin/rbac/route-add', { routes })
}

export function route_delete(routes) {
  return post('/admin/rbac/route-delete', { routes })
}

export function permissions() {
  return get('/admin/rbac/permissions')
}

export function permission_create(form) {
  return post('/admin/rbac/permission-create', { Form: form })
}

export function permission_update(name, form) {
  return post('/admin/rbac/permission-update', { name: name, Form: form })
}

export function permission_delete(name) {
  return post('/admin/rbac/permission-delete', { name })
}

export function roles() {
  return get('/admin/rbac/roles')
}

export function role_update(name, form) {
  return post('/admin/rbac/role-update', { name: name, Form: form })
}

export function role_create(form) {
  return post('/admin/rbac/role-create', { Form: form })
}

export function role_delete(name) {
  return post('/admin/rbac/role-delete', { name })
}

import { doGet, doPost, doPut, doDelete } from '@/libs/fetch'

export function routes () {
  return doGet('/admin/rbac/routes')
}

export function route_check () {
  return doPost('/admin/rbac/route-check')
}

export function route_add (routes) {
  return doPost('/admin/rbac/route-add', { routes })
}

export function route_delete (routes) {
  return doDelete('/admin/rbac/route-delete', { routes })
}

export function permissions () {
  return doGet('/admin/rbac/permissions')
}

export function permission_create (form) {
  return doPost('/admin/rbac/permission-create', { Form: form })
}

export function permission_update (name, form) {
  return doPut('/admin/rbac/permission-update', { name: name, Form: form })
}

export function permission_delete (name) {
  return doDelete('/admin/rbac/permission-delete', { name })
}

export function roles () {
  return doGet('/admin/rbac/roles')
}

export function role_update (name, form) {
  return doPut('/admin/rbac/role-update', { name: name, Form: form })
}

export function role_create (form) {
  return doPost('/admin/rbac/role-create', { Form: form })
}

export function role_delete (name) {
  return doDelete('/admin/rbac/role-delete', { name })
}

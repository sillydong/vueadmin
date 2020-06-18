import { doGet, doPost } from '@/libs/fetch'

export function qiniu_image (prefix, filename, watermark) {
  return doPost('/admin/upload/image', { prefix, filename, watermark })
}

export function qiniu_video (prefix, filename) {
  return doPost('/admin/upload/video', { prefix, filename })
}

export function qiniu_file (prefix, filename) {
  return doPost('/admin/upload/file', { prefix, filename })
}

export function persistent (id) {
  return doGet('/admin/upload/persistent', { id })
}

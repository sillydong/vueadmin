import { get } from '@/libs/fetch'

export function qiniu_image(prefix, filename, watermark) {
  return get('/admin/upload/qiniu-image', { prefix, filename, watermark })
}

export function qiniu_video(prefix, filename) {
  return get('/admin/upload/qiniu-video', { prefix, filename })
}

export function qiniu_file(prefix, filename) {
  return get('/admin/upload/qiniu-file', { prefix, filename })
}

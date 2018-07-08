/**
 * Project: tianjia
 * User: chenzhidong
 * Date: 17/3/17
 * Time: 00:22
 */
/**
 * 存储localStorage
 */
export const set = (name, content) => {
  if (!name) {
    return
  }
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const get = name => {
  if (!name) {
    return
  }
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const remove = name => {
  if (!name) {
    return
  }
  window.localStorage.removeItem(name)
}

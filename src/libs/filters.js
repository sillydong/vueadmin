const filters = {}

filters.qiniuImage = (url) => {
  return process.env.imageUrl + '/' + url
}

filters.qiniuThumb = (url, size = 100) => {
  return process.env.imageUrl + '/' + url + '?imageView2/1/w/' + size + '/h/' + size
}

filters.price = (val, coefficient = 100) => {
  return val / coefficient
}

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

filters.timeAgo = (time) => {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

filters.time = (time, cFormat) => {
  if (time === 0 || time === '' || time === '0' || time === null) {
    return '无'
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

filters.timePrettify = (time, option) => {
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return this.time(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

filters.bytesPrettify = (num, digits) => {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

filters.join = (arr, sep) => {
  if (arr == null) return ''
  sep = sep || ','
  return arr.join(sep)
}

filters.joinfield = (arr, field, sep) => {
  sep = sep || ','
  const datas = []
  for (const item of arr) {
    datas.push(item[field])
  }
  return datas.join(sep)
}

filters.arrayValue = (id, arr, field) => {
  for (const item of arr) {
    if (item['id'] === id) {
      return item[field]
    }
  }
}

filters.value = (obj, field, defaultVal) => {
  if (obj == null) {
    return defaultVal
  }
  return obj[field]
}

filters.map = (val, map) => {
  return map[val] === undefined ? val : map[val]
}

export default filters

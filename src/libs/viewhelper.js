import _ from 'lodash'
import filters from './filters'

const viewhelper = {}

// view handle
viewhelper.fillquery = (route, table) => {
  table.query = Object.assign(table.query, route.query)
  table.query.limit = parseInt(table.query.limit)
  table.query.offset = parseInt(table.query.offset)
  if (table.query.limit === 0) {
    table.query.limit = 20
  }
  table.page = (table.query.offset / table.query.limit) + 1
}

viewhelper.pagination = (router, route, table) => {
  if (parseInt(table.page) !== parseInt(route.query.page)) {
    table.query.offset = (table.page - 1) * table.query.limit
    router.push({
      name: router.name,
      query: table.query
    })
  }
  return false
}

viewhelper.search = (router, table) => {
  table.query.offset = 0
  router.push({
    name: router.name,
    query: table.query
  })
}

viewhelper.actionCreate = (formRef, form, empty) => {
  form.title = '新建'
  form.action = 'create'
  form.index = undefined
  form.visible = true
  form.form = viewhelper.setform(formRef, form.form, empty)
}

viewhelper.actionUpdate = (formRef, form, row, index) => {
  form.title = '更新'
  form.action = 'update'
  form.index = index
  form.visible = true
  form.form = viewhelper.setform(formRef, form.form, row)
}

// data handle
viewhelper.setform = (formRef, form, item) => {
  if (formRef !== undefined) {
    formRef.resetFields()
  }
  return _.pick(item, Object.keys(form))
}

viewhelper.replaceItem = (list, index, item) => {
  list.splice(index, 1, Object.assign(list[index], item))
}

viewhelper.deleteItem = (list, index) => {
  list.splice(index, 1)
}

viewhelper.preAppendItem = (list, item) => {
  list.unshift(item)
}

// formatter
const formatter = {}
formatter.image = (row, column, cellValue, index) => {
  return filters.qiniuImage(cellValue)
}

formatter.price = (row, column, cellValue, index) => {
  return filters.price(cellValue)
}

formatter.time = (row, column, cellValue, index) => {
  return filters.time(cellValue)
}

formatter.timeAgo = (row, column, cellValue, index) => {
  return filters.timeAgo(cellValue)
}

formatter.timePrettify = (row, column, cellValue, index) => {
  return filters.timePrettify(cellValue)
}

formatter.bytesPrettify = (row, column, cellValue, index) => {
  return filters.bytesPrettify(cellValue, 3)
}

formatter.join = (row, column, cellValue, index) => {
  return filters.join(cellValue, '; ')
}

formatter.lines = (row, column, cellValue, index) => {
  return filters.join(cellValue, '\n')
}

viewhelper.formatter = formatter

const rules = {}
rules.required = (message) => {
  return { required: true, trigger: 'blur', message: message }
}
rules.email = (required = true) => {
  return { type: 'email', required: required, message: '请输入正确的邮箱地址', trigger: 'blur' }
}
rules.mobile = (required = true) => {
  return { type: 'regexp', required: required, pattern: '^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[235-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|66\d{2})\d{6}$', message: '请输入正确的手机号', trigger: 'blur' }
}
rules.string = (min, max, required = true) => {
  var message = '请输入正确的字符串'
  var rule = { type: 'string', required: required, message: '请输入正确的字符串', trigger: 'blur' }
  if (min !== null && min !== undefined) {
    rule.min = min
    message += ', 长度大于' + min
  }
  if (max !== null && max !== undefined) {
    rule.max = max
    message += ', 长度小于' + min
  }
  rule.message = message
  return rule
}
rules.number = (min, max, required = true) => {
  var message = '请输入数字'
  var rule = { type: 'number',
    required: required,
    trigger: 'blur',
    transform (value) {
      return _.toNumber(value)
    } }
  if (min !== null && min !== undefined) {
    rule.min = min
    message += ', 大于' + min
  }
  if (max !== null && max !== undefined) {
    rule.max = max
    message += ', 小于' + max
  }
  rule.message = message
  return rule
}
rules.integer = (min, max, required = true) => {
  var message = '请输入正确的整数'
  var rule = { type: 'integer',
    required: required,
    trigger: 'blur',
    transform (value) {
      return _.toNumber(value)
    } }
  if (min !== null && min !== undefined) {
    rule.min = min
    message += ', 大于' + min
  }
  if (max !== null && max !== undefined) {
    rule.max = max
    message += ', 小于' + max
  }
  rule.message = message
  return rule
}
rules.float = (min, max, required = true) => {
  var message = '请输入正确的小数'
  var rule = { type: 'float',
    required: required,
    trigger: 'blur',
    transform (value) {
      return _.toNumber(value)
    } }
  if (min !== null && min !== undefined) {
    rule.min = min
    message += ', 大于' + min
  }
  if (max !== null && max !== undefined) {
    rule.max = max
    message += ', 小于' + max
  }
  rule.message = message
  return rule
}
rules.enum = (vals, required = true) => {
  return { type: 'enum', required: required, enum: vals, message: '输入内容不合法: [' + vals.join(', ') + ']', trigger: 'blur' }
}
rules.date = (required = true) => {
  return { type: 'date', required: required, message: '请输入正确的日期', trigger: 'blur' }
}
rules.url = (required = true) => {
  return { type: 'url', required: required, message: '请输入正确的URL', trigger: 'blur' }
}
rules.regexp = (reg, required = true) => {
  return { type: 'regexp', required: required, pattern: reg, message: '输入内容不符合正则: ' + reg, trigger: 'blur' }
}
rules.object = (fields, required = true) => {
  return { type: 'object', required: required, fields: fields, trigger: 'blur' }
}
rules.array = (length, required = true) => {
  return { type: 'array', required: required, len: length, message: '数组长度', trigger: 'blur' }
}
rules.func = (func, required = true) => {
  return { validator: func, required: required, trigger: 'blur' }
}
viewhelper.rules = rules

export default viewhelper

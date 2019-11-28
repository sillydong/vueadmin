'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseUrl: '"/"', // 接口地址
  imageUrl: '"http://image.domain.com"' // 图片域名
})

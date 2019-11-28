import Vue from 'vue'
import { router } from './router/index'
import { appRouter } from './router/router'
import store from '@/store'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import '@/styles/common.less'
import '@/styles/element.less'
import '@/styles/iconfont.less'
import '@/styles/styles.less'
// import '@/styles/fontawesome.less'
import * as filters from '@/filters'
import util from '@/libs/util'

Vue.use(Element, {
  size: 'small'
})

var ElTreeGrid = require('element-tree-grid')
Vue.component(ElTreeGrid.name, ElTreeGrid)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  components: { App },
  data: {
    currentPageName: ''
  },
  mounted () {
    this.currentPageName = this.$route.name
  },
  created () {
    const tagsList = []
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0])
      } else {
        tagsList.push(...item.children)
      }
    })
  },
  methods: {
    can (requestAccess) {
      return util.canAccess(requestAccess, this)
    }
  },
  template: '<App/>',
  router: router,
  store: store
})

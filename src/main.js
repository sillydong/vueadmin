import Vue from 'vue'
import { router } from './router/index'
import { appRouter } from './router/router'
import store from './store'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import '@/styles/common.less'
import '@/styles/element.less'
import '@/styles/iconfont.less'
import '@/styles/styles.less'
// import '@/styles/fontawesome.less'
import * as filters from './filters'

Vue.use(Element, {
  size: 'small'
})

var ElTreeGrid = require('element-tree-grid');
Vue.component(ElTreeGrid.name,ElTreeGrid);


Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router: router,
  store: store,
  data: {
    currentPageName: ''
  },
  mounted() {
    this.currentPageName = this.$route.name
  },
  created() {
    const tagsList = []
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0])
      } else {
        tagsList.push(...item.children)
      }
    })
  }
})

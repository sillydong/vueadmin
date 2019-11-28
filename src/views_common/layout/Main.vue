<style scoped lang="less">
  .main {
    width: 100%;
    height: 100%;
    .el-header {
      padding: 0;
    }
    .el-main {
      margin: 0;
      padding: 10px;
      background-color: #ffffff;
      .app-container {
        padding: 10px;
      }
    }
    .el-footer{
      width: 100%;
      height:24px !important;
      font-size: 13px;
      background: white;
      vertical-align: middle;
      color: #606266;
    }
  }
</style>

<template>
  <el-container class="main">
    <el-aside :width="shrink?'64px':'220px'">
      <mainaside
        :shrink="shrink"
        :menu-list="menuList"
      />
    </el-aside>
    <el-container>
      <el-header height="50px">
        <mainheader
          :shrink="shrink"
          :toggle-menu="toggleClick"
        />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        © <a
          href="http://www.dongwutec.com"
          target="_blank"
        >常州市东吴网络科技有限公司</a>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import mainaside from './main-components/mainaside'
import mainheader from './main-components/mainheader'
import util from '@/libs/util.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Main',
  components: {
    mainaside,
    mainheader
  },
  data () {
    return {
      shrink: false
    }
  },
  computed: {
    ...mapGetters([
      'nickname'
    ]),
    menuList () {
      return this.$store.state.app.menuList
    }
  },
  watch: {
    '$route' (to) {
      this.$store.commit('setCurrentPageName', to.name)
      const pathArr = util.setCurrentPath(this, to.name)
      if (pathArr.length > 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name)
      }
      localStorage.currentPageName = to.name
    }
  },
  mounted () {
    this.init()
  },
  created () {
  },
  methods: {
    init () {
      const pathArr = util.setCurrentPath(this, this.$route.name)
      this.$store.commit('updateMenulist')
      if (pathArr.length >= 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name)
      }
    },
    toggleClick () {
      this.shrink = !this.shrink
    }
  }
}
</script>

<style scoped>

</style>

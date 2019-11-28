<style lang="less">
    @import '404.less';
</style>

<template>
  <div class="error404">
    <div class="error404-body-con">
      <el-card>
        <div class="error404-body-con-title">
          4<span>0</span>4
        </div>
        <p class="error404-body-con-message">
          YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST
        </p>
        <div class="error404-btn-con">
          <el-button
            size="large"
            style="width: 200px;"
            type="text"
            @click="goHome"
          >
            返回首页
          </el-button>
          <el-button
            size="large"
            style="width: 200px;margin-left: 40px;"
            type="primary"
            @click="backPage"
          >
            返回上一页
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error-404',
  methods: {
    backPage () {
      this.$router.go(-1)
    },
    goHome () {
      this.$router.push({
        name: 'home_index'
      })
    }
  }
}
</script>

<style lang="less">
    @import '403.less';
</style>

<template>
    <div class="error403">
        <div class="error403-body-con">
            <el-card>
                <div class="error403-body-con-title">
                    4<span class="error403-0-span">0</span><span class="error403-0-span">3</span>
                </div>
                <p class="error403-body-con-message">You don't have permission</p>
                <div class="error403-btn-con">
                    <el-button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</el-button>
                    <el-button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
  name: 'error-403',
  methods: {
    backPage() {
      this.$router.go(-1)
    },
    goHome() {
      this.$router.push({
        name: 'home_index'
      })
    }
  }
}
</script>

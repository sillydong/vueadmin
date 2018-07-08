<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {

  },
  beforeDestroy() {

  },
  methods: {

  }
}
</script>

<style>
html {
  height: 100%;
  box-sizing: border-box;
}
body{
    width: 100%;
    height: 100%;
    margin: 0;
    background: #f0f0f0;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}
#app{
    width: 100%;
    height: 100%;
}
</style>

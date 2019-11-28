<template>
  <div class="el-table el-table--fit el-table--border el-table--small">
    <table
      cellspacing="0"
      cellpadding="0"
      border="0"
      class="el-table__body"
      style="width: 100%"
    >
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
  }
}
</script>

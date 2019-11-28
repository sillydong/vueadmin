<template>
  <tr class="el-table__row">
    <td
      rowspan="1"
      colspan="1"
      class="el-table_1_column_1 is-left"
      :width="labelWidth"
    >
      <div class="cell">
        {{ label }}
      </div>
    </td>
    <td
      rowspan="1"
      colspan="1"
      class="el-table_1_column_2 is-left"
    >
      <div class="cell">
        {{ value }}<slot />
      </div>
    </td>
  </tr>
</template>
<script>
export default {
  name: 'detail',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {},
    labelWidth: {
      type: Number,
      default: 150
    }
  },
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
  }
}
</script>

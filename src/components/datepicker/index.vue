<template>
  <div>
    <el-date-picker
      v-model="start_value"
      :editable="false"
      :picker-options="pickerOptionsStart"
      value-format="yyyy-MM-dd 00:00:00"
      type="date"
      placeholder="开始日期"
      dafault-value="today"
      :clearable="true"
      @change="starTimeChange"
    />
    <span>至</span>
    <el-date-picker
      v-model="stop_value"
      :editable="false"
      :picker-options="pickerOptionsStop"
      value-format="yyyy-MM-dd 00:00:00"
      type="date"
      placeholder="结束日期"
      dafault-value="today"
      :clearable="true"
      @change="endTimeChange"
    />
  </div>
</template>

<script>

export default {
  name: 'datepicker',
  props: {
    start: {
      type: String,
      default: ''
    },
    stop: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      start_value: undefined,
      stop_value: undefined,
      pickerOptionsStart: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      pickerOptionsStop: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  watch: {
    start (val) {
      this.start_value = val
    },
    stop (val) {
      this.stop_value = val
    },
    start_value (val) {
      this.$emit('update:start', val)
    },
    stop_value (val) {
      this.$emit('update:stop', val)
    }
  },
  mounted () {
    this.start_value = this.start
    this.stop_value = this.stop
  },
  methods: {
    starTimeChange (val) {
      let starTime = new Date(val)
      this.pickerOptionsStop = {
        disabledDate (time) {
          return time.getTime() < starTime
        }
      }
    },
    endTimeChange (val) {
      let endTime = new Date(val)
      this.pickerOptionsStart = {
        disabledDate (time) {
          return time.getTime() >= endTime
        }
      }
    }
  }
}
</script>

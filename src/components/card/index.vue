<template>
  <div
    class="card-panel"
  >
    <router-link
      v-if="redirect != null"
      :to="redirect"
      style="display: inline-block;height: 100%;width: 100%;"
    >
      <div class="card-panel-text">
        {{ label }}
      </div>
      <count-to
        :start-val="0"
        :end-val="number"
        :duration="2600"
        :decimals="decimals"
        class="card-panel-num"
      />
    </router-link>
    <div v-else>
      <div class="card-panel-text">
        {{ label }}
      </div>
      <count-to
        :start-val="0"
        :end-val="number"
        :duration="2600"
        :decimals="decimals"
        class="card-panel-num"
      />
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  name: 'card',
  components: {
    CountTo
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    number: {
      type: Number,
      default: 0
    },
    redirect: {
      type: Object,
      default: null
    }
  },
  computed: {
    decimals () {
      if (parseInt(this.number) == parseFloat(this.number)) {
        return 0
      } else {
        return 2
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.card-panel {
  height: 108px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);
  .card-panel-text {
    width: 100%;
    float:left;
    font-weight: bold;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
    padding: 26px;
  }
  .card-panel-num {
    float: right;
    font-weight: bold;
    font-size: 20px;
    padding-right: 26px;
  }
}
@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    display: none;
  }
}
</style>

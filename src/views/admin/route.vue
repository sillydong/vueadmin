<style scoped lang="less">

</style>
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        :loading="checking"
        type="warning"
        @click="check"
      >
        检查并删除无效路由
      </el-button>
      <el-button
        type="primary"
        @click="getlist"
      >
        刷新路由
      </el-button>
    </div>
    <div class="">
      <el-transfer
        v-model="assigned"
        :data="availables"
        :titles="titles"
        @change="transfer"
      />
    </div>
  </div>
</template>

<script>
// import { mapState, mapActions, mapMutations } from 'vuex';
import { routes, route_check, route_add, route_delete } from '@/api/rbac'

export default {
  name: 'admin_route',
  components: {},
  directives: {},
  filters: {},
  data () {
    return {
      titles: [
        '未绑定路由',
        '已绑定路由'
      ],
      availables: [],
      assigned: [],
      checking: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getlist()
  },
  mounted () {
  },
  methods: {
    getlist () {
      routes().then(response => {
        this.availables = response.data.availables
        this.assigned = response.data.assigned
      })
        .catch(err => {
          console.log(err)
        })
    },
    transfer (targetKeys, direction, moveKeys) {
      if (moveKeys.length > 0) {
        if (direction === 'left') {
          // 删除
          route_delete(moveKeys).then(response => {
            this.assigned = targetKeys
            //                            this.assigned.push(response.data)
          }).catch(err => {
            console.log(err)
          })
        } else if (direction === 'right') {
          // 添加
          route_add(moveKeys).then(response => {
            this.assigned = targetKeys
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    check () {
      this.checking = true
      route_check().then(response => {
        this.checking = false
        if (response.data.count > 0) {
          this.$notify({
            title: '检查完成',
            dangerouslyUseHTMLString: true,
            message: '删除' + response.data.count + '项无效路由:<br>' + response.data.items.join('<br>'),
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '检查完成',
            message: '无无效路由',
            type: 'success',
            duration: 2000
          })
        }
      }).catch(err => {
        console.log(err)
        this.checking = false
      })
    }
  }
}
</script>

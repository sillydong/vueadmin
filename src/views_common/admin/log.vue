<template>
  <div class="app-container">
    <div class="table-container">
      <el-table
        v-loading.body="table.loading"
        :data="table.items"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          align="left"
          label="ID"
          width="50"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="操作人员"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ admins[scope.row.admin_id] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="IP/路径"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.ip }}<br>{{ scope.row.route }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="操作记录"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.description" />
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="操作时间"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.created_at | parseTime() }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="table.query.page"
        :page-size="table.perpage"
        :total="table.total"
        layout="total, prev, pager, next, jumper"
        class="margin-top-10"
        background
        @current-change="pagination"
      />
    </div>
  </div>
</template>

<script>
// import { mapState, mapActions, mapMutations } from 'vuex';
import { index } from 'app/api/base'

export default {
  name: 'admin_log',
  components: {},
  data () {
    return {
      admins: [],
      table: {
        query: {
          page: 1
        },
        items: [],
        total: 0,
        perpage: 0,
        loading: false
      }
    }
  },
  computed: {},
  watch: {
    '$route': 'fillquery'
  },
  created () {
    this.fillquery()
  },
  methods: {
    fillquery () {
      this.table.query = Object.assign(this.table.query, this.$route.query)
      this.table.query.page = parseInt(this.table.query.page)
      this.getlist()
    },
    pagination () {
      if (parseInt(this.table.query.page) !== parseInt(this.$route.query.page)) {
        this.$router.push({
          name: this.$router.name,
          query: this.table.query
        })
      }
    },
    search () {
      this.table.query.page = 1
      this.$router.push({
        name: this.$router.name,
        query: this.table.query
      })
    },
    getlist () {
      this.table.loading = true
      index('admin-log', this.table.query).then(response => {
        this.admins = response.data.admins
        this.table.items = response.data.list.items
        this.table.total = response.data.list._meta.totalCount
        this.table.perpage = response.data.list._meta.perPage
        this.table.loading = false
        console.log(this.table.items)
      }).catch(err => {
        console.log(err)
        this.table.loading = false
      })
    }
  }
}
</script>
<style scoped>

</style>

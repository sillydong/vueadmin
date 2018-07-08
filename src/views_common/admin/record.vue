<template>
  <div class="app-container">
    <div class="table-container">
      <el-table :data="table.items" v-loading.body="table.loading" border fit highlight-current-row>
        <el-table-column align="left" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="管理员" width="150">
          <template slot-scope="scope">
            <span>{{admins[scope.row.admin_id]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="IP" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.ip}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="登陆时间" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.created_at | parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="设备信息">
          <template slot-scope="scope">
            <span>{{scope.row.ua}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="margin-top-10" background @current-change="pagination"
                     :current-page.sync="table.query.page"
                     :page-size="table.perpage" layout="total, prev, pager, next, jumper"
                     :total="table.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import { mapState, mapActions, mapMutations } from 'vuex';
import { index } from '@/api/base'

export default {
  name: 'admin_record',
  components: {},
  data() {
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
  watch:{
    '$route':'fillquery'
  },
  created() {
    this.fillquery();
  },
  methods: {
    fillquery() {
      this.table.query = Object.assign(this.table.query, this.$route.query);
      this.table.query.page = parseInt(this.table.query.page);
      this.getlist();
    },
    pagination(){
      if(parseInt(this.table.query.page) !== parseInt(this.$route.query.page)){
        this.$router.push({
          name: this.$router.name,
          query:this.table.query,
        });
      }
    },
    search(){
      this.table.query.page = 1;
      this.$router.push({
        name: this.$router.name,
        query:this.table.query,
      });
    },
    getlist(page) {
      this.table.loading = true
      if (page !== undefined) {
        this.table.query.page = page
      }
      index('admin-record', this.table.query).then(response => {
        this.admins = response.data.admins
        this.table.items = response.data.list.items
        this.table.total = response.data.list._meta.totalCount
        this.table.perpage = response.data.list._meta.perPage
        this.table.loading = false
      }).catch(err => {
        console.log(err)
        this.table.loading = false
      })
    }
  },
}
</script>
<style scoped>

</style>

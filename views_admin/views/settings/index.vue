<style scoped>

</style>
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        type="primary"
        class="filter-item"
        @click="action_create()"
      >
        添加
      </el-button>
    </div>
    <div class="table-container">
      <el-table
        v-loading.body="table.loading"
        :data="table.items"
        border

        fit
        highlight-current-row
      >
        <el-table-column
          prop="id"
          align="left"
          label="ID"
          width="50"
        />
        <el-table-column
          prop="skey"
          align="left"
          label="键名"
          width="100"
        />
        <el-table-column
          prop="smark"
          align="left"
          label="说明"
          width="100"
        />
        <el-table-column
          prop="svalue"
          align="left"
          label="键值"
        />
        <el-table-column
          align="left"
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              size="mini"
              type="success"
              @click="action_update(scope.row,scope.$index)"
            >
              编辑
            </el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              @click="do_delete(scope.row,scope.$index)"
            >
              删除
            </el-button>
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
    <el-dialog
      :visible.sync="form.visible"
      :title="form.title"
      width="800px"
    >
      <el-form
        ref="form"
        :model="form.form"
        :rules="form.rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item
          label="键名"
          prop="skey"
        >
          <el-input
            v-model="form.form.skey"
            :disabled="form.action!='create'"
          />
        </el-form-item>
        <el-form-item
          label="说明"
          prop="smark"
        >
          <el-input v-model="form.form.smark" />
        </el-form-item>
        <el-form-item
          label="键值"
          prop="svalue"
        >
          <el-input
            v-model="form.form.svalue"
            type="textarea"
            rows="5"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="text"
          @click="form.visible=false"
        >
          取消
        </el-button>
        <el-button
          v-if="form.action=='create'"
          :loading="form.loading"
          type="primary"
          @click="do_create"
        >
          保存
        </el-button>
        <el-button
          v-else
          :loading="form.loading"
          type="primary"
          @click="do_update"
        >
          更新
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { index, create, update, remove } from 'app/api/base'

export default {
  name: 'settings_index',
  components: {},
  data () {
    return {
      table: {
        query: {
          page: 1
        },
        items: [],
        total: 0,
        perpage: 0,
        loading: false
      },
      form: {
        form: {
          id: undefined,
          skey: '',
          smark: '',
          svalue: ''
        },
        rules: {
        },
        index: undefined,
        visible: false,
        action: '',
        loading: false,
        title: ''
      }
    }
  },
  computed: {
    ...mapGetters([
    ])
  },
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
      index('settings', this.table.query).then(response => {
        this.table.items = response.data.list.items
        this.table.total = response.data.list._meta.totalCount
        this.table.perpage = response.data.list._meta.perPage
        this.table.loading = false
      }).catch(err => {
        console.log(err)
        this.table.loading = false
      })
    },
    action_create () {
      this.form.title = '新建'
      this.form.action = 'create'
      this.form.index = undefined
      this.form.visible = true
      this.setform()
    },
    action_update (row, index) {
      this.form.title = '更新'
      this.form.action = 'update'
      this.form.index = index
      this.form.visible = true
      this.setform(row)
    },
    do_create () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.loading = true
          create('settings', this.form.form).then(response => {
            this.table.items.unshift(response.data)
            this.form.visible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.form.loading = false
          }).catch(err => {
            console.log(err)
            this.form.loading = false
          })
        }
      })
    },
    do_update () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.loading = true
          update('settings', this.form.form.id, this.form.form).then(response => {
            this.table.items.splice(this.form.index, 1,
              Object.assign(this.table.items[this.form.index], response.data))
            this.form.visible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.form.loading = false
          }).catch(err => {
            console.log(err)
            this.form.loading = false
          })
        }
      })
    },
    do_delete (row, index) {
      if (confirm('确认删除?')) {
        remove('settings', row.id).then(response => {
          this.table.items.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    setform (row) {
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields()
      }
      if (row === undefined || row === null) {
        this.form.form = {
          id: undefined,
          skey: '',
          smark: '',
          svalue: ''
        }
      } else {
        this.form.form = Object.assign({}, row)
      }
    }
  }
}
</script>

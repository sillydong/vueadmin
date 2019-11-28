<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        type="primary"
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
          align="left"
          label="权限名称"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="权限描述"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="可操作路由"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.routes }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="更新时间"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.updatedAt | parseTime() }}</span>
          </template>
        </el-table-column>
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
          label="权限名称"
          prop="name"
        >
          <el-input
            v-model="form.form.name"
            :disabled="form.action=='update'"
            placeholder="权限名，英文"
          />
        </el-form-item>
        <el-form-item
          label="权限描述"
          prop="description"
        >
          <el-input
            v-model="form.form.description"
            placeholder="权限描述"
          />
        </el-form-item>
        <el-form-item
          label="可操作路由"
          prop="data"
        >
          <el-checkbox-group v-model="form.form.routes">
            <el-checkbox
              v-for="item in routes"
              :key="item.name"
              :label="item.name"
            >
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
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
// import { mapState, mapActions, mapMutations } from 'vuex';
import { permissions, permission_create, permission_update, permission_delete } from 'app/api/rbac'

export default {
  name: 'admin_permission',
  components: {},
  data () {
    return {
      routes: [],
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
          name: '',
          description: '',
          routes: []
        },
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入权限名' }],
          description: [{ required: true, trigger: 'blur', message: '请输入权限描述' }],
          routes: [{ required: true, trigger: 'blur', message: '请选择可操作路由' }]
        },
        index: undefined,
        visible: false,
        action: '',
        loading: false,
        title: ''
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
      permissions().then(response => {
        this.routes = response.data.routes
        this.table.items = response.data.permissions
        this.table.total = this.table.items.length
        this.table.perpage = this.table.items.length
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

      this.setform()
      this.form.visible = true
    },
    action_update (row, index) {
      this.form.title = '更新'
      this.form.action = 'update'
      this.form.index = index

      this.setform(row)
      this.form.visible = true
    },
    do_create () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.loading = true
          permission_create(this.form.form).then(response => {
            this.table.items.unshift(response.data)
            this.getlist()
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
          permission_update(this.form.form.name, this.form.form).then(response => {
            this.table.items.splice(this.form.index, 1, response.data)
            this.getlist()
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
        permission_delete(row.name).then(response => {
          this.table.items.splice(index, 1)
          this.getlist()
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
        console.log('create')
        this.form.form = {
          name: '',
          description: '',
          routes: []
        }
      } else {
        console.log('update')
        this.form.form = Object.assign({}, row)
      }
    }
  }
}
</script>
<style scoped>
  .el-checkbox-group > label.el-checkbox {
    width: 33%;
    margin-left: 0;
  }
</style>

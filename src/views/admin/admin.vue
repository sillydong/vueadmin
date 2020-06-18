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
          prop="admin_name"
          align="left"
          label="昵称"
          width="100"
        />
        <el-table-column
          prop="admin_account"
          align="left"
          label="登陆账号"
          width="100"
        />
        <el-table-column
          align="left"
          label="权限"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.auth | joinfield('description') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="最后一次登陆"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.updated_at | parseTime() }}@{{ scope.row.admin_ip_address }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="操作"
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
            <!-- 禁用启用 -->
            <el-button
              v-if="scope.row.status==1"
              size="mini"
              type="danger"
              @click="do_disable(scope.row,scope.$index)"
            >
              禁用
            </el-button>
            <el-button
              v-else
              size="mini"
              type="primary"
              @click="do_enable(scope.row,scope.$index)"
            >
              启用
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
          label="登陆账号"
          prop="admin_account"
        >
          <el-input
            v-model="form.form.admin_account"
            :disabled="form.action=='update'"
            placeholder="登陆账号用于登陆时输入"
          />
        </el-form-item>
        <el-form-item
          label="昵称"
          prop="admin_name"
        >
          <el-input
            v-model="form.form.admin_name"
            placeholder="请输入昵称"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="admin_password_a"
        >
          <el-input
            v-model="form.form.admin_password_a"
            type="password"
            autocomplete="off"
            placeholder="请输入8位以上密码"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="admin_password_b"
        >
          <el-input
            v-model="form.form.admin_password_b"
            type="password"
            autocomplete="off"
            placeholder="请再次输入密码"
          />
        </el-form-item>
        <el-form-item
          label="权限"
          prop="auth"
        >
          <el-select
            v-model="form.form.auth"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="item in roles"
              :key="item.name"
              :value="item.name"
              :label="item.description"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <template>
            <el-switch
              v-model.number="form.form.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
            />
          </template>
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
import { index, create, update, enable, disable } from 'app/api/base'

export default {
  name: 'admin_admin',
  components: {},
  data () {
    const validatePasswordA = (rule, value, callback) => {
      if (this.form.action === 'create') {
        if (value === undefined || value.length < 8) {
          callback(new Error('密码不能小于8位'))
        } else if (this.form.form.admin_password_b.length > 0 && value !==
              this.form.form.admin_password_b) {
          callback(new Error('两次输入密码不相同'))
        } else {
          callback()
        }
      } else {
        if (value !== undefined) {
          if (value.length < 8) {
            callback(new Error('密码不能小于8位'))
          }
        }
        callback()
      }
    }
    const validatePasswordB = (rule, value, callback) => {
      if (this.form.action === 'create') {
        if (value === undefined || value.length < 8) {
          callback(new Error('密码不能小于8位'))
        } else if (value !== this.form.form.admin_password_a) {
          callback(new Error('两次输入密码不相同'))
        } else {
          callback()
        }
      } else {
        if (value !== undefined) {
          if (value.length < 8) {
            callback(new Error('密码不能小于8位'))
          } else if (value !== this.form.form.admin_password_a) {
            callback(new Error('两次输入密码不相同'))
          }
        }
        callback()
      }
    }
    return {
      roles: [],
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
          admin_name: '',
          admin_account: '',
          admin_password_a: '',
          admin_password_b: '',
          admin_password: '',
          status: 1,
          auth: []
        },
        rules: {
          admin_name: [{ required: true, trigger: 'blur', message: '请输入昵称' }],
          admin_account: [{ required: true, trigger: 'blur', message: '请输入登陆账号' }],
          admin_password_a: [{ trigger: 'blur', validator: validatePasswordA }],
          admin_password_b: [{ trigger: 'blur', validator: validatePasswordB }]
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
      index('admin', this.table.query).then(response => {
        this.roles = response.data.roles
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
          if (this.form.form.admin_password_a && this.form.form.admin_password_b) {
            this.form.form.admin_password = this.form.form.admin_password_a
          }
          this.form.loading = true
          create('admin', this.form.form).then(response => {
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
          if (this.form.form.admin_password_a && this.form.form.admin_password_b) {
            this.form.form.admin_password = this.form.form.admin_password_a
          }
          this.form.loading = true
          update('admin', this.form.form.id, this.form.form).then(response => {
            this.table.items.splice(this.form.index, 1, Object.assign(this.table.items[this.form.index], response.data))
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
    do_enable (row, index) {
      if (confirm('确认启用?')) {
        enable('admin', row.id).then(response => {
          this.table.items.splice(index, 1, Object.assign(this.table.items[index], response.data))
          this.$notify({
            title: '成功',
            message: '启用成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    do_disable (row, index) {
      if (confirm('确认禁用?')) {
        disable('admin', row.id).then(response => {
          this.table.items.splice(index, 1,
            Object.assign(this.table.items[index], response.data))
          this.$notify({
            title: '成功',
            message: '禁用成功',
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
          admin_name: '',
          admin_account: '',
          admin_password_a: '',
          admin_password_b: '',
          admin_password: '',
          role: '',
          area_id: 0,
          status: 1,
          auth: []
        }
      } else {
        this.form.form = Object.assign({}, row)
        this.form.form.status = parseInt(this.form.form.status)
        if (this.form.form.auth === undefined || this.form.form.auth.length === 0) {
          this.form.form.auth = []
        } else {
          const roles = []
          for (const item of this.form.form.auth) {
            roles.push(item.name)
          }
          this.form.form.auth = roles
        }
      }
    }
  }
}
</script>

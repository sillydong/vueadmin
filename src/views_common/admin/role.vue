<style scoped lang="less">
  .el-checkbox-group .el-checkbox {
    margin-left: 0;
    width: 33%;
  }
</style>
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="action_create()">添加</el-button>
    </div>
    <div class="table-container">
      <el-table :data="table.items" v-loading.body="table.loading" border fit highlight-current-row>
        <el-table-column prop="name" align="left" label="角色名称" width="150"></el-table-column>
        <el-table-column prop="description" align="left" label="角色描述" width="150"></el-table-column>
        <el-table-column align="left" label="可操作权限">
          <template slot-scope="scope">
            <span>{{scope.row.permissions.join(",")}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="更新时间" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.updatedAt | parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button size="mini" type="success" @click="action_update(scope.row,scope.$index)">
              编辑
            </el-button>
            <!-- 删除 -->
            <el-button size="mini" type="danger" @click="do_delete(scope.row,scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="margin-top-10" background @current-change="pagination"
                     :current-page.sync="table.query.page"
                     :page-size="table.perpage" layout="total, prev, pager, next, jumper"
                     :total="table.total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="form.visible" width="800px" :title="form.title">
      <el-form ref="form" :model="form.form" label-width="100px" label-position="left"
               :rules="form.rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.form.name" placeholder="角色名称，仅英文"
                    :disabled="form.action=='update'"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.form.description" placeholder="角色描述"></el-input>
        </el-form-item>
        <el-form-item label="可操作权限" prop="data">
          <el-checkbox-group v-model="form.form.permissions">
            <el-checkbox v-for="item in permissions" :key="item.name" :label="item.name">
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="form.visible=false">取消</el-button>
        <el-button v-if="form.action=='create'" type="primary" :loading="form.loading"
                   @click="do_create">保存
        </el-button>
        <el-button v-else type="primary" :loading="form.loading" @click="do_update">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { mapState, mapActions, mapMutations } from 'vuex';
import { roles, role_create, role_update, role_delete } from '@/api/rbac'

export default {
  name: 'admin_role',
  components: {},
  data() {
    return {
      permissions: [],
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
          permissions: []
        },
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入角色名称' }],
          description: [{ required: true, trigger: 'blur', message: '请输入角色描述' }],
          permissions: [{ required: true, trigger: 'blur', message: '请选择可操作权限' }]
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
    getlist() {
      this.table.loading = true
      roles(this.table.query).then(response => {
        this.table.items = response.data.roles
        this.table.total = this.table.items.length
        this.table.perpage = this.table.items.length
        this.permissions = response.data.permissions
        this.table.loading = false
      }).catch(err => {
        console.log(err)
        this.table.loading = false
      })
    },
    action_create() {
      this.form.title = '新建'
      this.form.action = 'create'
      this.form.index = undefined
      this.form.visible = true
      this.setform()
    },
    action_update(row, index) {
      this.form.title = '更新'
      this.form.action = 'update'
      this.form.index = index
      this.form.visible = true
      this.setform(row)
    },
    do_create() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.loading = true
          role_create(this.form.form).then(response => {
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
    do_update() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.loading = true
          role_update(this.form.form.name, this.form.form).then(response => {
            this.table.items.splice(this.form.index, 1, response.data)
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
    do_delete(row, index) {
      if (confirm('确认删除?')) {
        role_delete(row.name).then(response => {
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
    setform(row) {
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields()
      }
      if (row === undefined || row === null) {
        this.form.form = {
          name: '',
          description: '',
          permissions: []
        }
      } else {
        this.form.form = Object.assign({}, row)
      }
    }
  },
}
</script>

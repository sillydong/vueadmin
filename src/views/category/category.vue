<style scoped>

</style>
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="action_create()" class=filter-item>添加</el-button>
    </div>
    <div class="table-container">
      <el-table :data="table.items" v-loading.body="table.loading" border fit highlight-current-row>
        <el-table-column prop="id" align="left" label="ID" width="50"></el-table-column>
        <el-table-column align="left" label="分类名">
          <template slot-scope="scope">
            <span v-if="scope.row.parent==0">{{scope.row.name}}</span>
            <span v-else>
              |<template v-for="n in parseInt(scope.row.level)-1">—</template>
              {{scope.row.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button size="mini" type="success" @click="action_update(scope.row,scope.$index)">
              编辑
            </el-button>
            <!-- 删除 -->
            <el-button size="mini" type="danger" @click="do_delete(scope.row,scope.$index)">
              删除
            </el-button>
            <!-- 禁用启用 -->
            <el-button v-if="scope.row.status==1" size="mini" type="danger"
                       @click="do_disable(scope.row,scope.$index)">禁用
            </el-button>
            <el-button v-else size="mini" type="primary"
                       @click="do_enable(scope.row,scope.$index)">启用
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
        <el-form-item label="父分类" prop="parent">
          <el-select v-model="form.form.parent" placeholder="选择父分类或留空" :clearable="true" @change="updatelevel">
            <el-option value="0" label="无"></el-option>
            <el-option v-for="item in table.items" v-if="item.id!==form.form.id" :key="item.id" :label="item.name" :value="item.id">
              <span v-if="item.level==1">{{item.name}}</span>
              <span v-else>
                |<template v-for="n in parseInt(item.level)-1">—</template>
                {{item.name}}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名" prop="name">
          <el-input v-model="form.form.name" placeholder=""/>
        </el-form-item>

        <el-form-item label="BANNER图" prop="image">
          <singleimage :baseurl="baseurl" prefix="category" v-model="form.form.image" info="限高470像素，内容区域宽度1200像素"/>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.form.sort" placeholder=""/>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <template>
            <el-switch v-model="form.form.status" active-value="1" inactive-value="0"
                       active-text="启用" inactive-text="禁用"/>
          </template>
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
  //import { mapState, mapActions, mapMutations } from 'vuex';
  import {index, create, update, remove, enable, disable, recommand, unrecommand} from "@/api/base";
  import singleimage from '@/components/upload_qiniu/singleimage'

  export default {
    name: "category_category",
    components: {
      singleimage
    },
    data() {
      return {
        baseurl:process.env.imageUrl,
        tree:[],
        table: {
          query: {
            page: 1,
          },
          items: [],
          total: 0,
          perpage: 0,
          loading: false
        },
        form: {
          form: {
            id: undefined,
            name:'',
            parent:0,
            image:'',
            level:"1",
            sort:"0",
            status: "1",
          },
          rules: {
            name: [{required: true, trigger: 'blur', message: "请输入分类名"}],
            image:[{required: true, trigger: 'blur', message: "请上传分类banner图"}],
          },
          index: undefined,
          visible: false,
          action: "",
          loading: false,
          title: ""
        }
      };
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
        this.table.loading = true;
        index("category", this.table.query).then(response => {
          this.tree = response.data.tree;
          this.table.items = response.data.list.items;
          this.table.total = response.data.list._meta.totalCount;
          this.table.perpage = response.data.list._meta.perPage;
          this.table.loading = false;
        }).catch(err => {
          console.log(err);
          this.table.loading = false;
        });
      },
      action_create() {
        this.form.title = "新建";
        this.form.action = "create";
        this.form.index = undefined;
        this.form.visible = true;
        this.setform();
      },
      action_update(row, index) {
        this.form.title = "更新";
        this.form.action = "update";
        this.form.index = index;
        this.form.visible = true;
        this.setform(row);
      },
      do_create() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.loading = true;
            create("category", this.form.form).then(response => {
              this.getlist();
              // this.table.items.unshift(response.data);
              this.form.visible = false;
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
              this.form.loading = false;
            }).catch(err => {
              console.log(err);
              this.form.loading = false;
            });
          }
        })
      },
      do_update() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.loading = true;
            update("category", this.form.form.id, this.form.form).then(response => {
              this.getlist();
              // this.table.items.splice(this.form.index, 1,
              //     Object.assign(this.table.items[this.form.index], response.data));
              this.form.visible = false;
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              });
              this.form.loading = false;
            }).catch(err => {
              console.log(err);
              this.form.loading = false;
            });
          }
        })
      },
      do_delete(row, index) {
        if (confirm("确认删除?")) {
          remove("category", row.id).then(response => {
            this.getlist();
            // this.table.items.splice(index, 1);
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
          }).catch(err => {
            console.log(err)
          })
        }
      },
      do_enable(row, index) {
        if (confirm("确认启用?")) {
          enable("category", row.id).then(response => {
            this.table.items.splice(index, 1,
                Object.assign(this.table.items[index], response.data));
            this.$notify({
              title: '成功',
              message: '启用成功',
              type: 'success',
              duration: 2000
            });
          }).catch(err => {
            console.log(err)
          })
        }
      },
      do_disable(row, index) {
        if (confirm("确认禁用?")) {
          disable("category", row.id).then(response => {
            this.table.items.splice(index, 1,
                Object.assign(this.table.items[index], response.data));
            this.$notify({
              title: '成功',
              message: '禁用成功',
              type: 'success',
              duration: 2000
            });
          }).catch(err => {
            console.log(err)
          })
        }
      },
      setform(row) {
        if (this.$refs.form !== undefined) {
          this.$refs.form.resetFields();
        }
        if (row === undefined || row === null) {
          this.form.form = {
            id: undefined,
            name:'',
            parent:"",
            image:'',
            level:1,
            sort:"0",
            status: 1,
          };
        } else {
          this.form.form = Object.assign({}, row);
        }
      },
      updatelevel(val){
        if(val==="" || val == 0){
          this.form.form.level = 1;
        }else{
          const _self = this;
          this.table.items.forEach(function (item) {
            if(item.id === val){
              _self.form.form.level = parseInt(item.level)+1;
            }
          });
        }
      }
    },
  };
</script>

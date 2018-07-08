<style scoped>

</style>
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select class=filter-item v-model="table.query.category_id" placeholder="分类" :clearable="true">
        <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id">
          <span v-if="item.level==1">{{item.name}}</span>
          <span v-else>
                |<template v-for="n in parseInt(item.level)-1">—</template>
                {{item.name}}
              </span>
        </el-option>
      </el-select>
      <el-button type="primary" @click="search()" class=filter-item>搜索</el-button>
      <router-link :to="{name:'goods_edit'}">
        <el-button class=filter-item type="primary">添加商品</el-button>
      </router-link>
    </div>
    <div class="table-container">
      <el-table :data="table.items" v-loading.body="table.loading" border fit highlight-current-row>
        <el-table-column prop="id" align="left" label="ID" width="50px"></el-table-column>
        <el-table-column align="left" label="图片">
          <template slot-scope="scope">
            <a :href="scope.row.cover | parseImage" target="_blank">
              <img :src="scope.row.cover | parseImage" alt="" height="50px">
            </a>
          </template>
        </el-table-column>
        <el-table-column align="left" label="分类">
          <template slot-scope="scope">
            <span>{{flatcategories[scope.row.category_id]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="标题" prop="name"></el-table-column>
        <el-table-column align="left" label="更新时间" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.updated_at | parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <router-link :to="{name:'goods_edit',query:{id:scope.row.id}}">
              <el-button size="mini" type="success">编辑</el-button>
            </router-link>
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
  </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex';
  import {index, remove, enable, disable, recommand, unrecommand} from "@/api/base";

  export default {
    name: "goods_index",
    components: {},
    data() {
      return {
        categories:[],
        flatcategories:[],
        table: {
          query: {
            page: 1,
          },
          items: [],
          total: 0,
          perpage: 0,
          loading: false
        },
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
        index("goods", this.table.query).then(response => {
          this.categories = response.data.categories;
          this.flatcategories = response.data.flatcategories;
          this.table.items = response.data.list.items;
          this.table.total = response.data.list._meta.totalCount;
          this.table.perpage = response.data.list._meta.perPage;
          this.table.loading = false;
        }).catch(err => {
          console.log(err);
          this.table.loading = false;
        });
      },
      do_delete(row, index) {
        if (confirm("确认删除?")) {
          remove("goods", row.id).then(response => {
            this.table.items.splice(index, 1);
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
          enable("goods", row.id).then(response => {
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
          disable("goods", row.id).then(response => {
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
      do_recommand(row, index) {
        if (confirm("确认推荐?")) {
          recommand("goods", row.id).then(response => {
            this.table.items.splice(index, 1,
                Object.assign(this.table.items[index], response.data));
            this.$notify({
              title: '成功',
              message: '推荐成功',
              type: 'success',
              duration: 2000
            });
          }).catch(err => {
            console.log(err)
          })
        }
      },
      do_unrecommand(row, index) {
        if (confirm("确认取消推荐?")) {
          unrecommand("goods", row.id).then(response => {
            this.table.items.splice(index, 1,
                Object.assign(this.table.items[index], response.data));
            this.$notify({
              title: '成功',
              message: '取消推荐成功',
              type: 'success',
              duration: 2000
            });
          }).catch(err => {
            console.log(err)
          })
        }
      },
    },
  };
</script>

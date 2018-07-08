<style scoped>

</style>
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="table.query.category_id" placeholder="分类" :clearable="true" class="filter-item">
        <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id">
          <span v-if="item.level==1">{{item.name}}</span>
          <span v-else>
                |<template v-for="n in parseInt(item.level)-1">—</template>
                {{item.name}}
              </span>
        </el-option>
      </el-select >
      <el-select v-model="table.query.status" placeholder="订单状态" :clearable="true" class="filter-item" style="width: 100px;">
        <el-option v-for="(item,index) in statuses" :key="index" :label="item" :value="index"></el-option>
      </el-select>
      <el-select v-model="table.query.pay_type" placeholder="支付类型" :clearable="true" class="filter-item" style="width: 100px;">
        <el-option v-for="(item,index) in pays" :key="index" :label="item" :value="index"></el-option>
      </el-select>
      <el-input v-model="table.query.user_id" placeholder="用户ID" class="filter-item"></el-input>
      <el-input v-model="table.query.trade_no" placeholder="商户订单号" class="filter-item"></el-input>
      <el-button type="primary" @click="search()" class=filter-item>搜索</el-button>
    </div>
    <div class="table-container">
      <el-table :data="table.items" v-loading.body="table.loading" border fit highlight-current-row>
        <el-table-column prop="id" align="left" label="ID" width="50px"></el-table-column>
        <el-table-column label="订单信息">
          <template slot-scope="scope">
            <div>
              <el-row>
                <el-col :span="16"><span>订单编号:{{scope.row.trade_no}}</span></el-col>
                <el-col :span="8"><span>订单状态:{{statuses[scope.row.status]}}</span></el-col>
              </el-row>
              <template v-for="item in scope.row.goods">
                <el-row :key="item.id">
                  <el-col :span="4"><img :src="item.list_pic_url|parseImage()" alt="" style="width:80px;height:80px"></el-col>
                  <el-col :span="12">
                    <span>商品：【{{item.goods_id}}】.{{item.goods_name}}</span><br>
                    <span>属性：【{{item.product_id}}】.{{item.product_spec}}</span>
                  </el-col>
                  <el-col :span="4">
                    <span>数量：{{item.number}}</span>
                  </el-col>
                </el-row>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250px">
          <template slot-scope="scope">
            <!-- 查看	-->
            <router-link :to="{name:'order_detail',query:{id:scope.row.id}}">
              <el-button size="mini" type="primary">查看</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="margin-top-10" background @current-change="getlist"
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
    name: "order_list",
    components: {},
    data() {
      return {
        categories:[],
        flatcategories:[],
        shops:[],
        types:[],
        statuses:[],
        pays:[],
        table: {
          query: {
            status:undefined,
            category_id:undefined,
            user_id:undefined,
            pick_shop_id:undefined,
            trade_no:undefined,
            type:undefined,
            pay_type:undefined,
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
        index("orders", this.table.query).then(response => {
          this.categories = response.data.categories;
          this.flatcategories = response.data.flatcategories;
          this.shops = response.data.shops;
          this.types = response.data.types;
          this.statuses = response.data.statuses;
          this.pays = response.data.pays;
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
          remove("orders", row.id).then(response => {
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
          enable("orders", row.id).then(response => {
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
          disable("orders", row.id).then(response => {
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
          recommand("orders", row.id).then(response => {
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
          unrecommand("orders", row.id).then(response => {
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
      gotodetail(id){
        console.log(id)
        window.location.href="/#/order/detail?id="+id;
      }
    },
  };
</script>

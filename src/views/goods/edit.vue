<template>
  <div class="app-container">
    <el-row>
      <el-form ref="goods_form" :model="goods_form.form" label-width="100px" label-position="left"
                :rules="goods_form.rules">
        <el-form-item label="所属分类" prop="category_id">
          <el-select v-model="goods_form.form.category_id" placeholder="选择分类">
            <el-option v-for="item in categories" :key="item.id" :label="item.name"
                        :value="item.id">
              <span v-if="item.level==1">{{item.name}}</span>
              <span v-else>
              |<template v-for="n in parseInt(item.level)-1">—</template>
              {{item.name}}
            </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中文名" prop="name">
          <el-input v-model="goods_form.form.name" placeholder="商品中文名"/>
        </el-form-item>
        <el-form-item label="头图" prop="banner">
          <singleimage :baseurl="baseurl" prefix="goods" v-model="goods_form.form.banner"
                        info="建议尺寸1472*470像素"/>
        </el-form-item>
        <el-form-item label="售价" prop="normal_price">
          <el-input v-model="goods_form.form.normal_price" placeholder="售价"/>
        </el-form-item>
        <el-form-item label="商品标签" prop="is_new">
          <template>
            <el-select v-model="goods_form.form.is_new">
              <el-option value="0" label="无"></el-option>
              <el-option value="1" label="新品"></el-option>
              <el-option value="2" label="当季"></el-option>
              <el-option value="3" label="人气"></el-option>
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <template>
            <el-switch v-model="goods_form.form.status" active-value="1" inactive-value="0"
                        active-text="启用" inactive-text="禁用"/>
          </template>
        </el-form-item>


      </el-form>
      <div style="width: 100%;text-align: center;">
        <el-button v-if="goods_form.action=='create'" type="primary" :loading="goods_form.loading"
                    @click="do_create" style="width: 100px;">保存
        </el-button>
        <el-button v-else type="primary" :loading="goods_form.loading" @click="do_update"
                    style="width: 100px;">更新
        </el-button>
      </div>
    </el-row>

  </div>
</template>

<script>
  // import { mapState, mapActions, mapMutations } from 'vuex';
  import {index, create, update,view, remove, enable, disable, recommand, unrecommand} from "@/api/base";
  import singleimage from '@/components/upload_qiniu/singleimage'

  export default {
    name: 'goods_edit',
    components: {singleimage},
    data() {
      return {
        baseurl: process.env.imageUrl,
        id: undefined,
        categories: [],
        flatcategories: [],
        goods_form: {
          form: {
            id:undefined,
            name: '',
            banner: '',
            normal_price: '0',
            is_new: '1',
            status: "1",
          },
          rules: {
            category_id: [{required: true, trigger: 'blur', message: "请选择所属分类"}],
            name: [{required: true, trigger: 'blur', message: "请填写商品名"}],
          },
          loading: false,
          action: '',
        },
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
        this.id = this.$route.query.id;
        if (this.id !== undefined && this.id !== null) {
          this.goods_form.action = 'update';
        } else {
          this.goods_form.action = 'create';
        }
        getvuew();
      },
      getview() {
        this.goods_form.loading = true;
        view('goods',this.id).then(response => {
          this.categories = response.data.categories;
          this.flatcategories = response.data.flatcategories;
          this.setform(response.data.item);
          this.goods_form.loading = false;
        }).catch(err => {
          console.log(err);
          this.goods_form.loading = false;
        });
      },
      //goods
      do_create() {
        this.$refs.goods_form.validate(valid => {
          if (valid) {
            this.goods_form.loading = true;
            create("goods", this.goods_form.form).then(response => {
              this.id = response.data.id;
              this.goods_form.form = response.data;
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
              this.goods_form.loading = false;
              this.$router.replace({name: 'goods_edit', query: {id: response.data.id}});
              this.getview();
            }).catch(err => {
              console.log(err);
              this.goods_form.loading = false;
            });
          }
        })
      },
      do_update() {
        this.$refs.goods_form.validate(valid => {
          if (valid) {
            this.goods_form.loading = true;
            update("goods", this.id, this.goods_form.form).then(response => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              });
              this.goods_form.loading = false;
              this.getview()
            }).catch(err => {
              console.log(err);
              this.goods_form.loading = false;
            });
          }
        })
      },
      setform(row) {
        if (this.$refs.goods_form !== undefined) {
          this.$refs.goods_form.resetFields();
        }
        if (row === undefined || row === null) {
          this.id=undefined;
          this.goods_form.form = {
            id:undefined,
            name: '',
            banner: '',
            normal_price: '0',
            is_new: '1',
            status: "1",
          };
        } else {
          this.goods_form.form = Object.assign({}, row);
        }
      },
    },
  }
</script>

<style scoped>
  .el-card+.el-card{
    margin-top: 10px;
  }
</style>

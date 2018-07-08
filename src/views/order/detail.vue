<template>
  <div>TEMPOLORILY EMPTY</div>
</template>

<script>
// import { mapState, mapActions, mapMutations } from 'vuex';
import {index, create, update,view, remove, enable, disable, recommand, unrecommand} from "@/api/base";

export default {
  name:'goods_detail',
  components: {},
  data() {
    return {
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
    },
    getview(){
      this.loading=true;
      view('orders',this.id).then(response=>{
        this.categories = response.data.categories;
        this.flatcategories = response.data.flatcategories;
        this.shops = response.data.shops;
        this.types = response.data.types;
        this.statuses = response.data.statuses;
        this.pays = response.data.pays;
        this.order = response.data.item;
        this.shipping_areas = response.data.shipping_areas;
        this.expresscomps=response.data.expresscomps;
        this.loading=false;
      }).catch(err=>{
        console.log(err)
        this.loading=false;
      })
    },
  },
}
</script>

<style scoped>
  .app-container{
    font-size: 14px;
    color: #606266;
  }
  .el-col{
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .el-col+.el-col{
    padding-right: 5px;
    padding-left: 5px;
  }
</style>

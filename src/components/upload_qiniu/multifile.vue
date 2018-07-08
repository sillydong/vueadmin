<style lang="less">
  .multifile-upload-container{
    .el-upload-list{
      width: 300px;
    }
  }
</style>
<template>
  <div class="multifile-upload-container">
    <div slot="tip" class="el-upload__tip"
         style="margin-top:0;width:100%;float: left;display: block">{{info}}
    </div>
    <el-upload :data="dataObj" :file-list="filelist" :multiple="true"
               :show-file-list="true" action="//up.qbox.me/" accept="*"
               :on-success="handleScucess" :on-error="handleError" :on-remove="handleRemove" :on-preview="handlePreview"
               :before-upload="beforeUpload">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
  import {qiniu_file} from '@/api/upload'

  function noop() {
  }

  export default {
    name: 'multiimage',
    props: {
      baseurl:{
        type:String,
        default: ''
      },
      value: {
        type: Array,
        default() {
          return [];
        }
      },
      prefix: {
        type: String,
        default: '',
      },
      info: {
        type: String,
        default: '',
      },
      limit:{
        type: Number,
        default:0,
      },
      onRemove: {
        type: Function,
        default: noop
      },
      onSuccess: {
        type: Function,
        default: noop
      },
    },
    computed: {
      // filelist(){
      //   let filelist = [];
      //   if(this.value!==null){
      //     var _self = this;
      //     this.value.forEach(function (item) {
      //       filelist.push({name:'',url:_self.baseurl+item})
      //     })
      //   }
      //   return filelist;
      // },
    },
    watch:{
      value(val){
        this.files = val;
      },
      files(val){
        this.$emit('input',val)
      }
    },
    data() {
      return {
        filelist:[],
        files:[],
        preview: false,
        preview_url:'',
        dataObj: {token: '', key: ''}
      }
    },
    methods: {
      generateFilelist(){
        if(this.value!==null){
          const _self = this;
          this.value.forEach(function (item) {
            _self.filelist.push({name:item,url:_self.baseurl+item})
          })
        }
      },
      handlePreview(file){
        window.open(file.url,"_blank")
      },
      handleRemove(file,fileList) {
        this.onRemove(file);
        const _self = this;
        this.files.forEach(function (item,index) {
          if(file.url.indexOf(item)>0){
            _self.files.splice(index,1);
          }
        })
      },
      handleScucess(res, file,fileList) {
        this.onSuccess("/" + res.key);
        this.files.push("/" + res.key);
        this.generateFilelist()
      },
      handleError(err, file) {
        console.log(err)
      },
      beforeUpload(file) {
        const _self = this;
        return new Promise((resolve, reject) => {
          qiniu_file(_self.prefix,file.name, 0).then(response => {
            _self._data.dataObj.token = response.data.token;
            _self._data.dataObj.key = response.data.key;
            resolve(true)
          }).catch(err => {
            console.log(err);
            reject(false)
          })
        })
      }
    },
    created(){
      this.generateFilelist()
    }
  }
</script>

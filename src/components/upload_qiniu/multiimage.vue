<style lang="less">
</style>
<template>
  <div class="multiimage-upload-container">
    <div slot="tip" class="el-upload__tip"
         style="margin-top:0;width:100%;float: left;display: block">{{info}}
    </div>
    <el-upload :data="dataObj" :file-list="filelist" :multiple="true"
               list-type="picture-card" :show-file-list="true" action="//up.qbox.me/" accept="image/*"
               :on-success="handleScucess" :on-error="handleError" :on-remove="handleRemove" :on-preview="handlePreview"
               :before-upload="beforeUpload">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="preview" width="50%">
      <img width="100%" :src="preview_url" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {qiniu_image} from '@/api/upload'

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
    },
    watch:{
      value(val){
        if(!this.uploading){
          this.uploaded = val.length;
          this.xtmpfiles = val;
          this.filelist = [];
          const _self = this;
          if(val!==null){
            val.forEach(function (item) {
              _self.filelist.push({name:'',url:_self.baseurl+item})
            })
          }
        }
      },
    },
    data() {
      return {
        filelist:[],
        preview: false,
        preview_url:'',
        dataObj: {token: '', key: ''},
        xtmpfiles:[],
        uploaded:0,
        uploading:false,
      }
    },
    methods: {
      handlePreview(file){
        this.preview_url = file.url;
        this.preview=true;
      },
      handleRemove(file,fileList){
        const _self = this;
        this.onRemove(file);
        this.xtmpfiles.forEach(function (item,index) {
          if(file.url.indexOf(item)>0){
            _self.xtmpfiles.splice(index,1);
          }
        })
      },
      handleScucess(res, file,fileList) {
        this.uploaded++;
        this.xtmpfiles.push("/"+res.key);
        if(this.uploaded === fileList.length){
          this.$emit('input',this.xtmpfiles)
        }
        this.onSuccess("/" + res.key);
      },
      handleError(err, file,fileList) {
        this.uploaded++;
        if(this.uploaded===fileList.length){
          this.uploading=false;
        }
      },
      beforeUpload(file) {
        this.uploading=true;
        const _self = this;
        return new Promise((resolve, reject) => {
          qiniu_image(_self.prefix,file.name, 0).then(response => {
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
  }
</script>

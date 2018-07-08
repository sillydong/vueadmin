<style lang="less">
</style>
<template>
  <div class="singleimage-upload-container">
    <div slot="tip" class="el-upload__tip"
         style="margin-top:0;width:100%;float: left;display: block">{{info}}
    </div>
    <el-upload :data="dataObj" :file-list="filelist" :multiple="false" :limit="2"
               list-type="picture-card" :show-file-list="true" action="//up.qbox.me/" accept="image/*"
               :on-success="handleScucess" :on-error="handleError" :on-remove="handleRemove" :on-preview="handlePreview"
               :before-upload="beforeUpload" :on-change="handleChange">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="preview" width="50%">
      <img width="100%" :src="preview_url" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {qiniu_image} from '@/api/upload'

  export default {
    name: 'singleimage',
    props: {
      baseurl:{
        type:String,
        default: ''
      },
      value: {
        type: String,
        default: '',
      },
      prefix: {
        type: String,
        default: '',
      },
      info: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        preview: false,
        preview_url:'',
        dataObj: {token: '', key: ''}
      }
    },
    computed: {
      filelist(){
        if(this.value!==""){
          return [{name:'',url:this.baseurl+this.value}];
        }
        return [];
      }
    },
    methods: {
      handlePreview(file){
        this.preview_url = file.url;
        this.preview=true;
      },
      handleRemove(file) {
        this.emitInput('')
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      handleScucess(res, file) {
        this.emitInput("/"+res.key)
      },
      handleError(err, file) {
        console.log(err)
        alert(err.message);
      },
      handleChange(file,fileList){
        if(fileList.length>1){
          fileList.splice(0,1)
        }
      },
      beforeUpload(file) {
        const _self = this
        return new Promise((resolve, reject) => {
          qiniu_image(_self.prefix, file.name, 0).then(response => {
            _self._data.dataObj.token = response.data.token;
            _self._data.dataObj.key = response.data.key;
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
      }
    }
  }
</script>

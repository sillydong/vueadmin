<style lang="less">
  .singlevideo-upload-container{
    .el-upload-list{
      width: 300px;
    }
  }
</style>
<template>
  <div class="singlevideo-upload-container">
    <div slot="tip" class="el-upload__tip"
         style="margin-top:0;width:100%;float: left;display: block">{{info}}
    </div>
    <el-upload :data="dataObj" :file-list="filelist" :multiple="false" :limit="2"
               :show-file-list="true" action="//up.qbox.me/" accept="video/*"
               :on-success="handleScucess" :on-error="handleError" :on-remove="handleRemove" :on-preview="handlePreview"
               :before-upload="beforeUpload" :on-change="handleChange">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-dialog :visible.sync="preview" width="50%" :before-close="stopvideo">
      <video id="video" :src="preview_url" width="100%" controls="controls">您的浏览器不支持 video 标签。</video>
    </el-dialog>
  </div>
</template>

<script>
  import {qiniu_video} from '@/api/upload'

  export default {
    name: 'singlevideo',
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
          return [{name:this.value,url:this.baseurl+this.value}];
        }
        return [];
      }
    },
    methods: {
      stopvideo(done){
        const video = document.getElementById("video");
        video.pause();
        done();
      },
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
          qiniu_video(_self.prefix, file.name).then(response => {
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

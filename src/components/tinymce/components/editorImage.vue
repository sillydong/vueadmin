<template>
  <div class="upload-container">
    <el-button
      :style="{background:color,borderColor:color}"
      icon="upload"
      type="primary"
      @click="dialogVisible=true"
    >
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :data="dataObj"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        list-type="picture-card"
        class="editor-slide-upload"
        action="//up.qbox.me/"
      />
      <el-button @click="dialogVisible = false">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </el-dialog>
  </div>
</template>
<script>
import { qiniu_image } from 'app/api/upload'

export default {
  name: 'editorImage',
  props: {
    color: {
      type: String,
      default: '#20a0ff'
    },
    prefix: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      baseUrl: process.env.imageUrl,
      dialogVisible: false,
      listObj: {},
      fileList: [],
      dataObj: { token: '', key: '' }
    }
  },
  methods: {
    checkAllSuccess () {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit () {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
        return
      }
      console.log(arr)
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess (response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = this.baseUrl + '/' + response.key
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove (file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload (file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        qiniu_image(_self.prefix, file.name, 0).then(response => {
          _self._data.dataObj.token = response.data.token
          _self._data.dataObj.key = response.data.key

          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function () {
            _self.listObj[fileName] = {
              hasSuccess: false,
              uid: file.uid,
              width: this.width,
              height: this.height
            }
          }

          resolve(true)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .upload-container {
    .editor-slide-upload {
      margin-bottom: 20px;
    }
  }
</style>

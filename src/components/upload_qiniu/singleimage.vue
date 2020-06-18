<style lang="less">
</style>
<template>
  <div class="singleimage-upload-container">
    <div
      slot="tip"
      class="el-upload__tip"
      style="margin-top:0;width:100%;float: left;display: block"
    >
      {{ info }}
    </div>
    <el-upload
      :data="dataObj"
      :file-list="filelist"
      :multiple="false"
      :limit="2"
      :show-file-list="true"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      list-type="picture-card"
      action="//up.qbox.me/"
      accept="image/*"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog
      :visible.sync="preview"
      width="50%"
      append-to-body
    >
      <img
        :src="preview_url"
        width="100%"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script>
import { qiniu_image } from '@/api/upload'

export default {
  name: 'singleimage',
  props: {
    baseurl: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    prefix: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      preview: false,
      preview_url: '',
      dataObj: { token: '' }
    }
  },
  computed: {
    filelist () {
      if (this.value != null && this.value !== '') {
        return [{ name: '', url: this.baseurl + this.value }]
      }
      return []
    }
  },
  methods: {
    handlePreview (file) {
      this.preview_url = file.url
      this.preview = true
    },
    handleRemove (file) {
      this.emitInput('')
    },
    emitInput (val) {
      this.$emit('input', val)
    },
    handleSuccess (res, file) {
      this.emitInput('/' + res.key)
    },
    handleError (err, file) {
      console.log(err)
      alert(err.message)
    },
    handleChange (file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
    },
    beforeUpload (file) {
      const _self = this
      return new Promise((resolve, reject) => {
        qiniu_image(_self.prefix, file.name, 0).then(response => {
          _self._data.dataObj.token = response.data.token
          resolve(true)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
</script>

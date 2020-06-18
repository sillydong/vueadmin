<style lang="less">
</style>
<template>
  <div class="multiimage-upload-container">
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
      :multiple="true"
      :show-file-list="true"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :before-upload="beforeUpload"
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
  name: 'multiimage',
  props: {
    baseurl: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default () {
        return []
      }
    },
    prefix: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      preview: false,
      preview_url: '',
      dataObj: { token: '' },
      xtmpfiles: [],
      updatable: true
    }
  },
  computed: {
    filelist () {
      if (this.updatable) {
        const _self = this
        _self.xtmpfiles = []
        _self.value.forEach(function (item) {
          if (item.startsWith(_self.baseurl)) {
            _self.xtmpfiles.push({ url: item })
          } else {
            _self.xtmpfiles.push({ url: _self.baseurl + item })
          }
        })
      }
      return this.xtmpfiles
    }
  },
  methods: {
    handlePreview (file) {
      this.preview_url = file.url
      this.preview = true
    },
    handleRemove (file, fileList) {
      this.updatable = true
      const value = fileList.map(v => v.url)
      this.$emit('input', value)
    },
    handleSuccess (res, file, fileList) {
      if (this.value == null) {
        this.value = []
      }
      if (fileList.length === this.value.length + 1) {
        this.updatable = true
      } else {
        this.updatable = false
      }
      const url = '/' + res.key
      this.$emit('input', [...this.value, url])
    },
    handleError (err, file, fileList) {
      console.log(err)
      if (fileList.length === this.value.length + 1) {
        this.updatable = true
      } else {
        this.updatable = false
      }
    },
    beforeUpload (file) {
      this.uploading = true
      const _self = this
      return new Promise((resolve, reject) => {
        qiniu_image(_self.prefix, file.name, 1).then(response => {
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

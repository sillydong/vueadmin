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
import { qiniu_image, persistent } from 'app/api/upload'

function noop () {
}

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
    },
    onRemove: {
      type: Function,
      default: noop
    },
    onSuccess: {
      type: Function,
      default: noop
    }
  },
  data () {
    return {
      filelist: [],
      preview: false,
      preview_url: '',
      dataObj: { token: '', key: '' },
      xtmpfiles: [],
      uploaded: 0,
      uploading: false
    }
  },
  computed: {
  },
  watch: {
    value (val) {
      if (!this.uploading) {
        this.uploaded = val.length
        this.xtmpfiles = []
        this.filelist = []
        const _self = this
        if (val !== null) {
          val.forEach(function (item) {
            _self.filelist.push({ name: item.url, url: _self.baseurl + item.url, id: item.id })
            _self.xtmpfiles.push({ name: item.url, url: item.url, id: item.id })
          })
        }
      }
    }
  },
  methods: {
    handlePreview (file) {
      this.preview_url = file.url
      this.preview = true
    },
    handleRemove (file, fileList) {
      const _self = this
      let currentkey = ''
      if (file.response !== undefined) {
        currentkey = file.response.key
      } else {
        currentkey = file.name
      }
      this.xtmpfiles.forEach(function (item, index) {
        if (item.url.indexOf(currentkey) >= 0) {
          _self.uploaded--
          _self.xtmpfiles.splice(index, 1)
          _self.onRemove(item)
          return true
        }
      })
    },
    handleSuccess (res, file, fileList) {
      this.uploaded++
      this.xtmpfiles.push({ name: file.name, url: '/' + res.key, id: file.uid })
      let persistentId = res.persistentId
      if (persistentId !== undefined && persistentId !== null) {
        persistent(persistentId).then(resp => {
          if (this.uploaded === fileList.length) {
            this.$emit('input', this.xtmpfiles)
          }
          this.onSuccess('/' + res.key)
        }).catch(err => {
          console.log(err)
          if (this.uploaded === fileList.length) {
            this.$emit('input', this.xtmpfiles)
          }
          this.onSuccess('/' + res.key)
        })
      } else {
        if (this.uploaded === fileList.length) {
          this.$emit('input', this.xtmpfiles)
        }
        this.onSuccess('/' + res.key)
      }
    },
    handleError (err, file, fileList) {
      console.log(err)
      this.uploaded++
      if (this.uploaded === fileList.length) {
        this.uploading = false
      }
    },
    beforeUpload (file) {
      this.uploading = true
      const _self = this
      return new Promise((resolve, reject) => {
        qiniu_image(_self.prefix, file.name, 1).then(response => {
          _self._data.dataObj.token = response.data.token
          _self._data.dataObj.key = response.data.key
          resolve(true)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
</script>

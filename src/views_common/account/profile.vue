<template>
  <div class="app-container">
        <div style="width: 400px;">
          <el-form ref="form" :model="form.form" label-width="100px" label-position="left"
                   :rules="form.rules">
            <el-form-item label="昵称：">
              <el-input v-model="nickname" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="登陆账号">
              <el-input v-model="username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="原密码" prop="oldpass">
              <el-input v-model="form.form.oldpass" type="password" placeholder="请输入旧密码"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpass">
              <el-input v-model="form.form.newpass" type="password" placeholder="请输入新密码，至少8位字符"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmpass">
              <el-input v-model="form.form.confirmpass" type="password" placeholder="请再次输入新密码"
                        auto-complete="off"></el-input>
            </el-form-item>
            <div class="buttons">
              <el-button type="primary" long :loading="form.loading" @click="do_update">更新
              </el-button>
            </div>
          </el-form>
        </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { profile } from '@/api/account'

export default {
  name: 'profile',
  components: {},
  data() {
    const validatePasswordA = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不能小于8位'))
      } else if (this.form.form.confirmpass.length > 0 && value !== this.form.form.confirmpass) {
        callback(new Error('两次输入密码不相同'))
      } else {
        callback()
      }
    }
    const validatePasswordB = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不能小于8位'))
      } else if (value !== this.form.form.newpass) {
        callback(new Error('两次输入密码不相同'))
      } else {
        callback()
      }
    }
    return {
      form: {
        form: {
          oldpass: '',
          newpass: '',
          confirmpass: ''
        },
        rules: {
          oldpass: [{ required: true, trigger: 'blur', message: '请输入旧密码' }],
          newpass: [{ trigger: 'blur', validator: validatePasswordA }],
          confirmpass: [{ trigger: 'blur', validator: validatePasswordB }]
        },
        loading: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'nickname'
    ])
  },
  methods: {
    do_update() {
      this.$refs.form.validate(valid => {
        if (valid) {
          profile(this.form.form).then(response => {
            this.$store.dispatch('clean').then(() => {
              this.$notify({
                title: '成功',
                message: '修改密码成功，请重新登陆',
                type: 'success',
                duration: 2000,
                onClose: function() {
                  location.reload()
                },
                onClick: function() {
                  location.reload()
                }
              })
            })
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  },
  watch: {},
  directives: {},
  filters: {},
  created() {
  },
  mounted() {
  }
}
</script>

<style scoped>
</style>

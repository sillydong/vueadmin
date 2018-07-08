<style lang="less">
    .login {
        width: 100%;
        height: 100%;
        background-color: #2d3a4b;
        position: relative;
        &-con {
            position: relative;
            top: 50%;
            transform: translateY(-60%);
            width: 300px;
            margin: auto;
            &-header {
                font-size: 16px;
                font-weight: 300;
                text-align: center;
                padding: 30px 0;
            }
            .form-con {
                padding: 10px 0 0;
                .el-input-group__prepend {
                    padding: 0 10px;
                }
                .el-button {
                    width: 100%;
                }
            }
        }
    }
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <el-card :bordered="false">
                <div slot="header">
                    <i class="el-icon-ic-key-o"></i>
                    欢迎登录管理后台
                </div>
                <div class="form-con">
                    <el-form ref="loginForm" :model="form" :rules="rules">
                        <el-form-item prop="username">
                            <el-input v-model="form.username" placeholder="请输入用户名" :autofocus="true" prefix-icon="el-icon-ic-user-o"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-ic-lock-o"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="handleSubmit" :tabindex="0" :loading="form.loading" type="primary" long>登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: {
        username: '',
        password: '',
        loading: false
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('login', this.form).then(() => {
            this.loading = false
            this.$router.push({
              name: 'home_index'
            })
          }).catch(err => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>

</style>

<style scoped lang="less">
  .mainheader {
    /*box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);*/
    transition: padding .3s;
    .header {
      height: 50px;
      background: #f0f0f0;
      /*box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);*/
      vertical-align: middle;
      &-navicon-con {
        margin: 6px;
        display: inline-block;
        float: left;
        .el-button {
          padding: 6px 16px;
          color: #606266;
          &:hover {
            color: #409eff;
          }
        }
      }
      &-middle-con {
        display: inline-block;
        overflow: hidden;
        height: 100%;
        float: left;
        .el-breadcrumb {
          line-height: 50px;
        }
      }
      &-avator-con {
        display: inline-block;
        float: right;
        height: 100%;
        vertical-align: middle;
        .user-dropdown {
          &-menu-con {
            right: 0;
            top: 0;
            width: 150px;
            height: 100%;
            i {
              font-size: 16px;
              vertical-align: middle;
            }
            .main-user-name {
              display: inline-block;
              word-break: keep-all;
              white-space: nowrap;
              vertical-align: middle;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: right;
            }
          }
          &-innercon {
            height: 100%;
            padding-right: 14px;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="mainheader">
    <div class="header">
      <div class="header-navicon-con">
        <el-button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}"
                   type="text"
                   @click="toggleMenu">
          <i class="el-icon-ic-view-list-o" style="font-size: 24px;"></i>
        </el-button>
      </div>
      <div class="header-middle-con">
        <el-breadcrumb>
          <el-breadcrumb-item
              v-for="item in currentPath"
              :to="{path:item.path}"
              :key="item.name"
          >{{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-avator-con">
        <div class="user-dropdown-menu-con">
          <el-row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
            <el-dropdown transfer trigger="hover" @command="handleClickUserDropdown">
              <a href="javascript:void(0)">
                <i class="el-icon-ic-user-o"></i>
                <span class="main-user-name">{{ nickname }}</span>
              </a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="loginout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import util from '@/libs/util.js'

  function noop() {
  }

  export default {
    name: "mainheader",
    components: {},
    props: {
      shrink: {
        type: Boolean,
        default: false
      },
      toggleMenu: {
        type: Function,
        default: noop
      },
    },
    computed: {
      ...mapGetters([
        'nickname'
      ]),
      currentPath() {
        return this.$store.state.app.currentPath // 当前面包屑数组
      },
    },
    methods: {
      handleClickUserDropdown(name) {
        if (name === 'profile') {
          util.openNewPage(this, 'profile')
          this.$router.push({
            name: 'profile'
          })
        } else if (name === 'loginout') {
          // 退出登录
          this.$store.dispatch('logout').then(() => {
            this.$store.commit('clearOpenedSubmenu')
            this.$router.push({
              name: 'login'
            })
          }).catch(err => {
            console.log(err)
          })
        }
      },

    }
  }
</script>


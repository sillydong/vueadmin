<style scoped lang="less">
  .mainheader {
    /*box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);*/
    transition: padding .3s;
    .header {
      height: 50px;
      /*box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);*/
      vertical-align: middle;
      &-navicon-con {
        margin: 6px;
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
        overflow: hidden;
        height: 100%;
        float: left;
        .el-breadcrumb {
          line-height: 50px;
        }
      }
      &-avator-con {
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
              margin-right: 16px;
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
        <el-button
          :style="{transform: 'rotateZ(' + (shrink ? '-90' : '0') + 'deg)'}"
          type="text"
          @click="toggleMenu"
        >
          <i
            class="el-icon-ic-view-list-o"
            style="font-size: 24px;"
          />
        </el-button>
      </div>
      <div class="header-middle-con">
        <el-breadcrumb>
          <el-breadcrumb-item
            v-for="item in currentPath"
            :key="item.name"
            :to="{path:item.path}"
          >
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-avator-con">
        <div class="user-dropdown-menu-con">
          <el-row
            type="flex"
            justify="end"
            align="middle"
            class="user-dropdown-innercon"
          >
            <el-dropdown
              v-if="enableProfile || enableLogout"
              transfer
              trigger="hover"
              @command="handleClickUserDropdown"
            >
              <a href="javascript:void(0)">
                <i class="el-icon-ic-user-o" />
                <span class="main-user-name">{{ nickname }}</span>
              </a>
              <el-dropdown-menu
                slot="dropdown"
              >
                <el-dropdown-item
                  v-if="enableProfile"
                  command="profile"
                >
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="enableLogout"
                  command="loginout"
                  divided
                >
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div
              v-else
              class="el-dropdown"
            >
              <a
                href="javascript:void(0)"
              >
                <i class="el-icon-ic-user-o" />
                <span class="main-user-name">{{ nickname }}</span>
              </a>
            </div>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import util from '@/libs/util.js'

function noop () {
}

export default {
  name: 'mainheader',
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
    enableProfile: {
      type: Boolean,
      default: true
    },
    enableLogout: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'nickname'
    ]),
    currentPath () {
      return this.$store.state.app.currentPath // 当前面包屑数组
    }
  },
  methods: {
    handleClickUserDropdown (name) {
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
    }

  }
}
</script>

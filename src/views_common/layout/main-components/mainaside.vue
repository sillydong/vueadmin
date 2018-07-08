<style lang="less">
  .mainaside {
    width: 100%;
    height: 100%;
    background: #495060;
    .header{
      padding: 10px 0 9px;
      text-align: center;
      border-bottom: solid 1px #5e6d82;
      span.long {
        width: auto;
        color: #FFFFFF;
        font-size: 24px;
        line-height: 30px;
      }
      span.short {
        padding-top: 4px;
        padding-bottom: 4px;
        width: auto;
        color: #FFFFFF;
        font-size: 18px;
        line-height: 30px;
      }
    }
    [class^="el-icon-ic"], [class*=" el-icon-ic"] {
      font-size: 24px !important;
    };
    .el-menu {
      border: 0;
      background-color: inherit;
      color: #9ea7b4;
      .is-active .el-submenu__title .layout-text {
        color: #FFFFFF;
      }
      .el-menu-item, .el-submenu__title {
        background: inherit;
        color: #9ea7b4;
        &:hover {
          background-color: #409eff;
          color: #ffffff;
        }
        &.is-active {
          color: #ffffff;
        }
        &:hover i {
          color: #FFFFFF;
        }
      }
      .rootitem.is-active i {
        color: #FFFFFF;
      }
    }

    .el-menu--collapse {
      .rootitem.is-active i {
        color: #FFFFFF;
      }
      .el-menu {
        border: 0;
        background-color: rgb(73, 80, 96);
      }
    }
  }
</style>

<template>
  <div class="mainaside">
    <div class="header">
      <span v-show="!shrink" class="long">管理后台</span>
      <span v-show="shrink" class="short">后台</span>
    </div>
    <el-menu ref="mainaside" :collapse="shrink" :default-active="$route.name" @select="handleChange"
             mode="vertical" :unique-opened="true">
      <template v-for="item in menuList">
        <el-menu-item v-if="item.children.length<=1" class="rootitem" :name="item.children[0].name"
                      :index="item.children[0].name" :key="'menuitem' + item.name">
          <i :class="item.icon"></i>
          <span slot="title" class="layout-text"
                :key="'title' + item.name">{{ item.meta.title }}</span>
        </el-menu-item>

        <el-submenu v-if="item.children.length > 1" class="rootitem" :name="item.name"
                    :key="item.name" :index="item.name">
          <template slot="title">
            <i :class="item.icon"></i>
            <span class="layout-text">{{ item.meta.title }}</span>
          </template>
          <template v-for="child in item.children">
            <el-menu-item :index="child.name" :name="child.name" :key="'menuitem' + child.name">
              <span slot="title" class="layout-text" :key="'title' + child.name">{{ child.meta.title }}</span>
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'mainaside',
    components: {},
    props: {
      shrink: {
        type: Boolean,
        default: false
      },
      menuList: {
        type: Array,
        required: true
      },
      beforePush: {
        type: Function
      },
    },
    computed: {
    },
    methods: {
      handleChange(name) {
        let willpush = true
        if (this.beforePush !== undefined) {
          if (!this.beforePush(name)) {
            willpush = false
          }
        }
        if (willpush) {
          this.$router.push({
            name: name
          })
        }
        this.$emit('on-change', name)
      }
    }
  }
</script>

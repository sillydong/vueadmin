# Vue后台使用说明
这是一个后端开发剥出来的前端模板，脱胎于[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)和[iview-admin](https://github.com/iview/iview-admin)，两者分别是element-ui和iview的实现。在实际业务中使用了两个项目进行开发之后，深感一个代码比较凌乱，一个加载慢，于是对两者取长补短，结合成了这样一个项目。目前已经在项目中使用。代码中给出了部分页面的示例代码，但是没有数据。组件的话目前只做了上传的，后面用到什么再补。

## 配置

* 在`admin`目录下执行`npm install`安装依赖
* 修改`admin/config/index.js`中15行target到实际开发域名
* 修改`admin/config/dev.env.js`及`admin/config/prod.env.js`中imageUrl为七牛域名
* 默认后台页面会有缓存，切换过程中不会请求后端。如果不需要缓存此页面，则在`admin/src/store/modules/app.js`中添加页面`name`到`dontCache`数组中

## 通用组件

* 已实现基于七牛的单图、多图、单视频、单文件、多文件上传，详见代码

## 开发

* 执行`npm run dev`启动后台
* 配置都在config目录，`dev.env`和`prod.env`中包含了接口地址和图片域名的配置，`index.js`中配置了proxytable，便于开发过程，直接修改域名即可
* 在`admin/src/views`中添加文件，实现页面，参考`views_common`中内容
* 在`admin/src/api/base.js`中实现了对rest操作的封装，包括`index`、`create`、`update`、`remove`、`view`、`enable`、`disable`、`recommand`、`unrecommand`
* 特殊接口可以在`admin/src/api/`中添加文件，参考`base.js`、`account.js`等文件
* 添加页面需要在`admin/src/router/route.js`中添加对应的路由信息，可以通过access字段实现对路由的权限要求，权限从后端接口获取
* 页面`xxx.vue`中`name`必须与`router.js`中配置的路由`name`相同
* 样式支持`css`或`less`

## 发布

* 执行`npm run build`编译

## 权限控制

* 权限控制使用了RBAC，适配用过URL进行判断权限，比如Yii2的RBAC实现
* 前端权限通过在路由中配置access数组实现，会与后端返回的权限进行对比判断，控制左侧菜单的显示隐藏

# 其他资料

* [vue](https://cn.vuejs.org/index.html)
* [element](http://element.eleme.io/)

# 欢迎PR

本人后端开发，前端酱油，欢迎PR修改错误之处，谢谢！

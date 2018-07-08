const util = {}
util.title = function (title) {
  title = title || '管理后台'
  window.document.title = title
}

util.inOf = function (arr, targetArr) {
  let res = true
  arr.forEach(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

util.oneOf = function (ele, targetArr) {
  return targetArr.indexOf(ele) >= 0
}

util.oneLike = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true
  }
  for (const item of targetArr) {
    if (item.slice(-1) === '*') {
      const len = item.length - 1
      if (item.substr(0, len) === ele.substr(0, len)) {
        return true
      }
    }
  }
  return false
}

util.showThisRoute = function (requestAccess, userAccess) {
  if (userAccess.length === 0) {
    return false
  }
  if (util.oneOf('admin', userAccess)) {
    return true
  }
  if (Array.isArray(requestAccess)) {
    for (const item of requestAccess) {
      if (util.oneLike(item, userAccess)) {
        return true
      }
    }
    return false
  } else {
    return util.oneLike(requestAccess, userAccess)
  }
}

util.getRouterObjByName = function (routers, name) {
  if (!name || !routers || !routers.length) {
    return null
  }
  // debugger;
  let routerObj = null
  for (const item of routers) {
    if (item.name === name) {
      return item
    }
    routerObj = util.getRouterObjByName(item.children, name)
    if (routerObj) {
      return routerObj
    }
  }
  return null
}

util.handleTitle = function (vm, item) {
  return item.meta.title
}

util.setCurrentPath = function (vm, name) {
  console.log(name);
  let title = '';
  let isOtherRouter = false;
  let currentPathObj;
  let childObj;
  let isFirst = false;
  item:
      for (let item of vm.$store.state.app.routers) {
        if (item.children.length === 1) {
          if (item.children[0].name === name) {
            title = util.handleTitle(vm, item);
            if (item.name === 'otherRouter') {
              isOtherRouter = true
            }
            currentPathObj = item;
            childObj = item.children[0];
            isFirst = true;
            break;
          }
        } else {
          if (item.name === name) {
            currentPathObj = item;
            childObj = item.children[0];
            isFirst = true;
            break;
          } else {
            let i = 0;
            for (let child of item.children) {
              if (child.name === name) {
                title = util.handleTitle(vm, child)
                if (item.name === 'otherRouter') {
                  isOtherRouter = true
                }
                currentPathObj = item;
                childObj = child;
                if (i === 0) {
                  isFirst = true;
                }
                break item;
              }
              i++;
            }
          }
        }
      }
  let currentPathArr = [];
  if (name === 'home_index') {
    currentPathArr = [
      {
        title: '概览',
        path: '/home',
        name: 'home_index'
      }
    ]
  } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name
      !== 'home_index') {
    if (isOtherRouter) {
      console.log(currentPathObj)
      currentPathArr = vm.$store.state.app.currentPath;
      currentPathArr.push({
        title: title,
        path: currentPathObj.path + childObj.path,
        name: name
      })
      console.log(currentPathArr)
    } else {
      currentPathArr = [
        {
          title: '概览',
          path: '/home',
          name: 'home_index'
        },
        {
          title: title,
          path: currentPathObj.path + '/' + childObj.path,
          name: currentPathObj.name
        }
      ]
    }
  } else {
    if (currentPathObj.children.length <= 1 && currentPathObj.name
        === 'home_index') {
      currentPathArr = [
        {
          title: '概览',
          path: '/home',
          name: 'home_index'
        }
      ]
    } else if (currentPathObj.children.length <= 1 && currentPathObj.name
        !== 'home_index') {
      currentPathArr = [
        {
          title: '概览',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.meta.title,
          path: (isFirst ? '' : currentPathObj.path),
          name: currentPathObj.name
        }
      ]
    } else {
      currentPathArr = [
        {
          title: '概览',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.meta.title,
          path: (isFirst ? currentPathObj.path + '/' + childObj.path : currentPathObj.path),
          name: currentPathObj.name
        },
        {
          title: childObj.meta.title,
          path: currentPathObj.path + '/' + childObj.path,
          name: childObj.name
        }
      ]
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr)

  return currentPathArr
}

util.openNewPage = function (vm, name, argu, query) {
  vm.$store.commit('setCurrentPageName', name)
}

util.toDefaultPage = function (routers, name, route, next) {
  const len = routers.length
  let i = 0
  let notHandle = true
  while (i < len) {
    if (routers[i].name === name && routers[i].children && routers[i].redirect
        === undefined) {
      route.replace({
        name: routers[i].children[0].name
      })
      notHandle = false
      next()
      break
    }
    i++
  }
  if (notHandle) {
    next()
  }
}

util.canAccess = function (requestAccess, vm) {
  const userAccess = vm.$store.getters.roles
  if (userAccess.length === 0) {
    return false
  }
  if (util.oneOf('admin', userAccess)) {
    return true
  }
  return util.oneLike(requestAccess, userAccess)
}

export default util

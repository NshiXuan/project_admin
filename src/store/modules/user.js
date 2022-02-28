import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户头像
    avatar: '',
    // 菜单标记
    routes: [],
    // 角色信息
    roles: [],
    // 按钮权限信息
    buttons: [],
    // 对比之后 项目中已有的异步路由与服务器返回的标记信息对比最终需要展示的理由
    resultAsyncRoutes: [],
    // 存储全部路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储toekn
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //  存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 按钮权限的标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  },
  // 计算出来的异步路由
  SET_RESULTASYNCROUTES(state, asyncRoutes) {
    // vuex保存当前用户的异步路由
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户需要的所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 解构出用户名与密码
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    // 注意：当前登录请求现在使用mock数据 mock数据为 20000
    if (result.code === 20000) {
      // vuex存储token
      commit('SET_TOKEN', result.data.token)
      // 本地持久化存储token
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 获取用户信息，返回的数据包含：用户名name 用户头像 avatar 返回标记(不同的用户应该展示那些菜单的标记) 用户决策的信息 roles
        const { data } = response
        // vuex 存储用户信息
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

// 定义一个函数 两个数组进行对比 对比出当前用户到达显示那些路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户需要展示的异步路由
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) !== -1) {
      // 递归 别忘记了2 3 4 5级路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


import { getToken, setToken, removeToken } from '@/libs/token'
import { login, logout, info } from '@/api/account'

const user = {
  state: {
    token: getToken(),
    id: undefined,
    username: '',
    nickname: '',
    roles: []
  },
  mutations: {
    SET_STATE: (state, data) => {
      state.id = data.id
      state.username = data.username
      state.nickname = data.nickname
      if (data.roles === undefined) {
        state.roles = undefined
      } else {
        state.roles = data.roles || []
      }
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    CLEAN_STATE: (state) => {
      state.id = undefined
      state.username = ''
      state.nickname = ''
      state.roles = []
      state.token = ''
      localStorage.clear()
    }
  },
  actions: {
    login ({ commit }, form) {
      return new Promise((resolve, reject) => {
        login(form).then(response => {
          setToken(response.data.token)
          commit('SET_TOKEN', response.data.token)
          commit('SET_STATE', response.data)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    info ({ commit }) {
      return new Promise((resolve, reject) => {
        info().then(response => {
          commit('SET_STATE', response.data)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(response => {
          removeToken()
          commit('CLEAN_STATE')
          commit('clearOpenedSubmenu')
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    clean ({ commit }) {
      return new Promise((resolve) => {
        removeToken()
        commit('CLEAN_STATE')
        resolve()
      })
    }
  }
}

export default user

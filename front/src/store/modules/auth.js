import Vue from 'vue'
import auth from './../../auth'

// initial state
const initialState = () => ({
  user: auth.getUser(),
  token: auth.token(),
  loading: false,
  userType: '',
  errorLogin: false,
  errorMessage: ''
})

const state = initialState()

// getters
const getters = {
  isLoggedIn: state => !!state.token
}

// mutations
const mutations = {
  reset (state) {
    const init = initialState()
    Object.keys(init).forEach(key => {
      state[key] = init[key]
    })
  },
  update (state, payload) {
    state.user = payload.user
    state.token = payload.token
    state.userType = payload.user.user_type
  },
  loading (state, payload) {
    state.loading = payload
  },
  updateError (state, payload) {
    state.errorLogin = payload.error
    state.errorMessage = payload.message || ''
  },
  logout (state) {
    state.user = {}
    state.token = ''
    state.userType = ''
    state.errorLogin = false
  }
}

// actions
const actions = {
  login ({commit, state}, user) {
    commit('loading', true)
    return new Promise((resolve, reject) => {
      Vue.http.post('login', {username: user.username, password: user.password})
        .then(
          function (res) {
            commit('loading', false)
            if (res.body.success) {
              auth.login(res.body)
              commit('update', res.body)
              resolve()
            } else {
              commit('updateError', {error: true, message: 'Usuario o clave incorrectos'})
              reject()
            }
          },
          function () {
            commit('loading', false)
            commit('updateError', {error: true, message: 'Error de red'})
            reject()
          }
        )
    })
  },
  logout ({commit}) {
    auth.logout()
    commit('logout')
  }
}

export default {
  namespaced: true,
  initialState,
  state,
  getters,
  mutations,
  actions
}

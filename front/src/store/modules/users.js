import Vue from 'vue'

import { createActionHelpers } from 'vuex-loading'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

// initial state
const initialState = () => ({
  user: {},
  loading: false,
  error: ''
})

const state = initialState()

// getters
const getters = {}

// mutations
const mutations = {
  reset (state) {
    let init = initialState()
    Object.keys(init).forEach(key => {
      state[key] = init[key]
    })
  },
  setUser (state, user) {
    user.user_type = user.user_type || null
    if (user.auth) {
      user.auth.password = null
    }
    state.user = user
  },
  setImageToCurrentUser (state, urlImage) {
    state.user.picture = urlImage
  },
  setLoading (state, value) {
    state.loading = value
  },
  setError (state, value) {
    state.error = value
  },
  setAuth (state, payload) {
    state.user.user_type = payload.user_type
    delete payload.user_type
    state.user.auth = payload
  },
  setAuthUsername (state, payload) {
    state.user.auth.username = payload
  },
  setUserType (state, payload) {
    state.user.user_type = payload
  },
  setAuthPassword (state, payload) {
    state.user.auth.password = payload
  },
  resetCredentials (state) {
    state.user.auth = {}
  }
}

// actions
const actions = {
  fetchById ({commit, dispatch}, payload) {
    commit('setUser', {})
    commit('setLoading', true)
    startLoading(dispatch, 'users fetchById')
    return Vue.http.get('user/' + payload.id)
      .then(
        (res) => {
          commit('setLoading', false)
          if (res.body.success) {
            commit('setUser', res.body.user)
          } else {
            commit('setError', res.body.message)
          }
          endLoading(dispatch, 'users fetchById')
        },
        (err) => {
          endLoading(dispatch, 'users fetchById')
          return Promise.reject(err)
        }
      )
  },
  changeAuth ({commit}, payload) {
    commit('setLoading', true)
    return new Promise((resolve, reject) => {
      Vue.http.put('user/' + payload.id + '/credentials', {
        password: payload.auth.password,
        username: payload.auth.username,
        user_type: payload.auth.user_type,
        perms: payload.auth.perms
      })
        .then(
          (res) => {
            commit('setLoading', false)
            if (res.body.success) {
              commit('setAuth', {
                username: res.body.user.auth.username,
                user_type: payload.auth.user_type,
                password: ''
              })
              commit('setError', null)
              resolve()
            } else {
              commit('setError', res.body.message)
            }
          },
          (err) => {
            commit('setLoading', false)
            commit('setError', 'Error de red')
            reject(err)
          }
        )
    })
  },
  revokeAuth ({commit}, payload) {
    commit('setLoading', true)
    return Vue.http.post('user/' + payload.id + '/revoke')
      .then(
        (res) => {
          commit('setLoading', false)
          if (res.body.success) {
            commit('setAuth', {})
          } else {
            commit('setError', res.body.message)
          }
        },
        (err) => {
          commit('setLoading', false)
          commit('setError', 'Error de red')
          return Promise.reject(err)
        }
      )
  },
  create ({commit, dispatch}, payload) {
    let formData = new FormData()
    formData.append('picture', payload.image)
    let keys = Object.keys(payload.user)
    let i
    for (i = 0; i < keys.length; i++) {
      let key = keys[i]
      formData.append(key, payload.user[key])
    }
    startLoading(dispatch, 'users create')
    return Vue.http.post('user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(
      (res) => {
        endLoading(dispatch, 'users create')
        return res.body
      },
      (err) => {
        endLoading(dispatch, 'users create')
        return Promise.reject(err)
      }
    )
  },
  updateImage ({commit}, payload) {
    let formData = new FormData()
    formData.append('picture', payload.image)
    commit('setLoading', true)
    return Vue.http.post('user/picture/' + payload.userId, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(
        (res) => {
          if (res.body.success) {
            setTimeout(() => {
              commit('setLoading', false)
              commit('setImageToCurrentUser', res.body.picture)
            }, 3000)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  update ({commit, dispatch}, payload) {
    startLoading(dispatch, 'users update')
    return Vue.http.put('user/' + payload.user._id, {user: payload.user})
      .then(
        (res) => {
          if (res.body.success) {
            commit('setUser', res.body.user)
          }
          endLoading(dispatch, 'users update')
          return res.body
        },
        (err) => {
          endLoading(dispatch, 'users update')
          return Promise.reject(err)
        }
      )
  },
  existLegajo (context, payload) {
    return Vue.http.get('user/exists/legajo/' + payload.legajo)
      .then(
        (res) => {
          if (res.body.success) {
            return (!res.body.exists)
          }
        },
        (err) => {
          return Promise.reject(err)
        }
      )
  },
  existDni (context, payload) {
    return Vue.http.get('user/exists/dni/' + payload.dni)
      .then(
        (res) => {
          if (res.body.success) {
            return (!res.body.exists)
          }
        },
        (err) => {
          return Promise.reject(err)
        }
      )
  },
  getReport (context, user) {
    const success = (response) => {
      return new Blob([response.data], {type: response.headers.get['content-type']})
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get(`report/user/${user._id}`,
      {responseType: 'arraybuffer'}
    )
      .then(success)
      .catch(handleError)
  },
  getAllReportDay (context, day) {
    const success = (response) => {
      return new Blob([response.data], {type: response.headers.get['content-type']})
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get(`report/day/${day}`,
      {responseType: 'arraybuffer'}
    )
      .then(success)
      .catch(handleError)
  },
  getAllReport (context) {
    const success = (response) => {
      return new Blob([response.data], {type: response.headers.get['content-type']})
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get(`report/all`,
      {responseType: 'arraybuffer'}
    )
      .then(success)
      .catch(handleError)
  },
  deactivate ({commit}, {id, deactivatedReason}) {
    const success = (response) => {
      commit('setLoading', false)
      commit('setUser', response.body.user)
      return response.body
    }

    const handleError = (error) => {
      commit('setLoading', false)
      return Promise.reject(error)
    }

    commit('setLoading', true)
    return Vue.http.post(`user/${id}/deactivate`, {deactivatedReason})
      .then(success)
      .catch(handleError)
  },
  activate ({commit}, {id}) {
    const success = (response) => {
      commit('setLoading', false)
      commit('setUser', response.body.user)
      return response.body
    }

    const handleError = (error) => {
      commit('setLoading', false)
      return Promise.reject(error)
    }

    commit('setLoading', true)
    return Vue.http.post(`user/${id}/activate`)
      .then(success)
      .catch(handleError)
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

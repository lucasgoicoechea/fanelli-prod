import Vue from 'vue'
import { createActionHelpers } from 'vuex-loading'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

// initial state
const initialState = () => ({
  shifts: []
})

const state = initialState()

// getters
const getters = {}
// mutations
const mutations = {
  reset (state) {
    const init = initialState()
    Object.keys(init).forEach(key => {
      state[key] = init[key]
    })
  },
  update (state, payload) {
    state.shifts = payload.shifts
  }
}

// actions
const actions = {
  fetch ({commit, dispatch}) {
    startLoading(dispatch, 'shifts fetch')
    return Vue.http.get('shift')
      .then(
        (res) => {
          if (res.body.success) {
            commit('update', {shifts: res.body.shifts})
            endLoading(dispatch, 'shifts fetch')
          }
        },
        (err) => {
          endLoading(dispatch, 'shifts fetch')
          return Promise.reject(err)
        }
      )
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

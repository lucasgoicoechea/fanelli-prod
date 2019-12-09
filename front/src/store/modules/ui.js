// initial state
const initialState = () => ({
  sidebarStatus: false
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
  setSidebarStatus (state, status) {
    state.sidebarStatus = status
  }
}

// actions
const actions = {}

export default {
  namespaced: true,
  initialState,
  state,
  getters,
  mutations,
  actions
}

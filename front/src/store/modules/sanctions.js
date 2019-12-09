import Vue from 'vue'
import { createActionHelpers } from 'vuex-loading'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

// initial state
const initialState = () => ({})

const state = initialState()

// getters.
const getters = {}

// mutations
const mutations = {
  reset (state) {
    const init = initialState()
    Object.keys(init).forEach(key => {
      state[key] = init[key]
    })
  }
}
// actions
const actions = {
  createSanction ({dispatch}, sanction) {
    const created = (response) => {
      endLoading(dispatch, 'sanctions createSanctions')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'sanctions createSanctions')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'sanctions createSanctions')
    return Vue.http.post('sanction', {sanction})
      .then(created)
      .catch(handleError)
  },
  editSanction ({dispatch}, sanction) {
    const edited = (response) => {
      endLoading(dispatch, 'sanctions editSanction')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'sanctions editSanction')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'sanctions editSanction')
    return Vue.http.put(`sanction/${sanction._id}`, {sanction})
      .then(edited)
      .catch(handleError)
  },
  getUserSanctions ({dispatch}, payload) {
    const fecthed = (response) => {
      endLoading(dispatch, 'sanctions getUserSanctions')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'sanctions getUserSanctions')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'sanctions getUserSanctions')
    return Vue.http.get(`sanction/to/${payload.userId}`, {params: {page: payload.page}})
      .then(fecthed)
      .catch(handleError)
  },
  getDetail ({dispatch}, payload) {
    const fecthed = (response) => {
      endLoading(dispatch, 'sanctions getUserSanctions')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'sanctions getUserSanctions')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'sanctions getUserSanctions')
    return Vue.http.get(`sanction/${payload.id}`)
      .then(fecthed)
      .catch(handleError)
  },
  printSanction ({dispatch}, sanction) {
    const success = (response) => {
      const blob = new Blob([response.data], {type: response.headers.get['content-type']})
      return blob
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('sanction/pdf/' + sanction._id,
      { responseType: 'arraybuffer' }
    )
      .then(success)
      .catch(handleError)
  },
  cancelSanction ({dispatch}, sanction) {
    const cancelled = (response) => {
      endLoading(dispatch, 'sanctions cancelSanction')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'sanctions cancelSanction')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'sanctions cancelSanction')
    return Vue.http.delete(`sanction/${sanction._id}`)
      .then(cancelled)
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

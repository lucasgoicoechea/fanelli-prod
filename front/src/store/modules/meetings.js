import Vue from 'vue'
import { createActionHelpers } from 'vuex-loading'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

const beforeFallback = handler => error => {
  handler()
  return Promise.reject(error)
}

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
  create ({dispatch}, meeting) {
    const created = (response) => {
      endLoading(dispatch, 'meeting create')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'meeting create')
    })

    startLoading(dispatch, 'meeting create')
    return Vue.http.post('meeting', {meeting})
      .then(created)
      .catch(handleError)
  },
  edit ({dispatch}, meeting) {
    const edited = (response) => {
      endLoading(dispatch, 'meeting edit')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'meeting edit')
    })

    startLoading(dispatch, 'meeting edit')
    return Vue.http.put(`meeting/${meeting._id}`, {meeting})
      .then(edited)
      .catch(handleError)
  },
  getDetail ({dispatch}, payload) {
    const fetched = (response) => {
      endLoading(dispatch, 'meeting getDetail')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'meeting getDetail')
    })

    startLoading(dispatch, 'meeting getDetail')
    return Vue.http.get(`meeting/${payload.id}`)
      .then(fetched)
      .catch(handleError)
  },
  fetch (context, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('meeting', {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  print ({dispatch}, meeting) {
    const success = (response) => {
      const blob = new Blob([response.data], {type: response.headers.get['content-type']})
      return blob
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('meeting/pdf/' + meeting._id,
      {responseType: 'arraybuffer'}
    )
      .then(success)
      .catch(handleError)
  },
  cancel (context, meeting) {
    const deleted = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.delete(`meeting/${meeting._id}`)
      .then(deleted)
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

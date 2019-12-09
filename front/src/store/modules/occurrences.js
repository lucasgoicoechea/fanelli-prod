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
  createOccurrence ({dispatch}, occurrence) {
    const created = (response) => {
      endLoading(dispatch, 'occurrences createOccurrence')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'occurrences createOccurrence')
    })

    startLoading(dispatch, 'occurrences createOccurrence')
    return Vue.http.post('occurrence', {occurrence})
      .then(created)
      .catch(handleError)
  },
  editOccurrence ({dispatch}, occurrence) {
    const edited = (response) => {
      endLoading(dispatch, 'occurrences editOccurrence')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'occurrences editOccurrence')
    })

    startLoading(dispatch, 'occurrences editOccurrence')
    return Vue.http.put(`occurrence/${occurrence._id}`, {occurrence})
      .then(edited)
      .catch(handleError)
  },
  getDetail ({dispatch}, payload) {
    const fetched = (response) => {
      endLoading(dispatch, 'occurrences getDetail')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'occurrences getDetail')
    })

    startLoading(dispatch, 'occurrences getDetail')
    return Vue.http.get(`occurrence/${payload.id}`)
      .then(fetched)
      .catch(handleError)
  },
  printOccurrence ({dispatch}, occurrence) {
    const success = (response) => {
      const blob = new Blob([response.data], {type: response.headers.get['content-type']})
      return blob
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('occurrence/pdf/' + occurrence._id,
      {responseType: 'arraybuffer'}
    )
      .then(success)
      .catch(handleError)
  },
  resolve ({dispatch}, payload) {
    const resolved = (response) => {
      endLoading(dispatch, 'occurrences resolved')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'occurrences resolved')
    })

    startLoading(dispatch, 'occurrences resolved')
    return Vue.http.post(`occurrence/resolve/${payload.id}`, payload)
      .then(resolved)
      .catch(handleError)
  },
  cancel ({dispatch}, payload) {
    const cancelled = (response) => {
      endLoading(dispatch, 'occurrences cancelled')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'occurrences cancelled')
    })

    startLoading(dispatch, 'occurrences cancelled')
    return Vue.http.post(`occurrence/cancel/${payload.id}`)
      .then(cancelled)
      .catch(handleError)
  },
  fetchPendingOccurrences ({dispatch}, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('occurrence/pending', {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchPendingOccurrencesByMe ({dispatch}, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('occurrence/pending/by-me', {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchResolvedOccurrences ({dispatch}, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('occurrence/resolved', {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchResolvedOccurrencesByMe ({dispatch}, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('occurrence/resolve/by-me', {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchNotArchivedOccurrences (context, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('occurrence/not-archived', {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  archive ({dispatch}, payload) {
    const archived = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.post(`occurrence/archive/${payload._id}`)
      .then(archived)
      .catch(handleError)
  },
  // get recomendations
  getCollaboratorRecommendations (context, id) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get(`occurrence/statistics/${id}`)
      .then(fetched)
      .catch(handleError)
  },
  getUserOccurrences (context, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get(`occurrence/to/${payload.userId}`, {params: {page: payload.page}})
      .then(fetched)
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

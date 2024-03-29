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
  fetchManager (context, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('meeting/manager/all', {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchCalendarSector (context, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('meeting/manager/calendar', {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchManagerSector (context, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('meeting/manager/sector', {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchPass (context, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }
    // console.dir(context)
    return Vue.http.get('meeting/pass/' + payload.userId, {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchPassMe (context, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }
    // console.dir(context)
    return Vue.http.get('meeting/pass-me/' + payload.userId, {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchActive (context, payload) {
    const params = (payload !== undefined) ? payload : {}
    const fetched = (response) => {
      return response.body
    }
    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get('meeting/by-me/active', {params})
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
  },
  cancelAll (context, meeting) {
    const deleted = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.delete(`meeting/${meeting._id}/all`)
      .then(deleted)
      .catch(handleError)
  },
  fetchAll (context, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('meeting/to/' + payload.userId, {
      params: payload
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchAllTo (context, payload) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('meeting/all/' + payload.userId, {
      params: payload
    })
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

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
  create ({dispatch}, productivity) {
    const created = (response) => {
      endLoading(dispatch, 'productivity create')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'productivity create')
    })

    startLoading(dispatch, 'productivity create')
    return Vue.http.post('productivity', {productivity})
      .then(created)
      .catch(handleError)
  },
  edit ({dispatch}, productivity) {
    const edited = (response) => {
      endLoading(dispatch, 'productivity edit')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'productivity edit')
    })

    startLoading(dispatch, 'productivity edit')
    return Vue.http.put(`productivity/${productivity._id}`, {productivity})
      .then(edited)
      .catch(handleError)
  },
  getDetail ({dispatch}, payload) {
    const fetched = (response) => {
      endLoading(dispatch, 'productivity getDetail')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'productivity getDetail')
    })

    startLoading(dispatch, 'productivity getDetail')
    return Vue.http.get(`productivity/${payload.id}`)
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

    return Vue.http.get('productivity', {
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

    return Vue.http.get('productivity/manager/all', {
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

    return Vue.http.get('productivity/manager/calendar', {
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

    return Vue.http.get('productivity/manager/sector', {
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
    return Vue.http.get('productivity/pass/' + payload.userId, {
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
    return Vue.http.get('productivity/pass-me/' + payload.userId, {
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
    return Vue.http.get('productivity/by-me/active', {params})
      .then(fetched)
      .catch(handleError)
  },
  print ({dispatch}, productivity) {
    const success = (response) => {
      const blob = new Blob([response.data], {type: response.headers.get['content-type']})
      return blob
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('productivity/pdf/' + productivity._id,
      {responseType: 'arraybuffer'}
    )
      .then(success)
      .catch(handleError)
  },
  cancel (context, productivity) {
    const deleted = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.delete(`productivity/${productivity._id}`)
      .then(deleted)
      .catch(handleError)
  },
  cancelAll (context, productivity) {
    const deleted = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.delete(`productivity/${productivity._id}/all`)
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

    return Vue.http.get('productivity/to/' + payload.userId, {
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

    return Vue.http.get('productivity/all/' + payload.userId, {
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

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
  create ({dispatch}, bugReport) {
    const created = (response) => {
      endLoading(dispatch, 'bugReport create')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'bugReport create')
    })

    startLoading(dispatch, 'bugReport create')
    return Vue.http.post('bugReport', {bugReport})
      .then(created)
      .catch(handleError)
  },
  edit ({dispatch}, bugReport) {
    const edited = (response) => {
      endLoading(dispatch, 'bugReport edit')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'bugReport edit')
    })

    startLoading(dispatch, 'bugReport edit')
    return Vue.http.put(`bugReport/${bugReport._id}`, {bugReport})
      .then(edited)
      .catch(handleError)
  },
  getDetail ({dispatch}, payload) {
    const fetched = (response) => {
      endLoading(dispatch, 'bugReport getDetail')
      return response.body
    }

    const handleError = beforeFallback(() => {
      endLoading(dispatch, 'bugReport getDetail')
    })

    startLoading(dispatch, 'bugReport getDetail')
    return Vue.http.get(`bugReport/${payload.id}`)
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

    return Vue.http.get('bugReport', {
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

    return Vue.http.get('bugReport/manager/all', {
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

    return Vue.http.get('bugReport/manager/calendar', {
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

    return Vue.http.get('bugReport/manager/sector', {
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
    return Vue.http.get('bugReport/pass/' + payload.userId, {
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
    return Vue.http.get('bugReport/pass-me/' + payload.userId, {
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
    return Vue.http.get('bugReport/fetchActive', {params})
      .then(fetched)
      .catch(handleError)
  },
  fetchPassFails (context, payload) {
    const params = (payload !== undefined) ? payload : {}
    const fetched = (response) => {
      return response.body
    }
    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get('bugReport/fetchPassFails', {params})
      .then(fetched)
      .catch(handleError)
  },
  fetchNoActive (context, payload) {
    const params = (payload !== undefined) ? payload : {}
    const fetched = (response) => {
      return response.body
    }
    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get('bugReport/fetchNoActive', {params})
      .then(fetched)
      .catch(handleError)
  },
  getFailsForFather (context, payload) {
    const params = (payload !== undefined) ? payload : {}
    const fetched = (response) => {
      return response.body
    }
    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get('bugReport/getFailsForFather', {params})
      .then(fetched)
      .catch(handleError)
  },
  print ({dispatch}, bugReport) {
    const success = (response) => {
      const blob = new Blob([response.data], {type: response.headers.get['content-type']})
      return blob
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.get('bugReport/pdf/' + bugReport._id,
      {responseType: 'arraybuffer'}
    )
      .then(success)
      .catch(handleError)
  },
  cancel (context, bugReport) {
    const deleted = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.delete(`bugReport/${bugReport._id}`)
      .then(deleted)
      .catch(handleError)
  },
  cancelAll (context, bugReport) {
    const deleted = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }

    return Vue.http.delete(`bugReport/${bugReport._id}/all`)
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

    return Vue.http.get('bugReport/to/' + payload.userId, {
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

    return Vue.http.get('bugReport/all/' + payload.userId, {
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

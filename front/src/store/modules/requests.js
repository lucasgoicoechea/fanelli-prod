import Vue from 'vue'
import { createActionHelpers } from 'vuex-loading'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

function isEmpty (obj) {
  return Object.keys(obj).length === 0
}

const filterByDate = (list, date) => {
  if (!date) return list
  return list.filter(e => e.created_at.substring(0, 10) === date)
}
const filterByCollaborator = (list, collaborator) => {
  if (!collaborator || isEmpty(collaborator)) return list
  return list.filter(e => e.collaborator._id === collaborator._id)
}

// initial state
const initialState = () => ({
  request: {},
  pendingResolution: {
    requests: [],
    page: 1,
    lastOne: false,
    loading: false
  },
  solved: {
    requests: [],
    page: 1,
    lastOne: false,
    loading: false
  },
  delivered: {
    requests: [],
    page: 1,
    lastOne: false,
    loading: false
  },
  collaboratorEPPRequests: [],
  active: {
    requests: [],
    page: 1,
    lastOne: false,
    loading: false
  },
  supervisorActiveEPP: {
    requests: [],
    page: 1,
    lastOne: false
  },
  supervisorHistoryEPP: {
    requests: [],
    page: 1,
    lastOne: false
  }
})

const state = initialState()

// getters
const getters = {
  // getDeliveredEPPRequests: (state) => {
  //   return state.collaborator.find(catalog => catalog.type === type)
  // }
  getActivedAndReceivedRequests: (state) => {
    return state.active.requests.filter(request => !request.hasOwnProperty('approved'))
  },
  getOnlyActivedRequest: (state) => {
    return state.active.requests.filter(request => request.hasOwnProperty('approved'))
  },
  deliveredRequestsByDate: (state) => (date) => {
    return filterByDate(state.delivered.requests, date)
  },
  deliveredRequestsByCollaborator: (state) => (collaborator) => {
    return filterByCollaborator(state.delivered.requests, collaborator)
  },
  deliveredRequestsFilter: (state) => (date, collaborator) => {
    return filterByDate(filterByCollaborator(state.delivered.requests, collaborator), date)
  }
}

// mutations
const mutations = {
  reset (state) {
    const init = initialState()
    Object.keys(init).forEach(key => {
      state[key] = init[key]
    })
  },
  clear (state, type) {
    Vue.set(state[type], 'requests', [])
    state[type].page = 1
    state[type].lastOne = false
    state[type].loading = false
  },
  updateRequest (state, payload) {
    state.request = payload
  },
  updateRequestById (state, payload) {
    const requestIndex = state.active.requests.findIndex(request => request._id === payload.id)
    Vue.set(state.active.requests[requestIndex], 'approved', payload.approved)
    Vue.set(state.active.requests[requestIndex], 'approved_by', payload.user)
  },
  loadingById (state, payload) {
    const request = state.active.requests.find(request => request._id === payload.id)
    if (payload.approved) {
      request.acceptLoading = payload.loading
    } else {
      request.rejectLoading = payload.loading
    }
  },
  update (state, {type, requests}) {
    state[type].page += 1
    requests.forEach((req) => {
      state[type].requests.push(req)
    })
  },
  lastOne (state, type) {
    state[type].lastOne = true
  },
  loading (state, {loader, value}) {
    state[loader].loading = value
  },
  pendingToSolved (state, payload) {
    let index
    if ((index = state.pendingResolution.requests.indexOf(payload.request)) !== -1) {
      state.pendingResolution.requests.splice(index, 1)
      payload.request.resolved = true
      state.solved.requests.push(payload.request)
    }
  },
  deliveredToSolved (state, payload) {
    let index
    if ((index = state.delivered.requests.indexOf(payload)) !== -1) {
      state.delivered.requests.splice(index, 1)
      payload.resolved = true
      payload.delivered = false
      state.solved.requests.push(payload)
    }
  },
  solvedToDelivered (state, payload) {
    let index
    if ((index = state.solved.requests.indexOf(payload)) !== -1) {
      state.solved.requests.splice(index, 1)
      payload.resolved = true
      payload.delivered = true
      state.delivered.requests.push(payload)
    }
  },
  loadCollaboratorEPPRequests (state, payload) {
    state.collaboratorEPPRequests = payload
  },
  updateRequestsByCollaborator (state, payload) {
    state.delivered.requestsByCollaborator = state.delivered.requests.filter(request => request.collaborator._id === payload.id)
  },
  updateActiveRequests (state, payload) {
    payload.map(e => {
      e.acceptLoading = false
      e.rejectLoading = false
      return e
    })
    state.active.requests = payload
  }
}
// actions
const actions = {
  fetch ({commit}, payload) {
    return Vue.http.get('security-element/request/' + payload.id)
      .then(
        (res) => {
          if (res.body.success) {
            commit('updateRequest', res.body.request)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  approval ({commit, state}, payload) {
    Vue.http.post('security-element/approval/' + state.request._id, {approved: payload.approved})
      .then(
        function (res) {
          if (res.body.success) {
            commit('updateRequest', res.body.request)
          }
        }
      )
  },
  approvalById ({commit}, payload) {
    commit('loadingById', {id: payload.id, approved: payload.approved, loading: true})
    setTimeout(() => {}, 7000)
    Vue.http.post('security-element/approval/' + payload.id, {approved: payload.approved})
      .then(
        function (res) {
          if (res.body.success) {
            commit('updateRequestById', payload)
            commit('loadingById', {id: payload.id, approved: payload.approved, loading: false})
          }
        }
      )
  },
  fetchPending ({commit, state}) {
    commit('loading', {loader: 'pendingResolution', value: true})
    return new Promise((resolve, reject) => {
      Vue.http.get('security-element/pending-resolution?page=' + state.pendingResolution.page)
        .then(
          (res) => {
            if (res.body.success) {
              if (res.body.requests.length > 0) {
                commit('update', {type: 'pendingResolution', requests: res.body.requests})
              } else {
                commit('lastOne', 'pendingResolution')
              }
              commit('loading', {loader: 'pendingResolution', value: false})
              resolve()
            } else {
              reject()
            }
          },
          (err) => {
            reject(err)
          }
        )
    })
  },
  fetchSolved ({commit}) {
    commit('loading', {loader: 'solved', value: true})
    return new Promise((resolve, reject) => {
      Vue.http.get('security-element/solved?page=' + state.solved.page)
        .then(
          (res) => {
            if (res.body.success) {
              if (res.body.requests.length > 0) {
                commit('update', {type: 'solved', requests: res.body.requests})
              } else {
                commit('lastOne', 'solved')
              }
              commit('loading', {loader: 'solved', value: false})
              resolve()
            } else {
              reject(res)
            }
          },
          (err) => {
            reject(err)
          }
        )
    })
  },
  fetchDelivered ({commit, dispatch}, payload) {
    startLoading(dispatch, 'requests fetchDelivered')
    const params = (payload !== undefined) ? payload : {}
    params.page = state.delivered.page
    commit('loading', {loader: 'delivered', value: true})
    return new Promise((resolve, reject) => {
      Vue.http.get('security-element/delivered', {params})
        .then(
          (res) => {
            if (res.body.success) {
              if (res.body.requests.length > 0) {
                commit('update', {type: 'delivered', requests: res.body.requests})
              } else {
                commit('lastOne', 'delivered')
              }
              endLoading(dispatch, 'requests fetchDelivered')
              commit('loading', {loader: 'delivered', value: false})
              resolve()
            }
            endLoading(dispatch, 'requests fetchDelivered')
            reject()
          },
          (err) => {
            endLoading(dispatch, 'requests fetchDelivered')
            reject(err)
          }
        )
    })
  },
  moveToDelivery ({commit, state}, payload) {
    return Vue.http.post('security-element/delivered/' + payload.request._id, {delivered: payload.delivered})
      .then(
        (res) => {
          if (res.body.success) {
            if (payload.delivered) {
              commit('solvedToDelivered', payload.request)
            } else {
              commit('deliveredToSolved', payload.request)
            }
            return payload.request.global_request_counter
          }
        },
        (err) => Promise.reject(err)
      )
  },
  fetchLastUserEPPRequests ({commit, state}, payload) {
    Vue.http.get('security-element/to/' + payload.id)
      .then(
        (res) => {
          if (res.body.success) {
            commit('loadCollaboratorEPPRequests', res.body.requests)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  fetchSupervisorActiveRequest ({commit, state, dispatch}, payload) {
    startLoading(dispatch, 'requests supervisorActiveEPP')
    const params = (payload !== undefined) ? payload : {}
    params.page = state.supervisorActiveEPP.page
    return Vue.http.get('security-element/by-me/active', {params})
      .then(
        (res) => {
          if (res.body.success) {
            if (res.body.requests.length > 0) {
              commit('update', {type: 'supervisorActiveEPP', requests: res.body.requests})
            } else {
              commit('lastOne', 'supervisorActiveEPP')
            }
          }
          endLoading(dispatch, 'requests supervisorActiveEPP')
        },
        (err) => {
          endLoading(dispatch, 'requests supervisorActiveEPP')
          return Promise.reject(err)
        }
      )
  },
  fetchSupervisorHistoryRequest ({commit, state, dispatch}, payload) {
    startLoading(dispatch, 'requests supervisorHistoryEPP')
    const params = (payload !== undefined) ? payload : {}
    params.page = state.supervisorHistoryEPP.page
    return Vue.http.get('security-element/by-me/history', {params})
      .then(
        (res) => {
          if (res.body.success) {
            if (res.body.requests.length > 0) {
              commit('update', {type: 'supervisorHistoryEPP', requests: res.body.requests})
            } else {
              commit('lastOne', 'supervisorHistoryEPP')
            }
          }
          endLoading(dispatch, 'requests supervisorHistoryEPP')
        },
        (err) => {
          endLoading(dispatch, 'requests supervisorHistoryEPP')
          return Promise.reject(err)
        }
      )
  },
  fetchActiveRequest ({commit, dispatch}) {
    startLoading(dispatch, 'requests fetchActive')
    return new Promise((resolve, reject) => {
      Vue.http.get('security-element/active')
        .then(
          (res) => {
            if (res.body.success) {
              commit('updateActiveRequests', res.body.securityElements)
              endLoading(dispatch, 'requests fetchActive')
              resolve()
            } else {
              endLoading(dispatch, 'requests fetchActive')
              reject()
            }
          },
          (err) => {
            endLoading(dispatch, 'requests fetchActive')
            reject(err)
          }
        )
    })
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

import Vue from 'vue'
import {createActionHelpers} from 'vuex-loading'
import Constants from '../../const.js'
import dateAndTime from '../../utils/dateAndTime.js'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

// initial state
const initialState = () => ({
  dataToSubmit: {},
  resolved: {
    requests: [],
    page: 1,
    lastOne: false
  },
  collaboratorStaffRequests: [],
  pending: [],
  notArchived: {
    requests: [],
    page: 1,
    lastOne: false
  }
})

const state = initialState()

// getters
const getters = {
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
  pendingToResolved (state, payload) {
    const index = state.pending.findIndex(request => request.request._id === payload.res[payload.type]._id)
    if (index !== -1) {
      state.pending.splice(index, 1)
      state.resolved.requests.unshift({request: payload.res[payload.type], type: payload.typeRequest})
    }
  },
  loadRequests (state, payload) {
    state.requests = payload
  },
  updateNotArchive (state, requests) {
    state.notArchived.requests = requests
  },
  deleteArchived (state, id) {
    const index = state.notArchived.requests.findIndex((request) => request.request._id === id)
    state.notArchived.requests.splice(index, 1)
  },
  loadPendingRequests (state, payload) {
    state.pending = payload
  },
  loadResolvedRequests (state, payload) {
    state.resolved.requests = payload
  },
  loadCollaboratorStaffRequests (state, payload) {
    state.collaboratorStaffRequests = payload
  },
  updateToSubmitField (state, payload) {
    state.dataToSubmit[payload.field] = payload.value
  },
  resetDataToSubmit (state) {
    state.dataToSubmit = {}
  },
  deleteToSubmitField (state, payload) {
    delete state.dataToSubmit[payload]
  }
}
// actions
const actions = {
  fetchPending ({dispatch, commit}, payload) {
    startLoading(dispatch, 'staffRequests fetchPending')

    return Vue.http.get('staff-request/pending', {
      params: payload
    })
      .then(
        (res) => {
          if (res.body.success) {
            commit('loadPendingRequests', res.body.requests)
          }
          endLoading(dispatch, 'staffRequests fetchPending')
          return res.body
        },
        (err) => Promise.reject(err)
      )
  },
  fetchResolved ({dispatch, commit}, payload) {
    startLoading(dispatch, 'staffRequests fetchResolved')
    return Vue.http.get('staff-request/resolved', {
      params: payload
    })
      .then(
        (res) => {
          if (res.body.success) {
            commit('loadResolvedRequests', res.body.requests)
          }
          endLoading(dispatch, 'staffRequests fetchResolved')
          return res.body
        },
        (err) => {
          endLoading(dispatch, 'staffRequests fetchResolved')
          return Promise.reject(err)
        }
      )
  },
  fetchPendingByMe ({dispatch, commit}, payload) {
    startLoading(dispatch, 'staffRequests fetchPending')

    return Vue.http.get('staff-request/by-me/pending', {
      params: payload
    })
      .then(
        (res) => {
          if (res.body.success) {
            commit('loadPendingRequests', res.body.requests)
          }
          endLoading(dispatch, 'staffRequests fetchPending')
          return res.body
        },
        (err) => Promise.reject(err)
      )
  },
  fetchResolvedByMe ({dispatch, commit}, payload) {
    startLoading(dispatch, 'staffRequests fetchResolved')

    return Vue.http.get('staff-request/by-me/resolved', {
      params: payload
    })
      .then(
        (res) => {
          if (res.body.success && res.body.requests.length > 0) {
            commit('loadResolvedRequests', res.body.requests)
          }
          endLoading(dispatch, 'staffRequests fetchResolved')
          return res.body
        },
        (err) => Promise.reject(err)
      )
  },
  createLeave ({dispatch}, leaveRequest) {
    const created = (response) => {
      endLoading(dispatch, 'staffRequests createLeave')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'staffRequests createLeave')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'staffRequests createLeave')
    return Vue.http.post('staff-request/leave', {leaveRequest})
      .then(created)
      .catch(handleError)
  },
  createExtraHours ({dispatch}, extraHoursRequest) {
    const created = (response) => {
      endLoading(dispatch, 'staffRequests createExtraHours')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'staffRequests createExtraHours')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'staffRequests createExtraHours')
    return Vue.http.post('staff-request/extra-hours', {extraHoursRequest})
      .then(created)
      .catch(handleError)
  },
  createShiftChange ({dispatch}, shiftRequest) {
    const created = (response) => {
      endLoading(dispatch, 'staffRequests createShiftChange')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'staffRequests createShiftChange')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'staffRequests createShiftChange')
    return Vue.http.post('staff-request/shift-change', {shiftRequest})
      .then(created)
      .catch(handleError)
  },
  getNotArchived ({commit, dispatch, state}) {
    const fetched = (response) => {
      if (response.body.requests.length > 0) {
        commit('update', {type: 'notArchived', requests: response.body.requests})
      } else {
        commit('lastOne', 'notArchived')
      }
      endLoading(dispatch, 'staffRequests getNotArchived')
    }

    const handleError = (error) => {
      endLoading(dispatch, 'staffRequests getNotArchived')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'staffRequests getNotArchived')
    return Vue.http.get('staff-request/not-archived', {params: {page: state.notArchived.page}})
      .then(fetched)
      .catch(handleError)
  },
  toArchive ({commit, dispatch}, staffRequest) {
    const archived = (response) => {
      commit('deleteArchived', response.body.request._id)
      endLoading(dispatch, 'staffRequests toArchive' + staffRequest.request._id)
      return response
    }

    const handleError = (error) => {
      endLoading(dispatch, 'staffRequests toArchive' + staffRequest.request._id)
      return Promise.reject(error)
    }

    const type = () => {
      if (staffRequest.type === Constants.staff_requests_types.SHIFT_CHANGE) {
        return 'shift-change'
      } else if (staffRequest.type === Constants.staff_requests_types.EXTRA_HOURS) {
        return 'extra-hours'
      } else {
        return 'leave'
      }
    }

    startLoading(dispatch, 'staffRequests toArchive' + staffRequest.request._id)
    const id = staffRequest.request._id
    return Vue.http.post(`staff-request/${type()}/archive/${id}`)
      .then(archived)
      .catch(handleError)
  },

  approval ({state, dispatch, commit}, approvalPayload) {
    const success = (response) => {
      if (response.body.success) {
        // commit('pendingToResolved', {res: response.body, type: propertyName, typeRequest: approvalPayload.type})
        commit('reset')
        dispatch('fetchResolved')
        dispatch('fetchPending')
        endLoading(dispatch, loadingName)
        return response
      } else {
        endLoading(dispatch, loadingName)
        return Promise.reject(response)
      }
    }
    const actionName = approvalPayload.request.approved ? 'approve' : 'reject'
    const loadingName = `staffRequests card-request-${actionName}-${approvalPayload.request._id}`
    startLoading(dispatch, loadingName)

    const payload = {
      ...approvalPayload.request,
      ...state.dataToSubmit
    }

    let approvalType
    switch (approvalPayload.type) {
      case Constants.staff_requests_types.EXTRA_HOURS:
        approvalType = 'extra-hours'
        break
      case Constants.staff_requests_types.LEAVE:
        approvalType = 'leave'
        break
      case Constants.staff_requests_types.SHIFT_CHANGE:
        approvalType = 'shift-change'
        break
    }

    // let propertyName
    // switch (approvalPayload.type) {
    //   case Constants.staff_requests_types.EXTRA_HOURS:
    //     propertyName = 'extraHours'
    //     break
    //   case Constants.staff_requests_types.LEAVE:
    //     propertyName = 'leave'
    //     break
    //   case Constants.staff_requests_types.SHIFT_CHANGE:
    //     propertyName = 'shiftChange'
    //     break
    // }

    if (approvalPayload.type === 'LEAVE') {
      return Vue.http.post(`staff-request/${approvalType}/approval/${approvalPayload.request._id}`, {
        approved: approvalPayload.request.approved,
        [approvalType]: payload
      })
        .then(success)
    } else {
      return Vue.http.post(`staff-request/${approvalType}/approval/${approvalPayload.request._id}`, payload)
        .then(success)
    }
  },
  fetchLastUserStaffRequests ({commit, state}, payload) {
    return Vue.http.get('staff-request/to/' + payload.id)
      .then(
        (res) => {
          if (res.body.success) {
            commit('loadCollaboratorStaffRequests', res.body.requests)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  getPdf ({dispatch}, payload) {
    let pdfType
    switch (payload.type) {
      case Constants.staff_requests_types.EXTRA_HOURS:
        pdfType = 'extra-hours'
        break
      case Constants.staff_requests_types.LEAVE:
        pdfType = 'leave'
        break
      case Constants.staff_requests_types.SHIFT_CHANGE:
        pdfType = 'shift-change'
        break
    }
    startLoading(dispatch, `staffRequests printing-${payload._id}`)
    Vue.http.get(`staff-request/${pdfType}/pdf/${payload._id}`, {responseType: 'arraybuffer'})
      .then((response) => {
        const blob = new Blob([response.data], {type: response.headers.get['content-type']})
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `Solicitud-${dateAndTime.dateWithTimeLong(payload.created_at)}.pdf`
        link.click()
        endLoading(dispatch, `staffRequests printing-${payload._id}`)
      })
      .catch(
        () => {
          endLoading(dispatch, `staffRequests printing-${payload._id}`)
        }
      )
  },
  getDetail ({commit, dispatch}, payload) {
    startLoading(dispatch, `staffRequests fetchDetail`)
    return new Promise((resolve, reject) => {
      Vue.http.get(`staff-request/${payload.type}/${payload.id}`)
        .then(
          (res) => {
            if (res.body.success) {
              endLoading(dispatch, `staffRequests fetchDetail`)
              resolve(res.body.request)
            } else {
              endLoading(dispatch, `staffRequests fetchDetail`)
              reject(res)
            }
          }
        )
        .catch(
          (err) => {
            endLoading(dispatch, `staffRequests fetchDetail`)
            reject(err)
          }
        )
    })
  },
  getArchive ({commit, dispatch}, payload) {
    startLoading(dispatch, `staffRequests fetchArchive`)
    return new Promise((resolve, reject) => {
      Vue.http.get(`staff-request/to/${payload}`)
        .then(
          (res) => {
            if (res.body.success) {
              endLoading(dispatch, `staffRequests fetchArchive`)
              resolve(res.body)
            } else {
              endLoading(dispatch, `staffRequests fetchArchive`)
              reject(res)
            }
          }
        )
        .catch(
          (err) => {
            endLoading(dispatch, `staffRequests fetchArchive`)
            reject(err)
          }
        )
    })
  },
  cancel ({dispatch}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post(`staff-request/${payload.type}/cancel/${payload._id}`)
        .then(
          (res) => {
            if (res.body.success) {
              dispatch('fetchResolved')
              resolve(res.body)
            } else {
              reject(res)
            }
          }
        )
        .catch(
          (err) => {
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

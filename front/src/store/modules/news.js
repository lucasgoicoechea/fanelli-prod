import Vue from 'vue'
import generateGuid from '../../utils/guidGenerator'
import Constants from '../../const.js'
import {createActionHelpers} from 'vuex-loading'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

// initial state
const initialState = () => ({
  pending: [],
  finished: []
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
  updatePending (state, payload) {
    state.pending = payload.pending
  },
  updateFinished (state, payload) {
    state.finished = payload.finished
  }
}

// actions
const actions = {
  sendReport ({dispatch, state}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.news
    task.type = Constants.request_types.NEWS

    return new Promise((resolve, reject) => {
      Vue.http.post('staff-news', {news: payload.news}, {headers: {'Idempotency-Key': guid}})
        .then(
          (res) => {
            if (res.body.success) {
              resolve(res)
              task.state = Constants.states.COMPLETED
            } else {
              reject(res)
              task.state = Constants.states.ERROR
            }
            dispatch('tasksQueue/addTask', task, {root: true})
          },
          (err) => {
            reject(err)
            task.state = Constants.states.PENDING
            dispatch('tasksQueue/addTask', task, {root: true})
          }
        )
    })
  },
  fetchPendingNews ({commit}) {
    Vue.http.get('staff-news/without-exculpatory')
      .then(
        (res) => {
          if (res.body.success) {
            commit('updatePending', {pending: res.body.staffNews})
          }
        },
        (err) => Promise.reject(err)
      )
  },
  fetchFinishedNews ({commit}) {
    Vue.http.get('staff-news/finished')
      .then(
        (res) => {
          if (res.body.success) {
            commit('updateFinished', {finished: res.body.staffNews})
          }
        },
        (err) => Promise.reject(err)
      )
  },
  getAll ({commit, dispatch}, payload) {
    const success = (res) => {
      endLoading(dispatch, `newsRequests fetchAll`)
      return res.body
    }

    const failure = (err) => {
      endLoading(dispatch, `newsRequests fetchAll`)
      return Promise.reject(err)
    }

    startLoading(dispatch, `newsRequests fetchAll`)
    return Vue.http.get(`staff-news/to/${payload}`)
      .then(success)
      .catch(failure)
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

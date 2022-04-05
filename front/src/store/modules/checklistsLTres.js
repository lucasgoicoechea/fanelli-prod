import Vue from 'vue'
import {createActionHelpers} from 'vuex-loading'
import Constants from '@/const'
import generateGuid from '@/utils/guidGenerator'
import capitalize from '@/filters/capitalize'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

function isEmpty (obj) {
  return Object.keys(obj).length === 0
}

function getSector (state, sector) {
  return state.types.find(e => e.sector === sector)
}

// initial state
const initialState = () => ({
  types: [
    {
      sector: 'EXTRUSORA',
      checklist: {},
      currentCheck: 0
    },
    {
      sector: 'APILADORA',
      checklist: {},
      currentCheck: 0
    },
    {
      sector: 'DESAPILADORA',
      checklist: {},
      currentCheck: 0
    }
  ],
  checklists: [],
  loading: false,
  page: 0,
  lastOne: false,
  summaries: [],
  histories: [],
  checklistOrder: [
    'EXTRUSORA',
    'APILADORA',
    'DESAPILADORA'
  ],
  last30days: []
})

const state = initialState()

// getters
const getters = {
  getSector: (state) => (sector) => {
    return state.types.find(e => e.sector === sector)
  },
  currentCheck: (state, getters) => (sector) => {
    const index = getters.getSector(sector).currentCheck
    return getters.getSector(sector).checklist.checks[index]
  },
  isCurrentCheck: (state, getters) => (sector, check) => {
    return getters.currentCheck(sector) === check
  },
  checklistHasObservation: (state, getters) => (sector) => {
    const currentSector = getters.getSector(sector)
    if (isEmpty(currentSector.checklist)) {
      return false
    }
    return currentSector.checklist.observations.length > 0
  },
  getComparativeHeaders: (state) => {
    if (state.histories[0]) {
      const headers = Object.assign([], state.histories[0].headers)
      return headers.map(s => {
        s.redeable = s.shift + s.schedule[0]
        return s
      })
    }
  },
  getHistoryBySector: (state) => (sector) => {
    return state.histories.find(h => h.sector === sector) || []
  },
  getDatesChecklists: (state) => {
    const dates = state.last30days.map(c => c.substring(0, 10))
    return dates.filter((elem, index, self) => index === self.indexOf(elem))
  },
  filterChecklistsByDate: (state, getters) => (date) => {
    return getters.getDatesChecklists.filter(c => c.includes(date))
  },
  filterChecklistsSummary: (state) => (sector) => {
    return state.summaries.filter(c => c.sector === sector)[0]
  }
}

// mutations
const mutations = {
  loading (state, load) {
    state.loading = load
  },
  setPage (state, page) {
    state.page = page
  },
  reset (state) {
    const init = initialState()
    Object.keys(init).forEach(key => {
      state[key] = init[key]
    })
  },
  setLast30Days (state, payload) {
    state.last30days = payload.checklistsDays
  },
  lastOne (state) {
    state.lastOne = true
  },
  addChecklists (state, checklists) {
    checklists.forEach((checklist) => {
      state.checklists.push(checklist)
    })
  },
  setChecklist (state, {sector, checklist}) {
    checklist.checks.map(e => {
      e.loading = false
      if (e.hasOwnProperty('last')) {
        e.auxExtra = (e.check.extra && e.last.hasOwnProperty('extra')) ? e.last.extra : 0
      } else {
        e.last = null
        e.auxExtra = 0
      }
      return e
    })
    state.types.find(e => e.sector === sector).checklist = checklist
  },
  setAllChecklists (state, {checklists}) {
    state.checklists = checklists
  },
  initCurrent (state, {sector}) {
    const currentSector = getSector(state, sector)
    let currentPos = currentSector.checklist.checks.findIndex(e => e.values.length === 0)
    if (currentPos === -1) {
      currentPos = 0
    }
    currentSector.currentCheck = currentPos
  },
  updateAuxExtra (state, {sector, value}) {
    const currentSector = getSector(state, sector)
    currentSector.checklist.checks[currentSector.currentCheck].auxExtra = value
  },
  next (state, {sector}) {
    const currentSector = getSector(state, sector)
    const indexNext = currentSector.currentCheck + 1
    if (indexNext >= 0 && indexNext !== currentSector.checklist.checks.length) {
      currentSector.currentCheck = indexNext
    }
  },
  selectCheck (state, {check}) {
    const currentSector = getSector(state, check.sector)
    currentSector.currentCheck = currentSector.checklist.checks.findIndex(e => e.check._id === check._id)
  },
  undo (state, {sector}) {
    const currentSector = getSector(state, sector)
    const indexNext = currentSector.currentCheck - 1
    if (indexNext >= 0) {
      currentSector.currentCheck = indexNext
    }
  },
  updateCheck (state, {sector, id, checklist}) {
    const currentSector = getSector(state, sector)
    const updatedValue = checklist.checks.find(e => e.check._id === id)
    const localValue = currentSector.checklist.checks.find(e => e.check._id === id)
    localValue.values = updatedValue.values
    localValue.comments = updatedValue.comments
    if ('last' in updatedValue) localValue.last = updatedValue.last
  },
  loadingCheck (state, {sector, id, value}) {
    const currentSector = getSector(state, sector)
    const index = currentSector.checklist.checks.findIndex(e => e.check._id === id)
    currentSector.checklist.checks[index].loading = value
  },
  summaries (state, summaries) {
    state.summaries = summaries
  },
  addComparativeHistory (state, comparative) {
    const history = comparative
    history.sector = comparative.checks[0].sector
    history.headers.forEach(s => {
      s.redeable = s.shift + s.schedule[0]
    })
    state.histories.push(history)
  },
  cleanHistories (state) {
    state.histories.length = 0
  }
}

// actions
const actions = {
  fetch ({commit, dispatch}, {sector}) {
    startLoading(dispatch, 'checklist fetch')
    commit('loading', true)
    Vue.http.get(`checklist/current/${sector}`)
      .then(
        (res) => {
          if (res.body.success) {
            commit('setChecklist', {sector: sector, checklist: res.body.checklist})
            commit('initCurrent', {sector: sector})
            commit('loading', false)
            endLoading(dispatch, 'checklist fetch')
          } else {
            endLoading(dispatch, 'checklist fetch')
          }
        },
        () => {
          endLoading(dispatch, 'checklist fetch')
        }
      )
  },
  fetchAll ({commit}) {
    commit('loading', true)
    return Vue.http.get(`checklist`)
      .then(
        (res) => {
          if (res.body.success) {
            commit('setAllChecklists', {checklists: res.body.checklists})
            commit('loading', false)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  fetchLast30days ({commit}) {
    commit('loading', true)
    return Vue.http.get(`checklist/dates`)
      .then(
        (res) => {
          if (res.body.success) {
            commit('setLast30Days', {checklistsDays: res.body.dates})
            commit('loading', false)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  updateCheck ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.check
    task.type = Constants.request_types.CHECKLIST_CHECK
    task.extra_data = {text: payload.check.text}
    commit('next', {sector: payload.sector})
    commit('loadingCheck', {sector: payload.sector, id: payload.check.id, value: true})
    Vue.http.post('checklist/', {check: payload.check}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('updateCheck', {sector: payload.sector, id: payload.check.id, checklist: res.body.checklist})
            commit('loadingCheck', {sector: payload.sector, id: payload.check.id, value: false})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  createComment ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.check
    task.type = Constants.request_types.CHECKLIST_OBSERVATION
    task.extra_data = {text: payload.check.text}

    commit('loadingCheck', {sector: payload.sector, id: payload.check.id, value: true})
    Vue.http.post('checklist/comment', {check: payload.check}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('updateCheck', {sector: payload.sector, id: payload.check.id, checklist: res.body.checklist})
            commit('loadingCheck', {sector: payload.sector, id: payload.check.id, value: false})
          } else {
            task.state = Constants.states.ERROR
            dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  createObservation ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.observation
    task.type = Constants.request_types.CHECKLIST_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.sector)}
    return Vue.http.post('checklist/observation', {observation: payload.observation}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setChecklist', {sector: payload.sector, checklist: res.body.checklist})
          } else {
            task.state = Constants.states.ERROR
            dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  loadMore ({commit, state}) {
    commit('setPage', state.page + 1)
    commit('loading', true)
    return Vue.http.get('checklist?page=' + state.page)
      .then(
        (res) => {
          if (res.body.success) {
            if (res.body.checklists.length > 0) {
              commit('addChecklists', res.body.checklists)
            } else {
              commit('lastOne')
            }
            commit('loading', false)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  summaries ({commit, dispatch}, payload) {
    startLoading(dispatch, 'checklist summaries')
    const params = (payload.date !== null && payload.date !== undefined) ? {date: payload.date} : {}
    Vue.http.get('checklist/summary', {
      params: params
    })
      .then(
        (res) => {
          if (res.body.success) {
            commit('summaries', res.body.summaries)
            endLoading(dispatch, 'checklist summaries')
          }
        },
        () => {
          endLoading(dispatch, 'checklist summaries')
        }
      )
  },
  addHistory ({commit}, payload) {
    return new Promise((resolve, reject) => {
      const params = (payload.date !== null && payload.date !== undefined) ? {date: payload.date} : {}
      Vue.http.get(`checklist/comparative/${payload.sector}`, {
        params: params,
        before (request) {
          // abort previous request, if exists
          if (Vue.previousRequest !== undefined &&
            Vue.previousRequest[payload.sector] !== undefined) {
            Vue.previousRequest[payload.sector].abort()
          }
          // set previous request on Vue instance
          if (Vue.previousRequest === undefined) Vue.previousRequest = {}
          Vue.previousRequest[payload.sector] = request
        }
      })
        .then(
          (res) => {
            if (res.body.success) {
              commit('addComparativeHistory', res.body)
              resolve()
            }
            reject()
          },
          () => {
            reject()
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

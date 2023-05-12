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
      supervisionpart: {},
      currentSupervisionpart: 0,
      fails: []
    },
    {
      sector: 'APILADORA',
      supervisionpart: {},
      currentSupervisionpart: 0,
      fails: []
    },
    {
      sector: 'DESAPILADORA',
      supervisionpart: {},
      currentSupervisionpart: 0,
      fails: []
    }
  ],
  supervisionparts: [],
  loading: false,
  page: 0,
  lastOne: false,
  summaries: [],
  histories: [],
  supervisionpartOrder: [
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
  currentSupervisionpart: (state, getters) => (sector) => {
    const index = getters.getSector(sector).currentSupervisionpart
    return getters.getSector(sector).supervisionpart.hours[index]
  },
  isCurrentSupervisionpart: (state, getters) => (sector, supervisionpart) => {
    return getters.currentSupervisionpart(sector) === supervisionpart
  },
  currentHour: (state, getters) => (sector) => {
    // const index = getters.getSector(sector).hours.length - 1
    return getters.getSector(sector).supervisionpart.hours[0]
  },
  isCurrentHour: (state, getters) => (sector, hour) => {
    return getters.currentHour(sector) === hour
  },
  supervisionpartHasObservation: (state, getters) => (sector) => {
    const currentSector = getters.getSector(sector)
    if (isEmpty(currentSector.supervisionpart)) {
      return false
    }
    return currentSector.supervisionpart.observations.length > 0
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
    // console.log(sector)
    return state.histories.filter(h => h.sector === sector) || []
  },
  getDatesSupervisionparts: (state) => {
    const dates = state.last30days.map(c => c.substring(0, 10))
    return dates.filter((elem, index, self) => index === self.indexOf(elem))
  },
  filterSupervisionpartsByDate: (state, getters) => (date) => {
    return getters.getDatesSupervisionparts.filter(c => c.includes(date))
  },
  filterSupervisionpartsSummary: (state) => (sector) => {
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
    state.last30days = payload.supervisionpartsDays
  },
  lastOne (state) {
    state.lastOne = true
  },
  addSupervisionparts (state, supervisionparts) {
    supervisionparts.forEach((supervisionpart) => {
      state.supervisionparts.push(supervisionpart)
    })
  },
  setSupervisionpart (state, {sector, supervisionpart}) {
    /* supervisionpart.hours.map(e => {
      e.loading = false
      if (e.hasOwnProperty('last')) {
        e.auxExtra = (e.hour.extra && e.last.hasOwnProperty('extra')) ? e.last.extra : 0
      } else {
        e.last = null
        e.auxExtra = 0
      }
      return e
    }) */
    state.types.find(e => e.sector === sector).supervisionpart = supervisionpart
  },
  setFails (state, {sector, fails}) {
    // console.dir(fails)
    state.types.find(e => e.sector === sector).fails = fails
  },
  setAllSupervisionparts (state, {supervisionparts}) {
    state.supervisionparts = supervisionparts
  },
  initCurrent (state, {sector}) {
    const currentSector = getSector(state, sector)
    // aca deberiamos pararnos en el turno del momento
    // let currentPos = currentSector.supervisionpart.hours.findIndex(e => e.values.length === 0)
    let currentPos = -1
    if (currentPos === -1) {
      currentPos = 0
    }
    currentSector.currentSupervisionpart = currentPos
  },
  updateAuxExtra (state, {sector, value}) {
    const currentSector = getSector(state, sector)
    currentSector.supervisionpart.hours[currentSector.currentSupervisionpart].auxExtra = value
  },
  next (state, {sector}) {
    const currentSector = getSector(state, sector)
    const indexNext = currentSector.currentSupervisionpart + 1
    if (indexNext >= 0 && indexNext !== currentSector.supervisionpart.hours.length) {
      currentSector.currentSupervisionpart = indexNext
    }
  },
  selectSupervisionpart (state, {hour}) {
    const currentSector = getSector(state, hour.sector)
    currentSector.currentSupervisionpart = currentSector.supervisionpart.hours.findIndex(e => e.hour._id === hour._id)
  },
  undo (state, {sector}) {
    const currentSector = getSector(state, sector)
    const indexNext = currentSector.currentSupervisionpart - 1
    if (indexNext >= 0) {
      currentSector.currentSupervisionpart = indexNext
    }
  },
  updateSupervisionpart (state, {sector, id, supervisionpart}) {
    const currentSector = getSector(state, sector)
    const updatedValue = supervisionpart.hours.find(e => e.hour._id === id)
    const localValue = currentSector.supervisionpart.hours.find(e => e.hour._id === id)
    localValue.values = updatedValue.values
    localValue.comments = updatedValue.comments
    if ('last' in updatedValue) localValue.last = updatedValue.last
  },
  loadingSupervisionpart (state, {sector, id, value}) {
    const currentSector = getSector(state, sector)
    const index = currentSector.supervisionpart.hours.findIndex(e => e.hour._id === id)
    currentSector.supervisionpart.hours[index].loading = value
  },
  summaries (state, summaries) {
    state.summaries = summaries
  },
  addComparativeHistoryOLD (state, comparative) {
    const history = comparative
    history.sector = comparative.hours[0].sector
    history.headers.forEach(s => {
      s.redeable = s.shift + s.schedule[0]
    })
    state.histories.push(history)
  },
  addComparativeHistory (state, comparatives) {
    const histories = comparatives.supervisionparts
    histories.forEach(f => {
      f.headers = comparatives.headers
    })
    comparatives.headers.forEach(s => {
      s.redeable = s.shift + s.schedule[0]
    })
    histories.forEach(hi => {
      state.histories.push(hi)
    })
    // state.histories = histories
  },
  addTotales (state, totales) {
    const histories = totales
    histories.forEach(hi => {
      state.histories.push(hi)
    })
    return totales
  },
  cleanHistories (state) {
    state.histories.length = 0
  }
}

// actions
const actions = {
  fetch ({commit, dispatch}, {sector}) {
    startLoading(dispatch, 'supervisionpart fetch')
    commit('loading', true)
    Vue.http.get(`supervisionpartLTres/current/${sector}`)
      .then(
        (res) => {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: sector, supervisionpart: res.body.supervisionpart})
            commit('initCurrent', {sector: sector})
            commit('loading', false)
            endLoading(dispatch, 'supervisionpart fetch')
          } else {
            endLoading(dispatch, 'supervisionpart fetch')
          }
        },
        () => {
          endLoading(dispatch, 'supervisionpart fetch')
        }
      )
  },
  fetchAll ({commit}) {
    commit('loading', true)
    return Vue.http.get(`supervisionpartLTres`)
      .then(
        (res) => {
          if (res.body.success) {
            commit('setAllSupervisionparts', {supervisionparts: res.body.supervisionparts})
            commit('loading', false)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  fetchLast30days ({commit}) {
    commit('loading', true)
    return Vue.http.get(`supervisionpartLTres/dates`)
      .then(
        (res) => {
          if (res.body.success) {
            commit('setLast30Days', {supervisionpartsDays: res.body.dates})
            commit('loading', false)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  updateSupervisionpart ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.hour
    task.type = Constants.request_types.SUPERVISIONPART_HOUR
    task.extra_data = {text: payload.hour.text}
    // las dos lineas siguientes son para ir check por check
    // commit('next', {sector: payload.sector})
    // commit('loadingSupervisionpart', {sector: payload.sector, id: payload.hour.id, value: true})
    Vue.http.post('supervisionpartLTres/', {hour: payload.hour}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('updateSupervisionpart', {sector: payload.sector, id: payload.hour.id, supervisionpart: res.body.supervisionpart})
            commit('loadingSupervisionpart', {sector: payload.sector, id: payload.hour.id, value: false})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  updateTotals ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.sector)}
    // las  lineas siguientes son para ir check por check
    // commit('loadingSupervisionpart', {sector: payload.sector, id: payload.hour.id, value: true})
    Vue.http.post('supervisionpartLTres/totals', payload, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: payload.sector, supervisionpart: res.body.supervisionPart})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  updateHour ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.totals.sector)}
    // las  lineas siguientes son para ir check por check
    // commit('loadingSupervisionpart', {sector: payload.sector, id: payload.hour.id, value: true})
    Vue.http.post('supervisionpartLTres/updateHour', payload, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: payload.totals.sector, supervisionpart: res.body.supervisionPart})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  /* createComment ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.hour
    task.type = Constants.request_types.SUPERVISIONPART_OBSERVATION
    task.extra_data = {text: payload.supervisionpart.text}

    commit('loadingSupervisionpart', {sector: payload.sector, id: payload.hour.id, value: true})
    Vue.http.post('supervisionpart/comment', {hour: payload.hour}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('updateSupervisionpart', {sector: payload.sector, id: payload.hour.id, supervisionpart: res.body.supervisionpart})
            commit('loadingSupervisionpart', {sector: payload.sector, id: payload.hour.id, value: false})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },  */
  createObservation ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.observation
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.sector)}
    return Vue.http.post('supervisionpartLTres/observation', {observation: payload.observation}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: payload.sector, supervisionpart: res.body.supervisionPart})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  createObservationHour ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.observation
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.sector)}
    return Vue.http.post('supervisionpartLTres/createObservationHour', {observation: payload.observation}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: res.body.supervisionPart.sector, supervisionpart: res.body.supervisionPart})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  delRepositionPallet ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.observation
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.observation.sector)}
    return Vue.http.post('supervisionpartLTres/delRepositionPallet', {observation: payload.observation}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: res.body.supervisionPart.sector, supervisionpart: res.body.supervisionPart})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  createRepositionPallet ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.observation
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.observation.sector)}
    return Vue.http.post('supervisionpartLTres/createRepositionPallet', {observation: payload.observation}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: res.body.supervisionPart.sector, supervisionpart: res.body.supervisionPart})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  createMaterial ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.observation
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.observation.sector)}
    return Vue.http.post('supervisionpartLTres/createMaterial', {observation: payload.observation}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: res.body.supervisionPart.sector, supervisionpart: res.body.supervisionPart})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  addVagon ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.observation
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.observation.sector)}
    return Vue.http.post('supervisionpartLTres/addVagon', {observation: payload.observation}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: res.body.supervisionPart.sector, supervisionpart: res.body.supervisionPart})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  delMaterial ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.observation
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.observation.sector)}
    return Vue.http.post('supervisionpartLTres/delMaterial', {observation: payload.observation}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: res.body.supervisionPart.sector, supervisionpart: res.body.supervisionPart})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  delVagon ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.observation
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.observation.sector)}
    return Vue.http.post('supervisionpartLTres/delVagon', {observation: payload.observation}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: res.body.supervisionPart.sector, supervisionpart: res.body.supervisionPart})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  delStopping ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.observation
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.observation.sector)}
    return Vue.http.post('supervisionpartLTres/delStopping', {observation: payload.observation}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: res.body.supervisionPart.sector, supervisionpart: res.body.supervisionPart})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  createStopping ({commit, dispatch}, payload) {
    const guid = generateGuid()
    const task = {}
    task.id = guid
    task.data = payload.stopping
    task.type = Constants.request_types.SUPERVISIONPART_GENERAL_OBSERVATION
    task.extra_data = {sector: capitalize(payload.stopping.sector)}
    return Vue.http.post('supervisionpartLTres/createStopping', {observation: payload.stopping}, {headers: {'Idempotency-Key': guid}})
      .then(
        function (res) {
          if (res.body.success) {
            commit('setSupervisionpart', {sector: res.body.supervisionPart.sector, supervisionpart: res.body.supervisionPart})
          } else {
            task.state = Constants.states.ERROR
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        },
        function (err) {
          if (err.status === 0) {
            task.state = Constants.states.PENDING
            // dispatch('tasksQueue/addTask', task, {root: true})
          }
        }
      )
  },
  fails ({commit, dispatch}, {sector}) {
    startLoading(dispatch, 'supervisionpart fails')
    commit('loading', true)
    Vue.http.get(`supervisionpartLTres/fails/${sector}`)
      .then(
        (res) => {
          if (res.body.success) {
            commit('setFails', {sector: sector, fails: res.body.fails})
            commit('loading', false)
            endLoading(dispatch, 'supervisionpart fails')
          } else {
            endLoading(dispatch, 'supervisionpart fails')
          }
        },
        () => {
          endLoading(dispatch, 'supervisionpart fails')
        }
      )
  },
  loadMore ({commit, state}) {
    commit('setPage', state.page + 1)
    commit('loading', true)
    return Vue.http.get('supervisionpartLTres?page=' + state.page)
      .then(
        (res) => {
          if (res.body.success) {
            if (res.body.supervisionparts.length > 0) {
              commit('addSupervisionparts', res.body.supervisionparts)
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
    startLoading(dispatch, 'supervisionpart summaries')
    const params = (payload.date !== null && payload.date !== undefined) ? {date: payload.date} : {}
    Vue.http.get('supervisionpartLTres/summary', {
      params: params
    })
      .then(
        (res) => {
          if (res.body.success) {
            commit('summaries', res.body.summaries)
            endLoading(dispatch, 'supervisionpart summaries')
          }
        },
        () => {
          endLoading(dispatch, 'supervisionpart summaries')
        }
      )
  },
  addHistory ({commit}, payload) {
    return new Promise((resolve, reject) => {
      const params = (payload.date !== null && payload.date !== undefined) ? {date: payload.date} : {}
      Vue.http.get(`supervisionpartLTres/comparative/${payload.sector}`, {
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
  },
  totales ({commit}, payload) {
    return new Promise((resolve, reject) => {
      const params = (payload.date !== null && payload.date !== undefined) ? {date: payload.date} : {dae: 'dd'}
      Vue.http.get(`supervisionpartLTres/totalesGral`, {
        params: params
      })
        .then(
          (res) => {
            if (res.body.success) {
              resolve(res.body)
            }
            reject()
          },
          () => {
            reject()
          }
        )
    })
  },
  totalesExtrusora ({commit}, payload) {
    return new Promise((resolve, reject) => {
      const params = (payload.date !== null && payload.date !== undefined) ? {date: payload.date} : {dae: 'dd'}
      Vue.http.get(`supervisionpartLTres/totalesExtrusora`, {
        params: params
      })
        .then(
          (res) => {
            if (res.body.success) {
              resolve(res.body)
            }
            reject()
          },
          () => {
            reject()
          }
        )
    })
  },
  totalesApiladora ({commit}, payload) {
    return new Promise((resolve, reject) => {
      const params = (payload.date !== null && payload.date !== undefined) ? {date: payload.date} : {dae: 'dd'}
      Vue.http.get(`supervisionpartLTres/totalesApiladora`, {
        params: params
      })
        .then(
          (res) => {
            if (res.body.success) {
              resolve(res.body)
            }
            reject()
          },
          () => {
            reject()
          }
        )
    })
  },
  totalesDesapiladora ({commit}, payload) {
    return new Promise((resolve, reject) => {
      const params = (payload.date !== null && payload.date !== undefined) ? {date: payload.date} : {dae: 'dd'}
      Vue.http.get(`supervisionpartLTres/totalesDesapiladora`, {
        params: params
      })
        .then(
          (res) => {
            if (res.body.success) {
              resolve(res.body)
            }
            reject()
          },
          () => {
            reject()
          }
        )
    })
  },
  getAllReportDay (context, day) {
    const success = (response) => {
      return new Blob([response.data], {type: response.headers.get['content-type']})
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get(`supervisionpartLTres/excel/${day}`,
      {responseType: 'arraybuffer'}
    )
      .then(success)
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

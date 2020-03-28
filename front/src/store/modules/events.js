// initial state
import Vue from 'vue'
import Constants from '@/const.js'
import {createActionHelpers} from 'vuex-loading'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

const initialState = () => ({
  /**
   * timelines represents the events from each collaborator
   **/
  timelines: [],
  /**
   * selectedTimeline represents the timeline that is currently 'active' for manipulation
   */
  selectedTimeline: '',
  /**
   * selectedEventType represents the current type of event that is being created
   */
  selectedEventType: '',
  /**
   * dataToSubmit represents the data that is going to the server
   */
  dataToSubmit: {},
  /**
   * eventTypes represent all the event types available for the timelines
   */
  eventTypes: [
    {
      type: Constants.event_types.MEDICAL_ORDER,
      name: 'Orden médica'
    },
    {
      type: Constants.event_types.MEDICAL_REPORT,
      name: 'Informe Médico'
    },
    {
      type: Constants.event_types.LICENSE,
      name: 'Licencias'
    }
  ],
  licenseTypes: [
    {
      type: Constants.event_types.SINDICAL_LICENSE,
      name: 'Sindical'
    },
    {
      type: Constants.event_types.DEATH_LICENSE,
      name: 'Defunción'
    },
    {
      type: Constants.event_types.UNION_LICENSE,
      name: 'Matrimonio'
    },
    {
      type: Constants.event_types.BIRTH_LICENSE,
      name: 'Nacimiento'
    },
    {
      type: Constants.event_types.HOLIDAYS,
      name: 'Vacaciones'
    },
    {
      type: Constants.event_types.EXTRAORDINARY,
      name: 'Extraordinaria'
    },
    {
      type: Constants.event_types.COVID19,
      name: 'COVID19'
    }
  ],
  medicInformTypes: [
    {
      type: 'MEDIC',
      name: 'Enfermedad'
    },
    {
      type: 'ACCIDENT',
      name: 'Accidente'
    },
    {
      type: 'ABSENT',
      name: 'No se presentó'
    }
  ]
})

const state = initialState()

// getters
const getters = {
  isFirstEvent: (state) => (timelineId, eventId) => {
    const first = state.timelines
      .find(aTimeline => aTimeline._id === timelineId)
      .events[0].item._id === eventId
    return first
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

  resetDataToSubmit (state) {
    Object.keys(state.dataToSubmit).forEach(key => {
      if (key !== 'collaboratorId' && key !== 'eventsTimelineId' && key !== 'type') {
        delete state.dataToSubmit[key]
      }
    })
  },

  /**
   * Saves the payload to the state
   * @param state
   * @param payload
   */
  loadEventLine (state, payload) {
    state.timelines = payload
  },
  /**
   * Updates the current timeline for adding a new event to it later
   * @param state
   * @param payload
   */
  updateSelectedTimeline (state, payload) {
    state.dataToSubmit.eventsTimelineId = payload.timeline
  },
  /**
   * Updates the current event type for adding a new event
   * @param state
   * @param payload
   */
  updateSelectedEventType (state, payload) {
    state.dataToSubmit.type = payload.event
  },
  /**
   * Updates the current collaborator for adding a new event
   * @param state
   * @param payload
   */
  updateSelectedCollaborator (state, payload) {
    state.dataToSubmit.collaboratorId = payload.collaborator
  },
  /**
   * Updates a property from the dataToSubmit object
   * @param state
   * @param payload
   */
  updateToSubmitField (state, payload) {
    state.dataToSubmit[payload.field] = payload.value
  },
  /**
   * Adds a new event to a timeline
   * @param state
   * @param payload
   */
  addEventToTimeline (state, payload) {
    state.timelines.forEach(item => {
      if (item._id === payload.eventsTimeline._id) {
        const eventData = {
          _id: payload.staffRequest._id,
          type: 'StaffRequest',
          item: payload.staffRequest
        }
        item.events.push(eventData)
      }
    })
  },
  /**
   * Deletes a timeline from the state
   * @param state
   * @param payload
   */
  deleteTimeline (state, payload) {
    state.timelines.forEach((item, index) => {
      if (item._id === payload.timeline) {
        state.timelines.splice(index, 1)
      }
    })
  },
  /**
   * Updates the exculpatory from an event
   * @param {object} state The store's state
   * @param {object} payload The event's data
   * @param {string} payload._id The event's id
   * @param {string} payload.exculpatory The event's exculpatory
   */
  updateEventExculpatory (state, payload) {
    let found = false
    for (const timeline of state.timelines) {
      for (const event of timeline.events) {
        if (event.item._id === payload._id) {
          Vue.set(event.item, 'exculpatory', payload.exculpatory)
          found = true
          break
        }
      }
      if (found) {
        break
      }
    }
  },
  /**
   * Updates the observation from an event
   * @param {object} state The store's state
   * @param {object} payload The event's data
   * @param {string} payload.id The event's id
   * @param {string} payload.observation The event's observation
   */
  updateEventObservation (state, payload) {
    let found = false
    for (const timeline of state.timelines) {
      for (const event of timeline.events) {
        if (event.item._id === payload.id) {
          Vue.set(event.item, 'observation', payload.observation)
          found = true
          break
        }
      }
      if (found) {
        break
      }
    }
  },
  /**
   * Updates the event's fields
   * @param {object} state The store's state
   * @param {object} payload.event The event's data
   * @param {string} payload.event.id The event's id
   */
  updateEventFields (state, payload) {
    let found = false
    for (const timeline of state.timelines) {
      for (const event of timeline.events) {
        if (event.item._id === payload.event._id) {
          Vue.set(event, 'item', payload.event)
          found = true
          break
        }
      }
      if (found) {
        break
      }
    }
  },
  /**
   * Deletes an event from a timeline
   * @param state
   * @param payload
   */
  deleteEventFromTimeline (state, payload) {
    let found = false

    for (let [timelineIndex, timeline] of state.timelines.entries()) {
      if (timeline._id === payload.eventsTimelineId) {
        for (let [eventIndex, event] of timeline.events.entries()) {
          if (event.item._id === payload.eventId) {
            state.timelines[timelineIndex].events.splice(eventIndex, 1)
            found = true
            break
          }
        }
        if (found) {
          break
        }
      }
    }
  },
  deleteToSubmitField (state, payload) {
    delete state.dataToSubmit[payload]
  }
}
// actions
const actions = {
  /**
   * Fetch the event lines for each collaborator
   * @param commit
   * @param state
   */
  fetchEventLines ({commit, dispatch}) {
    startLoading(dispatch, 'timeline fetch')
    return Vue.http.get('events-timeline')
      .then(
        (res) => {
          if (res.body.success) {
            commit('loadEventLine', res.body.eventsTimeline)
            endLoading(dispatch, 'timeline fetch')
          } else {
            endLoading(dispatch, 'timeline fetch')
          }
        },
        (err) => {
          endLoading(dispatch, 'timeline fetch')
          return Promise.reject(err)
        }
      )
  },
  /**
   * Add a new event to the timeline
   * @param commit
   * @param state
   * @param payload
   */
  addEventToTimeline ({commit, dispatch, state}, payload) {
    startLoading(dispatch, 'events createNews')
    if (payload.eventType === Constants.event_types.MEDICAL_REPORT) {
      if (state.dataToSubmit.medicalDischarge === 'true') {
        state.dataToSubmit.dischargeDate = state.dataToSubmit.date
      } else {
        state.dataToSubmit.nextMedicalVisit = state.dataToSubmit.date
      }
      commit('deleteToSubmitField', 'date')
    }

    const formData = new FormData()

    for (const key of Object.keys(state.dataToSubmit)) {
      formData.append(key, state.dataToSubmit[key])
    }

    return new Promise((resolve, reject) => {
      Vue.http.post('staff-request/license', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(
          (res) => {
            if (res.body.success) {
              commit('addEventToTimeline', res.body)
              endLoading(dispatch, 'events createNews')
              resolve()
            } else {
              endLoading(dispatch, 'events createNews')
              reject()
            }
          },
          () => {
            endLoading(dispatch, 'events createNews')
            reject()
          })
    })
  },
  /**
   * Add an exculpatory to an event
   * @param commit
   * @param state
   * @param payload
   */
  addExculpatoryToEvent ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.put('staff-news/exculpatory', {news: payload})
        .then(
          (res) => {
            if (res.body.success) {
              commit('updateEventExculpatory', {
                _id: res.body.staffNews._id,
                exculpatory: res.body.staffNews.exculpatory
              })
              resolve(res)
            } else {
              reject()
            }
          },
          (err) => {
            reject(err)
          })
    })
    /**
     * Update an event's fields
     * @param {object} dispatch
     * @param {object} commit
     * @param {object} state
     * @param {string} data.id The event's id
     * @param {string} data.type The event's type
     * @param {string} [data.payload.observation] The event's observation
     * @param {string} [data.payload.exculpatory] The event's exculpatory
     * @param {string} [data.payload.nextMedicalVisit] The event's next medical visit
     * @param {string} [data.payload.dischargeDate] The event's discharge date
     */
  },
  updateEventFields ({dispatch, commit, state}, data) {
    startLoading(dispatch, 'events updateEvent')
    const url = data.type === Constants.staff_action_types.STAFF_NEWS ? 'staff-news' : 'staff-request/license'
    return Vue.http.put(`${url}/${data.id}`, {event: data.payload})
      .then(
        (res) => {
          if (res.body.success) {
            const event = (url === 'staff-news') ? res.body.staffNews : res.body.event
            commit('updateEventFields', {event: event})
            endLoading(dispatch, 'events updateEvent')
            return Promise.resolve(res)
          } else {
            endLoading(dispatch, 'events updateEvent')
            return Promise.reject(res)
          }
        },
        (err) => {
          endLoading(dispatch, 'events updateEvent')
          return Promise.reject(err)
        })
  },
  /**
   * Archive a timeline
   * @param commit
   * @param state
   * @param payload
   */
  archiveTimeline ({commit, state}, payload) {
    return Vue.http.post('events-timeline/archive', {eventsTimelineId: payload.timeline})
      .then(
        (res) => {
          if (res.body.success) {
            commit('deleteTimeline', payload)
          }
        },
        (err) => Promise.reject(err))
  },
  /**
   * Delete an event from a timeline
   * @param commit
   * @param state
   * @param payload
   */
  deleteEventFromTimeline ({commit, state, getters}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post('events-timeline/remove-event', {
        eventsTimelineId: payload.eventsTimelineId,
        eventId: payload.eventId
      })
        .then(
          (res) => {
            if (res.body.success) {
              if (getters.isFirstEvent(payload.eventsTimelineId, payload.eventId)) {
                commit('deleteTimeline', {timeline: payload.eventsTimelineId})
              } else {
                commit('deleteEventFromTimeline', payload)
              }
              resolve(res)
            } else {
              reject(res)
            }
          },
          (err) => {
            reject(err)
          })
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

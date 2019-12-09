import Vue from 'vue'
import {createActionHelpers} from 'vuex-loading'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

// initial state
const initialState = () => ({
  availability: {},
  newsWithoutExculpatory: []
})

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
  },
  setAvailability (state, items) {
    state.availability = items
  },
  setNewsWithoutExculpatory (state, news) {
    state.newsWithoutExculpatory = news
  }
}
// actions
const actions = {
  fetchAvailability ({commit, dispatch}, payload) {
    const fetched = (response) => {
      commit('setAvailability', response.body.availability)
      endLoading(dispatch, 'widgets availability')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'widgets availability')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'widgets availability')
    return Vue.http.get('availability', {
      params: {from: payload.from, to: payload.to},
      before (request) {
        if (Vue.previousRequest !== undefined &&
          Vue.previousRequest['availability'] !== undefined) {
          Vue.previousRequest['availability'].abort()
        }
        // set previous request on Vue instance
        if (Vue.previousRequest === undefined) Vue.previousRequest = {}
        Vue.previousRequest['availability'] = request
      }
    })
      .then(fetched)
      .catch(handleError)
  },
  fetchWithoutExculpatory ({commit, dispatch}) {
    const fetched = (response) => {
      commit('setNewsWithoutExculpatory', response.body.staffNews)
      endLoading(dispatch, 'widgets without-exculpatory')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'widgets without-exculpatory')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'widgets without-exculpatory')
    return Vue.http.get('staff-news/without-exculpatory', {
      before (request) {
        if (Vue.previousRequest !== undefined &&
          Vue.previousRequest['without-exculpatory'] !== undefined) {
          Vue.previousRequest['without-exculpatory'].abort()
        }
        // set previous request on Vue instance
        if (Vue.previousRequest === undefined) Vue.previousRequest = {}
        Vue.previousRequest['without-exculpatory'] = request
      }
    })
      .then(fetched)
      .catch(handleError)
  },
  createAnnouncement ({dispatch}, announcement) {
    const posted = (response) => {
      endLoading(dispatch, 'widgets createAnnouncement')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'widgets createAnnouncement')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'widgets createAnnouncement')
    return Vue.http.post('announcement', {announcement})
      .then(posted)
      .catch(handleError)
  },
  fetchAnnouncements ({dispatch}) {
    const fetched = (response) => {
      endLoading(dispatch, 'widgets fetchAnnouncements')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'widgets fetchAnnouncements')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'widgets fetchAnnouncements')
    return Vue.http.get('announcement')
      .then(fetched)
      .catch(handleError)
  },
  deleteAnnouncement ({dispatch}, announcement) {
    const deleted = (response) => {
      endLoading(dispatch, 'widgets deleteAnnouncement')
      return response.body
    }

    const handleError = (error) => {
      endLoading(dispatch, 'widgets deleteAnnouncement')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'widgets deleteAnnouncement')
    return Vue.http.delete(`announcement/${announcement._id}`)
      .then(deleted)
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

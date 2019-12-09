import Vue from 'vue'

// initial state
const initialState = () => ({
  data: [],
  notRead: 0,
  page: 1,
  loading: false,
  lastOne: false
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
  updateCount (state, count) {
    state.notRead = count
  },
  addNotifications (state, notifications) {
    notifications.forEach((notification) => {
      state.data.push(notification)
    })
  },
  setPage (state, page) {
    state.page = page
  },
  loading (state, load) {
    state.loading = load
  },
  lastOne (state) {
    state.lastOne = true
  }
}

// actions
const actions = {
  fetch ({commit}) {
    commit('reset')
    commit('loading', true)
    return Vue.http.get('user/me/notifications')
      .then(
        (res) => {
          if (res.body.success) {
            if (res.body.notifications.length > 0) {
              commit('addNotifications', res.body.notifications)
            } else {
              commit('lastOne')
            }
            commit('loading', false)
            commit('updateCount', res.body.notifications_ns_count)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  markAsRead ({commit, state}, notifId) {
    return Vue.http.post('user/notification-seen', {notification_id: notifId})
  },
  loadMore ({commit, state}) {
    commit('setPage', state.page + 1)
    commit('loading', true)
    return Vue.http.get('user/me/notifications?page=' + state.page)
      .then(
        (res) => {
          if (res.body.success) {
            if (res.body.notifications.length > 0) {
              commit('addNotifications', res.body.notifications)
            } else {
              commit('lastOne')
            }
            commit('loading', false)
            commit('updateCount', res.body.notifications_ns_count)
          }
        },
        (err) => Promise.reject(err)
      )
  },
  clearAll ({commit}) {
    const clean = (res) => {
      commit('reset')
      return res
    }
    const fail = (err) => {
      return Promise.reject(err)
    }

    return Vue.http.post('user/clear-notifications')
      .then(clean)
      .catch(fail)
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

import Vue from 'vue'

// initial state
const initialState = () => ({})

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
  }
}

// actions
const actions = {
  fetch (context, {attribute}) {
    const success = (res) => {
      if (res.body.success) {
        return res.body
      } else {
        return Promise.reject(res.body.message)
      }
    }

    const error = (err) => {
      return Promise.reject(err)
    }

    return Vue.http.get(attribute)
      .then(success)
      .catch(error)
  },
  create (context, {attribute, payload}) {
    const success = (res) => {
      if (res.body.success) {
        return res.body
      } else {
        return Promise.reject(res.body.message)
      }
    }

    const error = (err) => {
      return Promise.reject(err)
    }

    return Vue.http.post(attribute, payload)
      .then(success)
      .catch(error)
  },
  update (context, {attribute, payload}) {
    const success = (res) => {
      if (res.body.success) {
        return res.body
      } else {
        return Promise.reject(res.body.message)
      }
    }

    const error = (err) => {
      return Promise.reject(err)
    }
    return Vue.http.put(`${attribute}/${payload.data._id}`, payload)
      .then(success)
      .catch(error)
  },
  remove (context, {attribute, payload}) {
    const success = (res) => {
      if (res.body.success) {
        return res.body
      } else {
        return Promise.reject(res.body.message)
      }
    }

    const error = (err) => {
      return Promise.reject(err)
    }

    return Vue.http.delete(`${attribute}/${payload._id}`)
      .then(success)
      .catch(error)
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

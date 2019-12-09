import localforage from 'localforage'
import Constants from '@/const'

// initial state
const initialState = () => ({
  /**
   * tasks represents the state and data from the sent requests
   **/
  tasks: [],
  /**
   * loadingStarted indicates that the task loading from IDB was started
   **/
  loadingStarted: false
})

const state = initialState()

/**
 * Saves a given task to IDB
 * @param task
 * @returns {Promise}
 */
const saveTaskInIDB = (task) => {
  return localforage.setItem(task.id, task)
    .catch((err) => {
      const error = { msg: 'Error while saving task to IDB', error: err }
      return Promise.reject(error)
    })
}

// getters
const getters = {
  getSortedTasks (state) {
    const sortedTasks = [...state.tasks].sort((a, b) => {
      if (a.queued_date < b.queued_date) {
        return 1
      }
      if (a.queued_date > b.queued_date) {
        return -1
      }
      return 0
    })

    return sortedTasks.splice(0, 5)
  },
  getPendingTasks (state) {
    return state.tasks.filter(task => task.state === 'PENDING').length
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

  startLoading (state) {
    state.loadingStarted = true
  },

  addTask (state, task) {
    state.tasks.push(task)
  },

  updateTask (state, task) {
    const taskIndex = state.tasks.findIndex(t => t.id === task.idempotencyKey)

    if (taskIndex !== -1) {
      state.tasks[taskIndex].state = task.state
    }
  },

  deleteTask (state, taskKey) {
    state.tasks.splice(taskKey, 1)
  }
}
// actions
const actions = {
  /**
   * Create a task in Vuex and IDB
   * @param commit
   * @param payload
   */
  addTask ({commit}, task) {
    task.queued_date = new Date()
    const taskObj = Object.assign({id: task.id}, task)
    commit('addTask', taskObj)
    saveTaskInIDB(task)
  },

  /**
   * Update a task from 'pending' to 'completed' or 'error' in Vuex
   * @param commit
   * @param payload
   *
   */
  updateTask ({commit}, task) {
    commit('updateTask', task)
  },

  /**
   * Load all the tasks from Indexed DB to Vuex
   * @param commit
   */
  loadTasks ({commit}) {
    // // If we already loaded the tasks, dont load it again
    if (state.loadingStarted) {
      return
    }
    commit('startLoading')
    localforage.iterate((value, key) => {
      const task = Object.assign({id: key}, value)
      commit('addTask', task)
    }).catch((err) => {
      return Promise.reject(err)
    })
  },

  /**
   * Deletes all the completed tasks from Vuex and IDB
   * @param commit
   */
  clearCompletedTasks ({commit}) {
    if (state.tasks.length === 0) {
      return
    }
    localforage.iterate((value, key) => {
      if (value.state === Constants.states.COMPLETED) {
        commit('deleteTask', key)
        localforage.removeItem(key)
      }
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

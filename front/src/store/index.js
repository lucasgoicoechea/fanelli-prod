import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import notifications from './modules/notifications'
import catalog from './modules/catalog'
import requests from './modules/requests'
import checklists from './modules/checklists'
import checklistsLTres from './modules/checklistsLTres'
import supervisionparts from './modules/supervisionparts'
import supervisionpartsLTres from './modules/supervisionpartsLTres'
import collaborators from './modules/collaborators'
import users from './modules/users'
import news from './modules/news'
import tasksQueue from './modules/tasksQueue'
import shifts from './modules/shifts'
import events from './modules/events'
import ui from './modules/ui'
import staffRequests from './modules/staffRequests'
import widgets from './modules/widgets'
import sanctions from './modules/sanctions'
import occurrences from './modules/occurrences'
import fabric from './modules/fabric'
import meetings from './modules/meetings'
import productivitys from './modules/productivitys'
import productivity from './modules/productivity'
import bugReport from './modules/bugReport'

Vue.use(Vuex)

/*
  each module must implement the reset action
  and contain the next props: initialState, getters, mutations and actions
 */
export const modules = {
  auth,
  notifications,
  catalog,
  requests,
  checklists,
  checklistsLTres,
  supervisionparts,
  supervisionpartsLTres,
  collaborators,
  users,
  tasksQueue,
  news,
  events,
  shifts,
  ui,
  staffRequests,
  widgets,
  sanctions,
  occurrences,
  fabric,
  meetings,
  productivity,
  productivitys,
  bugReport
}

const actions = {
  /**
   * reset all modules
   */
  reset ({commit}) {
    Object.keys(modules).forEach((k) => {
      if ('reset' in modules[k].mutations) commit(`${k}/reset`)
    })
  }
}

export default new Vuex.Store({
  strict: false,
  state: {},
  getters: {},
  mutations: {},
  actions,
  modules
})

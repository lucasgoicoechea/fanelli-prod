import Vue from 'vue'
import group from '@/utils/groups'
import { createActionHelpers } from 'vuex-loading'

const {startLoading, endLoading} = createActionHelpers({
  moduleName: 'loading'
})

function isEmpty (obj) {
  return Object.keys(obj).length === 0
}

// initial state
const initialState = () => ({
  collaborators: [],
  match: '',
  collaboratorSelected: {},
  listCollaboratorsSelected: [],
  showList: false,
  groupCollaborators: {},
  preselection: []
})

const state = initialState()

// getters
const getters = {
  hasSelected: state => !isEmpty(state.collaboratorSelected) || state.listCollaboratorsSelected.length !== 0,
  filter: state => {
    const match = state.match.toLowerCase()
    return state.collaborators.filter(e => {
      return e.name.toLowerCase().includes(match) || e.lastname.toLowerCase().includes(match) || e.legajo.includes(match)
    })
  },
  groupCollaboratorsFilter: state => {
    const match = state.match.toLowerCase()
    return Object.keys(state.groupCollaborators).reduce((acumulator, current) => {
      acumulator[current] = state.groupCollaborators[current].filter(e => {
        return e.name.toLowerCase().includes(match) || e.lastname.toLowerCase().includes(match) || e.legajo.includes(match)
      })
      return acumulator
    }, {})
  },
  groupCollaboratorsIsEmpty: state => {
    return isEmpty(state.groupCollaborators)
  },
  getSelectedIds: state => {
    return state.listCollaboratorsSelected.map(e => e._id)
  },
  filterById: state => list => {
    const filterList = []
    list.forEach(collaborator => {
      const pos = state.collaborators.findIndex(c => c._id === collaborator._id)
      if (pos === -1) {
        return
      }
      filterList.push(state.collaborators[pos])
    })
    return filterList
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
  update (state, payload) {
    state.collaborators = payload.collaborators
  },
  setMatch (state, match) {
    state.match = match
  },
  selectCollaborator (state, collaborator) {
    state.collaboratorSelected = collaborator
  },
  updateListCollaboratorsSelected (state, collaborator) {
    const posSelected = state.listCollaboratorsSelected.findIndex(c => c._id === collaborator._id)
    const pos = state.collaborators.findIndex(c => c._id === collaborator._id)
    Vue.set(state.collaborators[pos], 'selected', (posSelected === -1))
    if (posSelected === -1) {
      state.listCollaboratorsSelected.push(collaborator)
    } else {
      state.listCollaboratorsSelected.splice(posSelected, 1)
    }
  },
  initPreSelecction (state) {
    state.listCollaboratorsSelected.length = 0
    state.collaborators.forEach(collaborator => {
      Vue.set(collaborator, 'selected', false)
    })
  },
  preSelecction (state, list) {
    list.forEach(collaborator => {
      const pos = state.collaborators.findIndex(c => c._id === collaborator._id)
      if (pos === -1) {
        return
      }
      const current = state.collaborators[pos]
      Vue.set(state.collaborators[pos], 'selected', true)
      state.listCollaboratorsSelected.push(current)
    })
  },
  changeShowList (state) {
    state.showList = !state.showList
  },
  groupByArea (state) {
    state.collaborators = state.collaborators.map(c => {
      c.area = c.hasOwnProperty('area')
        ? c.area.value
        : 'no Asignado'
      return c
    })
    state.groupCollaborators = group(state.collaborators, 'area')
  },
  setCollaborator (state, id) {
    state.collaboratorSelected = state.collaborators.find(c => c._id === id)
  },
  clearListCollaborators (state) {
    Vue.set(state, 'listCollaboratorsSelected', [])
    state.collaborators.forEach((e) => {
      Vue.set(e, 'selected', false)
    })
  }
}

// actions
const actions = {
  fetch ({commit, dispatch}) {
    startLoading(dispatch, 'collaborators fetch')
    return Vue.http.get('user/all')
      .then(
        (res) => {
          if (res.body.success) {
            commit('update', {collaborators: res.body.collaborators})
            commit('groupByArea')
            endLoading(dispatch, 'collaborators fetch')
          }
        },
        () => {
          endLoading(dispatch, 'collaborators fetch')
        }
      )
  },
  fetchTeam ({commit, dispatch}) {
    startLoading(dispatch, 'collaborators fetch')
    return Vue.http.get('user')
      .then(
        (res) => {
          if (res.body.success) {
            commit('update', {collaborators: res.body.employees})
            commit('groupByArea')
            endLoading(dispatch, 'collaborators fetch')
          }
        },
        () => {
          endLoading(dispatch, 'collaborators fetch')
        }
      )
  },
  fetchTeamStrict ({commit, dispatch}) {
    startLoading(dispatch, 'collaborators fetch')
    return Vue.http.get('user/team/strict')
      .then(
        (res) => {
          if (res.body.success) {
            commit('update', {collaborators: res.body.collaborators})
            commit('groupByArea')
            endLoading(dispatch, 'collaborators fetch')
          }
        },
        () => {
          endLoading(dispatch, 'collaborators fetch')
        }
      )
  },
  preSelection ({commit}, list) {
    commit('initPreSelecction')
    commit('preSelecction', list)
  },
  setCollaborator ({commit, dispatch}, id) {
    dispatch('fetch')
      .then(() => commit('setCollaborator', id))
  },
  clear ({commit}) {
    commit('selectCollaborator', {})
    commit('clearListCollaborators')
  },
  fetchResponsible (context, {userId}) {
    const fetched = (response) => {
      return response.body
    }
    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get(`user/${userId}/responsible-of`)
      .then(fetched)
      .catch(handleError)
  },
  updateResponsible (context, {userId, list}) {
    const updated = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.put(`user/${userId}/responsible-of`, {collaborators: list})
      .then(updated)
      .catch(handleError)
  },
  getBosses (context, {userId}) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get(`user/${userId}/bosses`)
      .then(fetched)
      .catch(handleError)
  },
  getIndirectTeam (context, {userId}) {
    const fetched = (response) => {
      return response.body
    }

    const handleError = (error) => {
      return Promise.reject(error)
    }
    return Vue.http.get(`user/${userId}/indirect-team`)
      .then(fetched)
      .catch(handleError)
  },
  report ({dispatch}) {
    const success = (response) => {
      endLoading(dispatch, 'collaborators report')
      return new Blob([response.data], {type: response.headers.get['content-type']})
    }

    const handleError = (error) => {
      endLoading(dispatch, 'collaborators report')
      return Promise.reject(error)
    }

    startLoading(dispatch, 'collaborators report')
    return Vue.http.get('report/all',
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

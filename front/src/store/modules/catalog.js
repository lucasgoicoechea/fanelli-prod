import Vue from 'vue'
import group from '../../utils/groups'
import generateGuid from '../../utils/guidGenerator'
import Constants from '../../const'

const initialState = () => ({
  /**
   * catalog represent fetched data from backend
   */
  catalog: [],
  /**
   * catalogGrouped represent catalog element grouped by 'type'
   */
  catalogGrouped: [],
  /**
   * data represent catalogGrouped + logics to load information
   * of quantity, model and size selected at EPP Form
   */
  data: [],
  /**
   * toSubmit represent data with quantity > 0 and is formatted
   * under the backend endpoint especification.
   */
  toSubmit: {},
  edit: false,
  total: 0,
  elementEdit: {}
})

const state = initialState()

// getters
const getters = {
  availableCatalog: state => state.catalog.filter(c => c.available),

  getByType: (state) => (type) => {
    return state.data.find(catalog => catalog.type === type)
  },

  getWithQuantity: (state) => {
    return state.data.filter(catalog => catalog.quantity > 0)
  },

  elementHasOptionSize: (state, getters) => (type) => {
    return getters.getByType(type).modelSelected !== '' &&
      getters.getByType(type).modelSelected.sizes.length > 1
  },

  elementHasOptionColour: (state, getters) => (type) => {
    return getters.getByType(type).modelSelected !== '' &&
      getters.getByType(type).modelSelected.colours.length > 1
  },

  valid: (state, getters) => {
    return getters.getWithQuantity.every(e => e.modelSelected !== '') &&
      getters.getWithQuantity.every(e => {
        if (getters.elementHasOptionColour(e.type)) {
          return e.colourSelected !== ''
        }
        if (getters.elementHasOptionSize(e.type)) {
          return e.sizeSelected !== ''
        }
        return true
      })
  },

  isCatalogEmpty: (state) => {
    return state.total === 0
  },

  filterByCategory: (state) => (cat) => {
    return state.data.filter(e => {
      return e.category === cat
    })
  },

  haveElementEdit: (state) => {
    return Object.keys(state.elementEdit).length > 0
  },

  getBrandsElement: (state, getters) => (type) => {
    return getters.getByType(type).models.map(e => {
      const copy = Object.assign({}, e)
      return copy.brand
    })
  }
}

// mutations
const mutations = {

  update (state, payload) {
    state.catalog = payload
  },

  reset (state) {
    const init = initialState()
    Object.keys(init).forEach(key => {
      state[key] = init[key]
    })
  },

  addProperties (state) {
    state.data.length = 0
    state.catalogGrouped = group(state.catalog, 'type')
    // Object.keys(state.catalogGrouped).forEach(function (key, index) { } )
    Object.keys(state.catalogGrouped).forEach(function (key) {
      const obj = {
        type: key,
        category: state.catalogGrouped[key][0].category,
        quantity: 0,
        models: state.catalogGrouped[key],
        modelSelected: '',
        sizeSelected: '',
        colourSelected: ''
      }
      state.data.push(obj)
    })
  },

  incrementQuantity (state, payload) {
    const index = state.data.findIndex(catalog => catalog.type === payload.type)
    state.data[index].quantity++
    state.total++
  },

  decrementQuantity (state, payload) {
    const index = state.data.findIndex(catalog => catalog.type === payload.type)
    if (state.data[index].quantity !== 0) {
      state.data[index].quantity--
      state.total--
    }
  },

  selectModel (state, payload) {
    const index = state.data.findIndex(catalog => catalog.type === payload.type)
    state.data[index].modelSelected = payload.modelSelected
  },

  selectOption (state, payload) {
    const index = state.data.findIndex(catalog => catalog.type === payload.type)
    state.data[index].sizeSelected = payload.size
    state.data[index].colourSelected = payload.colour
  },

  updateDataSubmit (state, payload) {
    state.toSubmit.items = payload.items.map(item => {
      item.modelSelected.size = item.sizeSelected
      item.modelSelected.colour = item.colourSelected
      item.modelSelected.cant = item.quantity
      /* copy item.modelSelected */
      const submit = Object.assign({}, item.modelSelected)
      delete submit.sizes
      delete submit.colours
      return submit
    })
    state.toSubmit.collaborator = payload.collaborator
    state.toSubmit.request_date = new Date()
  },

  editable (state, payload) {
    state.edit = true
    state.toSubmit._id = payload.request._id
  },

  editElement (state, payload) {
    state.elementEdit = payload.element
  },

  removeElement (state, payload) {
    const groupType = state.data.find(e => e.type === state.elementEdit.type)
    const index = groupType.models.findIndex(e => e._id === payload._id)
    groupType.models.splice(index, 1)
  },

  addElement (state, payload) {
    const groupType = state.data.find(e => e.type === state.elementEdit.type)
    groupType.models.push(payload)
  },

  fillWithRequest (state, payload) {
    state.edit = true
    state.toSubmit._id = payload._id
    payload.items.forEach(p => {
      const type = state.data.find(e => e.type === p.type)
      type.quantity = p.cant
      state.total += p.cant
      type.modelSelected = state.catalog.find(catalog => catalog._id === p._id)
      if (p.hasOwnProperty('colour')) {
        type.colourSelected = p.colour
      }
      if (p.hasOwnProperty('size')) {
        type.sizeSelected = p.size
      }
    })
  }
}

// actions
const actions = {
  fetch ({commit}) {
    return Vue.http.get('catalog/available')
      .then(
        (res) => {
          if (res.body.success) {
            commit('reset')
            commit('update', res.body.catalog)
            commit('addProperties')
          }
        },
        (err) => Promise.reject(err)
      )
  },
  EPPEdition ({state, commit, dispatch}, payload) {
    return Vue.http.get('security-element/request/' + payload._id)
      .then(
        (res) => {
          if (res.body.success) {
            const isEditable = res.body.request.isEditable
            if (isEditable) {
              const collaborator = res.body.request.collaborator._id
              dispatch('collaborators/setCollaborator', collaborator, {root: true})
              commit('fillWithRequest', res.body.request)
            } else {
              return Promise.reject()
            }
          }
        },
        (err) => Promise.reject(err)
      )
  },

  submit ({dispatch, state, commit}) {
    const task = {}
    const data = state.toSubmit
    const guid = generateGuid()
    task.id = guid
    task.data = data
    task.type = Constants.request_types.EPP

    if (state.edit) {
      Vue.http.post('security-element/' + state.toSubmit._id, {request: state.toSubmit}, {headers: {'Idempotency-Key': guid}})
        .then(
          function (res) {
            if (res.body.success) {
              commit('editable', {request: res.body.request})
              task.state = Constants.states.COMPLETED
            } else {
              task.state = Constants.states.ERROR
            }
          },
          function () {
            task.state = Constants.states.PENDING
            dispatch('tasksQueue/addTask', task, {root: true})
          }
        )
    } else {
      Vue.http.post('security-element', {request: state.toSubmit}, {headers: {'Idempotency-Key': guid}})
        .then(
          function (res) {
            if (res.body.success) {
              commit('editable', {request: res.body.request})
              task.state = Constants.states.COMPLETED
            } else {
              task.state = Constants.states.ERROR
            }
            dispatch('tasksQueue/addTask', task, {root: true})
          },
          function () {
            task.state = Constants.states.PENDING
            dispatch('tasksQueue/addTask', task, {root: true})
          }
        )
    }
  },

  addElement ({state, commit}, payload) {
    const item = {}
    item.model = payload.model
    item.brand = payload.brand
    item.certified = payload.certified
    item.type = state.elementEdit.type
    item.category = state.elementEdit.category
    item.description = 'Description'
    return new Promise((resolve, reject) => {
      Vue.http.post('catalog/', {item})
        .then(
          function (res) {
            if (res.body.success) {
              commit('addElement', res.body.item)
              resolve()
            } else {
              reject()
            }
          },
          function () {
            reject()
          }
        )
    })
  },

  deleteElement ({commit}, payload) {
    return Vue.http.delete('catalog/' + payload._id)
      .then(
        function (res) {
          if (res.body.success) {
            commit('removeElement', payload)
          }
        },
        function (err) {
          return Promise.reject(err)
        }
      )
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

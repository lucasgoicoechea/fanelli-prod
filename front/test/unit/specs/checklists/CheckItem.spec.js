import Vue from 'vue'
import Vuex from 'vuex'
import CheckItem from '@/components/checklists/CheckItem'
import store from '@/store'

Vue.use(Vuex)

function getViewModel (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ propsData, store }).$mount()
  return vm
}

describe('CheckItem Component', () => {
  describe('JS Component logic', () => {
    let item

    before(() => {
      item = {
        check: {
          sector: 'APILADORA'
        }
      }
    })

    it('has a created hook', () => {
      expect(typeof CheckItem.created).to.be.function
    })
    it('*data* must be a Function', () => {
      expect(typeof CheckItem.data).to.be.function
    })
    it('*data* return a fresh data object', () => {
      const aVM = getViewModel(CheckItem, {item})
      const otherVM = getViewModel(CheckItem, {item})
      expect(aVM.$data).to.be.an('object')
      expect(otherVM.$data).to.be.an('object')
      expect(aVM.$data === otherVM.$data).to.be.false
    })
    it('correctly sets the data attribute "loadObservation" when created', () => {
      const vm = getViewModel(CheckItem, {item})
      expect(vm.loadObservation).to.be.false
    })
    it('correctly sets the data attribute "comment" when created', () => {
      const vm = getViewModel(CheckItem, {item})
      expect(vm.comment).to.equals('')
    })
    it('correctly type object validation prop :item', () => {
      const vm = getViewModel(CheckItem, {item})
      expect(vm.$options.props.item.type).to.equals(Object)
    })
    it('correctly validation required prop :item', () => {
      const vm = getViewModel(CheckItem, {item})
      expect(vm.$options.props.item.required).to.be.true
    })
    it('correctly sets prop :item when created', () => {
      const vm = getViewModel(CheckItem, {item})
      expect(vm.item).to.be.an('object')
      expect(vm.item).to.equals(item)
    })
  })
})

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Acl from 'vue-acl'
import VueRouter from 'vue-router'
import constant from '@/const'
import WidgetAnnouncements from '@/components/widgets/announcements/WidgetAnnouncements'

describe('WidgetAnnouncements component', () => {
  let wrapper

  const widgetsModuleMock = {
    namespaced: true,
    actions: {
      fetchAnnouncements: () => {
        return Promise.resolve({announcements: [{_id: 1}]})
      }
    }
  }

  const modules = {widgets: widgetsModuleMock}

  const store = new Vuex.Store({
    state: {},
    modules,
    strict: false
  })

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Acl, {router: new VueRouter(), init: 'any'})
    const $constants = constant
    const $snotifyWrapper = {
      warning: () => ({}),
      error: () => ({}),
      success: () => ({})
    }
    const $modal = {
      show: () => ({}),
      hide: () => ({})
    }
    wrapper = shallowMount(WidgetAnnouncements, {
      localVue,
      store,
      mocks: {
        $constants,
        $modal,
        $snotifyWrapper
      }
    })
  })

  it('should validate data to WidgetAnnouncements', () => {
    const defaultData = WidgetAnnouncements.data()
    expect(defaultData.announcements).to.be.an('array')
    expect(defaultData.currentIndex).to.be.a('number')
  })

  it('should assign correctly announcements when call fetch methods', (done) => {
    wrapper.vm.fetch()
      .then(() => {
        expect(wrapper.vm.announcements).to.have.length(1)
        done()
      })
      .catch(err => done(err))
  })

  it('should push a announcement when call post method', () => {
    wrapper.vm.openModal()
    expect(wrapper.vm.announcements).to.have.length(0)
    wrapper.vm.post({_id: 1})
    expect(wrapper.vm.announcements).to.have.length(1)
  })

  it('should update currentIndex when call next and prev method', () => {
    wrapper.vm.post({_id: 1})
    wrapper.vm.post({_id: 2})
    wrapper.vm.post({_id: 3})
    expect(wrapper.vm.currentIndex).to.be.eql(2)
    wrapper.vm.prev()
    expect(wrapper.vm.currentIndex).to.be.eql(1)
    wrapper.vm.prev()
    expect(wrapper.vm.currentIndex).to.be.eql(0)
    wrapper.vm.prev()
    expect(wrapper.vm.currentIndex).to.be.eql(2)
    wrapper.vm.currentIndex = 0
    expect(wrapper.vm.currentIndex).to.be.eql(0)
    wrapper.vm.next()
    expect(wrapper.vm.currentIndex).to.be.eql(1)
    wrapper.vm.next()
    expect(wrapper.vm.currentIndex).to.be.eql(2)
    wrapper.vm.next()
    expect(wrapper.vm.currentIndex).to.be.eql(0)
  })

  it('test computed props', () => {
    expect(wrapper.vm.empty).to.be.true
    expect(wrapper.vm.showPointer).to.be.false
    wrapper.vm.post({_id: 1})
    expect(wrapper.vm.empty).to.be.false
    expect(wrapper.vm.showPointer).to.be.false
    wrapper.vm.post({_id: 2})
    expect(wrapper.vm.showPointer).to.be.true
  })
})


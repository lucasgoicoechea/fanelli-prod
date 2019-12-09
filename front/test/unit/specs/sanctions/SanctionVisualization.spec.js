import { createLocalVue, shallowMount } from '@vue/test-utils'
import SanctionVisualization from '@/components/sanctions/SanctionVisualization'
import constant from '@/const'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

describe('SanctionVisualization component', () => {
  let wrapper

  const aSanctionAction = {
    sanction: { _id: 1001 }
  }

  const sanctionsModuleMock = {
    namespaced: true,
    actions: {
      getDetail: () => {
        return Promise.resolve(aSanctionAction)
      },
      printSanction: () => {
        return Promise.resolve({})
      }
    }
  }

  const mockSanction = {
    sanction: {
      _id: 1,
      collaborators: [
        {name: 'lucas', lastname: 'Backend', legajo: '16'},
        {name: 'tomi', lastname: 'Test', legajo: '17'}
      ],
      created_at: '2018-09-04T17:16:00.667Z',
      creator: {name: 'GUI', lastname: 'UI/UX', legajo: '20'},
      dateRange: {from: '2018-09-04T17:16:00.667Z', to: '2018-09-04T17:16:00.667Z'},
      reason: 'Se notifica a Ud. que se ha resuelto aplicarle un apercibimiento disciplinario en razón de haber:asdasdasdDe repetirse estos hechos, se aplicarán medidas más rigurosas que faculta la ley.',
      type: 'WARNING',
      updated_at: '2018-09-04T17:16:00.667Z'
    }
  }

  const modules = {sanctions: sanctionsModuleMock}

  const store = new Vuex.Store({
    state: {},
    modules,
    strict: false
  })

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = new VueRouter()
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
    wrapper = shallowMount(SanctionVisualization, {
      localVue,
      router,
      store,
      mocks: {
        $constants,
        $modal,
        $snotifyWrapper
      }
    })

    wrapper.setData(mockSanction)
  })

  it('should have data functions', () => {
    expect(typeof SanctionVisualization.data).to.be.function
  })

  it('should validate data \'title\'', () => {
    expect(wrapper.vm.title).to.be.a('string')
    expect(wrapper.vm.title).to.equals('Disciplina')
  })

  it('should validate data \'sanction\'', () => {
    const defaultData = SanctionVisualization.data()
    expect(defaultData.sanction).to.be.an('object')
    expect(defaultData.loaderPrint).to.be.a('boolean')
    expect(defaultData.loaderPrint).to.be.false
  })

  it('should assign correctly sanction when action is resolved', (done) => {
    wrapper.vm.getDetails()
      .then(() => {
        expect(wrapper.vm.sanction._id).to.be.equals(aSanctionAction.sanction._id)
        done()
      })
      .catch(err => done(err))
  })

  it('should assign correctly data when print action finished', (done) => {
    wrapper.vm.askPrint()
    wrapper.vm.print()
      .then(() => {
        expect(wrapper.vm.loaderPrint).to.be.false
        done()
      })
      .catch(err => done(err))
  })
})

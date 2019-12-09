import { createLocalVue, shallowMount } from '@vue/test-utils'
import OccurrenceVisualization from '@/components/occurrences/OccurrenceVisualization'
import constant from '@/const'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

describe('OccurrenceVisualization component', () => {
  let wrapper

  const anOccurrenceResponse = {
    occurrence: {_id: 1001}
  }

  const occurrencesModuleMock = {
    namespaced: true,
    actions: {
      getDetail: () => {
        return Promise.resolve(anOccurrenceResponse)
      },
      resolve: ({dispatch}, payload) => {
        console.log(payload)
        return (payload.approved)
          ? Promise.resolve({
            occurrence: {
              _id: 1001,
              state: constant.OCCURRENCE_STATE.APPROVED
            }
          })
          : Promise.resolve({
            occurrence: {
              _id: 1001,
              state: constant.OCCURRENCE_STATE.REJECTED
            }
          })
      }
    }
  }

  const mockOccurrence = {
    occurrence: {
      _id: 1,
      collaborators: [
        {name: 'lucas', lastname: 'Backend', legajo: '16'},
        {name: 'tomi', lastname: 'Test', legajo: '17'}
      ],
      created_at: '2018-09-04T17:16:00.667Z',
      creator: {name: 'GUI', lastname: 'UI/UX', legajo: '20'},
      observation: 'Se notifica a Ud. que se ha resuelto aplicarle un apercibimiento disciplinario en razón de haber:asdasdasdDe repetirse estos hechos, se aplicarán medidas más rigurosas que faculta la ley.',
      actionPlan: 'Plan de acción',
      state: 'APPROVED',
      resolvedBy: {name: 'Lucas', lastname: 'Backend'},
      updated_at: '2018-09-04T17:16:00.667Z'
    }
  }

  const modules = {occurrences: occurrencesModuleMock}

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
    const $can = () => ({})
    wrapper = shallowMount(OccurrenceVisualization, {
      localVue,
      router,
      store,
      mocks: {
        $constants,
        $modal,
        $snotifyWrapper,
        $can
      }
    })

    wrapper.setData(mockOccurrence)
  })

  it('should have data functions', () => {
    expect(typeof OccurrenceVisualization.data).to.be.function
  })

  it('should validate data \'title\'', () => {
    expect(wrapper.vm.title).to.be.a('string')
    expect(wrapper.vm.title).to.equals('Acontecimiento detalle')
  })

  it('should validate data \'occurrence\'', () => {
    const defaultData = OccurrenceVisualization.data()
    expect(defaultData.occurrence).to.be.an('object')
    expect(defaultData.loaderPrint).to.be.a('boolean')
    expect(defaultData.loaderPrint).to.be.false
    expect(defaultData.loaderAccept).to.be.a('boolean')
    expect(defaultData.loaderAccept).to.be.false
    expect(defaultData.loaderReject).to.be.a('boolean')
    expect(defaultData.loaderReject).to.be.false
    expect(defaultData.stateColor).to.be.an('object')
  })

  it('should assign correctly sanction when action is resolved', (done) => {
    wrapper.vm.getDetails()
      .then(() => {
        expect(wrapper.vm.occurrence._id).to.be.equals(anOccurrenceResponse.occurrence._id)
        done()
      })
      .catch(err => done(err))
  })

  it('should computed props return a titleOccurrence string', () => {
    expect(wrapper.vm.titleOccurrence).to.be.eql('Acontecimiento')
  })

  it('should computed props return a iconOccurrence string', () => {
    expect(wrapper.vm.iconOccurrence).to.be.eql('/static/img/icon-occurrence/acontecimiento.svg')
  })

  it('should computed props return a occurrenceState string', () => {
    expect(wrapper.vm.occurrenceState).to.be.eql(constant.OCCURRENCE_STATE_READABLE.APPROVED)
  })

  it('should computed props return a resolvedBy string', () => {
    expect(wrapper.vm.resolvedBy).to.be.eql('Backend Lucas')
  })

  it('The isPendingResolution computed props should return false', () => {
    expect(wrapper.vm.isPendingResolution).to.be.false
  })

  it('The isCancelled computed props should return false', () => {
    expect(wrapper.vm.isCancelled).to.be.false
  })

  it('The stateStyle computed props should return an Object', () => {
    expect(wrapper.vm.stateStyle).to.be.an('Object')
    expect(wrapper.vm.stateStyle.color).to.be.a('string')
  })

  /*
  it('The createdAt computed props should return a string', () => {
    console.log(wrapper.vm.createdAt)
    expect(wrapper.vm.createdAt).to.be.eql('04-09-2018 2:16 PM')
  })
  */

  it('The recommendations computed props should return a string', () => {
    expect(wrapper.vm.recommendations).to.be.null
  })

  it('The acceptButton method should change occurrence\'s test', (done) => {
    wrapper.vm.accept()
      .then(() => {
        expect(wrapper.vm.occurrence.state).to.be.equals(constant.OCCURRENCE_STATE.APPROVED)
        expect(wrapper.vm.loaderAccept).to.be.false
        done()
      })
      .catch(err => done(err))
  })

  it('The rejectButton method should change occurrence\'s test', (done) => {
    wrapper.vm.reject()
      .then(() => {
        expect(wrapper.vm.occurrence.state).to.be.equals(constant.OCCURRENCE_STATE.REJECTED)
        expect(wrapper.vm.loaderReject).to.be.false
        done()
      })
      .catch(err => done(err))
  })
})

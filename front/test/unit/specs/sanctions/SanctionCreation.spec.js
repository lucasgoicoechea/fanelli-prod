import { createLocalVue, shallowMount } from '@vue/test-utils'
import SanctionCreation from '@/components/sanctions/SanctionCreation'
import capitalize from '@/filters/capitalize'
import constant from '@/const'
import store from '@/store'

describe('ReportNewsSanction component', () => {
  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue()
    const flatPickr = {
      name: 'flat-Pickr',
      render: h => h('<div></div>')
    }
    localVue.component('flatPickr', flatPickr)
    localVue.filter('capitalize', capitalize)
    const $constants = constant
    const $loading = {isLoading: () => false}
    const $snotifyWrapper = {
      warning: () => ({}),
      error: () => ({}),
      success: () => ({})
    }
    const $modal = {
      show: () => ({}),
      hide: () => ({})
    }
    wrapper = shallowMount(SanctionCreation, {
      localVue,
      store,
      mocks: {
        $constants,
        $loading,
        $modal,
        $snotifyWrapper
      }
    })

    wrapper.setData({
      pickerStart: {selectedDates: [1]},
      pickerEnd: {selectedDates: [1]}
    })
  })

  it('should have data functions', () => {
    expect(typeof SanctionCreation.data).to.be.function
  })

  it('should validate data \'title\'', () => {
    expect(typeof SanctionCreation.data).to.be.function
    const defaultData = SanctionCreation.data()
    expect(defaultData.title).to.be.a('string')
    expect(defaultData.title).to.equals('Sanciones')
  })
  it('should validate data \'sanction\'', () => {
    const defaultData = SanctionCreation.data()
    expect(defaultData.sanction).to.be.an('object')
    expect(defaultData.validation).to.be.an('object')
    expect(defaultData.sanctionResult).to.be.null
    expect(defaultData.loaderPrint).to.be.false
  })

  it('test successfulCreation method', () => {
    const sanctionMock = {_id: 1}
    const resFAIL = {success: false, message: 'string'}
    const resOK = {success: true, sanction: sanctionMock, message: 'string'}
    wrapper.vm.successfulCreation(resFAIL)
    expect((wrapper.vm.sanctionResult === null)).to.be.true
    wrapper.vm.successfulCreation(resOK)
    expect((wrapper.vm.sanctionResult !== null)).to.be.true
  })
})


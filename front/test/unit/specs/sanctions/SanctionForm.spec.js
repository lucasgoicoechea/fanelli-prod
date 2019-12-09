import { createLocalVue, shallowMount } from '@vue/test-utils'
import SanctionForm from '@/components/sanctions/SanctionForm'
import capitalize from '@/filters/capitalize'
import constant from '@/const'
import store from '@/store'

describe('SanctionForm component', () => {
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
    wrapper = shallowMount(SanctionForm, {
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
      pickerEnd: {selectedDates: [1]},
      pickerIncorporation: {selectedDates: [1]}
    })
  })

  it('should have data functions', () => {
    expect(typeof SanctionForm.data).to.be.function
  })

  it('should validate data \'sanction\'', () => {
    expect(wrapper.vm.sanction).to.be.an('object')
  })

  it('should validate correctly when missing parameters', () => {
    expect(wrapper.vm.validate().valid).to.be.false

    wrapper.setComputed({hasSelected: true})
    expect(wrapper.vm.validate().valid).to.be.false

    wrapper.setData({
      sanction: {
        type: constant.SANCTION_TYPE.SUSPENSION
      }
    })
    expect(wrapper.vm.validate().valid).to.be.false

    wrapper.setData({
      sanction: {
        dateRange: {
          from: new Date(),
          to: new Date()
        }
      }
    })

    wrapper.setData({
      pickerStart: {selectedDates: [1]},
      pickerEnd: {selectedDates: [1]}
    })

    expect(wrapper.vm.validate().valid).to.be.false

    wrapper.setData({
      sanction: {
        incoporationDate: new Date()
      }
    })

    wrapper.setData({
      confPickerIncorporation: {selectedDates: [1]}
    })

    expect(wrapper.vm.validate().valid).to.be.false

    wrapper.setData({
      sanction: {
        writtenReason: 'an reason'
      }
    })
    expect(wrapper.vm.validate().valid).to.be.true
  })

  it('test isSuspension', () => {
    wrapper.setData({
      sanction: {
        type: constant.SANCTION_TYPE.WARNING
      }
    })
    expect(wrapper.vm.isSuspension).to.be.false

    wrapper.setData({
      sanction: {
        type: constant.SANCTION_TYPE.SUSPENSION
      }
    })
    expect(wrapper.vm.isSuspension).to.be.true
  })

  it('test toLimit method', () => {
    wrapper.vm.toLimit([])
    expect(wrapper.vm.confPickerEnd.minDate).to.be.eql('')

    const aDate = new Date()
    wrapper.vm.toLimit([aDate])
    expect(wrapper.vm.confPickerEnd.minDate).to.be.a('Date')
  })

  it('test limitIncorporationDate method', () => {
    wrapper.vm.limitIncorporationDate([])
    expect(wrapper.vm.confPickerIncorporation.minDate).to.be.eql('')

    const aDate = new Date()
    wrapper.vm.limitIncorporationDate([aDate])
    expect(wrapper.vm.confPickerIncorporation.minDate).to.be.a('Date')
  })

  it('should hasSelectedRange be false when pickers not elements in array', () => {
    wrapper.setData({
      pickerStart: {selectedDates: []},
      pickerEnd: {selectedDates: []}
    })
    expect(wrapper.vm.pickerStart).to.be.a('Object')
    expect(wrapper.vm.pickerEnd).to.be.a('Object')
    expect(wrapper.vm.hasSelectedRange()).to.be.false
  })

  it('should hasSelectedRange be true when pickers has element', () => {
    wrapper.setData({
      pickerStart: {selectedDates: [1]},
      pickerEnd: {selectedDates: [1]}
    })

    expect(wrapper.vm.pickerStart).to.be.a('Object')
    expect(wrapper.vm.pickerEnd).to.be.a('Object')
    expect(wrapper.vm.hasSelectedRange()).to.be.true
  })

  it('test setDateRange method', () => {
    expect(wrapper.vm.sanction.dateRange.from).to.be.eql('')
    expect(wrapper.vm.sanction.dateRange.to).to.be.eql('')

    wrapper.setData({
      pickerStart: {latestSelectedDateObj: new Date()},
      pickerEnd: {latestSelectedDateObj: new Date()}
    })

    wrapper.vm.setDateRange()

    expect(new Date(wrapper.vm.sanction.dateRange.from)).to.be.a('Date')
    expect(new Date(wrapper.vm.sanction.dateRange.to)).to.be.a('Date')
  })

  it('test fullReason method', () => {
    let originalLengthReason = 0
    let fullLengthReason = 0
    wrapper.setData({
      sanction: {
        writtenReason: 'a reason',
        type: constant.SANCTION_TYPE.SUSPENSION
      }
    })

    originalLengthReason = wrapper.vm.sanction.writtenReason.length
    wrapper.vm.fullReason()
    fullLengthReason = wrapper.vm.sanction.reason.length

    expect((originalLengthReason < fullLengthReason)).to.be.true

    wrapper.setData({
      sanction: {
        writtenReason: 'a reason.',
        type: constant.SANCTION_TYPE.WARNING
      }
    })

    originalLengthReason = wrapper.vm.sanction.writtenReason.length
    wrapper.vm.fullReason()
    fullLengthReason = wrapper.vm.sanction.reason.length

    expect((originalLengthReason < fullLengthReason)).to.be.true
  })
})


import { shallowMount } from '@vue/test-utils'
import WidgetAvailability from '@/components/widgets/availability/WidgetAvailability'

describe('WidgetAvailability component', () => {
  it("should validate prop 'mode' correctly", () => {
    const wrapper = shallowMount(WidgetAvailability)
    const modeProp = wrapper.vm.$options.props.mode

    expect(modeProp.type).to.equal(String)
    expect(modeProp.required).to.be.false
    expect(modeProp.validator && modeProp.validator('aMode')).to.be.false
    expect(modeProp.validator && modeProp.validator('today')).to.be.true
    expect(modeProp.validator && modeProp.validator('week')).to.be.true
  })
  it("should default prop's mode set in 'today'", () => {
    const wrapper = shallowMount(WidgetAvailability)
    expect(wrapper.props().mode).to.be.equals('today')
    expect(wrapper.vm.$options.props.mode.default).to.be.equals('today')
  })
  it("should default currentMode set in 'today'", () => {
    const wrapper = shallowMount(WidgetAvailability)
    expect(wrapper.vm.currentMode).to.be.equals('today')
  })
  it('should update currentMode when select change', () => {
    const wrapper = shallowMount(WidgetAvailability)
    expect(wrapper.props().mode).to.be.equals('today')

    const options = wrapper.findAll('option')

    options.at(1).setSelected()
    expect(wrapper.vm.currentMode).to.be.equals('week')

    options.at(0).setSelected()
    expect(wrapper.vm.currentMode).to.be.equals('today')
  })
  it('should update view when call forceUpdate', () => {
    const wrapper = shallowMount(WidgetAvailability)
    expect(wrapper.vm.forceUpdateView).to.be.equals(0)
    wrapper.vm.forceUpdate()
    expect(wrapper.vm.forceUpdateView).to.be.equals(1)
  })
})


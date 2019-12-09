import DaySelector from '@/components/selectors/days/DaySelector'
import { shallowMount } from '@vue/test-utils'

describe('DaySelector component', () => {
  it(`should have created function`, () => {
    expect(typeof DaySelector.created).to.be.function
  })
  it('should have the correct default conf data to use datepicker', () => {
    expect(typeof DaySelector.data).to.be.function
    const defaultData = DaySelector.data()
    expect(defaultData.conf).to.be.object
  })
  it('should set correct minDate prop', () => {
    const wrapper = shallowMount(DaySelector, {
      propsData: {
        minDate: new Date()
      }
    })
    expect(wrapper.props().minDate).to.be.instanceOf(Date)
  })
  it('should set date constraint', () => {
    const date = new Date()
    const wrapper = shallowMount(DaySelector, {
      propsData: {
        minDate: date
      }
    })
    expect(wrapper.vm.conf.minDate).to.be.equals(date)
  })
})

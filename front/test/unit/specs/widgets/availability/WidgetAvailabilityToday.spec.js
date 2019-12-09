import { shallowMount } from '@vue/test-utils'
import WidgetAvailabilityToday from '@/components/widgets/availability/WidgetAvailabilityToday'

describe('WidgetAvailabilityToday component', () => {
  it('should have a dateRange into data function', () => {
    expect(typeof WidgetAvailabilityToday.data).to.be.function
    const defaultData = WidgetAvailabilityToday.data()
    expect(defaultData.dateRange).to.be.object
    expect(defaultData.dateRange.from).to.be.a('Date')
    expect(defaultData.dateRange.to).to.be.a('Date')
  })
  it('should set next range of date when use nextDay', () => {
    const wrapper = shallowMount(WidgetAvailabilityToday)

    const initRange = {
      from: new Date(wrapper.vm.dateRange.from),
      to: new Date(wrapper.vm.dateRange.to)
    }

    wrapper.vm.nextDay()

    expect(initRange.from < wrapper.vm.dateRange.from).to.be.true
    expect(initRange.to < wrapper.vm.dateRange.to).to.be.true
  })
  it('should set prev range of date when use nextDay', () => {
    const wrapper = shallowMount(WidgetAvailabilityToday)

    const initRange = {
      from: new Date(wrapper.vm.dateRange.from),
      to: new Date(wrapper.vm.dateRange.to)
    }

    wrapper.vm.prevDay()

    expect(initRange.from > wrapper.vm.dateRange.from).to.be.true
    expect(initRange.to > wrapper.vm.dateRange.to).to.be.true
  })
  it('should call nextDay method when click at tab element', () => {
    const wrapper = shallowMount(WidgetAvailabilityToday)

    const initRange = {
      from: new Date(wrapper.vm.dateRange.from),
      to: new Date(wrapper.vm.dateRange.to)
    }

    wrapper.find('.tab.next').trigger('click')

    expect(initRange.from < wrapper.vm.dateRange.from).to.be.true
    expect(initRange.to < wrapper.vm.dateRange.to).to.be.true
  })
  it('should call prevDay method when click at tab element', () => {
    const wrapper = shallowMount(WidgetAvailabilityToday)

    const initRange = {
      from: new Date(wrapper.vm.dateRange.from),
      to: new Date(wrapper.vm.dateRange.to)
    }

    wrapper.find('.tab.prev').trigger('click')

    expect(initRange.from > wrapper.vm.dateRange.from).to.be.true
    expect(initRange.to > wrapper.vm.dateRange.to).to.be.true
  })
})


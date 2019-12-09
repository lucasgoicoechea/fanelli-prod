import { shallowMount } from '@vue/test-utils'
import CardSanction from '@/components/cards/CardSanction'
import constant from '@/const'
import dateAndTime from '@/utils/dateAndTime'

describe('CardSanction component', () => {
  let wrapper
  const $constants = constant
  const propMocks = {
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

  beforeEach(() => {
    wrapper = shallowMount(CardSanction, {
      propsData: propMocks,
      mocks: {
        $constants
      }
    })
  })

  it('should have data functions', () => {
    expect(typeof CardSanction.data).to.be.function
  })

  it('should validate data model', () => {
    expect(wrapper.vm.TYPE_COLOR).to.be.an('object')
    expect(wrapper.vm.redirect).to.be.an('object')
  })

  it('should have prop\'s sanction', () => {
    expect(wrapper.vm.sanction).to.eql(propMocks.sanction)

    const sanctionProp = wrapper.vm.$options.props.sanction
    expect(sanctionProp.type).to.equal(Object)
    expect(sanctionProp.required).to.be.true
  })

  it('should return correct computed props', () => {
    expect(wrapper.vm.sanction).to.eql(propMocks.sanction)

    const sanctionProp = wrapper.vm.$options.props.sanction
    expect(sanctionProp.type).to.equal(Object)
    expect(sanctionProp.required).to.be.true
  })

  it('should return correct summarySuspension computed props', () => {
    const from = dateAndTime.dateDayAndMonth(wrapper.vm.sanction.dateRange.from)
    const to = dateAndTime.dateDayAndMonth(wrapper.vm.sanction.dateRange.to)
    expect(wrapper.vm.summarySuspension.includes(from)).to.be.true
    expect(wrapper.vm.summarySuspension.includes(to)).to.be.true
  })

  it('should return correct getTitleBackgroundColor computed props', () => {
    const typeSanction = wrapper.vm.sanction.type
    const color = wrapper.vm.TYPE_COLOR[typeSanction]
    expect(wrapper.vm.getTitleBackgroundColor).to.be.eql(color)
  })

  it('should return correct sanction type readable', () => {
    const typeSanction = wrapper.vm.sanction.type
    const readable = constant.SANCTION_TYPE_READABLE[typeSanction]
    expect(wrapper.vm.sanctionType).to.be.eql(readable)
  })
  /*
  it('should return correct created date readable', () => {
    const readable = '04-09-2018 2:16 PM'
    expect(wrapper.vm.createdDate).to.be.eql(readable)
  })
  */

  it('should return correct creator name', () => {
    const name = 'UI/UX GUI'
    expect(wrapper.vm.creatorName).to.be.eql(name)
  })

  it('should return correct list name of collaborators', () => {
    const names = 'Backend, Test'
    expect(wrapper.vm.applyCollaborators).to.be.eql(names)
  })

  it('test isSuspension', () => {
    wrapper.setProps({
      sanction: {
        type: constant.SANCTION_TYPE.SUSPENSION
      }
    })
    expect(wrapper.vm.isSuspension).to.be.true

    wrapper.setProps({
      sanction: {
        type: constant.SANCTION_TYPE.WARNING
      }
    })
    expect(wrapper.vm.isSuspension).to.be.false
  })
})


// Require the dev-dependencies
const path = require('path')
const chai = require('chai')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const sanctionService = require(path.join(__dirname, '/../service')).sanction
const StaffNewsModel = require(path.join(__dirname, '/../model/')).staffNews
const LeaveRequestModel = require(path.join(__dirname, '/../model/')).leaveRequest
const LicenseModel = require(path.join(__dirname, '/../model/')).staffRequest
const SanctionModel = require(path.join(__dirname, '/../model')).sanction
const factory = require(path.join(__dirname, '/helper/factory'))
const dateFns = require('date-fns')
const availabilityService = require(path.join(__dirname, '/../service')).availability
const availabilityModel = require(path.join(__dirname, '/../model')).availability
const availabilityEmitter = require(path.join(__dirname, '/../libs/availabilityEmitter'))
const sinon = require('sinon')
const expect = chai.expect
const Const = require(path.join(__dirname, '/../libs/const'))
const ObjectId = require('mongoose').Types.ObjectId

describe('Availability', () => {

  beforeEach(done => {
    availabilityModel.remove({})
      .then(r => {
        done()
      })
  })

  it('should create a staff news early availability object', async(function () {
    const earlyObject = factory.earlyStaffNews()
    const staffNews = awaitFor(StaffNewsModel.create(earlyObject))
    staffNews.generateAvailability({
      addUnavailability: function (availabilityDocument) {
        expect(availabilityDocument).to.have.property('collaborator').eql(staffNews.collaborator)
        expect(availabilityDocument).to.have.property('request')
        expect(availabilityDocument.request).to.have.property('_id').eql(staffNews._id)
        expect(availabilityDocument).to.have.property('from').eql(dateFns.startOfDay(staffNews.created_at))
        expect(availabilityDocument).to.have.property('type').eql(Const.AVAILABILITY_TYPE.STAFF_NEWS_EARLY)
      }
    })
  }))

  it('should create an staff request early availability with compensation object', async(function () {
    const earlyObject = factory.leaveEarlyStaffRequest()
    let leaveRequest = awaitFor(LeaveRequestModel.create(earlyObject))
    leaveRequest = awaitFor(LeaveRequestModel.findOneAndUpdate({_id: leaveRequest._id}, {$set: {archived: true}}, {new: true}))
    leaveRequest.generateAvailability({
      addUnavailability: function (availabilityDocument) {
        expect(availabilityDocument).to.have.property('request')
        expect(availabilityDocument.request).to.have.property('_id').eql(leaveRequest._id)
        expect(availabilityDocument).to.have.property('type').satisfy(t => t === Const.AVAILABILITY_TYPE.LEAVE_REQUEST_EARLY)
        expect(leaveRequest.days.some(d => dateFns.isEqual(d, availabilityDocument.from)))
      },
      addAvailability: function (availabilityDocument) {
        expect(availabilityDocument).to.have.property('request')
        expect(availabilityDocument.request).to.have.property('_id').eql(leaveRequest._id)
        expect(availabilityDocument).to.have.property('type').satisfy(t => t === Const.AVAILABILITY_TYPE.COMPENSATE)

        const days = leaveRequest.daysToCompensate.map(d => dateFns.startOfDay(d.from))
        expect(days.some(d => dateFns.isEqual(d, availabilityDocument.from)))

        const timesFrom = leaveRequest.daysToCompensate.map(d => dateFns.format(d.from, 'HH:mm'))
        expect(timesFrom.some(d => d === availabilityDocument.time.from))

        const timesTo = leaveRequest.daysToCompensate.map(d => dateFns.format(d.to, 'HH:mm'))
        expect(timesTo.some(d => d === availabilityDocument.time.to))
        const timeFormat = /[0-2][0-9]:[0-5][0-9]/
        expect(timeFormat.test(availabilityDocument.time.to)).to.be.true
        expect(timeFormat.test(availabilityDocument.time.from)).to.be.true
      }
    })
  }))

  it('should create an staff request early availability object without compensation', async(function () {
    const earlyObject = factory.leaveEarlyStaffRequest({resolution: Const.LEAVE_RESOLUTION.NO_COMPENSATE})
    let leaveRequest = awaitFor(LeaveRequestModel.create(earlyObject))
    leaveRequest = awaitFor(LeaveRequestModel.findOneAndUpdate({_id: leaveRequest._id}, {$set: {archived: true}}, {new: true}))

    const spy = {
      addUnavailability: sinon.spy(),
      addAvailability: sinon.spy()
    }

    leaveRequest.generateAvailability(spy)
    expect(spy.addUnavailability.called).to.be.true
    expect(spy.addAvailability.notCalled).to.be.true
  }))

  it('should create an staff request early availability object with compensation in many days', async(function () {
    const earlyObject = factory.leaveEarlyStaffRequest({
      daysToCompensate: [
        {
          from: '2018-08-08T15:00:00.000Z',
          to: '2018-08-08T16:00:00.000Z'
        },
        {
          from: '2018-08-09T15:00:00.000Z',
          to: '2018-08-09T16:00:00.000Z'
        }
      ]
    })
    let leaveRequest = awaitFor(LeaveRequestModel.create(earlyObject))
    leaveRequest = awaitFor(LeaveRequestModel.findOneAndUpdate({_id: leaveRequest._id}, {$set: {archived: true}}, {new: true}))

    const spy = {
      addUnavailability: sinon.spy(),
      addAvailability: sinon.spy()
    }
    leaveRequest.generateAvailability(spy)
    expect(spy.addUnavailability.called).to.be.true
    expect(spy.addAvailability.calledTwice).to.be.true
  }))

  it('should create an staff request early availability object with many collaborators', async(function () {
    const earlyObject = factory.leaveEarlyStaffRequest({
      collaborators: [
        '5a3c3fe94470566265b1f3bc',
        '5ada2f150b777a0c5ed3070c',
        '5ada2f150b777a0c5ed3070d'
      ],
      resolution: Const.LEAVE_RESOLUTION.NO_COMPENSATE
    })
    let leaveRequest = awaitFor(LeaveRequestModel.create(earlyObject))
    leaveRequest = awaitFor(LeaveRequestModel.findOneAndUpdate({_id: leaveRequest._id}, {$set: {archived: true}}, {new: true}))

    const spy = {
      addUnavailability: sinon.spy(),
      addAvailability: sinon.spy()
    }
    leaveRequest.generateAvailability(spy)
    expect(spy.addUnavailability.calledThrice).to.be.true
    expect(spy.addAvailability.notCalled).to.be.true
  }))

  it('should create an staff request early availability object with many days.', async(function () {
    const earlyObject = factory.leaveEarlyStaffRequest({
      days: [
        '2018-08-06T15:00:00.000Z',
        '2018-08-06T16:00:00.000Z'
      ],
      resolution: Const.LEAVE_RESOLUTION.NO_COMPENSATE
    })
    let leaveRequest = awaitFor(LeaveRequestModel.create(earlyObject))
    leaveRequest = awaitFor(LeaveRequestModel.findOneAndUpdate({_id: leaveRequest._id}, {$set: {archived: true}}, {new: true}))

    const spy = {
      addUnavailability: sinon.spy(),
      addAvailability: sinon.spy()
    }
    leaveRequest.generateAvailability(spy)
    expect(spy.addUnavailability.calledTwice).to.be.true
    expect(spy.addAvailability.notCalled).to.be.true
  }))

  it('should get today availabilities ', async(function () {
    const today = new Date()
    const tomorrow = dateFns.startOfTomorrow()
    const yesterday = dateFns.startOfYesterday()
    const inFiveDays = dateFns.addDays(today, 5)
    const lastWeek = dateFns.subDays(today, 5)
    const lastMonth = dateFns.subDays(today, 30)
    const nextMonth = dateFns.addDays(today, 30)

    const inRange1 = awaitFor(availabilityModel.create(factory.availability({from: today, to: today})))
    const inRange2 = awaitFor(availabilityModel.create(factory.availability({from: yesterday, to: tomorrow})))
    const inRange3 = awaitFor(availabilityModel.create(factory.availability({from: lastMonth, to: inFiveDays})))
    const inRange4 = awaitFor(availabilityModel.create(factory.availability({from: lastMonth, to: nextMonth})))

    awaitFor(availabilityModel.create(factory.availability({from: tomorrow, to: tomorrow, type: 'not in range'})))
    awaitFor(availabilityModel.create(factory.availability({from: yesterday, to: yesterday, type: 'not in range'})))
    awaitFor(availabilityModel.create(factory.availability({from: inFiveDays, to: inFiveDays, type: 'not in range'})))
    awaitFor(availabilityModel.create(factory.availability({from: lastWeek, to: lastWeek, type: 'not in range'})))
    awaitFor(availabilityModel.create(factory.availability({from: lastMonth, to: lastMonth, type: 'not in range'})))
    awaitFor(availabilityModel.create(factory.availability({from: nextMonth, to: nextMonth, type: 'not in range'})))
    const result = awaitFor(availabilityService.get())
    expect(result.some(r => inRange1._id.equals(r._id))).to.be.true
    expect(result.some(r => inRange2._id.equals(r._id))).to.be.true
    expect(result.some(r => inRange3._id.equals(r._id))).to.be.true
    expect(result.some(r => inRange4._id.equals(r._id))).to.be.true
    expect(result).to.have.lengthOf(4)
  }))

  it('should not call changeOfAvailability ', async(function () {
    availabilityEmitter.getInstance().unsubscribe(availabilityService)
    const spy = {
      changeOfAvailability: sinon.spy()
    }
    availabilityEmitter.getInstance().subscribe(spy)
    const earlyObject = factory.leaveEarlyStaffRequest({archived: true})
    awaitFor(LeaveRequestModel.create(earlyObject))
    expect(spy.changeOfAvailability.notCalled).to.be.true
    availabilityEmitter.getInstance().unsubscribe(spy)
  }))

  it('should not call changeOfAvailability because is being printed ', async(function () {
    availabilityEmitter.getInstance().unsubscribe(availabilityService)
    const spy = {
      changeOfAvailability: sinon.spy()
    }
    availabilityEmitter.getInstance().subscribe(spy)
    let earlyObject = factory.leaveEarlyStaffRequest()
    earlyObject = awaitFor(LeaveRequestModel.create(earlyObject))
    earlyObject.printed = true
    awaitFor(earlyObject.save())
    expect(spy.changeOfAvailability.calledOnce).to.be.true
    availabilityEmitter.getInstance().unsubscribe(spy)
  }))

  it('should call changeOfAvailability ', async(function () {
    availabilityEmitter.getInstance().unsubscribe(availabilityService)
    const spy = {
      changeOfAvailability: sinon.spy()
    }
    availabilityEmitter.getInstance().subscribe(spy)
    const earlyObject = factory.leaveEarlyStaffRequest({state: Const.STAFF_REQUEST_STATE.APPROVED})
    awaitFor(LeaveRequestModel.create(earlyObject))
    expect(spy.changeOfAvailability.called).to.be.true
    availabilityEmitter.getInstance().unsubscribe(spy)
  }))

  it('should call deleteOfAvailability ', async(function () {
    availabilityEmitter.getInstance().unsubscribe(availabilityService)
    const spy = {
      cancelOfAvailability: sinon.spy()
    }
    availabilityEmitter.getInstance().subscribe(spy)
    const earlyObject = factory.leaveEarlyStaffRequest({state: Const.STAFF_REQUEST_STATE.APPROVED, canceled: true})
    awaitFor(LeaveRequestModel.create(earlyObject))
    expect(spy.cancelOfAvailability.called).to.be.true
    availabilityEmitter.getInstance().unsubscribe(spy)
  }))

  it('should call updateOfAvailability ', async(function () {
    availabilityEmitter.getInstance().unsubscribe(availabilityService)
    const spy = {
      updateOfAvailability: sinon.spy(),
      changeOfAvailability: sinon.spy()
    }
    availabilityEmitter.getInstance().subscribe(spy)

    const medicalOrder = factory.medicalOrder({})
    let license = awaitFor(LicenseModel.create(medicalOrder))

    awaitFor(LicenseModel.update({_id: license._id}, {$set: {medicalAppointment: '2018-08-17T03:00:00.000Z'}}))
    expect(spy.updateOfAvailability.called).to.be.true
    availabilityEmitter.getInstance().unsubscribe(spy)
  }))

  it('should not call updateOfAvailability ', async(function () {
    availabilityEmitter.getInstance().unsubscribe(availabilityService)
    const spy = {
      updateOfAvailability: sinon.spy(),
      changeOfAvailability: sinon.spy()
    }
    availabilityEmitter.getInstance().subscribe(spy)

    const medicalOrder = factory.medicalOrder({})
    let license = awaitFor((LicenseModel.create(medicalOrder)))
    awaitFor(LicenseModel.update({_id: license._id}, {$set: {observation: 'awf'}}))
    expect(spy.updateOfAvailability.notCalled).to.be.true
    availabilityEmitter.getInstance().unsubscribe(spy)
  }))

  it('should delete availability', async(function () {
    const request = {
      _id: new ObjectId()
    }
    awaitFor(availabilityModel.create(factory.availability({request: request._id})))
    availabilityService.cancelOfAvailability(request)
    const results = awaitFor(availabilityModel.find({}))
    expect(results).to.have.lengthOf(0)
  }))

  it('should check updateOfAvailability on sanction edition', async(function () {
    availabilityEmitter.getInstance().unsubscribe(availabilityService)
    const spy = {
      updateOfAvailability: sinon.spy(),
      changeOfAvailability: sinon.spy()
    }
    availabilityEmitter.getInstance().subscribe(spy)

    let sanction = awaitFor((SanctionModel.create(factory.sanction({}))))
    awaitFor(sanctionService.edit(sanction._id, {reason: 'edited reason'}))
    expect(spy.updateOfAvailability.notCalled).to.be.true
    const newDateRange = {
      from: dateFns.subDays(new Date(), 2),
      to: dateFns.startOfTomorrow()
    }
    awaitFor(sanctionService.edit(sanction._id, {dateRange: newDateRange}))
    expect(spy.updateOfAvailability.called).to.be.true
    availabilityEmitter.getInstance().unsubscribe(spy)
  }))

  it('should check cancelOfAvailability on sanction delete', async(function () {
    availabilityEmitter.getInstance().unsubscribe(availabilityService)
    const spy = {
      cancelOfAvailability: sinon.spy(),
      changeOfAvailability: sinon.spy()
    }
    availabilityEmitter.getInstance().subscribe(spy)

    let sanction = awaitFor(SanctionModel.create(factory.sanction({type: Const.SANCTION_TYPE.WARNING})))
    awaitFor(sanctionService.remove(sanction._id))
    expect(spy.cancelOfAvailability.notCalled).to.be.true
    sanction = awaitFor(SanctionModel.create(factory.sanction({type: Const.SANCTION_TYPE.SUSPENSION})))
    awaitFor(sanctionService.remove(sanction._id))
    expect(spy.cancelOfAvailability.called).to.be.true
    availabilityEmitter.getInstance().unsubscribe(spy)
  }))
})

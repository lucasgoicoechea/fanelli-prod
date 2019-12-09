'use strict'
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const chaiStream = require('chai-stream')
chai.use(chaiStream)
const staffRequestService = require(path.join(__dirname, '/../service')).staffRequest
const dateFns = require('date-fns')

const staffRequestModel = require(path.join(__dirname, '/../model')).staffRequest
const LeaveRequestModel = require(path.join(__dirname, '/../model')).leaveRequest
const ExtraHoursModel = require(path.join(__dirname, '/../model')).extraHoursRequest
const ShiftChangeModel = require(path.join(__dirname, '/../model')).shiftChangeRequest

const Const = require(path.join(__dirname, '/../libs/const'))
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const ObjectId = require('mongoose').Types.ObjectId

describe('Staff Request', () => {
  beforeEach((done) => {
    // Before the test we empty the database
    staffRequestModel.remove({})
      .then(() => ExtraHoursModel.remove({}))
      .then(() => ShiftChangeModel.remove({}))
      .then(() => LeaveRequestModel.remove({}))
      .then(() => done())
      .catch(error => done(error))
  })

  it('should create a staff request', async(() => {
    let staffRequest = {
      type: Const.LICENSE_TYPE.MEDICAL_ORDER,
      medicalType: Const.STAFF_REQUEST_MEDICAL_TYPE.OTHER,
      observation: 'Vino la madre porque el estaba muy enfermo',
      initialDate: new Date()
    }
    staffRequest = awaitFor(staffRequestService.createLicense(new ObjectId(), new ObjectId(), staffRequest))
    expect(staffRequest).to.have.property('_id')
    staffRequest = awaitFor(staffRequestModel.findById(staffRequest._id))
    expect(staffRequest).to.have.property('collaborator')
    expect(staffRequest).to.have.property('creator')
  }))

  it('should update a staff request', async(() => {
    let staffRequest = {
      type: Const.LICENSE_TYPE.MEDICAL_ORDER,
      medicalType: Const.STAFF_REQUEST_MEDICAL_TYPE.OTHER,
      observation: 'Vino la madre porque el estaba muy enfermo',
      collaborator: new ObjectId(),
      creator: new ObjectId(),
      initialDate: new Date()
    }
    staffRequest = awaitFor(staffRequestModel.create(staffRequest))
    staffRequest = awaitFor(staffRequestService.updateLicense(staffRequest._id, {observation: 'modificada'}))
    expect(staffRequest).to.have.property('observation').to.be.eql('modificada')
  }))

  it('should create a leave request', async(() => {
    let leaveRequest = {
      type: Const.LEAVE_REQUEST_TYPE.LATE,
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      reason: 'some reason',
      time: '07:30'
    }
    leaveRequest = awaitFor(staffRequestService.createLeave(new ObjectId(), new ObjectId(), leaveRequest))
    expect(leaveRequest).to.have.property('_id')
    leaveRequest = awaitFor(LeaveRequestModel.findById(leaveRequest._id))
    expect(leaveRequest).to.have.property('collaborators').to.be.an('array')
    expect(leaveRequest).to.have.property('creator')
  }))

  it('should create a extra hours request', async(() => {
    let extraHoursRequest = {
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      time: '07:30'
    }
    extraHoursRequest = awaitFor(staffRequestService.createExtraHours(new ObjectId(), new ObjectId(), extraHoursRequest))
    expect(extraHoursRequest).to.have.property('_id')
    extraHoursRequest = awaitFor(ExtraHoursModel.findById(extraHoursRequest._id))
    expect(extraHoursRequest).to.have.property('collaborators').to.be.an('array')
    expect(extraHoursRequest).to.have.property('creator')
  }))

  it('should create a shift change request', async(() => {
    let shiftChange = {
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      toShift: new ObjectId(),
      temporary: true,
      changesWith: new ObjectId()
    }
    shiftChange = awaitFor(staffRequestService.createShiftChange(new ObjectId(), new ObjectId(), shiftChange))
    expect(shiftChange).to.have.property('_id')
    shiftChange = awaitFor(ShiftChangeModel.findById(shiftChange._id))
    expect(shiftChange).to.have.property('collaborators').to.be.an('array')
    expect(shiftChange).to.have.property('creator')
  }))

  it('should return that the request can\'t be created', async(() => {
    const days = [dateFns.endOfToday(), dateFns.addDays(dateFns.startOfToday(), 4)]
    let canBeCreated = awaitFor(staffRequestService.canRequestBeCreatedForDays(days))
    expect(canBeCreated).to.be.false
  }))

  it('should return that the request can be created', async(() => {
    const days = [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)]
    let canBeCreated = awaitFor(staffRequestService.canRequestBeCreatedForDays(days))
    expect(canBeCreated).to.be.true
  }))

  it('should approve a request', async(function () {
    let leaveRequest = {
      type: Const.LEAVE_REQUEST_TYPE.ABSENT,
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      reason: 'some reason',
      time: '07:30',
      state: Const.STAFF_REQUEST_STATE.PENDING_APPROVAL,
      creator: new ObjectId(),
      collaborators: new ObjectId()
    }
    const compensate = {
      resolution: 'COMPENSATE'
    }
    leaveRequest = awaitFor(LeaveRequestModel.create(leaveRequest))
    leaveRequest = awaitFor(staffRequestService.setApproval(leaveRequest, true, new ObjectId(), compensate))
    leaveRequest = awaitFor(LeaveRequestModel.findById(leaveRequest._id))
    expect(leaveRequest.state).to.be.eql(Const.STAFF_REQUEST_STATE.APPROVED)
    expect(leaveRequest.approvedDate).to.exist
  }))

  it('should return that can not be created', async(function () {
    let extraHoursRequest = {
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      time: '07:30',
      state: Const.STAFF_REQUEST_STATE.APPROVED
    }
    extraHoursRequest = awaitFor(staffRequestService.createLeave(new ObjectId(), new ObjectId(), extraHoursRequest))
    expect(staffRequestService.canChangeApproval(extraHoursRequest)).to.be.false
  }))

  it('should return that can not be created', async(function () {
    let extraHoursRequest = {
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      time: '07:30',
      state: Const.STAFF_REQUEST_STATE.PENDING_APPROVAL
    }
    extraHoursRequest = awaitFor(staffRequestService.createLeave(new ObjectId(), new ObjectId(), extraHoursRequest))
    expect(staffRequestService.canChangeApproval(extraHoursRequest)).to.be.true
  }))

  describe('Test Gets', () => {
    const collaborator = new ObjectId()
    const creator = new ObjectId()

    const extraHoursData = [
      {
        creator: creator,
        collaborators: [new ObjectId(), collaborator],
        state: Const.STAFF_REQUEST_STATE.PENDING_APPROVAL,
        created_at: dateFns.addDays(new Date(), 10)
      },
      {
        creator: new ObjectId(),
        collaborators: [new ObjectId()],
        state: Const.STAFF_REQUEST_STATE.PENDING_APPROVAL,
        created_at: dateFns.addDays(new Date(), 5)
      },
      {
        creator: creator,
        collaborators: [new ObjectId()],
        state: Const.STAFF_REQUEST_STATE.PENDING_APPROVAL,
        created_at: dateFns.addDays(new Date(), 0)
      }]

    const shiftChangeData = [
      {
        creator: creator,
        collaborators: [new ObjectId(), collaborator],
        state: Const.STAFF_REQUEST_STATE.APPROVED,
        created_at: dateFns.addDays(new Date(), 7)
      },
      {
        creator: creator,
        collaborators: [new ObjectId(), collaborator],
        state: Const.STAFF_REQUEST_STATE.REJECTED,
        created_at: dateFns.addDays(new Date(), 2)
      }]

    const leaveData = [
      {
        creator: creator,
        collaborators: [new ObjectId(), collaborator],
        state: Const.STAFF_REQUEST_STATE.APPROVED,
        created_at: dateFns.addDays(new Date(), 9),
        archived: true
      },
      {
        creator: new ObjectId(),
        collaborators: [new ObjectId(), collaborator],
        state: Const.STAFF_REQUEST_STATE.APPROVED,
        created_at: dateFns.addDays(new Date(), 3),
        archived: true,
        canceled: true
      },
      {
        creator: creator,
        collaborators: [new ObjectId()],
        state: Const.STAFF_REQUEST_STATE.REJECTED,
        created_at: dateFns.addDays(new Date(), 7),
        archived: true
      }]

    it('should return the staff requests pending', async(function () {
      awaitFor(ExtraHoursModel.create(extraHoursData))
      awaitFor(ShiftChangeModel.create(shiftChangeData))
      awaitFor(LeaveRequestModel.create(leaveData))
      const staffRequests = awaitFor(staffRequestService.getPending({}))
      expect(staffRequests).to.have.lengthOf(3)
    }))

    it('should return the staff resolved requests', async(function () {
      awaitFor(ExtraHoursModel.create(extraHoursData))
      awaitFor(ShiftChangeModel.create(shiftChangeData))
      awaitFor(LeaveRequestModel.create(leaveData))
      const staffRequests = awaitFor(staffRequestService.getResolved({}))
      expect(staffRequests).to.have.lengthOf(5)
    }))

    it('should return the staff requests pending done by an user', async(function () {
      awaitFor(ExtraHoursModel.create(extraHoursData))
      awaitFor(ShiftChangeModel.create(shiftChangeData))
      awaitFor(LeaveRequestModel.create(leaveData))
      const staffRequests = awaitFor(staffRequestService.getPending({creator}))
      expect(staffRequests).to.have.lengthOf(2)
    }))

    it('should return the staff requests resolved done by an user', async(function () {
      awaitFor(ExtraHoursModel.create(extraHoursData))
      awaitFor(ShiftChangeModel.create(shiftChangeData))
      awaitFor(LeaveRequestModel.create(leaveData))
      const staffRequests = awaitFor(staffRequestService.getPending({creator}))
      expect(staffRequests).to.have.lengthOf(2)
    }))
    it('should return the staff requests not archived', async(function () {
      awaitFor(ExtraHoursModel.create(extraHoursData))
      awaitFor(ShiftChangeModel.create(shiftChangeData))
      awaitFor(LeaveRequestModel.create(leaveData))
      const staffRequests = awaitFor(staffRequestService.getNotArchived())
      expect(staffRequests).to.have.lengthOf(5)
    }))

    it('should return the staff requests archived done to an user', async(function () {
      awaitFor(ExtraHoursModel.create(extraHoursData))
      awaitFor(ShiftChangeModel.create(shiftChangeData))
      awaitFor(LeaveRequestModel.create(leaveData))
      // Added archived staff request but rejected
      awaitFor(LeaveRequestModel.create({
        creator: new ObjectId(),
        collaborators: [new ObjectId(), collaborator],
        state: Const.STAFF_REQUEST_STATE.REJECTED,
        created_at: dateFns.addDays(new Date(), 3),
        archived: true
      }))
      const staffRequests = awaitFor(staffRequestService.getArchived({collaborator: collaborator}))
      expect(staffRequests).to.have.lengthOf(1)
    }))
    it('should return the staff requests archived done to an user', async(function () {
      awaitFor(ExtraHoursModel.create(extraHoursData))
      awaitFor(ShiftChangeModel.create(shiftChangeData))
      awaitFor(LeaveRequestModel.create(leaveData))
      const staffRequests = awaitFor(staffRequestService.get({page: 0, per_page: 1}))
      expect(staffRequests).to.have.lengthOf(1)
    }))

    it('should return the dates order by date ', async(function () {
      awaitFor(ExtraHoursModel.create(extraHoursData))
      awaitFor(ShiftChangeModel.create(shiftChangeData))
      awaitFor(LeaveRequestModel.create(leaveData))
      const staffRequests = awaitFor(staffRequestService.get({page: 1, per_page: 20}))
      expect(dateFns.isAfter(staffRequests[0].created_at, staffRequests[staffRequests.length - 1].created_at))
      expect(dateFns.isAfter(staffRequests[0].created_at, staffRequests[2].created_at))
    }))
  })

  it('should archive request', async(() => {
    let extraHoursRequest = {
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      creator: new ObjectId(),
      time: '07:30',
      state: Const.STAFF_REQUEST_STATE.APPROVED
    }
    extraHoursRequest = awaitFor(ExtraHoursModel.create(extraHoursRequest))
    extraHoursRequest = awaitFor(staffRequestService.archive(extraHoursRequest))
    expect(extraHoursRequest.state).eql(Const.STAFF_REQUEST_STATE.APPROVED)
    expect(extraHoursRequest.archived).to.be.true
  }))
  it('should return that can not be archived', async(() => {
    let extraHoursRequest = {
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      time: '07:30',
      state: Const.STAFF_REQUEST_STATE.PENDING_APPROVAL
    }
    const result = awaitFor(staffRequestService.canBeArchived(extraHoursRequest))
    expect(result).to.be.false
  }))
  it('should return that can be archived', async(() => {
    let extraHoursRequest = {
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      time: '07:30',
      state: Const.STAFF_REQUEST_STATE.APPROVED
    }
    const result = awaitFor(staffRequestService.canBeArchived(extraHoursRequest))
    expect(result).to.be.true
  }))

  it('should return that can be cancel', async(() => {
    let extraHoursRequest = {
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      time: '07:30',
      state: Const.STAFF_REQUEST_STATE.APPROVED
    }
    const result = awaitFor(staffRequestService.canBeCanceled(extraHoursRequest))
    expect(result).to.be.true
  }))

  it('should return that can not be cancel', async(() => {
    let extraHoursRequest = {
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      time: '07:30',
      state: Const.STAFF_REQUEST_STATE.APPROVED,
      archived: true
    }
    const result = awaitFor(staffRequestService.canBeCanceled(extraHoursRequest))
    expect(result).to.be.false
  }))

  it('should approve a request', async(function () {
    let leaveRequest = {
      type: Const.LEAVE_REQUEST_TYPE.ABSENT,
      days: [dateFns.addDays(dateFns.startOfToday(), 3), dateFns.addDays(dateFns.startOfToday(), 4)],
      reason: 'some reason',
      time: '07:30',
      state: Const.STAFF_REQUEST_STATE.APPROVED,
      creator: new ObjectId(),
      collaborators: new ObjectId()
    }
    leaveRequest = awaitFor(LeaveRequestModel.create(leaveRequest))
    leaveRequest = awaitFor(staffRequestService.cancel(leaveRequest, new ObjectId()))
    expect(leaveRequest.state).to.be.eql(Const.STAFF_REQUEST_STATE.APPROVED)
    expect(leaveRequest.canceled).to.be.true
  }))
})

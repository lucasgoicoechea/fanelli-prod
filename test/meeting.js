'use strict'
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const meetingService = require(path.join(__dirname, '/../service')).meeting
const MeetingModel = require(path.join(__dirname, '/../model')).meeting
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const ObjectId = require('mongoose').Types.ObjectId
const factory = require(path.join(__dirname, '/helper/factory'))
const dateFns = require('date-fns')
const Const = require(path.join(__dirname, '/../libs/const'))
describe('Meeting', () => {
  beforeEach((done) => {
    // Before the test we empty the database
    MeetingModel.remove({})
      .then(() => done())
      .catch(error => done(error))
  })

  it('should create a meeting', async(() => {
    const meeting = awaitFor(meetingService.create(factory.meeting({})))
    expect(meeting).to.have.property('_id')
    const meetings = awaitFor(MeetingModel.find({}))
    expect(meetings).to.have.lengthOf(1)
  }))

  it('should get all meetings', async(() => {
    awaitFor(MeetingModel.create(factory.meeting({})))
    awaitFor(MeetingModel.create(factory.meeting({})))
    awaitFor(MeetingModel.create(factory.meeting({})))
    const meetings = awaitFor(meetingService.list())
    expect(meetings).to.have.lengthOf(3)
  }))

  it('should meetings with pagination', async(() => {
    awaitFor(MeetingModel.create(factory.meeting({})))
    awaitFor(MeetingModel.create(factory.meeting({})))
    awaitFor(MeetingModel.create(factory.meeting({})))
    const meetings = awaitFor(meetingService.list({perPage: 2, page: 1}))
    expect(meetings).to.have.lengthOf(2)
  }))

  it('should get my meetings', async(() => {
    const userID = new ObjectId()
    awaitFor(MeetingModel.create(factory.meeting({creator: userID})))
    awaitFor(MeetingModel.create(factory.meeting({collaborators: [userID]})))
    awaitFor(MeetingModel.create(factory.meeting({})))
    const meetings = awaitFor(meetingService.listMyMeetings(userID))
    expect(meetings).to.have.lengthOf(2)
  }))

  it('should edit a meeting ', async(() => {
    let meeting = awaitFor(MeetingModel.create(factory.meeting()))
    let meetingEdited = awaitFor(meetingService.edit(meeting._id, {description: 'edited description'}))
    expect(meetingEdited.description).to.be.eql('edited description')
  }))

  it('should return that user cant edit a meeting', async(() => {
    let meeting = awaitFor(MeetingModel.create(factory.meeting({creator: new ObjectId()})))
    let canBeEdited = awaitFor(meetingService.isCreator(new ObjectId(), meeting._id))
    expect(canBeEdited).to.be.eql(false)
  }))

  it('should return that user cant edit a meeting', async(() => {
    const userID = new ObjectId()
    let meeting = awaitFor(MeetingModel.create(factory.meeting({creator: userID})))
    let canBeEdited = awaitFor(meetingService.isCreator(userID, meeting._id))
    expect(canBeEdited).to.be.eql(true)
  }))

  it('should delete a  meeting', async(() => {
    const meeting = awaitFor(MeetingModel.create(factory.meeting({})))
    awaitFor(meetingService.remove(meeting._id))
    const meetings = awaitFor(MeetingModel.find({}))
    expect(meetings).to.have.lengthOf(0)
  }))
})

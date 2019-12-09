'use strict'
// Require the dev-dependencies
const path = require('path')
const chai = require('chai')
chai.use(require('chai-subset'))
chai.use(require('chai-things'))
const expect = chai.expect
let users = require(path.join(__dirname, '/data/users'))
const eventsTimelineModel = require(path.join(__dirname, '/../model')).eventsTimeline
const staffNewsModel = require(path.join(__dirname, '/../model')).staffNews
const staffRequestModel = require(path.join(__dirname, '/../model')).staffRequest
const eventsTimelineService = require(path.join(__dirname, '/../service')).eventsTimeline
const constant = require(path.join(__dirname, '/../libs/const'))
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const ObjectId = require('mongoose').Types.ObjectId

describe('Events Timeline', () => {
  beforeEach((done) => {
    // Before the test we empty the database
    eventsTimelineModel.remove({})
      .then(() => done())
      .catch(error => done(error))
  })
  it('should create a new event (news) and add it to a timeline', async(() => {
    let event = {
      type: 'ABSENT',
      withNotice: false,
      observation: 'observation',
      exculpatory: 'Me olvide',
      creator: new ObjectId(),
      collaborator: new ObjectId()
    }
    event = awaitFor(staffNewsModel.create(event))
    const timeline = awaitFor(eventsTimelineModel.create({collaborator: users.colaborador._id}))
    const result = awaitFor(eventsTimelineService.addEventTo(event._id, 'StaffNews', timeline._id))
    expect(result).to.have.property('_id')
    const staffNews = awaitFor(eventsTimelineModel.findById(result._id))
    expect(staffNews).to.have.property('collaborator')
    expect(staffNews.collaborator.toString()).eql(users.colaborador._id)
    expect(staffNews).to.have.property('events').to.be.not.empty
  }))
  it('should create a new event (request) and add it to a timeline', async(() => {
    let event = {
      type: constant.LICENSE_TYPE.MEDICAL_ORDER,
      medicalType: constant.STAFF_REQUEST_MEDICAL_TYPE.OTHER,
      observation: 'Vino la madre porque el estaba muy enfermo',
      initialDate: new Date(),
      creator: new ObjectId(),
      collaborator: new ObjectId()
    }
    event = awaitFor(staffRequestModel.create(event))
    const timeline = awaitFor(eventsTimelineModel.create({collaborator: users.colaborador._id}))
    const result = awaitFor(eventsTimelineService.addEventTo(event._id, 'StaffNews', timeline._id))
    expect(result).to.have.property('_id')
    const staffNews = awaitFor(eventsTimelineModel.findById(result._id))
    expect(staffNews).to.have.property('collaborator')
    expect(staffNews.collaborator.toString()).eql(users.colaborador._id)
    expect(staffNews).to.have.property('events').to.be.not.empty
  }))
  it('should get a timeline', async(() => {
    let event = {
      type: 'ABSENT',
      withNotice: false,
      observation: 'observation',
      exculpatory: 'Me olvide',
      creator: new ObjectId(),
      collaborator: new ObjectId()
    }
    event = awaitFor(staffNewsModel.create(event))
    let timeline = awaitFor(eventsTimelineModel.create({collaborator: users.colaborador._id}))
    timeline.events.push({type: 'StaffNews', item: event})
    timeline = awaitFor(timeline.save())
    let timelines = awaitFor(eventsTimelineService.get())
    expect(timelines).to.have.lengthOf(1)
    expect(timelines[0].events[0].item).to.include({type: event.type})
    timeline.archived = true
    awaitFor(timeline.save())
    timelines = awaitFor(eventsTimelineService.get())
    expect(timelines).to.be.empty
  }))
  it('should archive a timeline', async(() => {
    let event = {
      type: 'ABSENT',
      withNotice: false,
      observation: 'observation',
      exculpatory: 'Me olvide',
      creator: new ObjectId(),
      collaborator: new ObjectId()
    }
    event = awaitFor(staffNewsModel.create(event))
    let timeline = awaitFor(eventsTimelineModel.create({collaborator: users.colaborador._id}))
    timeline.events.push({type: 'StaffNews', item: event})
    timeline = awaitFor(timeline.save())
    timeline = awaitFor(eventsTimelineService.archive(timeline._id))
    expect(timeline).to.have.property('archived').eql(true)
  }))
  it('should delete an individual event and not delete the timeline', async(() => {
    let events = [{
      type: 'ABSENT',
      withNotice: false,
      observation: 'observation',
      exculpatory: 'Me olvide',
      creator: new ObjectId(),
      collaborator: new ObjectId()
    }, {
      type: constant.LICENSE_TYPE.MEDICAL_ORDER,
      medicalType: constant.STAFF_REQUEST_MEDICAL_TYPE.OTHER,
      observation: 'Vino la madre porque el estaba muy enfermo',
      initialDate: new Date(),
      creator: new ObjectId(),
      collaborator: new ObjectId()
    }]
    events[0] = awaitFor(staffNewsModel.create(events[0]))
    events[1] = awaitFor(staffRequestModel.create(events[1]))
    let timeline = awaitFor(eventsTimelineModel.create({collaborator: users.colaborador._id}))
    timeline = awaitFor(eventsTimelineService.addEventTo(events[0]._id, 'StaffNews', timeline._id))
    timeline = awaitFor(eventsTimelineService.addEventTo(events[1]._id, 'StaffRequest', timeline._id))
    timeline = awaitFor(eventsTimelineService.removeEvent(events[1]._id, timeline._id))
    expect(timeline.events).to.have.lengthOf(1)
  }))
  it('should delete the first event and delete the timeline', async(() => {
    let events = [{
      type: 'ABSENT',
      withNotice: false,
      observation: 'observation',
      exculpatory: 'Me olvide',
      creator: new ObjectId(),
      collaborator: new ObjectId()
    }, {
      type: constant.LICENSE_TYPE.MEDICAL_ORDER,
      medicalType: constant.STAFF_REQUEST_MEDICAL_TYPE.OTHER,
      observation: 'Vino la madre porque el estaba muy enfermo',
      initialDate: new Date(),
      creator: new ObjectId(),
      collaborator: new ObjectId()
    }]
    events[0] = awaitFor(staffNewsModel.create(events[0]))
    events[1] = awaitFor(staffRequestModel.create(events[1]))
    let timeline = awaitFor(eventsTimelineModel.create({collaborator: users.colaborador._id}))
    timeline = awaitFor(eventsTimelineService.addEventTo(events[0]._id, 'StaffNews', timeline._id))
    timeline = awaitFor(eventsTimelineService.addEventTo(events[1]._id, 'StaffRequest', timeline._id))
    timeline = awaitFor(eventsTimelineService.removeEvent(events[0]._id, timeline._id))
    expect(timeline).to.be.eql({})
    const timelines = awaitFor(eventsTimelineModel.find({}))
    expect(timelines).to.have.lengthOf(0)
  }))
})

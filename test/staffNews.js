'use strict'
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const chaiStream = require('chai-stream')
chai.use(chaiStream)
let users = require(path.join(__dirname, '/data/users'))
const staffNewsService = require(path.join(__dirname, '/../service')).staffNews
const staffNewsModel = require(path.join(__dirname, '/../model')).staffNews
const EventsTimelineModel = require(path.join(__dirname, '/../model')).eventsTimeline
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const ObjectId = require('mongoose').Types.ObjectId
const factory = require(path.join(__dirname, '/helper/factory'))

const news = {
  type: 'ABSENT',
  withNotice: false,
  observation: 'observation'
}

describe('Staff News', () => {
  beforeEach((done) => {
    // Before the test we empty the database
    staffNewsModel.remove({})
      .then(() => done())
      .catch(error => done(error))
  })

  it('should create a staff news', async(() => {
    const result = awaitFor(staffNewsService.create(users.colaborador._id, users.supervisor._id, news))
    expect(result).to.have.property('_id')
    const staffNews = awaitFor(staffNewsModel.findById(result._id))
    expect(staffNews).to.have.property('collaborator')
    expect(staffNews.collaborator.toString()).eql(users.colaborador._id)
  }))

  it('should create a new staff news with exculpatory', async(() => {
    const newsWithExculpatory = {
      type: 'ABSENT',
      withNotice: false,
      observation: 'observation',
      exculpatory: 'Me olvide'
    }
    const result = awaitFor(staffNewsService.create(users.colaborador._id, users.supervisor._id, newsWithExculpatory))
    expect(result).to.have.property('_id')
    const staffNews = awaitFor(staffNewsModel.findById(result._id))
    expect(staffNews).to.have.property('collaborator')
    expect(staffNews.collaborator.toString()).eql(users.colaborador._id)
    expect(staffNews).to.have.property('exculpatory')
    expect(staffNews.exculpatory).eql('Me olvide')
  }))

  it('should create a new staff news with time', async(() => {
    const newsWithExculpatory = {
      type: 'LATE',
      withNotice: false,
      observation: 'observation',
      time: '30:50'
    }
    const result = awaitFor(staffNewsService.create(users.colaborador._id, users.colaborador._id, newsWithExculpatory))
    expect(result).to.have.property('_id')
    const staffNews = awaitFor(staffNewsModel.findById(result._id))
    expect(staffNews).to.have.property('collaborator')
    expect(staffNews.collaborator.toString()).eql(users.colaborador._id)
    expect(staffNews).to.have.property('exculpatory')
    expect(staffNews).to.have.property('discountedTime')
    expect(staffNews.time).eql('30:50')
  }))

  it('should create a new accident staff news', async(() => {
    const newsWithExculpatory = {
      type: 'ACCIDENT',
      observation: 'observation',
      informed: true,
      inPlant: true,
      left: true,
      time: '30:50'
    }
    const result = awaitFor(staffNewsService.create(users.colaborador._id, users.colaborador._id, newsWithExculpatory))
    expect(result).to.have.property('_id')
    const staffNews = awaitFor(staffNewsModel.findById(result._id))
    expect(staffNews).to.have.property('collaborator')
    expect(staffNews.collaborator.toString()).eql(users.colaborador._id)
    expect(staffNews).to.have.property('exculpatory')
    expect(staffNews.time).eql('30:50')
  }))

  /* it('should add an exculpatory to the news', async(() => {
    let staffNew = awaitFor(staffNewsService.create(users.colaborador._id, users.supervisor._id, news))
    awaitFor(staffNewsService.addExculpatory(staffNew._id, users.colaborador._id, 'Me olvide'))
    staffNew = awaitFor(staffNewsModel.findById(staffNew._id))
    expect(staffNew).to.have.property('exculpatory')
    expect(staffNew.exculpatory).eql('Me olvide')
  })) */

  it('should get news without exculpatory', async(() => {
    let result = awaitFor(staffNewsService.withoutExculpatory())
    expect(result).to.be.empty
    const sf1 = awaitFor(staffNewsModel.create({
      collaborator: new ObjectId(),
      creator: new ObjectId(),
      type: 'ABSENT',
      withNotice: false,
      exculpatory: 'me olvide'
    }))
    const sf2 = awaitFor(staffNewsModel.create(
      {
        collaborator: new ObjectId(),
        creator: new ObjectId(),
        type: 'LATE',
        withNotice: false
      }))
    const sf3 = awaitFor(staffNewsModel.create({
      collaborator: new ObjectId(),
      creator: new ObjectId(),
      type: 'LATE',
      withNotice: false
    }))
    const sf4 = awaitFor(staffNewsModel.create({
      collaborator: new ObjectId(),
      creator: new ObjectId(),
      type: 'EARLY',
      withNotice: false
    }))
    awaitFor(EventsTimelineModel.create(factory.timeline({events: [{item: sf1}, {item: sf2}]})))
    awaitFor(EventsTimelineModel.create(factory.timeline({archived: true, events: [{item: sf3}, {item: sf4}]})))

    result = awaitFor(staffNewsService.withoutExculpatory())
    expect(result).to.have.lengthOf(1)
  }))

  it('should get the pdf of a staff new', async(() => {
    const staffNews = awaitFor(staffNewsModel.create({
      collaborator: users.colaborador._id,
      creator: users.supervisor._id,
      type: 'ABSENT',
      time: '18:20',
      withNotice: false,
      exculpatory: 'me olvide'
    }))
    const stream = awaitFor(staffNewsService.getPDFStream(staffNews))
    expect(stream).to.be.a.ReadableStream
    stream.end()
    expect(stream).to.end
  }))

  it('should update a staff news', async(() => {
    let staffNews = awaitFor(staffNewsModel.create({
      collaborator: new ObjectId(),
      creator: new ObjectId(),
      type: 'ABSENT',
      withNotice: false,
      exculpatory: 'me olvide'
    }))
    staffNews = awaitFor(staffNewsService.update(staffNews._id, {withNotice: true}))
    expect(staffNews.withNotice).to.be.eql(true)
    expect(staffNews.type).to.be.eql('ABSENT')
  }))
})

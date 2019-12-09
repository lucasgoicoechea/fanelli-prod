'use strict'
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const occurrenceService = require(path.join(__dirname, '/../service')).occurrence
const OccurrenceModel = require(path.join(__dirname, '/../model')).occurrence
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const ObjectId = require('mongoose').Types.ObjectId
const factory = require(path.join(__dirname, '/helper/factory'))
const dateFns = require('date-fns')
const Const = require(path.join(__dirname, '/../libs/const'))
describe('Occurrence', () => {
  beforeEach((done) => {
    // Before the test we empty the database
    OccurrenceModel.remove({})
      .then(() => done())
      .catch(error => done(error))
  })

  it('should cancel an occurrence', async(function () {
    let occurrence = awaitFor(OccurrenceModel.create(factory.occurrence({state: Const.OCCURRENCE_STATE.APPROVED})))
    const canceledBy = new ObjectId()
    occurrence = awaitFor(occurrenceService.cancel(occurrence._id, canceledBy))
    expect(occurrence.state).to.be.eql(Const.OCCURRENCE_STATE.CANCELED)
  }))
  const collaborator = new ObjectId()
  const supervisor = new ObjectId()
  const occurrences = [
    factory.occurrence({state: Const.OCCURRENCE_STATE.PENDING_RESOLUTION}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.APPROVED}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.REJECTED}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.CANCELED}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.PENDING_RESOLUTION, collaborators: [collaborator]}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.APPROVED, collaborators: [collaborator], archived: true}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.REJECTED, collaborators: [collaborator]}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.PENDING_RESOLUTION, creator: supervisor}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.APPROVED, creator: supervisor}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.REJECTED, creator: supervisor}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.APPROVED, creator: supervisor, archived: true}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.APPROVED, creator: supervisor, archived: true}),
    factory.occurrence({state: Const.OCCURRENCE_STATE.REJECTED, creator: supervisor, archived: true})
  ]
  it('should get occurrences pending resolution', async(function () {
    awaitFor(OccurrenceModel.create(occurrences))
    const occurrencesResponse = awaitFor(occurrenceService.pending())
    expect(occurrencesResponse).to.have.lengthOf(3)
  }))
  it('should get occurrences resolved', async(function () {
    awaitFor(OccurrenceModel.create(occurrences))
    const occurrencesResponse = awaitFor(occurrenceService.resolved())
    expect(occurrencesResponse).to.have.lengthOf(10)
  }))
  it('should get occurrences done to a collaborator', async(function () {
    awaitFor(OccurrenceModel.create(occurrences))
    const occurrencesResponse = awaitFor(occurrenceService.doneTo(collaborator))
    expect(occurrencesResponse).to.have.lengthOf(1)
  }))
  it('should get archived occurrences', async(function () {
    awaitFor(OccurrenceModel.create(occurrences))
    const occurrencesResponse = awaitFor(occurrenceService.notArchived())
    expect(occurrencesResponse).to.have.lengthOf(9)
  }))
  it('should get only 4 occurrences', async(function () {
    awaitFor(OccurrenceModel.create(occurrences))
    const occurrencesResponse = awaitFor(occurrenceService.resolved({page: 1, perPage: 4}))
    expect(occurrencesResponse).to.have.lengthOf(4)
  }))
  it('should archive an occurrence', async(function () {
    let occurrence = awaitFor(OccurrenceModel.create(factory.occurrence({state: Const.OCCURRENCE_STATE.APPROVED})))
    occurrence = awaitFor(occurrenceService.archive(occurrence._id))
    expect(occurrence.archived).to.be.true
  }))
  it('should approve an occurrence', async(function () {
    const resolver = new ObjectId()
    let occurrence = awaitFor(OccurrenceModel.create(factory.occurrence({state: Const.OCCURRENCE_STATE.PENDING_RESOLUTION})))
    occurrence = awaitFor(occurrenceService.resolve(occurrence._id, true, resolver))
    expect(occurrence.state).to.be.eql(Const.OCCURRENCE_STATE.APPROVED)
    expect(occurrence.resolvedDate).to.be.eql(dateFns.startOfToday())
  }))

  it('should reject an occurrence', async(function () {
    const resolver = new ObjectId()
    let occurrence = awaitFor(OccurrenceModel.create(factory.occurrence({state: Const.OCCURRENCE_STATE.PENDING_RESOLUTION})))
    occurrence = awaitFor(occurrenceService.resolve(occurrence._id, false, resolver))
    expect(occurrence.state).to.be.eql(Const.OCCURRENCE_STATE.REJECTED)
    expect(occurrence.resolvedDate).to.be.eql(dateFns.startOfToday())
  }))

  it('should get sanction statistics', async(function () {
    const collaborator = new ObjectId()
    awaitFor(OccurrenceModel.create(factory.occurrence({
      collaborators: [collaborator],
      recommendations: [Const.RECOMMENDATION_TYPE.DISCIPLINE],
      archived: true
    })))
    awaitFor(OccurrenceModel.create(factory.occurrence({
      collaborators: [collaborator],
      recommendations: [Const.RECOMMENDATION_TYPE.DISCIPLINE],
      archived: true
    })))
    awaitFor(OccurrenceModel.create(factory.occurrence({
      collaborators: [collaborator],
      recommendations: [Const.RECOMMENDATION_TYPE.OPERATIVE],
      archived: true
    })))
    awaitFor(OccurrenceModel.create(factory.occurrence({
      collaborators: [collaborator],
      recommendations: [Const.RECOMMENDATION_TYPE.SAFETY],
      archived: true
    })))
    awaitFor(OccurrenceModel.create(factory.occurrence({
      collaborators: [collaborator],
      recommendations: [Const.RECOMMENDATION_TYPE.SAFETY, Const.RECOMMENDATION_TYPE.DISCIPLINE],
      archived: true
    })))
    awaitFor(OccurrenceModel.create(factory.occurrence({
      collaborators: [collaborator],
      recommendations: [Const.RECOMMENDATION_TYPE.SAFETY, Const.RECOMMENDATION_TYPE.DISCIPLINE],
      archived: true
    })))
    awaitFor(OccurrenceModel.create(factory.occurrence({
      collaborators: [collaborator],
      recommendations: [Const.RECOMMENDATION_TYPE.SAFETY, Const.RECOMMENDATION_TYPE.DISCIPLINE],
    })))
    awaitFor(OccurrenceModel.create(factory.occurrence({
      collaborators: [collaborator],
      recommendations: [Const.RECOMMENDATION_TYPE.SAFETY, Const.RECOMMENDATION_TYPE.DISCIPLINE],
      created_at: dateFns.subYears(new Date(), 1)
    })))
    const statistics = awaitFor(occurrenceService.occurrenceStatistics(collaborator))
    expect(statistics.discipline).to.be.eql(4)
    expect(statistics.operative).to.be.eql(1)
    expect(statistics.safety).to.be.eql(3)
  }))
  it('should edit an occurrence', async(function () {
    let occurrence = awaitFor(OccurrenceModel.create(factory.occurrence({state: Const.OCCURRENCE_STATE.PENDING_RESOLUTION, observation: 'an Observation'})))
    occurrence = awaitFor(occurrenceService.edit(occurrence._id, {observation: 'edited observation'}))
    expect(occurrence.observation).to.be.eql('edited observation')
  }))
  it('should return not editable', async(function () {
    let occurrence = awaitFor(OccurrenceModel.create(factory.occurrence({creator: new ObjectId()})))
    const canBeEdited = awaitFor(occurrenceService.canBeEditedByUser(new ObjectId(), occurrence._id))
    expect(canBeEdited).to.be.false
  }))
  it('should return not editable', async(function () {
    const creator = new ObjectId()
    let occurrence = awaitFor(OccurrenceModel.create(factory.occurrence({creator: creator, state: Const.OCCURRENCE_STATE.APPROVED})))
    const canBeEdited = awaitFor(occurrenceService.canBeEditedByUser(creator, occurrence._id))
    expect(canBeEdited).to.be.false
  }))
  it('should return editable', async(function () {
    const creator = new ObjectId()
    let occurrence = awaitFor(OccurrenceModel.create(factory.occurrence({creator: creator, state: Const.OCCURRENCE_STATE.PENDING_RESOLUTION})))
    const canBeEdited = awaitFor(occurrenceService.canBeEditedByUser(creator.toString(), occurrence._id))
    expect(canBeEdited).to.be.true
  }))
})

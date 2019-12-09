'use strict'
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const sanctionService = require(path.join(__dirname, '/../service')).sanction
const SanctionModel = require(path.join(__dirname, '/../model')).sanction
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const ObjectId = require('mongoose').Types.ObjectId
const factory = require(path.join(__dirname, '/helper/factory'))
const dateFns = require('date-fns')
const Const = require(path.join(__dirname, '/../libs/const'))

describe('Sanction', () => {
  beforeEach((done) => {
    // Before the test we empty the database
    SanctionModel.remove({})
      .then(() => done())
      .catch(error => done(error))
  })

  it('should create a sanction', async(() => {
    const sanction = awaitFor(sanctionService.create(factory.sanction({})))
    expect(sanction).to.have.property('_id')
    const sanctions = awaitFor(SanctionModel.find({}))
    expect(sanctions).to.have.lengthOf(1)
  }))

  it('should create an availability document', async(() => {
    const sanction = awaitFor(SanctionModel.create(factory.sanction({type: 'SUSPENSION', dateRange: {from: dateFns.startOfYesterday(), to: dateFns.startOfTomorrow()}})))
    sanction.generateAvailability({
      addUnavailability: function (document) {
        expect(dateFns.isSameDay(document.from, sanction.dateRange.from)).to.be.true
        expect(dateFns.isSameDay(document.to, sanction.dateRange.to)).to.be.true
        expect(document.type).to.be.eql(Const.AVAILABILITY_TYPE.SUSPENSION)
        expect(document.request._id).to.be.eql(sanction._id)
      }
    })
  }))

  it('should get all sanctions with pagination', async(() => {
    awaitFor(SanctionModel.create(factory.sanction({})))
    awaitFor(SanctionModel.create(factory.sanction({})))
    awaitFor(SanctionModel.create(factory.sanction({})))
    const sanctions = awaitFor(sanctionService.get({perPage: 2, page: 1}))
    expect(sanctions).to.have.lengthOf(2)
  }))

  it('should get sanctions done to a collaborator', async(() => {
    const collaborator = new ObjectId()
    awaitFor(SanctionModel.create(factory.sanction({collaborators: [collaborator]})))
    awaitFor(SanctionModel.create(factory.sanction({collaborators: [new ObjectId(), collaborator]})))
    awaitFor(SanctionModel.create(factory.sanction({})))
    const sanctions = awaitFor(sanctionService.getDoneTo(collaborator))
    expect(sanctions).to.have.lengthOf(2)
  }))

  it('should edit a sanction ', async(() => {
    let sanction = awaitFor(SanctionModel.create(factory.sanction()))
    let sanctionEdited = awaitFor(sanctionService.edit(sanction._id, {reason: 'edited reason'}))
    expect(sanctionEdited.reason).to.be.eql('edited reason')
  }))

  it('should delete a  sanction', async(() => {
    const sanction = awaitFor(SanctionModel.create(factory.sanction({})))
    awaitFor(sanctionService.remove(sanction._id))
    const sanctions = awaitFor(SanctionModel.find({}))
    expect(sanctions).to.have.lengthOf(0)
  }))
})

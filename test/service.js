const path = require('path')
const chai = require('chai')
const expect = chai.expect
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const factory = require(path.join(__dirname, '/helper/factory'))
const Service = require(path.join(__dirname, '/../service/service'))
const sinon = require('sinon')

function mockedServiceWithSpies () {
  const spies = {
    find: sinon.spy(),
    create: sinon.spy(),
    findById: sinon.spy(),
    remove: sinon.spy(),
    skip: sinon.spy(),
    limit: sinon.spy(),
    sort: sinon.spy(),
    update: sinon.spy()
  }
  const db = {
    find: function (query) {
      spies.find(query)
      return this
    },
    create: async(function (object) {
      spies.create(object)
      return {_id: '1234'}
    }),
    findById: async(function (id) {
      spies.findById(id)
      return this
    }),
    remove: async(function (query) {
      spies.remove(query)
      return this
    }),
    skip: function (offset) {
      spies.skip(offset)
      return this
    },
    limit: function (amount) {
      spies.limit(amount)
      return this
    },
    sort: function (sortObject) {
      spies.sort(sortObject)
      return this
    },
    update: async(function (query, set) {
      spies.update(query, set)
      return {_id: '1234'}
    })
  }
  const MockService = function (db) {
    Service.call(this, db)
  }
  MockService.prototype = Object.create(Service.prototype)
  MockService.prototype.constructor = MockService

  return {service: new MockService(db), spies}
}

describe('Base service', function () {
  it('should call list with default sorting and without pagination', async(function () {
    const {service, spies} = mockedServiceWithSpies()
    awaitFor(service.list())
    expect(spies.find.calledWith({})).to.be.true
    expect(spies.sort.calledWith({created_at: -1})).to.be.true
    expect(spies.limit.notCalled).to.be.true
    expect(spies.skip.notCalled).to.be.true
  }))
  it('should call list with sorting and without pagination', async(function () {
    const {service, spies} = mockedServiceWithSpies()
    awaitFor(service.list({sorting: {date: -1}}))
    expect(spies.find.calledWith({})).to.be.true
    expect(spies.sort.calledWith({date: -1})).to.be.true
    expect(spies.limit.notCalled).to.be.true
    expect(spies.skip.notCalled).to.be.true
  }))
  it('should call list with default sorting with default pagination', async(function () {
    const {service, spies} = mockedServiceWithSpies()
    awaitFor(service.list({pagination: {page: 3}}))
    expect(spies.find.calledWith({})).to.be.true
    expect(spies.sort.calledWith({created_at: -1})).to.be.true
    expect(spies.limit.calledWith(15)).to.be.true
    expect(spies.skip.calledWith(30)).to.be.true
  }))
  it('should call list with default sorting with pagination', async(function () {
    const {service, spies} = mockedServiceWithSpies()
    awaitFor(service.list({pagination: {page: 3, perPage: 5}}))
    expect(spies.find.calledWith({})).to.be.true
    expect(spies.sort.calledWith({created_at: -1})).to.be.true
    expect(spies.limit.calledWith(5)).to.be.true
    expect(spies.skip.calledWith(10)).to.be.true
  }))
  it('should call create', async(function () {
    const {service, spies} = mockedServiceWithSpies()
    const object = factory.mock()
    awaitFor(service.create(object))
    expect(spies.findById.calledWith('1234')).to.be.true
  }))
  it('should call edit', async(function () {
    const {service, spies} = mockedServiceWithSpies()
    awaitFor(service.edit('1234', {foo: 'bar'}))
    expect(spies.update.calledWith({_id: '1234'}, {$set: {foo: 'bar'}})).to.be.true
    expect(spies.findById.calledWith('1234')).to.be.true
  }))
  it('should call get', async(function () {
    const {service, spies} = mockedServiceWithSpies()
    awaitFor(service.get('1234'))
    expect(spies.findById.calledWith('1234')).to.be.true
  }))
})

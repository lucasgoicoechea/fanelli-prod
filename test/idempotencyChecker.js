'use strict'
// Require the dev-dependencies
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const idempotencyChecker = require(path.join(__dirname, '/../middlewares/idempotencyChecker'))
const sinon = require('sinon')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')

const mockedIdempotencyHandler = {
  addKey: async(function (key) {
    return true
  }),
  exists: async(function (key) {
    return (key === '3d3b707d-1a90-41cd-bbd4-f057e2531a4d')
  })
}

const middleware = idempotencyChecker(mockedIdempotencyHandler)

const existingKey = {
  get: sinon.fake.returns('3d3b707d-1a90-41cd-bbd4-f057e2531a4d')
}

const newKey = {
  get: sinon.fake.returns('f057e207d-1a90-41cd-bbd4-f0573d3057e2')
}

describe('IdempotencyChecker', () => {
  it('should not raise an error', async(function () {
    const callback = sinon.spy()
    awaitFor((middleware(newKey, null, callback)))
    expect(callback.called).to.be.true
  }))

  it('should call callback with an error', async(function () {
    const callback = sinon.spy()
    awaitFor((middleware(existingKey, null, callback)))
    expect(callback.getCall(0).args[0].error).to.exist
    expect(callback.getCall(0).args[0].error).to.be.eql('Idempotency-Key already sent')
  }))
})

const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const PositionModel = require(path.join(__dirname, '../model')).position
const Service = require(path.join(__dirname, '/service'))
const userService = require(path.join(__dirname, '/user'))

const PositionService = function (db) {
  Service.call(this, db)
}
PositionService.prototype = Object.create(Service.prototype)
PositionService.prototype.constructor = PositionService

PositionService.prototype.isRepeated = function (position) {
  return awaitFor(this.db.find(position)).length > 0
}

PositionService.prototype.canBeDeleted = function (id) {
  return !awaitFor(userService.isThereAnyWith({position: id}))
}

module.exports = new PositionService(PositionModel)

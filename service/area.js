const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const AreaModel = require(path.join(__dirname, '../model')).area
const Service = require(path.join(__dirname, '/service'))
const userService = require(path.join(__dirname, '/user'))

const AreaService = function (db) {
  Service.call(this, db)
}
AreaService.prototype = Object.create(Service.prototype)
AreaService.prototype.constructor = AreaService

AreaService.prototype.canBeDeleted = function (id) {
  return !awaitFor(userService.isThereAnyWith({area: id}))
}

AreaService.prototype.isRepeated = function (area) {
  return awaitFor(this.db.find(area)).length > 0
}

module.exports = new AreaService(AreaModel)

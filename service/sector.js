const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const SectorModel = require(path.join(__dirname, '../model')).sector
const Service = require(path.join(__dirname, '/service'))
const userService = require(path.join(__dirname, '/user'))

const SectorService = function (db) {
  Service.call(this, db)
}
SectorService.prototype = Object.create(Service.prototype)
SectorService.prototype.constructor = SectorService

SectorService.prototype.canBeDeleted = function (id) {
  return !awaitFor(userService.isThereAnyWith({sector: id}))
}

SectorService.prototype.isRepeated = function (sector) {
  return awaitFor(this.db.find(sector)).length > 0
}

module.exports = new SectorService(SectorModel)

const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const LineModel = require(path.join(__dirname, '../model')).line
const Service = require(path.join(__dirname, '/service'))
const userService = require(path.join(__dirname, '/user'))

const LineService = function (db) {
  Service.call(this, db)
}
LineService.prototype = Object.create(Service.prototype)
LineService.prototype.constructor = LineService

LineService.prototype.isRepeated = function (line) {
  return awaitFor(this.db.find(line)).length > 0
}

LineService.prototype.canBeDeleted = function (id) {
  return !awaitFor(userService.isThereAnyWith({line: id}))
}

module.exports = new LineService(LineModel)

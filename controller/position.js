const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const positionService = require(path.join(__dirname, '../service')).position
const AdministrationBase = require(path.join(__dirname, '/administrationBase'))

const PositionController = function (service) {
  AdministrationBase.call(this, service)
}
PositionController.prototype = Object.create(AdministrationBase.prototype)
PositionController.prototype.constructor = PositionController

module.exports = new PositionController(positionService)

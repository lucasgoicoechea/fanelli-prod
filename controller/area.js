const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const areaService = require(path.join(__dirname, '../service')).area
const AdministrationBase = require(path.join(__dirname, '/administrationBase'))

const AreaController = function (service) {
  AdministrationBase.call(this, service)
}
AreaController.prototype = Object.create(AdministrationBase.prototype)
AreaController.prototype.constructor = AreaController

const area = new AreaController(areaService)
module.exports = area

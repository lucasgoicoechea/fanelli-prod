const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const sectorService = require(path.join(__dirname, '../service')).sector
const AdministrationBase = require(path.join(__dirname, '/administrationBase'))

const SectorController = function (service) {
  AdministrationBase.call(this, service)
}
SectorController.prototype = Object.create(AdministrationBase.prototype)
SectorController.prototype.constructor = SectorController

const sector = new SectorController(sectorService)
module.exports = sector

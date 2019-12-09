const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const shiftService = require(path.join(__dirname, '../service')).shift
const AppError = require(path.join(__dirname, '/../libs/error')).AppError
const AdministrationBase = require(path.join(__dirname, '/administrationBase'))
const Const = require(path.join(__dirname, '/../libs/const'))

const ShiftController = function (service) {
  AdministrationBase.call(this, service)
  this.create = this.create.bind(this)
  this.edit = this.edit.bind(this)
}
ShiftController.prototype = Object.create(AdministrationBase.prototype)
ShiftController.prototype.constructor = ShiftController

ShiftController.prototype.create = async(function (req, res, next) {
  const sanitizedValue = req.body.data.value
    .replace(/\s+/g, ' ')
    .trim()
  let shift = {
    value: sanitizedValue,
    description: req.body.data.description
  }
  if (awaitFor(this.service.isRepeated(shift))) {
    return next(new AppError(`DocumentCantBeCreated`, 'no se puede crear porque ya existe uno con este nombre', Const.ERROR.DOCUMENT_CANT_BE_CREATED))
  }
  shift = awaitFor(this.service.create(shift))
  res.json({success: true, data: shift})
})

ShiftController.prototype.edit = async(function (req, res, next) {
  const sanitizedValue = req.body.data.value
    .replace(/\s+/g, ' ')
    .trim()
  let shift = {
    value: sanitizedValue,
    description: req.body.data.description
  }
  if (!awaitFor(this.service.canBeEdited(req.params.id))) {
    return next(new AppError(`DocumentCantBeEdited`, 'no se puede crear porque es un turno rotativo de produccion ', Const.ERROR.DOCUMENT_CANT_BE_EDITED))
  }
  shift = awaitFor(this.service.edit(req.params.id, shift))
  res.json({success: true, data: shift})
})

const shift = new ShiftController(shiftService)
module.exports = shift

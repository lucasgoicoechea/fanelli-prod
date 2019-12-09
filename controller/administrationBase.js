const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const AppError = require(path.join(__dirname, '/../libs/error')).AppError
const Const = require(path.join(__dirname, '/../libs/const'))

// GENERIC ROUTE and model.

/**
 *
 * @apiDefine administrationEntity
 * @apiSuccess {String} data.value Represents the name of the administration entity
 * @apiSuccess {String} data.description meeting Creator
 *
 **/
/**
 *
 * @api {post} /api/administration Creates a administration entity
 * @apiDescription Generic documentation. For a specific api administration endpoint replace administration for a valid administration value (line, position, area, shift, position)
 * @apiName createAdministration
 * @apiGroup Administration
 *
 * @apiUse JWT
 *
 * @apiParam {Object} data Administration data object
 * @apiParam {String} data.value Represents the name of the administration entity
 * @apiParam {String} [data.description] Administration description (only in shift)
 *
 * @apiError (1008) DocumentCantBeCreated The administration can't be created because it already exists

 * @apiUse administrationEntity
 *
 */

/**
 * @api {get} /api/administration Get administrations
 * @apiDescription Generic documentation for a specific api administration endpoint replace administration for a specific administration value (line, position, area, shift, position)
 * @apiName get administrations
 * @apiGroup Administration
 *
 * @apiUse JWT
 * @apiSuccess {Object[]} data Array containing administrations
 * @apiUse administrationEntity
 *
 */

/**
 * @api {delete} /api/administration/:id Remove a administration
 * @apiDescription Generic documentation for a specific api administration endpoint replace administration for a specific administration value (line, position, area, shift, position)
 * @apiName Remove administration
 * @apiGroup Administration
 *
 * @apiUse JWT
 * @apiParam {string} :id administration id
 *
 * @apiError (1007) DocumentCantBeDeleted The administration can't be deleted because it has collaborators associated
 *
 *
 */

/**
 * @api {put} /api/administration/:id Edit administration info
 * @apiDescription Generic documentation for a specific api administration endpoint replace administration for a specific administration value (line, position, area, shift, position)
 * @apiName Edit administration
 * @apiGroup Administration
 *
 * @apiUse JWT
 * @apiParam {string} :id administration id
 *
 * @apiParam {Object} data Administration data object
 * @apiParam {String} data.value Represents the name of the administration entity
 * @apiParam {String} [meeting.description] Administration description (only in shift)
 *
 * @apiError (1006) DocumentCantBeEdited The administration can't be edited because the field has a special protection (ex: T1, T2, T3, T4 shifts)
 *
 */

function AdministrationBase (service) {
  this.service = service
  this.create = this.create.bind(this)
  this.list = this.list.bind(this)
  this.edit = this.edit.bind(this)
  this.remove = this.remove.bind(this)
}

AdministrationBase.prototype.create = async(function (req, res, next) {
  let object = {
    value: req.body.data.value
      .replace(/\s+/g, ' ')
      .trim()
  }
  if (awaitFor(this.service.isRepeated(object))) {
    return next(new AppError(`DocumentCantBeCreated`, 'no se puede crear porque ya existe uno con este nombre', Const.ERROR.DOCUMENT_CANT_BE_CREATED))
  }
  object = awaitFor(this.service.create(object))
  res.json({success: true, data: object})
})

AdministrationBase.prototype.list = async(function (req, res, next) {
  const objects = awaitFor(this.service.list())
  res.json({success: true, data: objects})
})

AdministrationBase.prototype.remove = async(function (req, res, next) {
  if (!awaitFor(this.service.canBeDeleted(req.params.id))) {
    return next(new AppError('DocumentCantBeRemoved', 'No se puede eliminar porque existen colaboradores asociados', Const.ERROR.DOCUMENT_CANT_BE_REMOVED))
  }
  awaitFor(this.service.remove(req.params.id))
  res.json({success: true, message: 'eliminada'})
})

AdministrationBase.prototype.edit = async(function (req, res, next) {
  let object = {
    value: req.body.data.value
      .replace(/\s+/g, ' ')
      .trim()
  }
  object = awaitFor(this.service.edit(req.params.id, object))
  res.json({success: true, data: object})
})

module.exports = AdministrationBase

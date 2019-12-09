const path = require('path')
const express = require('express')
const router = express.Router()
const controller = require(path.join(__dirname, '/../controller')).sanction
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

/**
 * @api {post} /api/sanction Creates a sanction entity
 * @apiName createSanction
 * @apiGroup Sanction
 *
 * @apiUse JWT
 * @apiUse createSanction
 *
 * @apiUse sanctionEntity
 *
 */
router.post('', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_PLANTA, ROLE.RRHH]), validator.sanction.create, controller.create)

/**
 * @api {get} /api/sanction/pdf/:id generates a sanction pdf
 * @apiName get sanction pdf
 * @apiGroup Sanction
 *
 *
 * @apiParam {string} :id suspension id
 *
 * @apiUse JWT
 *
 */
router.get('/pdf/:id', authorize([ROLE.ADMINISTRACION, ROLE.JEFES, ROLE.RRHH]), controller.getPdf)

/**
 * @api {get} /api/sanction/:id  Get sanction details
 * @apiName get sanction details
 * @apiGroup Sanction
 *
 * @apiParam {string} :id sanction id*
 * @apiUse JWT
 *
 * @apiUse sanctionEntity
 *
 */
router.get('/:id', authorize([ROLE.ADMINISTRACION, ROLE.JEFES, ROLE.RRHH]), controller.getById)

/**
 * @api {get} /api/sanction Get all sanctions
 * @apiName get all sanctions
 * @apiGroup Sanction
 *
 * @apiUse JWT
 * @apiUse pagination
 * @apiSuccess {Object[]} sanctions Array containing sanctions
 * @apiUse sanctionEntity
 *
 */
router.get('', authorize([ROLE.ADMINISTRACION, ROLE.JEFES, ROLE.RRHH]), controller.get)

/**
 * @api {get} /api/sanction/to/:id Get sanctions done to a collaborator
 * @apiName get sanctions to
 * @apiGroup Sanction
 *
 * @apiUse JWT
 * @apiParam {string} :id collaborator id
 * @apiUse pagination
 *
 * @apiSuccess {Object[]} sanctions Array containing sanctions
 * @apiUse sanctionEntity
 *
 */
router.get('/to/:id', authorize([ROLE.ADMINISTRACION, ROLE.JEFES, ROLE.SUPERVISORES, ROLE.HIGIENE_SEGURIDAD]), controller.getDoneTo)

/**
 * @api {delete} /api/sanction/:id Remove a sanction
 * @apiName Remove sanction
 * @apiGroup Sanction
 *
 * @apiUse JWT
 * @apiParam {string} :id sanction id
 *
 *
 */
router.delete('/:id', authorize([ROLE.ADMINISTRACION, ROLE.JEFES, ROLE.RRHH]), controller.remove)


/**
 * @api {put} /api/sanction/:id Edit sanction info
 * @apiName Edit sanction
 * @apiGroup Sanction
 *
 * @apiUse JWT
 * @apiParam {string} :id sanction id
 * @apiUse editSanction
 *
 * @apiUse sanctionEntity
 *
 */
router.put('/:id', authorize([ROLE.ADMINISTRACION, ROLE.JEFES]), controller.edit)

module.exports = router

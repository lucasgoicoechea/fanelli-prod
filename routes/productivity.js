const path = require('path')
const express = require('express')
const router = express.Router()
const productivityController = require(path.join(__dirname, '/../controller')).productivity
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

/**
 * @api {post} /api/productivity Creates a productivity entity
 * @apiName createProductivity
 * @apiGroup Productivity
 *
 * @apiUse JWT
 * @apiUse createProductivity
 *
 * @apiUse productivityEntity
 *
 */
router.post('', productivityController.create)

/**
 * @api {get} /api/productivity/pdf/:id generates a productivity pdf
 * @apiName get productivity pdf
 * @apiGroup Productivity
 *
 *
 * @apiParam {string} :id productivity id
 *
 * @apiUse JWT
 *
 */
router.get('/pdf/:id', productivityController.getPdf)

/**
 * @api {get} /api/productivity/:id  Get productivity details
 * @apiName get productivity details
 * @apiGroup Productivity
 *
 * @apiParam {string} :id productivity id
 * @apiUse JWT
 *
 * @apiUse productivityEntity
 *
 */
router.get('/:id', productivityController.getById)

/**
 * @api {get} /api/productivity Get productivitys
 * @apiName get productivitys
 * @apiGroup Productivity
 *
 * @apiUse JWT
 * @apiUse pagination
 * @apiSuccess {Object[]} productivitys Array containing productivitys
 * @apiUse productivityEntity
 *
 */
router.get('', productivityController.listMyProductivitys)
router.get('/manager/all', productivityController.listMyProductivitysManager)

router.get('/manager/sector', productivityController.listMyProductivitysSector)
router.get('/manager/calendar', productivityController.listMyProductivitysCalendar)


/**
 * @api {get} /api/productivity/notpassed Get productivitys
 * @apiName get productivitys
 * @apiGroup Productivity
 *
 * @apiUse JWT
 * @apiUse pagination
 * @apiSuccess {Object[]} productivitys Array containing productivitys
 * @apiUse productivityEntity
 *
 */
// router.get('/notpassed/',productivityController.listMyProductivitysNotPassed)
router.get('/by-me/active', productivityController.getActiveByMe)

/**
 * @api {get} /api/productivity/to/:id Get sanctions done to a collaborator
 * @apiName get sanctions to
 * @apiGroup Productivity
 *
 * @apiUse JWT
 * @apiParam {string} :id collaborator id
 * @apiUse pagination
 *
 * @apiSuccess {Object[]} productivity Array containing productivity
 * @apiUse sanctionEntity
 *
 */
router.get('/to/:id',  productivityController.getDoneTo)

/**
 * @api {get} /api/productivity/to/:id Get sanctions done to a collaborator
 * @apiName get sanctions to
 * @apiGroup Productivity
 *
 * @apiUse JWT
 * @apiParam {string} :id collaborator id
 * @apiUse pagination
 *
 * @apiSuccess {Object[]} productivity Array containing productivity
 * @apiUse sanctionEntity
 *
 */
router.get('/all/:id',  productivityController.getAllDoneTo)
router.get('/pass/:id', productivityController.getAllPassTo)
router.get('/pass-me/:id', productivityController.getAllPassMe)

/**
 * @api {delete} /api/productivity/:id Remove a productivity
 * @apiName Remove productivity
 * @apiGroup Productivity
 *
 * @apiUse JWT
 * @apiParam {string} :id productivity id
 *
 *
 */
router.delete('/:id', productivityController.remove)
router.delete('/:id/all', productivityController.removeAll)


/**
 * @api {put} /api/productivity/:id Edit productivity info
 * @apiName Edit productivity
 * @apiGroup Productivity
 *
 * @apiUse JWT
 * @apiParam {string} :id productivity id
 * @apiUse editProductivity
 *
 * @apiUse productivityEntity
 *
 */
router.put('/:id', productivityController.edit)

module.exports = router

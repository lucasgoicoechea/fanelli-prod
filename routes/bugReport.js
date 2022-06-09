const path = require('path')
const express = require('express')
const router = express.Router()
const bugReportController = require(path.join(__dirname, '/../controller')).bugReport
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

/**
 * @api {post} /api/bugReport Creates a bugReport entity
 * @apiName createMeeting
 * @apiGroup bugReport
 *
 * @apiUse JWT
 * @apiUse createMeeting
 *
 * @apiUse meetingEntity
 *
 */
router.post('', bugReportController.create)
router.get('/fetchActive', bugReportController.fetchActive)
router.get('/fetchNoActive', bugReportController.fetchNoActive)
router.get('/fetchPassFails', bugReportController.fetchPassFails)
router.get('/:id', bugReportController.getId)
router.put('/:id', bugReportController.edit)
router.get('/excel/delivered', bugReportController.getReportDelivered)
router.post('/approval/:id', authorize([ROLE.JEFES, ROLE.RRHH]), bugReportController.approval)





module.exports = router

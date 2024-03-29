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
router.get('/fetchAll', bugReportController.fetchAll)
router.get('/fetchActive', bugReportController.fetchActive)
router.get('/fetchNoActive', bugReportController.fetchNoActive)
router.get('/fetchPassFails', bugReportController.fetchPassFails)
router.get('/getFailsForFather', bugReportController.getFailsForFather)
router.get('/fetchActiveBetadas', bugReportController.fetchActiveBetadas)
router.get('/fetchActiveRelacionadas', bugReportController.fetchActiveRelacionadas)
router.post('/createFails', authorize([ROLE.JEFES, ROLE.RRHH]), bugReportController.createFails)
router.put('/updateFails/:id', authorize([ROLE.JEFES, ROLE.RRHH]), bugReportController.updateFails)
router.delete('/removeFails/:id', authorize([ROLE.JEFES, ROLE.RRHH]), bugReportController.deleteFails)
router.get('/:id', bugReportController.getId)
router.put('/:id', bugReportController.edit)
router.get('/excel/delivered', bugReportController.getReportDelivered)
router.get('/excel/jobsRequest', bugReportController.getReportJobsRequest)
router.get('/excel/all', bugReportController.getReportAll)
router.post('/approval/:id', authorize([ROLE.JEFES, ROLE.RRHH]), bugReportController.approval)





module.exports = router

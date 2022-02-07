const path = require('path')
const express = require('express')
const router = express.Router()
const meetingController = require(path.join(__dirname, '/../controller')).meeting
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

/**
 * @api {post} /api/meeting Creates a meeting entity
 * @apiName createMeeting
 * @apiGroup Meeting
 *
 * @apiUse JWT
 * @apiUse createMeeting
 *
 * @apiUse meetingEntity
 *
 */
router.post('', meetingController.create)

/**
 * @api {get} /api/meeting/pdf/:id generates a meeting pdf
 * @apiName get meeting pdf
 * @apiGroup Meeting
 *
 *
 * @apiParam {string} :id meeting id
 *
 * @apiUse JWT
 *
 */
router.get('/pdf/:id', meetingController.getPdf)

/**
 * @api {get} /api/meeting/:id  Get meeting details
 * @apiName get meeting details
 * @apiGroup Meeting
 *
 * @apiParam {string} :id meeting id
 * @apiUse JWT
 *
 * @apiUse meetingEntity
 *
 */
router.get('/:id', meetingController.getById)

/**
 * @api {get} /api/meeting Get meetings
 * @apiName get meetings
 * @apiGroup Meeting
 *
 * @apiUse JWT
 * @apiUse pagination
 * @apiSuccess {Object[]} meetings Array containing meetings
 * @apiUse meetingEntity
 *
 */
router.get('', meetingController.listMyMeetings)
router.get('/manager/all', meetingController.listMyMeetingsManager)

router.get('/manager/sector', meetingController.listMyMeetingsSector)
router.get('/manager/calendar', meetingController.listMyMeetingsCalendar)


/**
 * @api {get} /api/meeting/notpassed Get meetings
 * @apiName get meetings
 * @apiGroup Meeting
 *
 * @apiUse JWT
 * @apiUse pagination
 * @apiSuccess {Object[]} meetings Array containing meetings
 * @apiUse meetingEntity
 *
 */
// router.get('/notpassed/',meetingController.listMyMeetingsNotPassed)
router.get('/by-me/active', meetingController.getActiveByMe)

/**
 * @api {get} /api/meeting/to/:id Get sanctions done to a collaborator
 * @apiName get sanctions to
 * @apiGroup Meeting
 *
 * @apiUse JWT
 * @apiParam {string} :id collaborator id
 * @apiUse pagination
 *
 * @apiSuccess {Object[]} meeting Array containing meeting
 * @apiUse sanctionEntity
 *
 */
router.get('/to/:id',  meetingController.getDoneTo)

/**
 * @api {get} /api/meeting/to/:id Get sanctions done to a collaborator
 * @apiName get sanctions to
 * @apiGroup Meeting
 *
 * @apiUse JWT
 * @apiParam {string} :id collaborator id
 * @apiUse pagination
 *
 * @apiSuccess {Object[]} meeting Array containing meeting
 * @apiUse sanctionEntity
 *
 */
router.get('/all/:id',  meetingController.getAllDoneTo)
router.get('/pass/:id', meetingController.getAllPassTo)
router.get('/pass-me/:id', meetingController.getAllPassMe)

/**
 * @api {delete} /api/meeting/:id Remove a meeting
 * @apiName Remove meeting
 * @apiGroup Meeting
 *
 * @apiUse JWT
 * @apiParam {string} :id meeting id
 *
 *
 */
router.delete('/:id', meetingController.remove)
router.delete('/:id/all', meetingController.removeAll)


/**
 * @api {put} /api/meeting/:id Edit meeting info
 * @apiName Edit meeting
 * @apiGroup Meeting
 *
 * @apiUse JWT
 * @apiParam {string} :id meeting id
 * @apiUse editMeeting
 *
 * @apiUse meetingEntity
 *
 */
router.put('/:id', meetingController.edit)

module.exports = router

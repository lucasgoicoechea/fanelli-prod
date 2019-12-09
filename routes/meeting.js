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

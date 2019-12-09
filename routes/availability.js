const path = require('path')
const express = require('express')
const router = express.Router()
const controller = require(path.join(__dirname, '/../controller')).availability
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

/**
 * @api {get} /api/availability?from=:form&to=:to
 * @apiName GetAvailability
 * @apiGroup Availability
 *
 * @apiUse JWT
 *
 * @apiParam {Date} from
 * @apiParam {Date} to
 *
 * @apiSuccess {Object[]} availability Array containing availability data
 * @apiSuccess {Object} availability.collaborator User Object
 * @apiSuccess {Date} availability.from Initial date
 * @apiSuccess {Date} availability.to Final Date
 * @apiSuccess {Object} availability.request Object with the request information
 * @apiSuccess {Boolean} availability.isAvailable Flag indicating the availability of the collaborator
 * @apiSuccess {Object} availability.time Object containing time data
 * @apiSuccess {String} availability.time.from initial time ['STAFF_NEWS_EARLY',  'STAFF_NEWS_ABSENT',  'STAFF_NEWS_LATE',  'STAFF_NEWS_ACCIDENT',  'LEAVE_REQUEST_EARLY',  'LEAVE_REQUEST_ABSENT',  'LEAVE_REQUEST_LATE',  'EXTRA_HOURS',  'COMPENSATE']
 * @apiSuccess {Integer} availability.time.to ending time [LEAVE_REQUEST_EARLY, COMPENSATE]
 * @apiSuccess {String} availability.type type of the request ['STAFF_NEWS_EARLY',  'STAFF_NEWS_ABSENT',  'STAFF_NEWS_LATE',  'STAFF_NEWS_ACCIDENT',  'LEAVE_REQUEST_EARLY',  'LEAVE_REQUEST_ABSENT',  'LEAVE_REQUEST_LATE',  'EXTRA_HOURS',  'COMPENSATE',  'MEDICAL_REPORT',  'MEDICAL_ORDER',  'BIRTH_LICENSE',  'DEATH_LICENSE',  'UNION_LICENSE',  'SINDICAL_LICENSE', 'SHIFT_CHANGE']
 */

router.get('/', controller.get)

module.exports = router

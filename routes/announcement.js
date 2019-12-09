const path = require('path')
const express = require('express')
const router = express.Router()
const announcementController = require(path.join(__dirname, '/../controller')).announcement
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

/**
 * @api {post} /api/announcement Creates a occurrence entity
 * @apiName createAnnouncement
 * @apiGroup Announcement
 *
 * @apiUse JWT
 * @apiUse createAnnouncement
 *
 * @apiUse AnnouncementEntity
 *
 */
router.post('/', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_PLANTA]), announcementController.create)

/**
 * @api {get} /api/announcement Get all announcements
 * @apiName listAnnouncements
 * @apiGroup Announcement
 *
 * @apiUse JWT
 *
 * @apiSuccess {Object[]} sanctions Array containing announcements
 * @apiUse AnnouncementEntity
 *
 */
router.get('/', announcementController.list)

/**
 * @api {delete} /api/announcement/:id Removes a occurrence entity
 * @apiName deleteAnnouncement
 * @apiGroup Announcement
 *
 * @apiParam {string} :id announcement id
 *
 * @apiUse JWT
 * @apiResponse {Boolean} success
 *
 */
router.delete('/:id', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_PLANTA]), announcementController.remove)

module.exports = router

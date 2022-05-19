'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
const eventsTimelineController = require(path.join(__dirname, '/../controller')).eventsTimeline
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.get('/', authorize([ROLE.ADMINISTRACION, ROLE.JEFES]), eventsTimelineController.get)
router.post('/archive', validator.eventsTimeline.archive, authorize([ROLE.ADMINISTRACION]), eventsTimelineController.archive)
router.post('/desarchive', validator.eventsTimeline.desarchive, authorize([ROLE.ADMINISTRACION]), eventsTimelineController.desarchive)
router.post('/remove-event', validator.eventsTimeline.removeEvent, authorize([ROLE.ADMINISTRACION]), eventsTimelineController.removeEvent)

module.exports = router

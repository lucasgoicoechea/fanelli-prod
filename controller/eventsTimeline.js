'use strict'
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const EventsTimelineService = require(path.join(__dirname, '../service')).eventsTimeline
const winston = require('winston')
const Const = require('../libs/const')

const controller = {
  get: async(function (req, res) {
    let options = {}
    if (!Const.ROLE.ADMINISTRACION.includes(req.user.user_type)) {
      options.teamOf = req.user.id
    }
    res.send({success: true, eventsTimeline: awaitFor(EventsTimelineService.get(options))})
  }),
  archived: async(function (req, res) {
    let options = {}
    if (!Const.ROLE.ADMINISTRACION.includes(req.user.user_type)) {
      options.teamOf = req.user.id
    }
    res.send({success: true, eventsTimeline: awaitFor(EventsTimelineService.getArchived(options))})
  }),
  archive: async(function (req, res, next) {
    try {
      awaitFor(EventsTimelineService.archive(req.body.eventsTimelineId))
      res.send({success: true, eventsTimeline: awaitFor(EventsTimelineService.get())})
    } catch (error) {
      winston.log('debug', 'error', error)
      next(error)
    }
  }),
  desarchive: async(function (req, res, next) {
    try {
      awaitFor(EventsTimelineService.desarchive(req.body.eventsTimelineId))
      res.send({success: true, eventsTimeline: awaitFor(EventsTimelineService.get())})
    } catch (error) {
      winston.log('debug', 'error', error)
      next(error)
    }
  }),
  removeEvent: async(function (req, res, next) {
    try {
      const eventsTimeline = awaitFor(EventsTimelineService.removeEvent(req.body.eventId, req.body.eventsTimelineId))
      res.send({success: true, eventsTimeline})
    } catch (error) {
      winston.log('debug', 'error', error)
      next(error)
    }
  })

}

module.exports = controller

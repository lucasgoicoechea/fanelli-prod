'use strict'
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const staffNewsService = require(path.join(__dirname, '../service')).staffNews
const eventsTimelineService = require(path.join(__dirname, '../service')).eventsTimeline

const controller = {
  create: async(function (req, res) {
    //console.log('va date'+req.body.news.request_date)
    const news = {
      type: req.body.news.type,
      withNotice: req.body.news.withNotice,
      observation: req.body.news.observation,
      exculpatory: req.body.news.exculpatory,
      time: req.body.news.time,
      informed: req.body.news.informed,
      inPlant: req.body.news.inPlant,
      left: req.body.news.left,
      created_at: req.body.news.request_date != null? req.body.news.request_date : new Date() 
    }
    let newStaffNews = awaitFor(staffNewsService.create(req.body.news.collaborator, req.user.id, news))
    let newEventsTimeline
    if (req.body.news.hasOwnProperty('eventsTimeline')) {
      newEventsTimeline = awaitFor(eventsTimelineService.addEventTo(newStaffNews, 'StaffNews', req.body.news.eventsTimeline))
    } else {
      newEventsTimeline = awaitFor(eventsTimelineService.createTimelineForCollaborator(newStaffNews.collaborator))
      newEventsTimeline = awaitFor(eventsTimelineService.addEventTo(newStaffNews, 'StaffNews', newEventsTimeline._id))
    }
    newEventsTimeline = awaitFor(eventsTimelineService.getById(newEventsTimeline._id))
    newStaffNews = awaitFor(staffNewsService.getById(newStaffNews._id))

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        staffNews: newStaffNews,
        idempotencyKey: idempotencyKey,
        eventsTimeline: newEventsTimeline
      })
    } else {
      res.json({success: true, staffNews: newStaffNews, eventsTimeline: newEventsTimeline})
    }
  }),
  addExculpatory: async(function (req, res, next) {
    try {
      const newStaffNews = awaitFor(staffNewsService.addExculpatory(req.body.news.staffNewId, req.body.news.exculpatory))
      res.send({success: true, staffNews: newStaffNews})
    } catch (error) {
      next(error)
    }
  }),
  withoutExculpatory: async(function (req, res) {
    const newStaffNews = awaitFor(staffNewsService.withoutExculpatory())
    res.send({success: true, staffNews: newStaffNews})
  }),
  getPDF: async(function (req, res, next) {
    try {
      const pdfStream = awaitFor(staffNewsService.getPDFStream(req.params.id))
      pdfStream.pipe(res)
      res.contentType('application/pdf')
      pdfStream.end()
    } catch (error) {
      next(error)
    }
  }),
  /**
   * @apiDefine updateStaffNews
   * @apiParam {Object} event Event Object
   * @apiParam {Date} [event.exculpatory] exculpatory
   * @apiParam {Date} [event.observation] observation
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'success': 'true',
   *       'event': 'staff request'
   *     }
   */
  update: async(function (req, res, next) {
    const news = {
      observation: req.body.event.observation
    }
    try {
      let newStaffNews = awaitFor(staffNewsService.update(req.params.id, news))
      if (req.body.event.exculpatory) {
        newStaffNews = awaitFor(staffNewsService.addExculpatory(req.params.id, req.body.event.exculpatory))
      }
      res.send({success: true, staffNews: newStaffNews})
    } catch (error) {
      next(error)
    }
  }),
  finished: async(function (req, res) {
    res.send({success: true, staffNews: awaitFor(staffNewsService.finished())})
  }),
  getDoneTo: async(function (req, res) {
    res.send({
      success: true,
      staffNews: awaitFor(staffNewsService.getDoneTo(req.params.id, {page: req.page, perPage: req.per_page}))
    })
  }),

  /**
   * @apiDefine updateStaffNewsObservation
   * @apiParam {String} event.id Event id
   * @apiParam {String} event.observation event observation
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
 *       'success': 'true',
 *       'event': 'staff news'
 *     }
   */
  updateObservation: async(function (req, res, next) {
    const news = {
      observation: req.body.event.observation
    }
    try {
      const newStaffNews = awaitFor(staffNewsService.update(req.body.event.id, news))
      res.send({success: true, event: newStaffNews})
    } catch (error) {
      next(error)
    }
  })
}
module.exports = controller

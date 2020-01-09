const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const meetingService = require(path.join(__dirname, '../service')).meeting
const AppError = require(path.join(__dirname, '../libs/error')).AppError
const Const = require(path.join(__dirname, '/../libs/const'))
const controller = {

  /**
   * @apiDefine createMeeting
   * @apiParam {Object} meeting Meeting Object
   * @apiParam {String[]} meeting.collaborators Array containing collaborators ids
   * @apiParam {String} meeting.type Meeting type (INDIVIDUAL | GROUP)
   * @apiParam {String} meeting.description Meeting description
   * @apiParam {String[]} meeting.recommendations Meeting recommendations
   * @apiParam {Date} meeting.date Meeting date
   *
   */
  create: async(function (req, res) {
    let meeting = {
      collaborators: req.body.meeting.collaborators,
      creator: req.user.id,
      type: req.body.meeting.type,
      frecuency: req.body.meeting.frecuency,
      date: req.body.meeting.date,
      dateFrom: req.body.meeting.dateFrom,
      recommendations: req.body.meeting.recommendations,
      weeklys: req.body.meeting.weeklys,
      description: req.body.meeting.description,
      time: req.body.meeting.time
    }
    meeting = awaitFor(meetingService.create(meeting))
    res.json({success: true, meeting})
  }),
  getPdf: async(function (req, res, next) {
    try {
      const pdfStream = awaitFor(meetingService.getPdf(req.params.id))
      pdfStream.pipe(res)
      res.contentType('application/pdf')
      pdfStream.end()
    } catch (error) {
      next(error)
    }
  }),

  getById: async(function (req, res) {
    const meeting = awaitFor(meetingService.getById(req.params.id))
    res.json({success: true, meeting})
  }),
  listMyMeetings: async(function (req, res, next) {
    let meetings
    if (Const.ROLE.JEFES.includes(req.user.user_type) || req.user.user_type === Const.USER_TYPE.RRHH) {
      meetings = awaitFor(meetingService.list({perPage: req.query.per_page, page: req.query.page, teamOf: req.user.id}))
    } else {
      meetings = awaitFor(meetingService.listMyMeetings(req.user.id, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    }
    res.json({success: true, meetings})
  }),
  remove: async(function (req, res, next) {
    if (!Const.ROLE.JEFES.includes(req.user.user_type) && !Const.USER_TYPE.RRHH === req.user.user_type && !meetingService.isCreator(req.user.id, req.params.id)) {
      return next(new AppError('Impossible delete', 'No se puede eliminar', Const.ERROR.DOCUMENT_CANT_BE_REMOVED))
    }
    awaitFor(meetingService.remove(req.params.id))
    res.json({success: true, message: 'Reunion eliminada'})
  }),
  /**
   * @apiDefine editMeeting
   * @apiParam {Object} meeting Meeting Object
   * @apiParam {String} [meeting.description] meeting description
   * @apiParam {String[]} [meeting.collaborators] Array containing collaborators ids
   * @apiParam {String[]} [meeting.recommendations] meeting recommendations
   * @apiParam {String} [meeting.type] meeting type
   * @apiParam {Date} [meeting.date]  Meeting date
   * @apiParam {Date} [meeting.dateFrom]  Meeting dateFrom
   * @apiParam {Time} [meeting.time]  Meeting time
   * @apiParam {String} [meeting.frecuency] meeting frecuency
   * @apiParam {String[]} [meeting.weeklys] meeting weeklys
   */
  edit: async(function (req, res, next) {
    if (!Const.ROLE.JEFES.includes(req.user.user_type) && !Const.USER_TYPE.RRHH === req.user.user_type && !meetingService.isCreator(req.user.id, req.params.id)) {
      return next(new AppError('Impossible to edit', 'No se puede editar', Const.ERROR.DOCUMENT_CANT_BE_EDITED))
    }

    let meeting = {
      collaborators: req.body.meeting.collaborators,
      type: req.body.meeting.type,
      date: req.body.meeting.date,
      recommendations: req.body.meeting.recommendations,
      description: req.body.meeting.description,
      frecuency: req.body.meeting.frecuency,
      dateFrom: req.body.meeting.dateFrom,
      weeklys: req.body.meeting.weeklys,
      time: req.body.meeting.time
    }
    let repeatEdit = req.body.meeting.repeatEdit || false
    meeting = awaitFor(meetingService.edit(req.params.id, meeting,repeatEdit))
    res.json({success: true, meeting})
  })
}
module.exports = controller

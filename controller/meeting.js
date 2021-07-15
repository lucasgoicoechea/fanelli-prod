const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const scheduler = require('node-schedule')
const meetingService = require(path.join(__dirname, '../service')).meeting
const AppError = require(path.join(__dirname, '../libs/error')).AppError
const Const = require(path.join(__dirname, '/../libs/const'))
const controller = {

  /**
   * @apiDefine createMeetingper_page
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
      editors: req.body.meeting.editors,
      creator: req.user.id,
      type: req.body.meeting.type,
      frecuency: req.body.meeting.frecuency,
      dates: req.body.meeting.dates,
      date: req.body.meeting.date,
      dateFrom: req.body.meeting.dateFrom,
      recommendations: req.body.meeting.recommendations,
      weeklys: req.body.meeting.weeklys,
      names: req.body.meeting.names,
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
  getDoneTo: async(function (req, res, next) {
    let meetings
    meetings = awaitFor(meetingService.listMyMeetings(req.query.userId, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    res.json({success: true, meetings})
  }),
  getAllDoneTo: async(function (req, res, next) {
    let meetings
    meetings = awaitFor(meetingService.listMyMeetingsAll(req.query.userId, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    res.json({success: true, meetings})
  }),
  getAllPassTo: async(function (req, res, next) {
    let meetings
    var idus = req.query.userId;
    meetings = awaitFor(meetingService.listMyMeetingsAllPass(idus, {
        perPage: req.query.per_page,
        page: req.query.page,
        date: req.query.date,
        type: req.query.type,
        frecuency: req.query.frecuency
      }))
    res.json({success: true, meetings})
  }),
  getAllPassMe: async(function (req, res, next) {
    let meetings
    var idus = req.user.id;
    meetings = awaitFor(meetingService.listMyMeetingsAllPass(idus, {
        perPage: req.query.per_page,
        page: req.query.page,
        date: req.query.date,
        type: req.query.type,
        frecuency: req.query.frecuency
      }))
    res.json({success: true, meetings})
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
  listMyMeetingsManager: async(function (req, res, next) {
    let meetings
    if (Const.ROLE.JEFES.includes(req.user.user_type) || req.user.user_type === Const.USER_TYPE.RRHH) {
      meetings = awaitFor(meetingService.list({perPage: req.query.per_page, page: req.query.page, teamOf: req.user.id}))
    } else {
      meetings = awaitFor(meetingService.listMyMeetings(req.user.id, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    }
    let resList = []
    meetings.forEach(c => {
      let meetingrepro = awaitFor(meetingService.getByIdOrigin(c._id))
      let frecuentcia = c.type === 'FRECUENCY'?Const.MEETING_FRECUENCY[c.frecuency]:Const.READABLE_MEETING_TYPE[c.type]
      resList.push(
        {
          _id: c._id,
          state: c.state,
          type: c.type,
          frecuency: frecuentcia,
          date: c.date,
          creator: c.creator,
          dateFrom: c.dateFrom,
          description: c.description,
          names: c.names,
          weeklys: c.weeklys,
          recommendations: c.recommendations,
          collaborators: c.collaborators,
          repro: meetingrepro
        }
      )
    })
    res.json({success: true, meetings: resList})
  }),
  getActiveByMe: async(function (req, res) {
    const meetings = awaitFor(meetingService.getActiveByUser(req.user.id, {
      perPage: req.query.per_page,
      page: req.query.page
    }, {collaborator: req.query.collaborator, date: req.query.date, teamOf: req.user.id}))
    res.send({success: true, requests: meetings})
  }),
  listMyMeetingsNotPassed: async(function (req, res, next) {
    let meetings
    meetings = awaitFor(meetingService.listMyMeetings(req.query.userId, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    res.json({success: true, meetings})
  }),
  remove: async(function (req, res, next) {
    if (!Const.ROLE.JEFES.includes(req.user.user_type) && !Const.USER_TYPE.RRHH === req.user.user_type && !meetingService.isCreator(req.user.id, req.params.id)) {
      return next(new AppError('Impossible delete', 'No se puede eliminar', Const.ERROR.DOCUMENT_CANT_BE_REMOVED))
    }
    awaitFor(meetingService.remove(req.params.id))
    res.json({success: true, message: 'Reunion eliminada'})
  }),
  removeAll: async(function (req, res, next) {
    if (!Const.ROLE.JEFES.includes(req.user.user_type) && !Const.USER_TYPE.RRHH === req.user.user_type && !meetingService.isCreator(req.user.id, req.params.id)) {
      return next(new AppError('Impossible delete', 'No se puede eliminar', Const.ERROR.DOCUMENT_CANT_BE_REMOVED))
    }
    awaitFor(meetingService.removeAll(req.params.id))
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
   * @apiParam {String[]} [meeting.names] meeting names
   * 
   */
  edit: async(function (req, res, next) {
    if (!Const.ROLE.JEFES.includes(req.user.user_type) && !Const.USER_TYPE.RRHH === req.user.user_type && !meetingService.isCreator(req.user.id, req.params.id)) {
      return next(new AppError('Impossible to edit', 'No se puede editar', Const.ERROR.DOCUMENT_CANT_BE_EDITED))
    }
    if (req.body.meeting.state == null){
      req.body.meeting.state = 2
    }
    let meeting = {
      collaborators: req.body.meeting.collaborators,
      editors: req.body.meeting.editors,
      type: req.body.meeting.type,
      date: req.body.meeting.date,
      dates: req.body.meeting.dates,
      recommendations: req.body.meeting.recommendations,
      description: req.body.meeting.description,
      frecuency: req.body.meeting.frecuency,
      dateFrom: req.body.meeting.dateFrom,
      weeklys: req.body.meeting.weeklys,
      names: req.body.meeting.names,
      state: req.body.meeting.state,
      time: req.body.meeting.time
    }
    let repeatEdit = req.body.meeting.repeatEdit || false
    meeting = awaitFor(meetingService.edit(req.params.id, meeting,repeatEdit))
    res.json({success: true, meeting})
  })
}

function initExecuted () {
  return async(function () {
    let meetingss = awaitFor(meetingService.listAllPass({}))
    //filtramos las programadas = 0 
    meetingss = meetingss.where('state').equals(0)
    //las pasamos a ejecutadas  = 1
    meetingss.forEach(meeting => {
      meeting.state = 1
      meeting = awaitFor(meetingService.edit(meeting._id, meeting,false))
    })
  })
}


//  Run this scripts at 24:00
scheduler.scheduleJob('0 24 * * *', initExecuted())

module.exports = controller

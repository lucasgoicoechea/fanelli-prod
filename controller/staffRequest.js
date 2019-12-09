'use strict'
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const staffRequestService = require(path.join(__dirname, '../service')).staffRequest
const eventsTimelineService = require(path.join(__dirname, '../service')).eventsTimeline
const s3 = require(path.join(__dirname, '/../libs/s3'))
const AppError = require('../libs/error').AppError
const dateFns = require('date-fns')
const Const = require(path.join(__dirname, '/../libs/const'))

const controller = {
  /**
   * @apiDefine createLicense
   * @apiParam {String} type
   * @apiParam {String} [observation] License observation
   * @apiParam {String} [collaboratorId] Collaborator
   * @apiParam {String} [observation] License observation
   * @apiParam {Date} [incorporationDate] Date where the licence starts
   * @apiParam {Date} [initialDate] Date where the licence starts
   * @apiParam {String} [medicalType] Medical type
   * @apiParam {Date} [medicalAppointment] If it's "Orden Medica" this Date represents when the collaborator is going to go
   * @apiParam {Date} [nextMedicalVisit] If it's "Informe Medico" this Date represents when the collaborator is going to go back to the doctor
   * @apiParam {Date} [dischargeDate] It's the date when the collaborator is coming back if it's "Informe Medico" and is a medicalDischarge
   * @apiParam {Boolean} [medicalDischarge] If it's "Informe Medico" this flag represents when the collaborator is going to go back to work
   * @apiParam {Boolean} [eventsTimelineId] If there is an existing timeline, if there isn't any it'll create one
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
 *       'success': 'true',
 *       'eventsTimeline': {eventsTimeline}
 *       'staffRequest': {staffRequest}
 *     }
   */
  createLicense: async(function (req, res) {
    let license = {
      type: req.body.type,
      observation: req.body.observation,
      incorporationDate: req.body.exculpatory,
      initialDate: req.body.time,
      symptom: req.body.informed,
      medicalType: req.body.location,
      medicalAppointment: req.body.medicalAppointment,
      medicalDischarge: req.body.medicalDischarge
    }

    if (req.body.nextMedicalVisit !== undefined && req.body.nextMedicalVisit !== 'undefined') {
      license.nextMedicalVisit = new Date(new Date(req.body.nextMedicalVisit).getTime() + 1000 * 60 * 60 * 3)
    }

    if (req.body.medicalAppointment !== undefined && req.body.medicalAppointment !== 'undefined') {
      license.medicalAppointment = new Date(new Date(req.body.medicalAppointment).getTime() + 1000 * 60 * 60 * 3)
    }

    if (req.body.dischargeDate !== undefined && req.body.dischargeDate !== 'undefined') {
      license.dischargeDate = new Date(new Date(req.body.dischargeDate).getTime() + 1000 * 60 * 60 * 3)
    }

    if (license.incorporationDate !== undefined && license.incorporationDate !== 'undefined') {
      license.incorporationDate = new Date(new Date(license.incorporationDate).getTime() + 1000 * 60 * 60 * 3)
    }

    if (license.initialDate !== undefined && license.initialDate !== 'undefined') {
      license.initialDate = new Date(new Date(license.initialDate).getTime() + 1000 * 60 * 60 * 3)
    }

    license = awaitFor(staffRequestService.createLicense(req.body.collaboratorId, req.user.id, license))

    // TODO extract to service
    if (req.file) {
      const medicalOrderPath = 'medical_order/' + license._id + '.' + req.file.originalname.split('.').pop()
      awaitFor(s3.save(req.file.buffer, s3.getKey(medicalOrderPath)))
      license.medicalOrderPath = medicalOrderPath
      license = awaitFor(license.save())
    }

    let newEventsTimeline
    if (typeof req.body.eventsTimelineId !== 'undefined') {
      newEventsTimeline = awaitFor(eventsTimelineService.addEventTo(license, 'StaffRequest', req.body.eventsTimelineId))
    } else {
      newEventsTimeline = awaitFor(eventsTimelineService.createTimelineForCollaborator(license.collaborator))
      newEventsTimeline = awaitFor(eventsTimelineService.addEventTo(license, 'StaffRequest', newEventsTimeline._id))
    }

    newEventsTimeline = awaitFor(eventsTimelineService.getById(newEventsTimeline._id))
    license = awaitFor(staffRequestService.getById(license._id))

    res.json({success: true, staffRequest: license, eventsTimeline: newEventsTimeline})
  }),

  /**
   * @apiDefine updateStaffRequestObservation
   * @apiParam {String} event.id Event id
   * @apiParam {String} event.observation event observation
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
 *       'success': 'true',
 *       'event': 'staff request'
 *     }
   */
  updateObservation: async(function (req, res) {
    const event = awaitFor(staffRequestService.updateLicense(req.body.event.id, {observation: req.body.event.observation}))
    res.json({success: true, event: event})
  }),

  /**
   * @apiDefine updateStaffRequest
   * @apiParam {Object} event Event Object
   * @apiParam {Date} [event.nextMedicalVisit] nextMedicalVisit
   * @apiParam {Date} [event.medicalAppointment] medicalAppointment
   * @apiParam {Date} [event.dischargeDate event] dischargeDate
   * @apiParam {Date} [event.nextMedicalVisit] nextMedicalVisit
   * @apiParam {Date} [event.incorporationDate] incorporationDate
   * @apiParam {Date} [event.initialDate] initialDate
   * @apiParam {String} [event.observation] observation
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'success': 'true',
   *       'event': 'staff request'
   *     }
   */
  updateLicense: async(function (req, res) {
    let license = {}

    if (req.body.event.nextMedicalVisit !== undefined && req.body.event.nextMedicalVisit !== 'undefined') {
      license.nextMedicalVisit = new Date(new Date(req.body.event.nextMedicalVisit).getTime() + 1000 * 60 * 60 * 3)
    }

    if (req.body.event.medicalAppointment !== undefined && req.body.event.medicalAppointment !== 'undefined') {
      license.medicalAppointment = new Date(new Date(req.body.event.medicalAppointment).getTime() + 1000 * 60 * 60 * 3)
    }

    if (req.body.event.dischargeDate !== undefined && req.body.event.dischargeDate !== 'undefined') {
      license.dischargeDate = new Date(new Date(req.body.event.dischargeDate).getTime() + 1000 * 60 * 60 * 3)
    }
    if (req.body.event.incorporationDate !== undefined && req.body.event.incorporationDate !== 'undefined') {
      license.incorporationDate = new Date(new Date(req.body.event.incorporationDate).getTime() + 1000 * 60 * 60 * 3)
    }
    if (req.body.event.initialDate !== undefined && req.body.event.initialDate !== 'undefined') {
      license.initialDate = new Date(new Date(req.body.event.initialDate).getTime() + 1000 * 60 * 60 * 3)
    }
    license.observation = req.body.event.observation
    license = awaitFor(staffRequestService.updateLicense(req.params.id, license))
    res.json({success: true, event: license})
  }),

  createExtraHours: async(function (req, res, next) {
    const request = {
      days: req.body.extraHoursRequest.days,
      time: req.body.extraHoursRequest.time,
      reason: req.body.extraHoursRequest.reason
    }
    const extraHoursRequest = awaitFor(staffRequestService.createExtraHours(req.body.extraHoursRequest.collaborators, req.user.id, request))
    staffRequestService.sendCreateNotification(extraHoursRequest)
    res.json({success: true, extraHoursRequest: extraHoursRequest})
  }),

  createLeave: async(function (req, res, next) {
    const request = {
      type: req.body.leaveRequest.type,
      days: req.body.leaveRequest.days,
      reason: req.body.leaveRequest.reason,
      time: req.body.leaveRequest.time,
      returns: req.body.leaveRequest.returns,
      returnsTime: req.body.leaveRequest.returnsTime,
      daysToCompensate: req.body.leaveRequest.daysToCompensate

    }
    const leaveRequest = awaitFor(staffRequestService.createLeave(req.body.leaveRequest.collaborators, req.user.id, request))
    staffRequestService.sendCreateNotification(leaveRequest)
    res.json({success: true, leaveRequest: leaveRequest})
  }),

  createShiftChange: async(function (req, res) {
    const request = {
      days: req.body.shiftRequest.days,
      toShift: req.body.shiftRequest.toShift,
      temporary: req.body.shiftRequest.temporary,
      reason: req.body.shiftRequest.reason,
      byFabric: req.body.shiftRequest.byFabric
    }
    const shiftRequest = awaitFor(staffRequestService.createShiftChange(req.body.shiftRequest.collaborators, req.user.id, request))
    staffRequestService.sendCreateNotification(shiftRequest)
    res.json({success: true, shiftRequest: shiftRequest})
  }),

  leaveApproval: async(function (req, res, next) {
    let leave = awaitFor(staffRequestService.getLeaveById(req.params.id))
    if (!staffRequestService.canChangeApproval(leave)) {
      return next(new AppError('Impossible to change approval', 'No se puede cambiar la aprobacion', Const.ERROR.STAFF_REQUEST_ALREADY_APPROVED))
    }
    leave = awaitFor(staffRequestService.setApproval(leave, req.body.approved, req.user.id, req.body.leave))
    leave = awaitFor(staffRequestService.getLeaveById(leave._id))
    staffRequestService.sendApprovalNotification(leave)
    return res.json({success: true, leave: leave})
  }),
  extraHoursApproval: async(function (req, res, next) {
    let extraHours = awaitFor(staffRequestService.getExtraHoursById(req.params.id))

    if (!staffRequestService.canChangeApproval(extraHours)) {
      return next(new AppError('Impossible to change approval', 'No se puede cambiar la aprobacion', Const.ERROR.STAFF_REQUEST_ALREADY_APPROVED))
    }
    extraHours = awaitFor(staffRequestService.setApproval(extraHours, req.body.approved, req.user.id))
    extraHours = awaitFor(staffRequestService.getExtraHoursById(extraHours._id))
    staffRequestService.sendApprovalNotification(extraHours)
    return res.json({success: true, extraHours: extraHours})
  }),
  shiftChangeApproval: async(function (req, res, next) {
    let shiftChange = awaitFor(staffRequestService.getShiftChangeById(req.params.id))
    if (!staffRequestService.canChangeApproval(shiftChange)) {
      return next(new AppError('Impossible to change approval', 'No se puede cambiar la aprobacion', Const.ERROR.STAFF_REQUEST_ALREADY_APPROVED))
    }
    shiftChange = awaitFor(staffRequestService.setApproval(shiftChange, req.body.approved, req.user.id))
    shiftChange = awaitFor(staffRequestService.getShiftChangeById(shiftChange._id))
    staffRequestService.sendApprovalNotification(shiftChange)
    return res.json({success: true, shiftChange: shiftChange})
  }),

  get: async(function (req, res, next) {
    const staffRequests = awaitFor(staffRequestService.get(req.query))
    res.json({success: true, requests: staffRequests})
  }),

  getResolved: async(function (req, res, next) {
    const requests = awaitFor(staffRequestService.getResolved({page: req.query.page, perPage: req.query.per_page, teamOf: req.user.id}))
    res.json({success: true, requests: requests})
  }),

  getPending: async(function (req, res, next) {
    const requests = awaitFor(staffRequestService.getPending(({page: req.query.page, perPage: req.query.per_page, teamOf: req.user.id})))
    res.json({success: true, requests: requests})
  }),
  getDoneTo: async(function (req, res, next) {
    const requests = awaitFor(staffRequestService.getArchived({collaborator: req.params.id}))
    res.json({success: true, requests: requests})
  }),

  getLeavePdf: async(function (req, res, next) {
    try {
      let leave = awaitFor(staffRequestService.getLeaveById(req.params.id))
      const pdfStream = awaitFor(staffRequestService.generatePdfManyPages(leave))
      pdfStream.pipe(res)
      res.contentType('application/pdf')
      pdfStream.end()
    } catch (error) {
      next(error)
    }
  }),
  getExtraHoursPdf: async(function (req, res, next) {
    try {
      let extraHours = awaitFor(staffRequestService.getExtraHoursById(req.params.id))
      const pdfStream = awaitFor(staffRequestService.generateSinglePage(extraHours))
      pdfStream.pipe(res)
      res.contentType('application/pdf')
      pdfStream.end()
    } catch (error) {
      next(error)
    }
  }),
  getShiftChangePdf: async(function (req, res, next) {
    try {
      let shiftChange = awaitFor(staffRequestService.getShiftChangeById(req.params.id))
      const pdfStream = awaitFor(staffRequestService.generatePdfManyPages(shiftChange))
      pdfStream.pipe(res)
      res.contentType('application/pdf')
      pdfStream.end()
    } catch (error) {
      next(error)
    }
  }),

  archiveLeave: async(function (req, res, next) {
    let leave = awaitFor(staffRequestService.getLeaveById(req.params.id))
    if (!awaitFor(staffRequestService.canBeArchived(leave))) {
      return next(new AppError('Impossible to archive', 'No se puede archivar', Const.ERROR.STAFF_REQUEST_CANT_BE_ARCHIVED))
    }
    leave = awaitFor(staffRequestService.archive(leave))
    return res.json({success: true, request: leave})
  }),
  archiveExtraHours: async(function (req, res, next) {
    let extraHours = awaitFor(staffRequestService.getExtraHoursById(req.params.id))
    if (!awaitFor(staffRequestService.canBeArchived(extraHours))) {
      return next(new AppError('Impossible to archive', 'No se puede archivar', Const.ERROR.STAFF_REQUEST_CANT_BE_ARCHIVED))
    }
    extraHours = awaitFor(staffRequestService.archive(extraHours))
    return res.json({success: true, request: extraHours})
  }),
  archiveShiftChange: async(function (req, res, next) {
    let shiftChange = awaitFor(staffRequestService.getShiftChangeById(req.params.id))
    if (!awaitFor(staffRequestService.canBeArchived(shiftChange))) {
      return next(new AppError('Impossible to archive', 'No se puede archivar', Const.ERROR.STAFF_REQUEST_CANT_BE_ARCHIVED))
    }
    shiftChange = awaitFor(staffRequestService.archive(shiftChange))
    awaitFor(staffRequestService.changeShift(shiftChange))
    return res.json({success: true, request: shiftChange})
  }),

  cancelLeave: async(function (req, res, next) {
    let leave = awaitFor(staffRequestService.getLeaveById(req.params.id))
    if (!awaitFor(staffRequestService.canBeCanceled(leave))) {
      return next(new AppError('Impossible to cancel', 'No se puede cancelar', Const.ERROR.STAFF_REQUEST_CANT_BE_CANCELED))
    }
    leave = awaitFor(staffRequestService.cancel(leave, req.user.id))
    return res.json({success: true, request: leave})
  }),
  cancelExtraHours: async(function (req, res, next) {
    let extraHours = awaitFor(staffRequestService.getExtraHoursById(req.params.id))
    if (!awaitFor(staffRequestService.canBeCanceled(extraHours))) {
      return next(new AppError('Impossible to cancel', 'No se puede cancelar', Const.ERROR.STAFF_REQUEST_CANT_BE_CANCELED))
    }
    extraHours = awaitFor(staffRequestService.cancel(extraHours, req.user.id))
    return res.json({success: true, request: extraHours})
  }),
  cancelShiftChange: async(function (req, res, next) {
    let shiftChange = awaitFor(staffRequestService.getShiftChangeById(req.params.id))
    if (!awaitFor(staffRequestService.canBeCanceled(shiftChange))) {
      return next(new AppError('Impossible to cancel', 'No se puede cancelar', Const.ERROR.STAFF_REQUEST_CANT_BE_CANCELED))
    }
    shiftChange = awaitFor(staffRequestService.cancel(shiftChange, req.user.id))
    return res.json({success: true, request: shiftChange})
  }),

  getNotArchived: async(function (req, res) {
    const requests = awaitFor(staffRequestService.getNotArchived(req.query))
    res.json({success: true, requests: requests})
  }),

  getLeaveById: async(function (req, res) {
    let leave = awaitFor(staffRequestService.getLeaveById(req.params.id))
    res.json({success: true, request: {type: Const.STAFF_REQUEST_TYPE.LEAVE, data: leave}})
  }),
  getExtraHoursById: async(function (req, res) {
    let extraHours = awaitFor(staffRequestService.getExtraHoursById(req.params.id))
    res.json({success: true, request: {type: Const.STAFF_REQUEST_TYPE.EXTRA_HOURS, data: extraHours}})
  }),
  getShiftChangeById: async(function (req, res) {
    let shiftChange = awaitFor(staffRequestService.getShiftChangeById(req.params.id))
    res.json({success: true, request: {type: Const.STAFF_REQUEST_TYPE.SHIFT_CHANGE, data: shiftChange}})
  })
}
module.exports = controller

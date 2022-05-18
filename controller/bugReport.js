const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const scheduler = require('node-schedule')
const bugReportService = require(path.join(__dirname, '../service')).bugReport
const AppError = require(path.join(__dirname, '../libs/error')).AppError
const Const = require(path.join(__dirname, '/../libs/const'))
const controller = {

  /**
   * @apiDefine createMeetingper_page
   * @apiParam {Object} bugReport bugReport Object
   * @apiParam {String[]} bugReport.collaborators Array containing collaborators ids
   * @apiParam {String} bugReport.type bugReport type (INDIVIDUAL | GROUP)
   * @apiParam {String} bugReport.description bugReport description
   * @apiParam {String[]} bugReport.recommendations bugReport recommendations
   * @apiParam {Date} bugReport.date bugReport date
   *
   */
  create: async(function (req, res) {
    let bugReport = {
      line: req.body.bugReport.line,
      sector: req.body.bugReport.sector,
      sub_sector: req.body.bugReport.sub_sector,
      equipo: req.body.bugReport.equipo,
      group: req.body.bugReport.group,
      part: req.body.bugReport.part,
      estado: req.body.bugReport.estado,
      prioridad: req.body.bugReport.prioridad,
      inconveniente: req.body.bugReport.inconveniente,
      detectado: req.body.bugReport.detectado,
      resuelto: req.body.bugReport.resuelto,
      resume: req.body.bugReport.resume,
      resolucion: req.body.bugReport.resolucion
    }
    bugReport = awaitFor(bugReportService.create(bugReport))
    res.json({success: true, bugReport})
  }),

  getId: async(function (req, res, next) {
      let bugReport = awaitFor(bugReportService.findOne(req.params.id))
      res.json({success: true, bugReport: bugReport})
  }),

  fetchActive: async(function (req, res, next) {
    let bugReports
    bugReports = awaitFor(bugReportService.listAllPass({
        perPage: req.query.per_page,
        page: req.query.page,
        date: req.query.date,
        type: req.query.type,
        frecuency: req.query.frecuency
      }))
    res.json({success: true, bugReports})
  }),

  fetchPassFails: async(function (req, res, next) {
    let bugReports
    bugReports = awaitFor(bugReportService.listPassFails({
        perPage: req.query.per_page,
        page: req.query.page,
        date: req.query.date,
        type: req.query.type,
        frecuency: req.query.frecuency
      }))
    res.json({success: true, bugReports})
  }),
  getFailsForFather: async(function (req, res, next) {
    let bugReports
    bugReports = awaitFor(bugReportService.getFailsForFather({
        id: req.father
      }))
    res.json({success: true, bugReports})
  }),
  

  fetchNoActive: async(function (req, res, next) {
    let bugReports
    bugReports = awaitFor(bugReportService.listNoActive({
        perPage: req.query.per_page,
        page: req.query.page,
        date: req.query.date,
        type: req.query.type,
        frecuency: req.query.frecuency
      }))
    res.json({success: true, bugReports})
  }),

  edit: async(function (req, res, next) {
    /*if (!Const.ROLE.JEFES.includes(req.user.user_type) && !Const.USER_TYPE.RRHH === req.user.user_type && !bugReportService.isCreator(req.user.id, req.params.id)) {
      return next(new AppError('Impossible to edit', 'No se puede editar', Const.ERROR.DOCUMENT_CANT_BE_EDITED))
    }
    if (req.body.bugReport.state == null){
      req.body.bugReport.state = 2
    }*/
    let bugReport = awaitFor(bugReportService.findOne(req.params.id))
      bugReport.estado = req.body.bugReport.estado
      bugReport.resuelto = req.body.bugReport.resuelto
      bugReport.resolucion = req.body.bugReport.resolucion
    // let repeatEdit = req.body.bugReport.repeatEdit || false
    bugReport = awaitFor(bugReportService.edit(bugReport, req.params.id))
    res.json({success: true, bugReport})
  })
}
  

module.exports = controller

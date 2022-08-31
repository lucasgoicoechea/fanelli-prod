const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const scheduler = require('node-schedule')
const bugReportService = require(path.join(__dirname, '../service')).bugReport
const AppError = require(path.join(__dirname, '../libs/error')).AppError
const Const = require(path.join(__dirname, '/../libs/const'))
const excel = require(path.join(__dirname, '../libs/excel'))
const ObjectId = require('mongoose').Types.ObjectId
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
      resolucion: req.body.bugReport.resolucion,
      betadas: null
    }
    bugReport = awaitFor(bugReportService.create(bugReport))
    res.json({success: true, bugReport})
  }),

  createFails: async(function (req, res) {
    let failed = {
      text: req.body.data.value,
      father_id: req.body.data.father_id
    }
    failed = awaitFor(bugReportService.createFailed(failed))
    res.json({success: true, failed})
  }),

  updateFails: async(function (req, res) {
    let failed = awaitFor(bugReportService.findOneFail(req.params.id))
    failed.text = req.body.text
    failed = awaitFor(bugReportService.updateFailed(failed))
    res.json({success: true, failed})
  }),

  deleteFails: async(function (req, res) {
    let failed = awaitFor(bugReportService.findOneFail(req.params.id))
    failed.remove()
    res.json({success: true, failed})
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

  fetchActiveRelacionadas: async(function (req, res, next) {
    let bugReports
    bugReports = awaitFor(bugReportService.listAllPassRelated({
        perPage: req.query.per_page,
        page: req.query.page,
        line: req.query.line,
        sector: req.query.sector,
        sub_sector: req.query.sub_sector,
        equipo: req.query.equipo
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
    let faileds
    let ffid = req.query.father
    if (req.query.father=='null' || req.query.father=='' || req.query.father=='undefined')
    {
      ffid = null
    }
    faileds = awaitFor(bugReportService.getFailsForFather({
        father_id: ffid
      }))
    res.json({success: true, faileds})
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
  
  fetchActiveBetadas: async(function (req, res, next) {
    let bugReports
    bugReports = awaitFor(bugReportService.listBetadas({
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
      bugReport.resume = req.body.bugReport.resume
    // let repeatEdit = req.body.bugReport.repeatEdit || false
    bugReport = awaitFor(bugReportService.edit(bugReport, req.params.id))
    res.json({success: true, bugReport})
  }),

  getReportDelivered: async(function (req, res, next) {
    try {
      /*let date
      if (req.params.day) {
        date = new Date(new Date(req.params.day).getTime() + 1000 * 60 * 60 * 3)
      } else {
        date = new Date(new Date().toDateString())
      }*/
      const excel = awaitFor(generateReportForDelivered())
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx')
      console.log(excel)
      awaitFor(excel.xlsx.write(res))
      res.end()
    } catch (error) {
      console.log(error)
      next(error)
    }
  }),

  approval: async(function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
      next(Boom.notFound('ID inválido'))
      return
    }
    let bugReport = awaitFor(bugReportService.findOne(req.params.id))
    if (bugReport === null) {
      next(Boom.notFound('Solicitud inexistente'))
      return
    }
    bugReport = setApproval(bugReport, req.body.approved, req.user.id)
    let message = req.body.approved ? 'Solicitud aprobada' : 'Solicitud rechazada'
    res.json({success: true, message: message, request: bugReport})
  }),

}



const generateReportForDelivered = async(function () {
  let bugReports
  bugReports = awaitFor(bugReportService.listNoActive({ }))
 
  /*const data = awaitFor(Bluebird.all([totalesMaterialExtrusora,totalesMaterialApiladora ,totalesMaterialDesapiladora])
      .reduce(
        (arr, events) => arr.concat(events),
        []
      ))*/

  //totales = _.orderBy(totales,['sector','created_at'],['desc','desc']);
  return excel.generateExcelBugReportDelivered(bugReports)
})

function setApproval (bugReport, approval) {
  bugReport.set({betadas: approval})
  // bugReport.set({approved_by: approver})
  bugReport = awaitFor(bugReport.save())
  return bugReport
}

module.exports = controller

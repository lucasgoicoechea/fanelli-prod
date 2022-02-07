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
      prioridad: req.body.bugReport.prioridad,
      inconveniente: req.body.bugReport.inconveniente,
      resume: req.body.bugReport.resume
    }
    bugReport = awaitFor(bugReportService.create(bugReport))
    res.json({success: true, bugReport})
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
  })
}
  

module.exports = controller

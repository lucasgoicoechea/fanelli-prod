const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const dateFns = require('date-fns')
const reportService = require(path.join(__dirname, '../service')).report
const controller = {
  getReportForCollaborator: async(function (req, res, next) {
    try {
      const excel = awaitFor(reportService.generateReportFor(req.params.id))
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx')
      awaitFor(excel.xlsx.write(res))
      res.end()
    } catch (error) {
      next(error)
    }
  }),
  getReportForDay: async(function (req, res, next) {
    try {
      const excel = awaitFor(reportService.generateReportForDay(req.params.day))
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx')
      awaitFor(excel.xlsx.write(res))
      res.end()
    } catch (error) {
      next(error)
    }
  }),
  getReportForAll: async(function (req, res, next) {
    try {
      const excel = awaitFor(reportService.generateReportForAll(dateFns.subMonths(new Date(), 9)))
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx')
      awaitFor(excel.xlsx.write(res))
      res.end()
    } catch (error) {
      next(error)
    }
  })
}
module.exports = controller

const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const dashboardService = require(path.join(__dirname, '../service')).dashboard
const controller = {
  getBirthdays: async(function (req, res, next) {
    try {
      const date = req.query.date || Date.now()
      const birthdays = awaitFor(dashboardService.getBirthdaysFor(date))
      res.send({success: true, birthdays: birthdays})
    } catch (error) {
      next(error)
    }
  })
}
module.exports = controller

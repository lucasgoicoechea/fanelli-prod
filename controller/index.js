const path = require('path')

/* This file has all the controllers in the exported properties
 * to create a new controller you need to create the file and add it here
 * Boilerplate of a controller :
 *
 * const async = require('asyncawait/async')
 * const awaitFor = require('asyncawait/await')
 * const path = require('path')
 * const service = require(path.join(__dirname, '../service')).service
 * const controller = {
 *  method_name: async(function (req, res, next){
 *    try {
 *      val1 = req.body.val1
 *      val2 = req.body.val2
 *      awaitFor(service.method(val1, val2))
 *      ...
 *      res.send({success: true, data: data})
 *    } catch (error) {
 *      next(error)
 *    }
 *  })
 * }
 * module.exports = controller
 */

module.exports = {
  authentication: require(path.join(__dirname, '/authentication')),
  catalog: require(path.join(__dirname, '/catalog')),
  securityElement: require(path.join(__dirname, '/securityElement')),
  user: require(path.join(__dirname, '/user')),
  checklist: require(path.join(__dirname, '/checklist')),
  checklistLTres: require(path.join(__dirname, '/checklistLTres')),
  staffNews: require(path.join(__dirname, '/staffNews')),
  staffRequest: require(path.join(__dirname, '/staffRequest')),
  eventsTimeline: require(path.join(__dirname, '/eventsTimeline')),
  dashboard: require(path.join(__dirname, '/dashboard')),
  shift: require(path.join(__dirname, '/shift')),
  availability: require(path.join(__dirname, '/availability')),
  sanction: require(path.join(__dirname, '/sanction')),
  report: require(path.join(__dirname, '/report')),
  announcement: require(path.join(__dirname, '/announcement')),
  sector: require(path.join(__dirname, '/sector')),
  meeting: require(path.join(__dirname, '/meeting')),
  position: require(path.join(__dirname, '/position')),
  area: require(path.join(__dirname, '/area')),
  line: require(path.join(__dirname, '/line')),
  occurrence: require(path.join(__dirname, '/occurrence')),
  supervisionPart: require(path.join(__dirname, '/supervisionPart')),
  supervisionPartLTres: require(path.join(__dirname, '/supervisionPartLTres')),
  bugReport: require(path.join(__dirname, '/bugReport'))
}

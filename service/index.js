const path = require('path')
/* This file has all the services in the exported  properties
 * to create a new service you need to create the file and add it here
 * Boilerplate of a service:
 *
 * const async = require('asyncawait/async')
 * const awaitFor = require('asyncawait/await')
 * const path = require('path')
 * const model = require(path.join(__dirname, '../model')).model
 * const notification = require(path.join(__dirname, '/../libs/notification'))
 * const service = {
 *  method_name: async(function (val1, val2){
 *    model.method(val1)
 *    model.method2(val2)
 *    notification.send(notification)
 *  })
 * }
 * module.exports = service
 */

module.exports = {
  team: require(path.join(__dirname, '/team')),
  staffNews: require(path.join(__dirname, '/staffNews')),
  staffRequest: require(path.join(__dirname, '/staffRequest')),
  eventsTimeline: require(path.join(__dirname, '/eventsTimeline')),
  dashboard: require(path.join(__dirname, '/dashboard')),
  securityElement: require(path.join(__dirname, '/securityElement')),
  shift: require(path.join(__dirname, '/shift')),
  availability: require(path.join(__dirname, '/availability')),
  sanction: require(path.join(__dirname, '/sanction')),
  occurrence: require(path.join(__dirname, '/occurrence')),
  announcement: require(path.join(__dirname, '/announcement')),
  meeting: require(path.join(__dirname, '/meeting')),
  position: require(path.join(__dirname, '/position')),
  user: require(path.join(__dirname, '/user')),
  area: require(path.join(__dirname, '/area')),
  line: require(path.join(__dirname, '/line')),
  sector: require(path.join(__dirname, '/sector')),
  report: require(path.join(__dirname, '/report'))
}

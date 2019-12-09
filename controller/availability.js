const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const availabilityService = require(path.join(__dirname, '../service')).availability

const controller = {
  get: async(function (req, res, next) {
    try {
      const availability = awaitFor(availabilityService.get({from: req.query.from, to: req.query.to}))
      res.send({success: true, availability: availability})
    } catch (error) {
      next(error)
    }
  })
}
module.exports = controller

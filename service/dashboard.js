const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const UserModel = require(path.join(__dirname, '../model')).user

const service = {
  getBirthdaysFor: async(function (date) {
    const dateOnly = new Date(date.toDateString())
    const beginning = new Date(dateOnly.getTime())
    const ending = new Date(beginning.getTime() + (24 * 60 * 60 * 1000))
    return awaitFor(UserModel.find({
      'birthdate': {
        $gte: beginning,
        $lt: ending
      }
    }, {name: 1, lastname: 1, birthdate: 1}))
  })
}
module.exports = service

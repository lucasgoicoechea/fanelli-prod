const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const dateFns = require('date-fns')
const AvailabilityModel = require(path.join(__dirname, '../model')).availability
const availabilityEmitter = require(path.join(__dirname, '../libs/availabilityEmitter'))
const Const = require(path.join(__dirname, '/../libs/const'))

const service = {

  get: async(function ({from = new Date(), to = new Date()} = {}) {
    let realFrom = dateFns.endOfDay(dateFns.subDays(from, 1))
    let realTo = dateFns.startOfDay(dateFns.addDays(to, 1))
    let availabilities = awaitFor(AvailabilityModel.find({})
      .populate({
        path: 'collaborator',
        populate: {
          path: 'shift'
        },
        select: 'name lastname legajo s3Key'
      })
      .populate({
        path: 'request',
        populate: {
          path: 'toShift'
        }
      }))
    // Filter shift change, we only show it once in the widget
    availabilities = availabilities.filter(a => a.type !== Const.AVAILABILITY_TYPE.SHIFT_CHANGE || !a.isAvailable)
    /**
     * Used to filter from 22  from the day before to 6 from the day after.
     * Not used because i can't know if the request is after 6 if request is without time.
     if (a.time !== undefined && a.time.from !== undefined) {
        let [hours, minutes] = a.time.from.split(':')
        a.realFrom = dateFns.setHours(a.from, hours)
        a.realFrom = dateFns.setMinutes(a.realFrom, minutes)

        if (a.time.to !== undefined) {
          let [hours, minutes] = a.time.to.split(':')
          a.realTo = dateFns.setHours(a.to, hours)
          a.realTo = dateFns.setMinutes(a.realTo, minutes)
        } else {
          a.realTo = a.realFrom
        }
      } else {
        a.realFrom = a.from
        a.realTo = a.to
      }
     })

     realFrom = dateFns.setHours(realFrom, 22)
     realTo = dateFns.setHours(realTo, 6)

     */

    // Filter availabilities in date range
    return availabilities.filter(a => dateFns.areRangesOverlapping(a.from, a.to, realFrom, realTo))
  }),

  changeOfAvailability: async(function (document) {
    document.generateAvailability(this)
  }),

  addUnavailability: async(function (document) {
    document.isAvailable = false
    awaitFor(AvailabilityModel.create(document))
  }),

  addAvailability: async(function (document) {
    document.isAvailable = true
    awaitFor(AvailabilityModel.create(document))
  }),

  updateOfAvailability: async(function (document) {
    awaitFor(document.updateAvailability(this))
  }),

  cancelOfAvailability: async(function (document) {
    awaitFor(AvailabilityModel.remove({request: document._id}))
  }),

  replaceAvailability: async(function (document) {
    awaitFor(AvailabilityModel.update({request: document.request._id}, {$set: document}, {multi: true}))
  })
}

availabilityEmitter.getInstance().subscribe(service)

module.exports = service

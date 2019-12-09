const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const dateFns = require('date-fns')
const shiftModel = require(path.join(__dirname, '../model')).shift
const Service = require(path.join(__dirname, '/service'))
const userService = require(path.join(__dirname, '/user'))
const Const = require(path.join(__dirname, '../libs/const'))
const protectedShifts = Object.keys(Const.PROTECTED_SHIFT).map(t => Const.PROTECTED_SHIFT[t])

const ShiftService = function (db) {
  Service.call(this, db)
}
ShiftService.prototype = Object.create(Service.prototype)
ShiftService.prototype.constructor = ShiftService

ShiftService.prototype.isRepeated = async(function (shift) {
  return awaitFor(this.db.find(shift)).length > 0
})

ShiftService.prototype.canBeDeleted = async(function (id) {
  const shift = awaitFor(this.get(id))
  return !protectedShifts.includes(shift.value) && !awaitFor(userService.isThereAnyWith({shift: id}))
})

ShiftService.prototype.canBeEdited = async(function (id) {
  const shift = awaitFor(this.get(id))
  return !protectedShifts.includes(shift.value)
})

ShiftService.prototype.getRuleForDay = async(function (shift, day) {
  // Count the total of days in a cycle of a set of shift rules.
  const daysInShiftCycle = shift.rules.reduce((sum, r) => sum + r.days)
  // Days between the initial date form the shift and the day
  const differenceInDays = dateFns.differenceInDays(shift.from, day)
  // Mod between the difference in days and the days in a cycle to discard cycles finished
  const mod = differenceInDays % daysInShiftCycle
  let sum = 0
  // Find the rule for the day passed as parameter
  return shift.rules.find(r => {
    sum += r.days
    return sum === mod
  })
})

ShiftService.prototype.getBeginningOfShiftForDay = async(function (shift, day) {
  const ruleOfToday = this.getRuleForDay(shift, day)
  return dateFns.setHours(dateFns.startOfDay(day), ruleOfToday.in)
})

ShiftService.prototype.getEndingOfShiftForDay = async(function (shift, day) {
  const ruleOfToday = this.getRuleForDay(shift, day)
  const beginningOfShift = this.getBeginningOfShiftForDay(shift, day)
  return dateFns.addMilliseconds(beginningOfShift, ruleOfToday.hours)
})

module.exports = new ShiftService(shiftModel)

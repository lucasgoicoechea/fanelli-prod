'use strict'
const path = require('path')
const ChecklistModel = require(path.join(__dirname, '/../model')).checklistLTres
const CheckModel = require(path.join(__dirname, '/../model')).check
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const config = require(path.join(__dirname, '/../config'))
const _ = require('lodash')
const shift = require(path.join(__dirname, '/../libs/shift'))
const scheduler = require('node-schedule')
const Boom = require('boom')
const AppError = require(path.join(__dirname, '/../libs/error')).AppError
const winston = require('winston')
const ObjectId = require('mongoose').Types.ObjectId
const notification = require(path.join(__dirname, '/../libs/notification'))
const constant = require(path.join(__dirname, '../libs/const'))
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const USER_TYPE = constant.USER_TYPE
const NOTIFICATIONS_TYPE = constant.NOTIFICATION_TYPE
const SHIFT_DURATION_MS = constant.SHIFT_DURATION_MS
const ONE_HOUR_MS = constant.ONE_HOUR_MS
const SECTORS = Object.getOwnPropertyNames(constant.CHECKS_SECTOR).map(s => constant.CHECKS_SECTOR[s])

/**
 * WARNING this was done by a junior and inexperienced developer (only 4 months) so take care if you want to re used this code
 * if you have more experience i recommend you to not use this code in case you have to do some similar functionality but you can use the idea behind the code
 *
 */
const controller = {
  add: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.check.id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let now = new Date()
    let check = awaitFor(CheckModel.findById(req.body.check.id))
    if (check === null) return next(Boom.notFound('Check inexistente'))
    let sector = check.sector
    let checklist = awaitFor(ChecklistModel
      .findById(req.body.check.checklist_id)
      .populate({path: 'checks.check', model: 'Checks'})
    )
    if (checklist === null) return next(Boom.notFound('Checklist inexistente'))
    check = _.find(checklist.checks, c => c.check._id.toString() === req.body.check.id.toString())
    let value = {
      supervisor: req.user.id,
      value: req.body.check.value,
      date: now,
      extra: req.body.check.extra ? req.body.check.extra : undefined
    }

    //  if it's the first value of the checklist
    if (checklist.supervisor === undefined) {
      checklist.set({supervisor: req.user.id})
      winston.log('debug', 'Primer valor de la checklist', checklist.sector)
      notification.clearNotification(checklist.sector + '-must-create-reminder')
    }

    // if the it's the first value of the check and it's late
    if (checklist.late === undefined && check.last === undefined && (now - checklist.date) > ONE_HOUR_MS) {
      checklist.set({late: true})
    }

    // Save the value and replace the last
    check.values.push(value)
    check.set({last: value})
    // optional comment
    if (req.body.check.comment) {
      let comment = {
        supervisor: req.user.id,
        comment: req.body.check.comment
      }
      check.comments.push(comment)
    }
    checklist = awaitFor(checklist.save())

    awaitFor(updateReminders(checklist.checks, sector))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        checklist: checklist,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, checklist: checklist})
    }
  }),

  addCommentToCheck: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.check.id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let check = awaitFor(CheckModel.findById(req.body.check.id))
    if (check === null) return next(Boom.notFound('Check inexistente'))
    let checklist = awaitFor(ChecklistModel
      .findById(req.body.check.checklist_id)
      .populate({path: 'checks.check', model: 'Checks'}))

    check = _.find(checklist.checks, c => c.check._id.toString() === req.body.check.id.toString())

    let comment = {
      supervisor: req.user.id,
      comment: req.body.check.comment
    }
    check.comments.push(comment)

    checklist = awaitFor(checklist.save())
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        checklist: checklist,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, checklist: checklist})
    }
  }),

  addObservation: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.observation.checklist_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let checklist = awaitFor(ChecklistModel
      .findById(req.body.observation.checklist_id)
      .populate({path: 'checks.check', model: 'Checks'})
      .populate('checks.comments.supervisor', ['name', 'lastname'])
      .populate('checks.values.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('checks.last.supervisor', ['name', 'lastname']))
    checklist.observations.push({observation: req.body.observation.observation, supervisor: req.user.id})
    checklist = awaitFor(checklist.save())
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        checklist: checklist,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, checklist: checklist})
    }
  }),

  getChecks: async(function (req, res, next) {
    let checks = awaitFor(CheckModel.find({sector: req.params.sector.toUpperCase()}))
    if (checks === null) return next(Boom.notFound('Sector inexistente'))
    res.json({success: true, checks: checks})
  }),

  /**
   * Used to send the current checklist either it's been created before or not
   */
  getCurrent: async(function (req, res, next) {
    let checklist = awaitFor(getLastOrCreate(req.params.sector.toUpperCase()))
    res.json({success: true, checklist: checklist})
  }),

  /**
   * Used to get dates in which checklists were done
   */
  datesWithChecklists: async(function (req, res, next) {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    let dates = awaitFor(ChecklistModel.distinct('date', {
      'date': {
        $gte: new Date(new Date().getTime() - thirtyDays)
      }
    }))
    dates = dates.sort((d1, d2) => d2.getTime() - d1.getTime())
    dates = dates.map(d => new Date(d.toLocaleDateString()))
    res.send({success: true, dates: dates})
  }),

  get: async(function (req, res, next) {
    let page = req.query.page || 1
    let perPage = req.query.per_page || 15
    let offset = (page - 1) * perPage
    offset = Number(offset)
    perPage = Number(perPage)
    const checklists = awaitFor(ChecklistModel.find({}, {
      sector: 1,
      _id: 1,
      date: 1,
      schedule: 1
    }).skip(offset).limit(perPage))
    res.json({success: true, checklists: checklists})
  }),

  getChecklist: async(function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    const checklist = awaitFor(ChecklistModel.findById(req.params.id)
      .populate({path: 'checks.check', model: 'Checks'})
      .populate('checks.comments.supervisor', ['name', 'lastname'])
      .populate('checks.values.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('checks.last.supervisor', ['name', 'lastname']))
    res.json({success: true, checklist: checklist})
  }),

  getPdf: async(function (req, res, next) {
    if (isNaN(Date.parse(req.query.date)) || new Date(req.query.date) > new Date()) {
      next(new AppError('Invalid Date', 'Fecha Invalida'))
      return
    }
    let day = new Date(req.query.date)
    let nextDay = new Date(day)
    nextDay.setDate(nextDay.getDate() + 1)

    let checklists = awaitFor(ChecklistModel.find({
      date: {$gte: day, $lt: nextDay},
      sector: req.params.sector.toUpperCase()
    }).populate({path: 'checks.check', model: 'Checks'}).lean())

    if (checklists.length === 0) {
      next(new AppError('Missing checklist', 'No existen checklist!'))
      return
    }

    let pdfStream = pdf.createPdf(pdf.getChecklistContent(checklists))
    pdfStream.pipe(res)
    res.contentType('application/pdf')
    pdfStream.end()
  }),

  summary: async(function (req, res) {
    const summaries = []
    let date
    if (req.query.hasOwnProperty('date')) {
      date = new Date(new Date(req.query.date).getTime() + 1000 * 60 * 60 * 3)
    } else {
      date = new Date(new Date().toDateString())
    }
    winston.log('debug', 'date it s:', {date: date, localDate: date.toLocaleString()})
    SECTORS.forEach(s => {
      summaries.push(summaryForSector(date, s))
    })
    res.json({success: true, summaries})
  }),

  /**
   * NOT USED
   */
  revision: async(function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) next(Boom.notFound('ID Inválido'))

    const checklist = awaitFor(ChecklistModel.findById(req.params.id).lean().exec())
    if (checklist === null) next(Boom.notFound('Checklist inexistente'))

    const {totalChecks, completedChecks, incompleteChecks, goodChecks, badChecks, goodComments, badComments} = getRevisionForChecklist(checklist)

    res.json({
      success: true,
      totalChecks,
      completedChecks,
      incompleteChecks,
      goodChecks,
      badChecks,
      badComments,
      goodComments
    })
  }),

  /**
   * NOT USED
   */
  correction: async(function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) next(Boom.notFound('ID Inválido'))

    const checklist = awaitFor(ChecklistModel.findById(req.params.id).lean().exec())
    if (checklist === null) next(Boom.notFound('Checklist inexistente'))

    const {totalChecks, completedChecks, incompleteChecks, goodChecks, badChecks, goodComments, badComments} = getCorrectionForChecklist(checklist)

    res.json({
      success: true,
      totalChecks,
      completedChecks,
      incompleteChecks,
      goodChecks,
      badChecks,
      badComments,
      goodComments
    })
  }),

  /**
   * It receives a date or uses the current date and searches for the checklists on that date. It also receives the sector of the checklist to search for
   * Returns an object that has an array of the checks from the sector sent and the headers.
   * Inside the checks array it has the data defined in the model plus a comparative property
   * this property is an array with the values saved in the checklist for that check
   * The headers array has the shift and schedule ordered
   */
  comparative: async(function (req, res, next) {
    let date
    const sector = req.params.sector.toUpperCase()
    if (req.query.hasOwnProperty('date')) {
      date = new Date(new Date(req.query.date).getTime() + 1000 * 60 * 60 * 3)
    } else {
      date = new Date(new Date().toDateString())
    }
    winston.log('debug', 'date it s:', {date: date, localDate: date.toLocaleString()})

    let checklists = awaitFor(ChecklistModel.getChecklistsForDayAndSector(date, sector))
    const checks = awaitFor(CheckModel.find({sector: sector.toUpperCase()}).lean())

    // Initialize the property comparative for all checks
    checks.forEach(c => { c.comparative = [] })
    const headers = []
    const observations = []

    // Add the headers data (shift and schedule of the day)
    shift.dayShiftDistribution(date)
      .forEach(d => headers.push({schedule: d.schedule.value, shift: d.shift}))
    checklists = _.orderBy(checklists, c => c.date)

    // for all the checklist made on the day and for each check of the sector add to the comparative data the value of the current check in the current checklist
    checklists.forEach(checklist => {
      observations.push(checklist.observations)
      checks.forEach(c => c.comparative.push(checklist.checks.find(cv => cv.check.toString() === c._id.toString())))
    })

    // If there are fewer checklist than headers it's because one or more checklist where not created so we complete the missing values in the comparative array
    checks.forEach(c => completeObjectsMissing(c.comparative, {
      check: c._id,
      comments: [],
      values: []
    }, headers.length))

    completeObjectsMissing(observations, [], headers.length)

    res.json({success: true, headers, checks, observations})
  })
}

function initReminders () {
  return async(function () {
    notification.clearNotification('must-complete')

    notification.clearNotification('something-bad')

    //  clears all intervals and set them to null
    // CHANGE CheckModel.SECTOR TO SECTORS
    Object.getOwnPropertyNames(CheckModel.SECTOR)
      .forEach(sector => {
        notification.clearNotification(sector + '-must-create-reminder')
        notification.pushNotificationEvery(
          config.CHECKLIST_REMINDER,
          {user_type: USER_TYPE.SUPERVISOR_PRODUCCION},
          new notification.Payload('Recordar crear checklist ' + sector, '', NOTIFICATIONS_TYPE.RECORDATORIO_CHECKLIST),
          1200,
          sector + '-must-create-reminder'
        )
      })
  })
}

//  Run this scripts at 6:00 , 14:00, 22:00
scheduler.scheduleJob('0 6,14,22 * * *', initReminders())

const updateReminders = async(function (checks) {
  // let versions = _.groupBy(checks, c => c.check)
  let lastVersions = _.map(checks, c => c.last)

  // if there is a notification reminder already set it doesn't create another
  const someCheckIsFalse = _.some(lastVersions, v => v.value === false)
  if (someCheckIsFalse && !awaitFor(notification.notificationExists('something-bad'))) {
    winston.log('debug', 'Hay algo que corregir y no hay reminder')
    notification.pushNotificationEvery(
      config.CHECKLIST_REMINDER,
      {user_type: USER_TYPE.SUPERVISOR_PRODUCCION},
      new notification.Payload('Hay algo que corregir del checklist', '', NOTIFICATIONS_TYPE.RECORDATORIO_CHECKLIST),
      1200,
      'something-bad'
    )

    // if there is a notification reminder already set it sets it to null, because there is nothing bad
  } else if (!someCheckIsFalse) {
    winston.log('debug', 'Todo esta bien')
    notification.clearNotification('something-bad')
  }

  let missingChecks = _.some(lastVersions, c => c.value === undefined)
  if (missingChecks && !awaitFor(notification.notificationExists('must-complete'))) {
    winston.log('debug', 'Faltan campos que completar del checklist y no hay un reminder')
    notification.pushNotificationEvery(
      config.CHECKLIST_REMINDER,
      {user_type: USER_TYPE.SUPERVISOR_PRODUCCION},
      new notification.Payload('Faltan campos que completar del checklist', '', NOTIFICATIONS_TYPE.RECORDATORIO_CHECKLIST),
      1200,
      'must-complete'
    )
  } else if (!missingChecks) {
    winston.log('debug', 'Todo el checklist esta completo')
    notification.clearNotification('must-complete')
  }
})

function createChecklist (sector, schedule, now) {
  let checks = []
  awaitFor(CheckModel.find({sector: sector}).lean())
    .forEach(c => {
      checks.push({check: c._id, values: [], comments: []})
    })
  if (schedule.value === 'NOCHE' && now.getHours() < 6) {
    now.setDate(now.getDate() - 1)
  }
  let date = new Date(now.toDateString()).setHours(schedule.begins)

  notification.clearNotification('must-complete')

  notification.clearNotification('something-bad')

  notification.clearNotification(sector + '-must-create-reminder')

  let checklist = awaitFor(ChecklistModel.create({
    schedule: schedule.value,
    sector: sector,
    date: date,
    checks: checks
  }))
  checklist = awaitFor(ChecklistModel
    .populate(checklist, {path: 'checks.check', model: 'Checks'}))
  return checklist
}

function getLastOrCreate (sector) {
  return async(function () {
    let now = new Date()
    let checklist = awaitFor(ChecklistModel.getLastChecklistOfSector(sector))
    let schedule = shift.getSchedule(new Date())
    //  First checklist ever
    if (checklist === null) {
      winston.log('debug', 'First checklist ever')
      return awaitFor(createChecklist(sector, schedule, now))
    }
    let diff = (now - checklist.date)
    if (diff > SHIFT_DURATION_MS) {
      winston.log('debug', 'First checklist of shift')
      return awaitFor(createChecklist(sector, schedule, now))
    } else {
      return checklist
    }
  })()
}

/**
 * Filter with function sent as parameter and then sort by date
 * @param {Array|any[]} values to filter and sort (can be comment or value)
 * @param {Date} values[].date of the value or comment
 * @param filterCondition
 * @return {Array|any[]} return
 */
function filterAndSort (values, filterCondition) {
  let tempValues = _.filter(values, filterCondition)
  return _.sortBy(tempValues, v => v.date)
}

/**
 * Returns the count of comments made on a bad check and the count of comments made on a good check
 * @param checklist is an array of comments and values order by date
 * @return {{goodComments: number, badComments: number}}
 */
function goodAndBadComments (checklist) {
  const checks = mergeCommentsAndValues(checklist)
  let badComments = 0
  let goodComments = 0
  // For each check count the comments made when the check was good and when the check was bad

  checks.forEach(c => {
    let prev = null
    c.forEach(t => {
      if (t.hasOwnProperty('value')) {
        // Is a value, save the value
        prev = t.value
      } else {
        // Is a comment, if it was made when a check was bad, is a bad comment, otherwise is a good comment
        if (prev === false) badComments += 1
        else goodComments += 1
      }
    })
  })
  return {goodComments, badComments}
}

/**
 *
 * @param checklist document
 * @return {Array}  checks is an array of comments and values merged and order by date
 */
function mergeCommentsAndValues (checklist) {
  const checks = []
  // Merge the comments and values of a check order by date
  checklist.checks.forEach(c => {
    checks.push(_.orderBy(c.values.concat(c.comments), t => t.date))
  })
  return checks
}

/**
 * returns the total of checks that evaluate true for the condition
 * @param checks of a checklist
 * @param {Function} condition The function invoked per check
 * @return {number} count of the checks with the condition true
 */
function checksWith (checks, condition) {
  return _.reduce(checks, (total, c) => condition(c) ? total + 1 : total, 0)
}

/* eslint-disable no-unused-vars */
/**
 * returns the total of values that evaluate true for the condition
 * @param checks of a checklist
 * @param {Function} condition The function invoked per value
 * @return {number} count of the values with the condition true
 */
function valuesWith (checks, condition) {
  const flatMap = _.flatMap(checks, c => c.values)
  return _.reduce(flatMap, (total, v) => condition(v) ? total + 1 : total, 0)
}

/* eslint-disable no-unused-vars */

function getRevisionForChecklist (checklist) {
  // Deep copy because i modify the property values in checklist.checks but i need checklist to be immutable
  let checklistCopy = _.cloneDeep(checklist)
  const totalChecks = checklistCopy.checks.length
  // Remove from the checks the values and the comments made after the first hour
  checklistCopy.checks.forEach(c => {
    c.values = filterAndSort(c.values, v => v.date - checklistCopy.date < ONE_HOUR_MS)
    c.comments = filterAndSort(c.comments, c => c.date - checklistCopy.date < ONE_HOUR_MS)
  })

  const {goodComments, badComments} = goodAndBadComments(checklistCopy)

  // Count the completed checks , the ones that have values in it
  const completedChecks = checksWith(checklistCopy.checks, c => c.values.length > 0)
  const incompleteChecks = totalChecks - completedChecks

  // Count only the last value of a check in the first hour
  const goodChecks = checksWith(checklistCopy.checks, c => c.values.length > 0 && c.values[c.values.length - 1].value === true)

  const badChecks = completedChecks - goodChecks
  return {totalChecks, completedChecks, incompleteChecks, goodChecks, badChecks, goodComments, badComments}
}

function getCorrectionForChecklist (checklist) {
  // Deep copy because i modify the property values in checklist.checks but i need checklist to be immutable
  let checklistCopy = _.cloneDeep(checklist)
  const totalChecks = checklistCopy.checks.length

  // Remove from the checks the comments made before the first hour
  checklistCopy.checks.forEach(c => {
    c.comments = filterAndSort(c.comments, c => c.date - checklistCopy.date > ONE_HOUR_MS)
  })

  const {goodComments, badComments} = goodAndBadComments(checklistCopy)
  // Remove from the checks the values made before the first hour
  checklistCopy.checks.forEach(c => {
    c.values = filterAndSort(c.values, v => v.date - checklistCopy.date > ONE_HOUR_MS)
  })

  // Count the completed checks , the ones that have a last value
  const completedChecks = checksWith(checklistCopy.checks, c => c.hasOwnProperty('last'))
  const incompleteChecks = totalChecks - completedChecks

  // counts the checks with the last on true
  const goodChecks = checksWith(checklistCopy.checks, c => c.values.length > 0 && c.values[c.values.length - 1].value === true)

  // counts all the bad values of a check
  const badChecks = checksWith(checklistCopy.checks, c => c.values.length !== 0 && c.values[c.values.length - 1].value === false)
  return {totalChecks, completedChecks, incompleteChecks, goodChecks, badChecks, goodComments, badComments}
}

/**
 * This function is used in case that the array must have some specific length
 * with some specific empty objects
 * @param array to be completed with objects
 * @param obj which will be used to fill the array
 * @param val number of iterations
 * @return {Array} with the completed objects
 */
function completeObjectsMissing (array, obj, val) {
  if (array.length < val) {
    array.push(obj)
    completeObjectsMissing(array, obj, val)
  }
  return array
}

function summaryForSector (date, sector) {
  let checklists = awaitFor(ChecklistModel.getChecklistsForDayAndSector(date, sector))
  checklists = _.orderBy(checklists, c => c.date)
  const revision = getSummaryWith(checklists, getRevisionForChecklist)
  const correction = getSummaryWith(checklists, getCorrectionForChecklist)
  return {revision, correction, sector: sector}
}

function getSummaryWith (checklists, functionSummary) {
  let singleSummary = []
  checklists.forEach(checklist => {
    let checklistData = functionSummary(checklist)
    checklistData.shift = shift.getShift(checklist.date)
    checklistData.schedule = shift.getSchedule(checklist.date).readable
    singleSummary.push(checklistData)
  })
  completeObjectsMissing(singleSummary, null, SECTORS.length)
  return singleSummary
}

module.exports = controller

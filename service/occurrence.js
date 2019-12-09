const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const OccurrenceModel = require(path.join(__dirname, '../model')).occurrence
const Const = require(path.join(__dirname, '/../libs/const'))
const dateFns = require('date-fns')
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const _ = require('lodash')
const teamService = require(path.join(__dirname, '/team'))
const notification = require(path.join(__dirname, '/../libs/notification'))

const service = {
  create: async(function (occurrence) {
    occurrence = awaitFor(OccurrenceModel.create(occurrence))
    occurrence = awaitFor(OccurrenceModel.findById(occurrence._id)
      .populate('creator', 'name lastname')
      .populate('collaborators', 'name lastname'))
    this.createdNotification(occurrence)
    return occurrence
  }),

  createdNotification: (occurrence) => {
    if (process.env.NODE_ENV !== 'test') {
      let everyBoss = awaitFor(teamService.allBossesOf(occurrence.collaborators))
      notification.sendNotification(
        {_id: {$in: everyBoss}},
        new notification.Payload('Nuevo acontecimiento', `/acontecimientos/${occurrence._id}`,
          occurrence.notificationType,
          {
            creator: occurrence.creator.basicInfo(),
            collaborators: occurrence.collaborators.map(c => c.basicInfo()),
            state: occurrence.state
          })
      )
    }
  },
  resolvedNotification: (occurrence) => {
    if (process.env.NODE_ENV !== 'test') {
      notification.sendNotification(
        {$or: [{user_type: {$in: Const.ROLE.ADMINISTRACION}}, {_id: occurrence.creator._id}]},
        new notification.Payload('Acontecimiento resuelto', `/acontecimientos/${occurrence._id}`,
          occurrence.notificationType,
          {
            creator: occurrence.creator.basicInfo(),
            collaborators: occurrence.collaborators.map(c => c.basicInfo()),
            resolvedBy: occurrence.resolvedBy.basicInfo(),
            state: occurrence.state
          })
      )
    }
  },
  cancel: async(function (id, canceledBy) {
    let occurrence = awaitFor(OccurrenceModel.findOne({_id: id, state: Const.OCCURRENCE_STATE.APPROVED}))
    occurrence.set({state: Const.OCCURRENCE_STATE.CANCELED})
    occurrence.set({canceledBy: canceledBy})
    awaitFor(occurrence.save())
    return OccurrenceModel.findById(id)
      .populate('canceledBy', 'name lastname legajo s3Key')
      .populate('creator', 'name lastname legajo')
      .populate('resolvedBy', 'name lastname legajo')
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
  }),
  pending: async(function (options = {}) {
    let cursor = OccurrenceModel
      .find({state: Const.OCCURRENCE_STATE.PENDING_RESOLUTION})
      .populate('canceledBy', 'name lastname legajo s3Key')
      .populate('creator', 'name lastname legajo')
      .populate('resolvedBy', 'name lastname legajo')
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
    cursor = filter(cursor, options)
    return paginateAndSort(cursor, options)
  }),
  resolved: async(function (options = {}) {
    let cursor = OccurrenceModel
      .find({state: {$ne: Const.OCCURRENCE_STATE.PENDING_RESOLUTION}})
      .populate('canceledBy', 'name lastname legajo s3Key')
      .populate('creator', 'name lastname legajo')
      .populate('resolvedBy', 'name lastname legajo')
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
    cursor = filter(cursor, options)
    return paginateAndSort(cursor, options)
  }),
  doneTo: async(function (id, options = {}) {
    const cursor = OccurrenceModel
      .find({collaborators: id, archived: true, state: Const.OCCURRENCE_STATE.APPROVED})
      .populate('canceledBy', 'name lastname legajo s3Key')
      .populate('creator', 'name lastname legajo')
      .populate('resolvedBy', 'name lastname legajo')
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
    return paginateAndSort(cursor, options)
  }),
  notArchived: async(function (options = {}) {
    const cursor = OccurrenceModel
      .find({archived: false})
      .populate('canceledBy', 'name lastname legajo s3Key')
      .populate('creator', 'name lastname legajo')
      .populate('resolvedBy', 'name lastname legajo')
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1, s3Key: 1}
      })
    return paginateAndSort(cursor, options)
  }),
  archive: async(function (id) {
    let occurrence = awaitFor(OccurrenceModel.findOne({
      _id: id,
      state: {$ne: Const.OCCURRENCE_STATE.PENDING_RESOLUTION}
    }))
    occurrence.set({archived: true})
    occurrence = awaitFor(occurrence.save())
    return occurrence
      .populate('canceledBy', 'name lastname legajo s3Key')
      .populate('creator', 'name lastname legajo')
      .populate('resolvedBy', 'name lastname legajo')
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
  }),
  resolve: async(function (id, approved, resolvedBy) {
    let occurrence = awaitFor(OccurrenceModel.findOne({_id: id, state: Const.OCCURRENCE_STATE.PENDING_RESOLUTION}))
    if (approved) {
      occurrence.set({state: Const.OCCURRENCE_STATE.APPROVED})
    } else {
      occurrence.set({state: Const.OCCURRENCE_STATE.REJECTED})
    }
    occurrence.set({resolvedBy: resolvedBy})
    occurrence = occurrence.set({resolvedDate: dateFns.startOfToday()})
    awaitFor(occurrence.save())
    occurrence = awaitFor(OccurrenceModel.findById(id)
      .populate('canceledBy', 'name lastname legajo s3Key')
      .populate('creator', 'name lastname legajo')
      .populate('resolvedBy', 'name lastname legajo')
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1, s3Key: 1}
      }))
    this.resolvedNotification(occurrence)
    return occurrence
  }),
  getById: async(function (id) {
    return awaitFor(OccurrenceModel.findById(id)
      .populate('canceledBy', 'name lastname legajo s3Key')
      .populate('creator', 'name lastname legajo')
      .populate('resolvedBy', 'name lastname legajo')
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1, s3Key: 1}
      })
    )
  }),
  canBeEditedByUser: async(function (userId, occurrenceId) {
    const occurrence = awaitFor(OccurrenceModel.findById(occurrenceId))
    return (occurrence.creator.equals(userId) && occurrence.state === Const.OCCURRENCE_STATE.PENDING_RESOLUTION)
  }),
  edit: async(function (occurrenceId, propertiesEdited) {
    let occurrence = awaitFor(OccurrenceModel.findById(occurrenceId))
    occurrence.set(propertiesEdited)
    awaitFor(occurrence.save())
    return OccurrenceModel.findById(occurrenceId)
      .populate('canceledBy', 'name lastname legajo s3Key')
      .populate('creator', 'name lastname legajo')
      .populate('resolvedBy', 'name lastname legajo')
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1, s3Key: 1}
      })
  }),
  occurrenceStatistics: async(function (userId) {
    const occurrences = awaitFor(OccurrenceModel.find({
      collaborators: userId,
      archived: true,
      created_at: {
        $gte: dateFns.startOfYear(new Date()),
        $lt: dateFns.endOfYear(new Date())
      }
    }))
    const recommendations = _.flatMap(occurrences, o => o.recommendations)
    const counterInitializer = {
      operative: 0,
      safety: 0,
      discipline: 0
    }
    return recommendations.reduce((counter, recommendation) => {
      counter[recommendation.toLowerCase()] += 1
      return counter
    }, counterInitializer)
  }),
  getPdf: async(function (id) {
    const occurrence = awaitFor(OccurrenceModel
      .findById(id)
      .populate('resolvedBy', 'name lastname legajo')
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, dni: 1, lastname: 1, legajo: 1, sector: 1, position: 1, s3Key: 1}
      }))
    // Saving previous occurrences of collaborator
    const previousOccurrences = new Map()
    occurrence.collaborators.forEach(collaborator => {
      previousOccurrences.set(collaborator._id, awaitFor(this.occurrenceStatistics(collaborator._id)))
    })
    const stream = pdf.createPdf(pdf.getOccurrenceContent(occurrence, previousOccurrences))
    awaitFor(occurrence.set({printed: true}))
    return stream
  })
}
const paginateAndSort = async(function (cursor, options = {}) {
  cursor = cursor
    .sort({created_at: -1})
  if (options.page !== undefined) {
    options.perPage = options.perPage || 15
    cursor = cursor
      .skip(options.perPage * (options.page - 1))
      .limit(options.perPage)
  }
  return cursor
})

function filter (cursor, options = {}) {
  if (options.teamOf) {
    cursor = awaitFor(cursor.teamOf(options.teamOf)).query
  }
  return cursor
}

module.exports = service

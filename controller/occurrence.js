const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const occurrenceService = require(path.join(__dirname, '../service')).occurrence
const Const = require(path.join(__dirname, '../libs/const'))
const AppError = require(path.join(__dirname, '../libs/error')).AppError

/**
 * Last "solicitudes" like request so use this as an example if you have to do a similar functionality
 * "solicitudes" like request: it has requested, approved or rejected, printed, archived and list in different places
 */
const controller = {
  /**
   * @apiDefine createOccurrence
   * @apiParam {Object} occurrence Occurrence Object
   * @apiParam {String[]} occurrence.collaborators Array containing collaborators ids
   * @apiParam {String[]} occurrence.recommendations Occurrence recommendations (OPERATIVE | SAFETY | DISCIPLINE)
   * @apiParam {String} occurrence.observation Occurrence observation
   * @apiParam {String} [occurrence.actionPlan] Occurrence action plan
   *
   */
  create: async(function (req, res) {
    let occurrence = {
      collaborators: req.body.occurrence.collaborators,
      recommendations: req.body.occurrence.recommendations,
      actionPlan: req.body.occurrence.actionPlan,
      observation: req.body.occurrence.observation,
      creator: req.user.id
    }
    occurrence = awaitFor(occurrenceService.create(occurrence))
    res.json({success: true, occurrence})
  }),
  /**
   * @apiDefine editOccurrence
   * @apiParam {Object} occurrence Occurrence Object
   * @apiParam {String[]} [occurrence.recommendations] Occurrence recommendations (OPERATIVE | SAFETY | DISCIPLINE)
   * @apiParam {String[]} occurrence.collaborators Array containing collaborators ids
   * @apiParam {String} [occurrence.observation] Occurrence observation
   * @apiParam {String} [occurrence.actionPlan] Occurrence action plan
   *
   */
  edit: async(function (req, res, next) {
    let occurrence = {
      collaborators: req.body.occurrence.collaborators,
      recommendations: req.body.occurrence.recommendations,
      actionPlan: req.body.occurrence.actionPlan,
      observation: req.body.occurrence.observation
    }
    // if user can't edit occurrence
    if (!Const.ROLE.JEFES.includes(req.user.user_type) && !occurrenceService.canBeEditedByUser(req.user.id, req.params.id)) {
      return next(new AppError('Impossible to edit', 'No se puede editar', Const.ERROR.DOCUMENT_CANT_BE_EDITED))
    }
    occurrence = awaitFor(occurrenceService.edit(req.params.id, occurrence))
    res.json({success: true, occurrence})
  }),
  pending: async(function (req, res) {
    const occurrences = awaitFor(occurrenceService.pending({perPage: req.query.per_page, page: req.query.page, teamOf: req.user.id}))
    res.json({success: true, occurrences})
  }),
  resolved: async(function (req, res) {
    const occurrences = awaitFor(occurrenceService.resolved({perPage: req.query.per_page, page: req.query.page, teamOf: req.user.id}))
    res.json({success: true, occurrences})
  }),
  doneByMePending: async(function (req, res) {
    const occurrences = awaitFor(occurrenceService.doneByPending(req.user.id, {
      perPage: req.query.per_page,
      page: req.query.page,
      teamOf: req.user.id
    }))
    res.json({success: true, occurrences})
  }),
  doneByMeResolved: async(function (req, res) {
    const occurrences = awaitFor(occurrenceService.doneByResolved(req.user.id, {
      perPage: req.query.per_page,
      page: req.query.page,
      teamOf: req.user.id
    }))
    res.json({success: true, occurrences})
  }),
  doneTo: async(function (req, res) {
    const occurrences = awaitFor(occurrenceService.doneTo(req.params.id, {
      perPage: req.query.per_page,
      page: req.query.page
    }))
    res.json({success: true, occurrences})
  }),
  notArchived: async(function (req, res) {
    const occurrences = awaitFor(occurrenceService.notArchived({perPage: req.query.per_page, page: req.query.page}))
    res.json({success: true, occurrences})
  }),
  archive: async(function (req, res) {
    const occurrence = awaitFor(occurrenceService.archive(req.params.id))
    res.json({success: true, occurrence})
  }),
  resolve: async(function (req, res) {
    const occurrence = awaitFor(occurrenceService.resolve(req.params.id, req.body.approved, req.user.id))
    res.json({success: true, occurrence})
  }),
  getById: async(function (req, res) {
    const occurrence = awaitFor(occurrenceService.getById(req.params.id))
    res.json({success: true, occurrence})
  }),
  cancel: async(function (req, res) {
    const occurrence = awaitFor(occurrenceService.cancel(req.params.id))
    res.json({success: true, occurrence})
  }),
  occurrenceStatistics: async(function (req, res) {
    const statistics = awaitFor(occurrenceService.occurrenceStatistics(req.params.id))
    res.json({success: true, statistics})
  }),
  getPdf: async(function (req, res, next) {
    try {
      const pdfStream = awaitFor(occurrenceService.getPdf(req.params.id))
      pdfStream.pipe(res)
      res.contentType('application/pdf')
      pdfStream.end()
    } catch (error) {
      next(error)
    }
  })
}
module.exports = controller

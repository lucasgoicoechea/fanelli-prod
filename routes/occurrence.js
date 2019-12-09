const path = require('path')
const express = require('express')
const router = express.Router()
const occurrenceController = require(path.join(__dirname, '/../controller')).occurrence
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

/**
 * @api {get} /api/occurrence/pending Gets pending occurrences
 * @apiName pendingOccurrences
 * @apiGroup Occurrence
 *
 * @apiUse JWT
 *
 *
 * @apiUse pagination
 * @apiSuccess {Object[]} occurrences Array containing pending occurrences
 * @apiUse occurrenceEntity
 */
router.get('/pending', authorize([ROLE.JEFES, ROLE.ADMINISTRACION]), occurrenceController.pending)

/**
 * @api {get} /api/occurrence/resolved Gets resolved occurrences
 * @apiName resolvedOccurrences
 * @apiGroup Occurrence
 *
 * @apiUse JWT
 *
 * @apiUse pagination
 * @apiSuccess {Object[]} occurrences Array containing resolved occurrences
 * @apiUse occurrenceEntity
 *
 */
router.get('/resolved', authorize([ROLE.JEFES, ROLE.ADMINISTRACION]), occurrenceController.resolved)

/**
 * @api {post} /api/occurrence Creates a occurrence entity
 * @apiName createOccurrence
 * @apiGroup Occurrence
 *
 * @apiUse JWT
 * @apiUse createOccurrence
 *
 * @apiUse occurrenceEntity
 *
 */
router.post('/', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.HIGIENE_SEGURIDAD, ROLE.ADMINISTRACION]), occurrenceController.create)

/**
 * @api {get} /api/occurrence/not-archived Gets not archived occurrences
 * @apiName notArchivedOccurrences
 * @apiGroup Occurrence
 *
 * @apiUse JWT
 *
 *
 * @apiUse pagination
 * @apiSuccess {Object[]} occurrences Array containing resolved occurrences
 * @apiUse occurrenceEntity
 */
router.get('/not-archived', authorize([ROLE.ADMINISTRACION]), occurrenceController.notArchived)

/**
 * @api {get} /api/occurrence/:id Get occurrence details
 * @apiName occurrenceDetails
 * @apiGroup Occurrence
 *
 * @apiUse JWT
 *
 * @apiParam {string} :id occurrence id
 *
 * @apiUse occurrenceEntity
 *
 */
router.get('/:id', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.HIGIENE_SEGURIDAD, ROLE.ADMINISTRACION]), occurrenceController.getById)

/**
 * @api {post} /api/occurrence/archive/:id Archives an occurrence
 * @apiName archiveOccurrence
 * @apiGroup Occurrence
 *
 * @apiUse JWT
 *
 * @apiParam {string} :id occurrence id
 *
 * @apiUse occurrenceEntity
 *
 */
router.post('/archive/:id', authorize([ROLE.ADMINISTRACION]), occurrenceController.archive)

/**
 * @api {post} /api/occurrence/cancel/:id Cancels an occurrence
 * @apiName cancelOccurrence
 * @apiGroup Occurrence
 *
 * @apiUse JWT
 *
 * @apiParam {string} :id occurrence id
 *
 * @apiUse occurrenceEntity
 *
 */
router.post('/cancel/:id', authorize([ROLE.JEFES, ROLE.RRHH]), occurrenceController.cancel)

/**
 * @api {post} /api/occurrence/resolve/:id Resolves an occurrence entity
 * @apiName resolveOccurrence
 * @apiGroup Occurrence
 *
 * @apiUse JWT
 * @apiParam {string} :id occurrence id
 * @apiParam {Boolean} approved true if was accepted , false if was rejected
 *
 * @apiUse occurrenceEntity
 *
 */
router.post('/resolve/:id', authorize([ROLE.JEFES, ROLE.RRHH]), occurrenceController.resolve)

/**
 * @api {get} /api/occurrence/pdf/:id Gets a sanction pdf
 * @apiName pdfOccurrence
 * @apiGroup Occurrence
 *
 * @apiParam {string} :id occurrence id
 *
 * @apiUse JWT
 */
router.get('/pdf/:id', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.HIGIENE_SEGURIDAD, ROLE.ADMINISTRACION]), occurrenceController.getPdf)

/**
 * @api {get} /api/occurrence/resolve/by-me Gets resolved occurrences by me
 * @apiName resolvedOccurrencesByMe
 * @apiGroup Occurrence
 *
 * @apiUse JWT
 *
 *
 * @apiUse pagination
 * @apiSuccess {Object[]} occurrences Array containing resolved occurrences done by me
 * @apiUse occurrenceEntity
 */
router.get('/resolve/by-me', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.HIGIENE_SEGURIDAD, ROLE.ADMINISTRACION]), occurrenceController.resolved)

/**
 * @api {get} /api/occurrence/pending/by-me Gets pending occurrences by me
 * @apiName pendingOccurrencesByMe
 * @apiGroup Occurrence
 *
 * @apiUse JWT
 *
 *
 * @apiUse pagination
 * @apiSuccess {Object[]} occurrences Array containing pending occurrences by me
 * @apiUse occurrenceEntity
 */
router.get('/pending/by-me', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.HIGIENE_SEGURIDAD, ROLE.ADMINISTRACION]), occurrenceController.pending)

/**
 * @api {get} /api/occurrence/to/:id Gets occurrences done to a collaborator
 * @apiName occurrencesDoneTo
 * @apiGroup Occurrence
 *
 * @apiParam {string} :id collaborator id
 *
 * @apiUse JWT
 *
 *
 * @apiUse pagination
 * @apiSuccess {Object[]} occurrences Array containing occurrences done to a collaborator
 * @apiUse occurrenceEntity
 */
router.get('/to/:id', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.HIGIENE_SEGURIDAD, ROLE.ADMINISTRACION]), occurrenceController.doneTo)

/**
 * @api {put} /api/occurrence/:id Edits an occurrence
 * @apiName occurrencesEdit
 * @apiGroup Occurrence
 *
 * @apiParam {string} :id occurrence id
 *
 * @apiUse JWT
 * @apiUse editOccurrence
 *
 *
 * @apiUse occurrenceEntity
 */
router.put('/:id', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.HIGIENE_SEGURIDAD, ROLE.RRHH]), occurrenceController.edit)

/**
 * @api {get} /api/statistics/:id Gets occurrence statistics
 * @apiName occurrencesStatistics
 * @apiGroup Occurrence
 *
 * @apiParam {string} :id collaborator id
 *
 * @apiUse JWT
 *
 * @apiSuccess {Object} statistics Occurrence statistics
 * @apiSuccess {integer} occurrence.operative operative statistics
 * @apiSuccess {integer} occurrence.safety operative safety
 * @apiSuccess {integer} occurrence.discipline operative discipline
 *
 * */
router.get('/statistics/:id', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.HIGIENE_SEGURIDAD, ROLE.ADMINISTRACION]), occurrenceController.occurrenceStatistics)

module.exports = router

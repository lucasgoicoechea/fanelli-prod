const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const sanctionService = require(path.join(__dirname, '../service')).sanction
/**
 * Last "novedades" like request so use this as an example if you have to do a similar functionality
 * "novedades" like request: it is created, affects availability, and has to be list on collaborators archive
 */
const controller = {
  /**
   * @apiDefine createSanction
   * @apiParam {Object} sanction Sanction Object
   * @apiParam {String[]} sanction.collaborators Array containing collaborators ids
   * @apiParam {String} sanction.type Sanction type (WARNING | SUSPENSION)
   * @apiParam {String} sanction.reason Sanction full reason
   * @apiParam {String} sanction.writtenReason Sanction written reason
   * @apiParam {Object} [sanction.dateRange] Object containing date information, obligatory if it's suspension type
   * @apiParam {Date} [sanction.dateRange.from] Beginning of the sanction
   * @apiParam {Date} [sanction.dateRange.to] End of the sanction
   * @apiParam {Date} [sanction.incorporationDate] Incorporation datetime of the sanction
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'success': 'true',
   *       'sanction': 'sanction Object'
   *     }
   */
  create: async(function (req, res) {
    let sanction = {
      collaborators: req.body.sanction.collaborators,
      creator: req.user.id,
      type: req.body.sanction.type,
      reason: req.body.sanction.reason,
      writtenReason: req.body.sanction.writtenReason,
      dateRange: req.body.sanction.dateRange,
      incorporationDate: req.body.sanction.incorporationDate
    }
    sanction = awaitFor(sanctionService.create(sanction))
    res.json({success: true, sanction})
  }),
  getPdf: async(function (req, res, next) {
    try {
      const pdfStream = awaitFor(sanctionService.getPdf(req.params.id))
      pdfStream.pipe(res)
      res.contentType('application/pdf')
      pdfStream.end()
    } catch (error) {
      next(error)
    }
  }),

  getById: async(function (req, res) {
    const sanction = awaitFor(sanctionService.getById(req.params.id))
    res.json({success: true, sanction})
  }),
  get: async(function (req, res, next) {
    const sanctions = awaitFor(sanctionService.get({perPage: req.query.per_page, page: req.query.page}))
    res.json({success: true, sanctions})
  }),
  getDoneTo: async(function (req, res, next) {
    const sanctions = awaitFor(sanctionService.getDoneTo(req.params.id, {
      perPage: req.query.per_page,
      page: req.query.page
    }))
    res.json({success: true, sanctions})
  }),
  remove: async(function (req, res, next) {
    awaitFor(sanctionService.remove(req.params.id))
    res.json({success: true, message: 'Sancion eliminada'})
  }),
  /**
   * @apiDefine editSanction
   * @apiParam {Object} sanction Sanction Object
   * @apiParam {String} [sanction.reason] sanction reason
   * @apiParam {String} [sanction.writtenReason] sanction written reason
   * @apiParam {Object} [sanction.dateRange] Object containing date information, obligatory if it's suspension type
   * @apiParam {Date} [sanction.dateRange.from] Beginning of the sanction
   * @apiParam {Date} [sanction.dateRange.to] End of the sanction
   * @apiParam {Date} [sanction.incorporationDate] suspension incorporation datetime
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'success': 'true',
   *       'sanction': 'sanction Object'
   *     }
   */
  edit: async(function (req, res, next) {
    let sanction = {
      type: req.body.sanction.type,
      reason: req.body.sanction.reason,
      writtenReason: req.body.sanction.writtenReason,
      dateRange: req.body.sanction.dateRange,
      incorporationDate: req.body.sanction.incorporationDate
    }
    sanction = awaitFor(sanctionService.edit(req.params.id, sanction))
    res.json({success: true, sanction})
  })
}
module.exports = controller

const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const SanctionModel = require(path.join(__dirname, '../model')).sanction
const Const = require(path.join(__dirname, '/../libs/const'))
const AppError = require(path.join(__dirname, '/../libs/error')).AppError
const pdf = require(path.join(__dirname, '/../libs/pdf'))

const service = {
  create: async(function (sanction) {
    return awaitFor(SanctionModel.create(sanction))
  }),
  getPdf: async(function (sanctionId) {
    const sanction = awaitFor(SanctionModel
      .findById(sanctionId)
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1, dni: 1}
      })
      .populate('creator', 'name lastname'))
    return pdf.createPdf(pdf.getSanctionContent(sanction))
  }),
  getById: async(function (sanctionId) {
    return awaitFor(SanctionModel.findById(sanctionId)
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1, s3Key: 1}
      })
      .populate('creator', 'name lastname legajo s3Key'))
  }),
  get: async(function (options) {
    let sanctions = SanctionModel.find({})
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
    return paginateAndSort(sanctions, options)
  }),
  getDoneTo: async(function (collaborator, options) {
    let sanctions = SanctionModel.find({collaborators: collaborator})
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
    return paginateAndSort(sanctions, options)
  }),
  edit: async(function (id, sanction) {
    awaitFor(SanctionModel.update({_id: id}, {$set: sanction}))
    return SanctionModel.findById(id)
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
  }),
  remove: async(function (id) {
    const sanction = awaitFor(SanctionModel.findById({_id: id}))
    awaitFor(sanction.remove())
    return true
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
module.exports = service

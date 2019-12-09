const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const SecurityElementModel = require(path.join(__dirname, '../model')).securityElement
const dateFns = require('date-fns')

const service = {
  getActive: async(function (options) {
    let securityElements = SecurityElementModel
      .find({delivered: false})
      .sort({created_at: -1})

    // there is no pagination in frontend
    // securityElements = paginate(securityElements, options.page, options.perPage)

    securityElements = filterEpp(securityElements, options)

    securityElements = awaitFor(securityElements
      .populate('collaborator', ['name', 'lastname'])
      .populate('supervisor', ['name', 'lastname'])
      .populate('approved_by', ['name', 'lastname']))
    return securityElements.filter(epp => !epp.isEditable())
  }),
  getDelivered: async(function (options, filters = {}) {
    let securityElements = SecurityElementModel
      .find({delivered: true})
      .sort({created_at: -1})

    filterEpp(securityElements, filters)
    paginate(securityElements, options.page, options.perPage)

    return awaitFor(securityElements
      .populate('supervisor', ['name', 'lastname'])
      .populate('approved_by', ['name', 'lastname'])
      .populate('collaborator', ['name', 'lastname'])
    )
  }),
  getActiveByUser: async(function (userId, options, filters = {}) {
    let securityElements = SecurityElementModel
      .find({
        $and: [
          {delivered: false},
          // approved can be undefined (not approved nor rejected) or true (approved)
          {approved: {$not: {$eq: false}}}
        ]
      })
      .sort({created_at: -1})

    securityElements = filterEpp(securityElements, filters)
    securityElements = paginate(securityElements, options.page, options.perPage)

    return awaitFor(securityElements
      .populate('collaborator', ['name', 'lastname'])
      .populate('supervisor', ['name', 'lastname'])
      .populate('approved_by', ['name', 'lastname'])
    )
  }),
  getHistoryByUser: async(function (userId, options, filters) {
    let securityElements = SecurityElementModel
      .find({
        $or: [
          {delivered: true},
          {approved: false}
        ]
      })
      .sort({created_at: -1})

    securityElements = filterEpp(securityElements, filters)
    securityElements = paginate(securityElements, options.page, options.perPage)

    return awaitFor(securityElements
      .populate('collaborator', ['name', 'lastname'])
      .populate('supervisor', ['name', 'lastname'])
      .populate('approved_by', ['name', 'lastname'])
    )
  })
}

function filterEpp (eppCursor, filters) {
  if (filters.collaborator) {
    eppCursor = eppCursor.where('collaborator').equals(filters.collaborator)
  }
  if (filters.date) {
    eppCursor = eppCursor.where('updated_at').gt(filters.date).lt(dateFns.addDays(filters.date, 1))
  }
  if (filters.teamOf) {
    eppCursor = awaitFor(eppCursor.teamOf(filters.teamOf)).query
  }
  return eppCursor
}

function paginate (eppCursor, page = 1, perPage = 15) {
  let offset = (page - 1) * perPage
  offset = Number(offset)
  perPage = Number(perPage)
  return eppCursor
    .skip(offset)
    .limit(perPage)
}

module.exports = service

const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const dateFns = require('date-fns')
const config = require(path.join(__dirname, '/../config'))
const Const = require(path.join(__dirname, '/../libs/const'))
const StaffRequestModel = require(path.join(__dirname, '/../model')).staffRequest
const ExtraHoursModel = require(path.join(__dirname, '/../model')).extraHoursRequest
const ShiftChangeModel = require(path.join(__dirname, '/../model')).shiftChangeRequest
const LeaveModel = require(path.join(__dirname, '/../model')).leaveRequest
const UserModel = require(path.join(__dirname, '/../model')).user
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const teamService = require(path.join(__dirname, '/team'))
const notification = require(path.join(__dirname, '/../libs/notification'))

const service = {
  createLicense: async(function (collaborator, creator, license) {
    license.collaborator = collaborator
    license.creator = creator
    return StaffRequestModel.create(license)
  }),

  updateLicense: async(function (licenseId, updateData) {
    awaitFor(StaffRequestModel.update({_id: licenseId}, {$set: updateData}, {new: true}).populate('creator collaborator', 'name lastname legajo'))
    return StaffRequestModel.findById(licenseId).populate('creator collaborator', 'name lastname legajo')
  }),

  createExtraHours: async(function (collaborators, creator, extraHours) {
    return awaitFor(createRequestWithModel(collaborators, creator, extraHours, ExtraHoursModel))
  }),

  createLeave: async(function (collaborators, creator, leave) {
    return awaitFor(createRequestWithModel(collaborators, creator, leave, LeaveModel))
  }),

  createShiftChange: async(function (collaborators, creator, shiftChange) {
    return awaitFor(createRequestWithModel(collaborators, creator, shiftChange, ShiftChangeModel))
  }),

  sendCreateNotification: (request) => {
    let everyBoss = awaitFor(teamService.allBossesOf(request.collaborators))
    notification.sendNotification(
      {_id: {$in: everyBoss}},
      new notification.Payload('Nueva solicitud', '/solicitudes/' + request.getType() + '/' + request._id, request.getTypeNotification(), {
        creator: request.creator.toObject(),
        collaborators: request.collaborators,
        state: request.state
      })
    )
  },

  get: async(function (filters) {
    let requestMap = getOnModels({}, filters)
    requestMap = awaitFor(executePromises(requestMap))
    const request = transformResults(requestMap)
    return paginateAndSort(request, filters)
  }),

  getLeaveById: async(function (id) {
    return this.populateAll(LeaveModel.findById(id))
  }),

  getExtraHoursById: async(function (id) {
    return this.populateAll(ExtraHoursModel.findById(id))
  }),

  getShiftChangeById: async(function (id) {
    return this.populateAll(ShiftChangeModel.findById(id))
  }),

  canBeArchived: async(request => request.state === Const.STAFF_REQUEST_STATE.APPROVED || request.state === Const.STAFF_REQUEST_STATE.REJECTED),

  archive: async(request => {
    request.set({archived: true})
    return awaitFor(request.save())
  }),

  cancel: async((request, responsible) => {
    request.set({canceled: true})
    request.set({canceledBy: responsible})
    return awaitFor(request.save())
  }),

  canBeCanceled: async(request => {
    return !request.archived
  }),

  setApproval: async((request, approved, responsible, updatedInfo) => {
    if (approved) {
      request.set({state: Const.STAFF_REQUEST_STATE.APPROVED})
    } else {
      request.set({state: Const.STAFF_REQUEST_STATE.REJECTED})
    }
    request.set({approvedBy: responsible})
    if (updatedInfo !== undefined) {
      request.set(updatedInfo)
    }
    request.set({approvedDate: new Date()})
    request = awaitFor(request.save())
    request = awaitFor(service.populateAll(request))
    return request
  }),

  sendApprovalNotification: (request) => {
    let message = request.state === Const.STAFF_REQUEST_STATE.APPROVED ? 'Solicitud aprobada' : 'Solicitud Rechazada'
    notification.sendNotification(
      {$or: [{user_type: {$in: Const.ROLE.ADMINISTRACION}}, {_id: request.creator}]},
      new notification.Payload(message, '/solicitudes/' + request.getType() + '/' + request._id, request.getTypeNotification(), {
        creator: request.creator.toObject(),
        collaborators: request.collaborators,
        approvedBy: request.approvedBy.toObject(),
        state: request.state
      })
    )
  },

  changeShift: async(shiftChangeRequest => {
    if (shiftChangeRequest.temporary === false && shiftChangeRequest.canceled === false) {
      awaitFor(UserModel.update({_id: {$in: shiftChangeRequest.collaborators}}, {$set: {shift: shiftChangeRequest.toShift}}, {multi: true}))
    }
  }),

  canRequestBeCreatedForDays: days => days.every(d => dateFns.differenceInMilliseconds(d, new Date()) > config.REQUEST_TIME_LIMITATION),

  canRequestBeCreatedForDay: day => dateFns.differenceInMilliseconds(day, new Date()) > config.REQUEST_TIME_LIMITATION,

  canChangeApproval: request => request.state === Const.STAFF_REQUEST_STATE.PENDING_APPROVAL,

  getPending: async(function (filters) {
    let requestMap = getOnModels({$or: [{state: Const.STAFF_REQUEST_STATE.PENDING_APPROVAL}]}, filters)
    requestMap = awaitFor(executePromises(requestMap))
    const request = transformResults(requestMap)
    return paginateAndSort(request, filters)
  }),

  getNotArchived: async(filters => {
    let requestMap = getOnModels({archived: false}, filters)
    requestMap = awaitFor(executePromises(requestMap))
    const request = transformResults(requestMap)
    return paginateAndSort(request, filters)
  }),

  getArchived: async(filters => {
    let requestMap = getOnModels({
      archived: true,
      canceled: {$ne: true},
      state: Const.STAFF_REQUEST_STATE.APPROVED
    }, filters)
    requestMap = awaitFor(executePromises(requestMap))
    const request = transformResults(requestMap)
    return paginateAndSort(request, filters)
  }),

  getResolved: async(function (filters) {
    let requestMap = getOnModels({
      $or: [
        {state: Const.STAFF_REQUEST_STATE.APPROVED},
        {state: Const.STAFF_REQUEST_STATE.REJECTED}
      ]
    }, filters)
    requestMap = awaitFor(executePromises(requestMap))
    const request = transformResults(requestMap)
    return paginateAndSort(request, filters)
  }),

  getById: async(function (requestId) {
    return StaffRequestModel.findById(requestId, {})
      .populate('creator', ['name', 'lastname'])
      .populate('collaborators', ['name', 'lastname'])
  }),

  generatePdfManyPages: async(function (request) {
    request = awaitFor(this.populateAll(request))
    const pdfStream = pdf.createPdf(pdf.getStaffRequestContentInManyPages(request))
    if (!request.printed) {
      request.set({printed: true})
      awaitFor(request.save())
    }
    return pdfStream
  }),

  generateSinglePage: async(function (request) {
    request = awaitFor(this.populateAll(request))
    const pdfStream = pdf.createPdf(pdf.getStaffRequestContentSinglePage(request))
    if (!request.printed) {
      request.set({printed: true})
      awaitFor(request.save())
    }
    return pdfStream
  }),

  populateAll: async(function (request) {
    return request
      .populate('toShift')
      .populate('approvedBy', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('canceledBy', ['name, lastname'])
      .populate({
        path: 'collaborators',
        select: ['name', 'lastname', 'legajo', 'sector', 's3Key'],
        populate: {path: 'shift'}
      })
  })
}

const createRequestWithModel =
  async((collaborators, creator, request, model) => {
    request.collaborators = collaborators
    request.creator = creator
    request.status = Const.STAFF_REQUEST_STATE.PENDING_APPROVAL
    request = awaitFor(model.create(request))
    request = awaitFor(model.findById(request._id)
      .populate('shift')
      .populate('approvedBy', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('canceledBy', ['name, lastname'])
      .populate({path: 'collaborators', select: ['name', 'lastname', 'legajo', 'sector'], populate: {path: 'shift'}}))
    return request
  })

const findOnModel = (model, query) => model
  .find(query)
  .populate({path: 'collaborators', populate: {path: 'shift'}, select: {'notifications': 0}})
  .populate('creator', ['name', 'lastname', 'shift'])
  .populate('approvedBy', ['name', 'lastname', 'shift'])
  .populate('canceledBy', ['name', 'lastname'])
  .populate('toShift')

const filterStaffRequest = (staffRequest, filters = {}) => {
  if (filters.hasOwnProperty('state')) {
    staffRequest = staffRequest.where('state').equals(filters.state)
  }
  if (filters.hasOwnProperty('creator')) {
    staffRequest = staffRequest.where('creator').equals(filters.creator)
  }
  if (filters.hasOwnProperty('collaborator')) {
    staffRequest = staffRequest.where('collaborators').equals(filters.collaborator)
  }
  if (filters.hasOwnProperty('archived')) {
    staffRequest = staffRequest.where('collaborators').equals(filters.archived)
  }
  if (filters.hasOwnProperty('teamOf')) {
    staffRequest = awaitFor(staffRequest.teamOf(filters.teamOf)).query
  }
  return staffRequest
}

const approveRequest = async((request, responsible) => {
  request.set({state: Const.STAFF_REQUEST_STATE.APPROVED})
  request.set({approvedBy: responsible})
  return request.save()
})

const rejectRequest = async((request, responsible) => {
  request.set({state: Const.STAFF_REQUEST_STATE.REJECTED})
  request.set({approvedBy: responsible})
  return request.save()
})

/**
 * @param {Object} query the main query to be executed.
 * @param {Object} filters
 * @returns {Map} A Map containing the cursor promises for each model
 */
const getOnModels = (query, filters) => {
  let requests = new Map()
  requests.set(Const.STAFF_REQUEST_TYPE.LEAVE, findOnModel(LeaveModel, query))
  requests.set(Const.STAFF_REQUEST_TYPE.EXTRA_HOURS, findOnModel(ExtraHoursModel, query))
  requests.set(Const.STAFF_REQUEST_TYPE.SHIFT_CHANGE, findOnModel(ShiftChangeModel, query))

  requests.forEach((value, key) => {
    requests.set(key, filterStaffRequest(value, filters))
  })
  return requests
}

/**
 *
 * @param requestsMap Map containing mongoose cursor promises
 * @return {Array} of requests to be parsed more easily
 * [{type: "tipo", request: "solicitud"}, ...]
 */
const transformResults = requestsMap => {
  const requestsResponse = []

  requestsMap.forEach((requests, type) => {
    requests.forEach(request => {
      requestsResponse.push({
        type: type,
        request: request
      })
    })
  })

  return requestsResponse
}

/**
 * @param {Map} cursorMap with the cursor promises to be waited for
 * @return {Promise<Map>} Map containing the queries executed
 */
const executePromises = async(cursorMap => {
  const promises = Array.from(cursorMap).map(cm => cm[1])
  const keys = Array.from(cursorMap).map(cm => cm[0])
  const result = awaitFor(Promise.all(promises))
  result.forEach((r, i) => {
    cursorMap.set(keys[i], r)
  })
  return cursorMap
})

function paginateAndSort (requests, options = {}) {
  if (requests.length !== 0) {
    if (requests[0].request.state !== Const.STAFF_REQUEST_STATE.PENDING_APPROVAL) {
      requests.sort((pr, cr) => dateFns.compareDesc(pr.request.approvedDate, cr.request.approvedDate))
    } else {
      requests.sort((pr, cr) => dateFns.compareAsc(pr.request.created_at, cr.request.created_at))
    }
  }
  if (options.hasOwnProperty('page')) {
    let perPage = options.per_page || 15
    let page = options.page || 1
    let offset = (page - 1) * perPage
    offset = Number(offset)
    perPage = Number(perPage)

    requests = requests.slice(offset, offset + perPage)
  }

  return requests
}

module.exports = service

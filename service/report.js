const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const StaffNewsModel = require(path.join(__dirname, '../model')).staffNews
const OccurrenceModel = require(path.join(__dirname, '../model')).occurrence
const SanctionModel = require(path.join(__dirname, '../model')).sanction
const StaffRequestModel = require(path.join(__dirname, '../model')).staffRequest
const LeaveRequestModel = require(path.join(__dirname, '../model')).leaveRequest
const UserModel = require(path.join(__dirname, '../model')).user
const excel = require(path.join(__dirname, '../libs/excel'))
const Const = require(path.join(__dirname, '../libs/const'))
const Bluebird = require('bluebird')
const dateFns = require('date-fns')
const service = {
  generateReportFor: async(function (id) {
    const collaborator = awaitFor(UserModel.findById(id))

    const staffNews = StaffNewsModel.find({collaborator: id})
    const staffRequests = StaffRequestModel.find({collaborator: id})
    const sanctions = SanctionModel.find({collaborators: id})
    const leaveRequests = LeaveRequestModel.find({
      collaborators: id,
      state: Const.STAFF_REQUEST_STATE.APPROVED,
      archived: true
    })
    const occurrences = OccurrenceModel.find({
      collaborators: id,
      state: Const.OCCURRENCE_STATE.APPROVED,
      archived: true
    })
    const collaboratorEvents = awaitFor(Bluebird.all([staffNews, staffRequests, sanctions, leaveRequests, occurrences])
      .reduce(
        (arr, events) => arr.concat(events),
        []
      ))
    const data = [{
      events: collaboratorEvents,
      collaborator
    }]
    return excel.generateExcel(data)
  }),
  generateReportForAll: async(function () {
    const collaborators = awaitFor(UserModel.find({deactivated: false}, 'name lastname'))
    const data = []
    collaborators.forEach(collaborator => {
      const staffNews = StaffNewsModel.find({
        collaborator: collaborator.id
      })
      const staffRequests = StaffRequestModel.find({
        collaborator: collaborator.id
      })
      const sanctions = SanctionModel.find({
        collaborators: collaborator.id
      })
      const leaveRequests = LeaveRequestModel.find({
        collaborators: collaborator.id,
        state: Const.STAFF_REQUEST_STATE.APPROVED,
        archived: true
      })
      const occurrences = OccurrenceModel.find({
        collaborators: collaborator.id,
        state: Const.OCCURRENCE_STATE.APPROVED,
        archived: true
      })
      const collaboratorEvents = awaitFor(Bluebird.all([staffNews, staffRequests, sanctions, leaveRequests, occurrences])
        .reduce(
          (arr, events) => arr.concat(events),
          []
        ))
      data.push({
        events: collaboratorEvents,
        collaborator
      })
    })
    return excel.generateExcelMultipleCollaborators(data)
  }),
  generateReportForDay: async(function (day) {
    const collaborators = awaitFor(UserModel.find({deactivated: false}, 'name lastname'))
    const data = []
    collaborators.forEach(collaborator => {
      const staffNews = StaffNewsModel.find({
        collaborator: collaborator.id
      })
      const staffRequests = StaffRequestModel.find({
        collaborator: collaborator.id
      })
      const sanctions = SanctionModel.find({
        collaborators: collaborator.id
      })
      const leaveRequests = LeaveRequestModel.find({
        collaborators: collaborator.id,
        state: Const.STAFF_REQUEST_STATE.APPROVED,
        archived: true
      })
      const occurrences = OccurrenceModel.find({
        collaborators: collaborator.id,
        state: Const.OCCURRENCE_STATE.APPROVED,
        archived: true
      })
      const collaboratorEvents = awaitFor(Bluebird.all([staffNews, staffRequests, sanctions, leaveRequests, occurrences])
        .reduce(
          (arr, events) => arr.concat(events),
          []
        ))
      data.push({
        events: collaboratorEvents,
        collaborator
      })
    })
    return excel.generateExcelMultipleCollaboratorsByDay(data, day)
  })
}
module.exports = service

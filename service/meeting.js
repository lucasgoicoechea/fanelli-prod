const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const MeetingModel = require(path.join(__dirname, '../model')).meeting
const notification = require(path.join(__dirname, '/../libs/notification'))
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const service = {

  create: async(function (meeting) {
    return awaitFor(MeetingModel.create(meeting))
  }),
  getPdf: async(function (meetingId) {
    const meeting = awaitFor(MeetingModel
      .findById(meetingId)
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1, dni: 1, sector: 1, position: 1}
      })
      .populate('creator', 'name lastname legajo'))
    return pdf.createPdf(pdf.getMeetingContent(meeting))
  }),
  getById: async(function (meetingId) {
    return awaitFor(MeetingModel.findById(meetingId)
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1, s3Key: 1}
      })
      .populate('creator', 'name lastname legajo s3Key'))
  }),
  list: async(function (options) {
    let meetings = MeetingModel.find({})
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
    meetings = filter(meetings, options)
    return paginateAndSort(meetings, options)
  }),
  listMyMeetings: async(function (id, options) {
    let meetings = MeetingModel
      .find({
        $or: [{creator: id}, {collaborators: id}]
      })
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
    return paginateAndSort(meetings, options)
  }),
  edit: async(function (id, meeting) {
    awaitFor(MeetingModel.update({_id: id}, {$set: meeting}))
    return MeetingModel.findById(id)
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
  }),
  remove: async(function (id) {
    const meeting = awaitFor(MeetingModel.findById({_id: id}))
    awaitFor(meeting.remove())
    return true
  }),
  isCreator: async(function (userId, meetingId) {
    const meeting = awaitFor(MeetingModel.findById(meetingId))
    return meeting.creator.equals(userId)
  })
}

const paginateAndSort = function (cursor, options = {}) {
  cursor = cursor
    .sort({created_at: -1})
  if (options.page !== undefined) {
    options.perPage = options.perPage || 15
    cursor = cursor
      .skip(options.perPage * (options.page - 1))
      .limit(options.perPage)
  }
  return cursor
}

const filter = function (cursor, options = {}) {
  if (options.teamOf) {
    cursor = awaitFor(cursor.teamOf(options.teamOf)).query
  }
  return cursor
}
module.exports = service

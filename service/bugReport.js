const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const BugReportModel = require(path.join(__dirname, '../model')).bugReport
const FailedModel = require(path.join(__dirname, '../model')).failed
const notification = require(path.join(__dirname, '/../libs/notification'))
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const moment = require('moment')
const dateFns = require('date-fns')
const { isNull } = require('lodash')
const Const = require(path.join(__dirname, '../libs/const'))
const NOTIFICATION_TYPE = Const.NOTIFICATION_TYPE
const service = {

  create: async(function (bugReport) {
    let bugReportTmp = awaitFor(BugReportModel.create(bugReport))
    return bugReportTmp
    }
  ),
  createFailed: async(function (failed) {
    let failesTmp = awaitFor(FailedModel.create(failed))
    return failesTmp
    }
  ),
  edit: async(function (bugReport, id) {
    awaitFor(BugReportModel.update({_id: id}, {$set: bugReport}))
    // let bugReportTmp = awaitFor(BugReportModel.update(bugReport))
    return bugReport
  }),

  listAllPass : async(function (options) {
    let bugReports = BugReportModel
    .find({
      inconveniente: {$nin :["COMPLEJIDAD"]},
      created_at:{$gte:new Date().getTime()-(48*60*60*1000)},
      estado: {$nin :["SOLUCIONADO"]}
    })
    .sort({
      created_at: -1
    })
  return bugReports
  }),

  listAllPassRelated : async(function (options) {
    let bugReports = BugReportModel
    .find({
      //inconveniente: {$nin :["COMPLEJIDAD"]},
      //created_at:{$gte:new Date().getTime()-(48*60*60*1000)},
      estado: {$nin :["SOLUCIONADO"]},
      line: options.line,
      sector: options.sector,
      sub_sector: options.sub_sector,
      equipo: options.equipo
    })
    .sort({
      created_at: -1
    })
  return bugReports
  }),
  listAll : async(function (options) {
    let bugReports = BugReportModel
    .find({})
    .sort({
      created_at: -1
    })
  return bugReports
  }),
  listPassFails : async(function (options) {
    let bugReports = BugReportModel
    .find({
      $or:[{inconveniente: "COMPLEJIDAD"}, {created_at:{$lte:new Date(new Date().getTime()-(48*60*60*1000))}, estado: {$nin :["SOLUCIONADO"]}}],
      betadas: null
    })
    .sort({
      created_at: -1
    })
  return bugReports
  }),
  
  listBetadas : async(function (options) {
    let bugReports = BugReportModel
    .find({
      betadas: true
    })
    .sort({
      created_at: -1
    })
  return bugReports
  }),

  getFailsForFather : async(function (options) {
    if (options.father_id == null) {
      options.father_id = null;
    }
    let bugReports = FailedModel
    .find({
      father_id: options.father_id   })
  return bugReports
  }),

  

  listNoActive : async(function (options) {
    let bugReports = BugReportModel
    .find({
      // created_at:{$gte:new Date(new Date().getTime()+(24*60*60*1000))},
      $or:[{ estado: "SOLUCIONADO"}]     
    })
    .sort({
      created_at: -1
    })
    /*.populate({
      path: 'collaborators',
      populate: {path: 'shift', select: 'value'},
      select: {name: 1, lastname: 1, legajo: 1}
    })
    .populate('creator', 'name lastname legajo')*/
   /*bugReports = filterMeeting(bugReports,options)*/
  // return paginateAndSort(bugReports, options,-1)
  return bugReports
  }),

  findOneFail: async(function (id) {
    return awaitFor(FailedModel.findById(id))
  }),

  updateFailed: async(function (failed) {
    awaitFor(FailedModel.update({_id: failed._id}, {$set: failed}, {multi: true}))
    return failed
    }
  ),


  deleteFailed: async(function (failed) {
    awaitFor(failed.remove())
    return true
    }
  ),

  findOne: async(function (meetingId) {
    return awaitFor(BugReportModel.findById(meetingId))
  })
}
  

const paginateAndSort = function (cursor, options = {},asc=1) {
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

module.exports = service

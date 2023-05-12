'use strict'
const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const config = require(path.join(__dirname, '/../libs/const'))
const staffNewsModel = require(path.join(__dirname, '/../model')).staffNews
const licenseModel = require(path.join(__dirname, '/../model')).staffRequest
const teamService = require(path.join(__dirname, '/team'))
const eventsTimelineService = require(path.join(__dirname, '/eventsTimeline'))
const dateFns = require('date-fns')
const Boom = require('boom')
const shift = require(path.join(__dirname, '/../libs/shift'))
const notification = require(path.join(__dirname, '/../libs/notification'))
const constant = require(path.join(__dirname, '../libs/const'))
const NOTIFICATION_TYPE = constant.NOTIFICATION_TYPE
const ROLES = constant.ROLE
const SCHEDULE = constant.SCHEDULE
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const UserModel = require(path.join(__dirname, '/../model')).user
const _ = require('lodash')
const discounter = {
  LATE: (schedule, enterTime) => enterTime.getTime() - schedule.beginsAsDate().getTime(),
  EARLY: (schedule, exitTime) => schedule.endsAsDate().getTime() - exitTime.getTime()
}
const Const = require(path.join(__dirname, '/../libs/const'))

const sendCreateNotification = async(function (collaborator, creator, news) {
  const payload = new notification.Payload('Novedad', '/control/novedades', NOTIFICATION_TYPE.NOVEDAD,
    { 
      subType: news.type,
      creator: {name: creator.name, lastname: creator.lastname},
      collaborator: {name: collaborator.name, lastname: collaborator.lastname},
      observation: news.observation
    })
  const query = {
    $or: [
      {user_type: {$in: ROLES.ADMINISTRACION}},
      {_id: {$in: awaitFor(teamService.bossesChainOf(collaborator._id))}}
    ]
  }
  notification.sendNotification(query, payload)
})

const service = {
  create: async(function (collaborator, creator, news) {
    creator = awaitFor(
      UserModel.findById(creator, {name: 1, lastname: 1})
        .populate('shift'))
    collaborator = awaitFor(UserModel.findById(collaborator, {name: 1, lastname: 1}))

    sendCreateNotification(collaborator, creator, news)

    news.collaborator = collaborator
    news.creator = creator

    // If it's Late or Early i need to calculate how long the collaborator wasn't in Fanelli
    if (news.type === staffNewsModel.TYPES.LATE || news.type === staffNewsModel.TYPES.EARLY) {
      const time = new Date()
      time.setHours(news.time.split(':')[0], news.time.split(':')[1])
      // If it doesn't have a shift i use the default schedule
      if (collaborator.shift !== undefined && ['T1', 'T2', 'T3', 'T4'].indexOf(collaborator.shift.value) > -1) {
        const schedule = shift.getScheduleForShift(shift.SHIFT[collaborator.shift], new Date())
        news.discountedTime = discounter[news.type](schedule, time)
      } else {
        news.discountedTime = discounter[news.type](SCHEDULE.SIN_TURNO, time)
      }
    }
    return staffNewsModel.create(news)
  }),

  addExculpatory: async(function (staffNewId, exculpatory) {
    return staffNewsModel
      .findOneAndUpdate({_id: staffNewId}, {$set: {exculpatory: exculpatory}}, {new: true})
      .populate('collaborator creator', 'name lastname legajo')
  }),

  withoutExculpatory: async(function () {
    const timelines = awaitFor(eventsTimelineService.get())
    const nonArchivedEvents = _.flatMap(timelines, t => t.events.map(e => e.item))
    return awaitFor(staffNewsModel
      .find({
        _id: {$in: nonArchivedEvents},
        exculpatory: {$exists: false},
        $or: [{type: Const.STAFF_NEWS_TYPE.LATE}, {type: Const.STAFF_NEWS_TYPE.ABSENT}]
      })
      .populate('creator', ['name', 'lastname'])
      .populate({
        path: 'collaborator',
        populate: 'shift',
        select: 'name lastname shift s3Key legajo'
      })
      .sort({createdAt: -1})
    )
  }),
  finished: async(function () {
    return awaitFor(staffNewsModel
      .find({exculpatory: {$exists: true}})
      .populate('creator', ['name', 'lastname'])
      .populate('collaborator', ['name', 'lastname'])
      .sort({createdAt: -1})
    )
  }),
  getPDFStream: async(function (staffNewId) {
    let staffNews = awaitFor(staffNewsModel.findById(staffNewId)
      .populate({path: 'collaborator', populate: {path: 'shift'}})
      .populate('creator', ['name', 'lastname']))
    if (staffNews === undefined || staffNews === null) {
      throw Boom.notFound('ID Inválido')
    }
    const content = pdf.getStaffNewsContent(staffNews)
    return pdf.createPdf(content)
  }),

  update: async(function (staffNewId, staffNews) {
    return awaitFor(staffNewsModel.findOneAndUpdate({_id: staffNewId}, {$set: staffNews}, {new: true})).populate('creator collaborator', 'name lastname legajo')
  }),
  getById: async(function (requestId) {
    return staffNewsModel.findById(requestId)
      .populate('creator', ['name', 'lastname'])
      .populate('collaborator', ['name', 'lastname'])
  }),
  getDoneTo: async(function (collaborator, options) {
    const timelines = awaitFor(eventsTimelineService.getArchived())
    const archivedEvents = _.flatMap(timelines, t => t.events.map(e => e.item))
    let staffNews = awaitFor(staffNewsModel.find({
      _id: {$in: archivedEvents},
      collaborator: collaborator
    })
      .populate('creator', ['name', 'lastname'])
      .populate('collaborator', ['name', 'lastname']))
    let licenses = awaitFor(licenseModel.find({
      _id: {$in: archivedEvents},
      collaborator: collaborator
    })
      .populate('creator', ['name', 'lastname'])
      .populate('collaborator', ['name', 'lastname']))
    staffNews = staffNews.concat(licenses)

    staffNews.sort((pr, cr) => dateFns.compareDesc(pr.created_at, cr.created_at))

    if (options.page !== undefined) {
      staffNews = paginate(staffNews, options.page, options.perPage)
    }
    return staffNews
  })
}

function paginate (staffNews, page = 1, perPage = 15) {
  let offset = (page - 1) * perPage
  offset = Number(offset)
  perPage = Number(perPage)

  staffNews.slice(offset, offset + perPage)
  return staffNews
}

module.exports = service

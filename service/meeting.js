const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const MeetingModel = require(path.join(__dirname, '../model')).meeting
const notification = require(path.join(__dirname, '/../libs/notification'))
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const moment = require('moment')
const dateFns = require('date-fns')
const teamService = require(path.join(__dirname, '/team'))
const Const = require(path.join(__dirname, '../libs/const'))
const NOTIFICATION_TYPE = Const.NOTIFICATION_TYPE
const service = {

  create: async(function (meeting) {
    let meetingTmp = meeting;
    if (meeting.type === 'FRECUENCY') {
     /* if (meeting.frecuency !== 'WEEKLY') {
         meetingTmp = awaitFor(MeetingModel.create(meeting))
      }*/
      createRepetitionsMeeting(meetingTmp)
    }
    else meetingTmp = awaitFor(MeetingModel.create(meeting))
    return meetingTmp
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
    let meetings = MeetingModel.find({
      date:{$gte:new Date(new Date().getTime()-(2*24*60*60*1000))}
    })
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
    meetings = filter(meetings, options)
    return paginateAndSort(meetings, options)
  }),
  getActiveByUser: async(function (userId, options, filters = {}) {
    let meetings = MeetingModel
      .find({
        $or: [{creator: userId}, {collaborators: userId}]
      })
      .sort({created_at: -1})
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
    return paginateAndSort(meetings, options)
  }),

  listMyMeetings: async(function (id, options) {
    let meetings = MeetingModel
      .find({
        date:{$gte:new Date(new Date().getTime()-(2*24*60*60*1000))},
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
  listMyMeetingsAll: async(function (id, options) {
    let meetings = MeetingModel
      .find({
        date:{$lte:new Date(new Date().getTime()+(24*60*60*1000))},
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
    listMyMeetingsAllPass : async(function (id, options) {
      let meetings = MeetingModel
      .find({
        date:{$lte:new Date(new Date().getTime()+(24*60*60*1000))},
        $or: [{creator: id}, {collaborators: id}]
      })
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
      meetings = filterMeeting(meetings,options)
    return paginateAndSort(meetings, options,-1)
  }),
  edit: async(function (id, meeting,repeatEdit) {
    awaitFor(MeetingModel.update({_id: id}, {$set: meeting}))
    if (repeatEdit) {
      let idorigin = meeting._originId || id
      awaitFor(MeetingModel.updateMany({_originId: idorigin}, {$set:{"time": meeting.time}}))
    }
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
  removeAll: async(function (id) {
    const meeting = awaitFor(MeetingModel.findById({_id: id}))
    const meetings = awaitFor(MeetingModel.find({_originId: meeting._originId }))
    meetings.forEach(dweek => { awaitFor(dweek.remove()) })
    return true
  }),
  isCreator: async(function (userId, meetingId) {
    const meeting = awaitFor(MeetingModel.findById(meetingId))
    return meeting.creator.equals(userId)
  })
}

function filterMeeting (meetingss, filters) {
  /*if (filters.collaborator) {
    eppCursor = eppCursor.where('collaborator').equals(filters.collaborator)
  }*/
  // console.dir(filters)
  if (filters.date) {
    filters.date = new Date (filters.date)
    meetingss = meetingss.where('date').gt(filters.date).lt(dateFns.addDays(filters.date, 1))
  }
  if (filters.type) {
    meetingss = meetingss.where('type').equals(filters.type)
  }
  if (filters.frecuency) {
    meetingss = meetingss.where('frecuency').equals(filters.frecuency)
  }
  /*if (filters.teamOf) {
    eppCursor = awaitFor(eppCursor.teamOf(filters.teamOf)).query
  }*/
  return meetingss
}

const paginateAndSort = function (cursor, options = {},asc=1) {
  cursor = cursor
      .sort({date: asc})
   // .sort({created_at: -1})
  if (options.page !== undefined) {
    options.perPage = options.perPage || 15
    cursor = cursor
      .skip(options.perPage * (options.page - 1))
      .limit(options.perPage)
  }
  return cursor
}

const createRepetitionsMeeting = function (meeting) {
  if (meeting.frecuency === 'DAILY') {
     //desde hasta crear reuniones con el meeting_origin
     var firts = true;
     var a = moment(meeting.date);
     var b = moment(meeting.dateFrom);
     var tmp;
     for (var m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
        //console.log(m.format('YYYY-MM-DD'));
        if (firts){
            meetingT = awaitFor(MeetingModel.create(meeting));
            firts = false;
        }
        tmp = m.clone();    
        cloneWithAnotherDate(meetingT,new Date(tmp.locale("en").add(1, 'd').format("YYYY-MM-DD")));
      } 
      awaitFor(meetingT.remove());
  } 

  if (meeting.frecuency === 'WEEKLY') {
    var a = moment(meeting.date);
    var b = moment(meeting.dateFrom);
    var firts = true;
    let meetingT = meeting;
    var tmp;
    //desde hasta crear reuniones con el meeting_origin
    meeting.weeklys.forEach(dweek => {
      // Get "next" monday
        let dday = Const.WEEKLY_MEETING_FRECUENCY_DAY[dweek];
        let m = a.clone().day(dday);
        if( m.isAfter(a, 'd') ){ 
          console.log(m.format('YYYY-MM-DD'));
        }
        while( m.isBefore(b) ){ 
          //console.log(m.format('YYYY-MM-DD'));
          if (firts){
            meetingT = awaitFor(MeetingModel.create(meeting));
          }
          tmp = m.clone();
          if (!firts){
            cloneWithAnotherDate(meetingT,new Date(tmp.locale("en").add(1, 'd').format("YYYY-MM-DD")));
          }
          else {
            firts = false;
          }
          m.add(7, 'days'); 
        }
        });
   }

  if (meeting.frecuency === 'MONTHLY') {
    meetingT = awaitFor(MeetingModel.create(meeting));
    sendCreateNotification(meetingT)
    meeting.dates.forEach(element => {
      if (element !== null && element !== "") {
        var a = moment(meeting.date);
        let meetingT = meeting;
        cloneWithAnotherDate(meetingT,element);
      }
    });  
  }
  return meeting
}


const sendCreateNotification = async(function (meeting) {
  meetingg = awaitFor(MeetingModel.findById(meeting._id)
  .populate('creator', 'name lastname')
  .populate('collaborators', 'name lastname'))
  let everyBoss = awaitFor(teamService.allBossesOf(meeting.collaborators))
  
  notification.sendNotification(
    {_id: {$in: everyBoss}},
    new notification.Payload('Nueva Reunión', '/meeting', NOTIFICATION_TYPE.MEETING,
      {
        collaborators: meetingg.collaborators.map(c => c.basicInfo()),
        creator: meetingg.creator.basicInfo(),
        state: meetingg.state
      })
  )
})

const cloneWithAnotherDate = function (meeting, dateOther) {
    let meetingRepeat = {
      collaborators: meeting.collaborators,
      editors: meeting.editors,
      creator: meeting.creator,
      type: meeting.type,
      frecuency: meeting.frecuency,
      date: dateOther,
      dateFrom: meeting.dateFrom,
      recommendations: meeting.recommendations,
      weeklys: meeting.weeklys,
      names: meeting.names,
      description: meeting.description,
      time: meeting.time,
      _originId: meeting._id
    }
    return awaitFor(MeetingModel.create(meetingRepeat))
}

const filter = function (cursor, options = {}) {
  if (options.teamOf) {
    console.log('list')
    cursor = awaitFor(cursor.teamOf(options.teamOf)).query
  }
  return cursor
}
module.exports = service

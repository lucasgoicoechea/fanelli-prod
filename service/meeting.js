const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const MeetingModel = require(path.join(__dirname, '../model')).meeting
const notification = require(path.join(__dirname, '/../libs/notification'))
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const moment = require('moment')
const Const = require(path.join(__dirname, '../libs/const'))
const service = {

  create: async(function (meeting) {
    let meetingTmp = meeting;
    if (meeting.type === 'FRECUENCY') {
     /* if (meeting.frecuency !== 'WEEKLY') {
         meetingTmp = awaitFor(MeetingModel.create(meeting))
      }*/
      createRepetitionsMeeting(meetingTmp)
    }
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

const createRepetitionsMeeting = function (meeting) {
  if (meeting.frecuency === 'DAILY') {
     //desde hasta crear reuniones con el meeting_origin
     var a = moment(meeting.date);
     var b = moment(meeting.dateFrom);
     var tmp;
     for (var m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
      tmp = m.clone();    
      cloneWithAnotherDate(meeting,new Date(tmp.locale("en").add(1, 'd').format("YYYY-MM-DD")));
      } 
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
            firts = false;
          }
          tmp = m.clone();
          cloneWithAnotherDate(meetingT,new Date(tmp.locale("en").add(1, 'd').format("YYYY-MM-DD")));
          m.add(7, 'days'); 
        }
        });
   }

  if (meeting.frecuency === 'MONTHLY') {
    //desde hasta crear reuniones con el meeting_origin
    var a = moment(meeting.date);
    var b = moment(meeting.dateFrom);
    let meetingT = meeting;
    let m = a;
    var tmp;
    if( m.isAfter(a, 'd') ){ 
      console.log(m.format('YYYY-MM-DD'));
    }
    while( m.isBefore(b) ){ 
      //console.log(m.format('YYYY-MM-DD'));
      if (a.date() <= m.daysInMonth() ) {
        m.date(a.date());
        tmp = m.clone();
        cloneWithAnotherDate(meetingT,new Date(tmp.locale("en").add(1, 'd').format("YYYY-MM-DD")));
      }
      m.add(1,'months'); 
    }
  }
  return meeting
}

const cloneWithAnotherDate = function (meeting, dateOther) {
    let meetingRepeat = {
      collaborators: meeting.collaborators,
      creator: meeting.creator,
      type: meeting.type,
      frecuency: meeting.frecuency,
      date: dateOther,
      dateFrom: meeting.dateFrom,
      recommendations: meeting.recommendations,
      weeklys: meeting.weeklys,
      description: meeting.description,
      time: meeting.time,
      _originId: meeting._id
    }
    return awaitFor(MeetingModel.create(meetingRepeat))
}

const filter = function (cursor, options = {}) {
  if (options.teamOf) {
    cursor = awaitFor(cursor.teamOf(options.teamOf)).query
  }
  return cursor
}
module.exports = service

const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const BugReportModel = require(path.join(__dirname, '../model')).bugReport
const notification = require(path.join(__dirname, '/../libs/notification'))
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const moment = require('moment')
const dateFns = require('date-fns')
const Const = require(path.join(__dirname, '../libs/const'))
const NOTIFICATION_TYPE = Const.NOTIFICATION_TYPE
const service = {

  create: async(function (bugReport) {
    let bugReportTmp = awaitFor(BugReportModel.create(bugReport))
    return bugReportTmp
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
  return bugReports
  }),

  listPassFails : async(function (options) {
    let bugReports = BugReportModel
    .find({
      $or:[{inconveniente: "COMPLEJIDAD"}, {created_at:{$lte:new Date(new Date().getTime()-(48*60*60*1000))}, estado: {$nin :["SOLUCIONADO"]}}]
    })
  return bugReports
  }),

  listNoActive : async(function (options) {
    let bugReports = BugReportModel
    .find({
      // created_at:{$gte:new Date(new Date().getTime()+(24*60*60*1000))},
      estado: "SOLUCIONADO"
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

  findOne: async(function (meetingId) {
    return awaitFor(BugReportModel.findById(meetingId))
  })
}
  /* getPdf: async(function (meetingId) {
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
  getByIdOrigin: async(function (meetingId) {
    let meetings = MeetingModel
      .find({
        _originId: meetingId
      })
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
      return meetings
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
  listMyMeetingsMonth: async(function (id, month, year, options) {
    var start = new Date(new Date(year+"-"+month+"-01").getTime()-(24*60*60*1000))
    var end = new Date(new Date(year+"-"+month+"-30").getTime()+(24*60*60*1000))
    var conditions = id==null?{date:{$gte: start, $lt: end}}:{
      date:{$gte: start, $lt: end},
      $or: [{creator: id}, {collaborators: id}]
    }

    console.dir(conditions)
    let meetings = MeetingModel
      .find(conditions)
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
  listAllPass : async(function (options) {
    let meetings = MeetingModel
    .find({
      date:{$lte:new Date(new Date().getTime()+(24*60*60*1000))}
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
  /* if (filters.date) {
    filters.date = new Date (filters.date)
    meetingss = meetingss.where('date').gt(filters.date).lt(dateFns.addDays(filters.date, 1))
  }
  if (filters.type) {
    meetingss = meetingss.where('type').equals(filters.type)
  }
  if (filters.frecuency) {
    meetingss = meetingss.where('frecuency').equals(filters.frecuency)
  }
  if (filters.state) {
    meetingss = meetingss.where('state').equals(filters.state)
  }
  /*if (filters.teamOf) {
    eppCursor = awaitFor(eppCursor.teamOf(filters.teamOf)).query
  }
  return meetingss
} */

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

/*const createRepetitionsMeeting = function (meeting) {
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
}) */

module.exports = service

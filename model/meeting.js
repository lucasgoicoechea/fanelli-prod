const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
const Const = require(path.join(__dirname, '/../libs/const'))
const dateFns = require('date-fns')
const {queryTeam} = require(path.join(__dirname, '/../libs/queryResponsible'))
/**
 * @apiDefine meetingEntity
 * @apiSuccess {Object} meeting Meeting Object
 * @apiSuccess {Object[]} meeting.collaborators Collaborators in the meeting
 * @apiSuccess {Object} meeting.creator meeting Creator
 * @apiSuccess {String} meeting.type Meeting type, can be GROUP or INDIVIDUAL
 * @apiSuccess {String} meeting.description Meeting description
 * @apiSuccess {String[]} meeting.recommendations Meeting recommendations
 * @apiSuccess {Date} meeting.date Meeting date
 *
 * */
const meetingSchema = new Schema({
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  editors: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: Object.keys(Const.MEETING_TYPE).map(t => Const.MEETING_TYPE[t]),
    required: true
  },
  frecuency: {
    type: String
  },
  recommendations: [{
    type: String,
    enum: Object.keys(Const.RECOMMENDATION_MEETING).map(t => Const.RECOMMENDATION_MEETING[t]),
    required: true
  }],
  weeklys: [{
    type: String
    //enum: Object.keys(Const.WEEKLY_MEETING_FRECUENCY).map(t => Const.WEEKLY_MEETING_FRECUENCY[t])
  }],
  names: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  dateFrom: {
    type: Date
  },
  date: {
    type: Date,
    required: true
  },
  dates: [{
    type: Date
  }],
  time: {
    type: String
  },
  _originId: {
    type: Schema.Types.ObjectId,
    ref: 'Meeting',
    required: false
  },
  state: {
    type: Number,
    enum: Const.MEETING_STATE,
    default: Const.MEETING_STATE.PROGRAMMED
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

meetingSchema.methods.printableDetails = function () {
  const details = []

  details.push({
    key: `Reunion ${this.type === 'FRECUENCY'?Const.MEETING_FRECUENCY[this.frecuency]:Const.READABLE_MEETING_TYPE[this.type]}: `,
    value: this.recommendations.map(t => Const.READABLE_RECOMMENDATION_MEETING[t]).join(', ')
  })

  details.push({
    key: 'Realizada el: ',
    value: dateFns.format(this.date, 'DD/MM/YYYY')
  })
  let html = this.description
  html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
  html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
  html = html.replace(/<\/div>/ig, '\n');
  html = html.replace(/<\/li>/ig, '\n');
  html = html.replace(/<li>/ig, '  *  ');
  html = html.replace(/<\/ul>/ig, '\n');
  html = html.replace(/<\/p>/ig, '\n');
  html = html.replace(/<br\s*[\/]?>/gi, "\n");
  html = html.replace(/<[^>]+>/ig, '');
  html = html.replace(/\u00a0/g, " ");
  html = html.replace(/&nbsp;/g, " ");
  
  details.push({
    key: 'Temas: ',
    value: html
  })

  return details
}

meetingSchema.query.teamOf = queryTeam('collaborators')
// mongoose.set('debug', true)
const MeetingModel = mongoose.model('Meeting', meetingSchema)
module.exports = MeetingModel

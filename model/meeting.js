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
  recommendations: [{
    type: String,
    enum: Object.keys(Const.RECOMMENDATION_MEETING).map(t => Const.RECOMMENDATION_MEETING[t]),
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
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
    key: `Reunion ${Const.READABLE_MEETING_TYPE[this.type]}: `,
    value: this.recommendations.map(t => Const.READABLE_RECOMMENDATION_MEETING[t]).join(', ')
  })

  details.push({
    key: 'Realizada el: ',
    value: dateFns.format(this.date, 'DD/MM/YYYY')
  })

  details.push({
    key: 'Temas: ',
    value: this.description
  })

  return details
}

meetingSchema.query.teamOf = queryTeam('collaborators')

const MeetingModel = mongoose.model('Meeting', meetingSchema)
module.exports = MeetingModel

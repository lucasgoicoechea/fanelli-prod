const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const {queryTeam} = require(path.join(__dirname, '/../libs/queryResponsible'))
const Schema = mongoose.Schema
const EventsTimelineSchema = new Schema({
  collaborator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  events: [{
    type: {
      type: String
    },
    archived: {
      type: Boolean,
      default: false
    },
    item: {type: Schema.Types.ObjectId, refPath: 'events.type'}
  }],
  archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  usePushEach: true
})

EventsTimelineSchema.query.teamOf = queryTeam('collaborator')
const EventTimelineModel = mongoose.model('EventTimeline', EventsTimelineSchema)

module.exports = EventTimelineModel

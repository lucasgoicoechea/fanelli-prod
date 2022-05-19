const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const EventsTimelineModel = require(path.join(__dirname, '/../model')).eventsTimeline

const service = {
  addEventTo: async(function (item, type, timelineId) {
    let eventsTimeline = awaitFor(EventsTimelineModel.findById(timelineId))
    eventsTimeline.events.push({type: type, item: item})
    eventsTimeline = awaitFor(eventsTimeline.save())
    return eventsTimeline
  }),
  createTimelineForCollaborator: async(function (collaboratorId) {
    return awaitFor(EventsTimelineModel.create({collaborator: collaboratorId}))
  }),
  get: async(function (options) {
    let timelines = EventsTimelineModel
      .find({archived: false})
      .populate('collaborator', ['name', 'lastname', 'legajo'])
      .populate({
        path: 'events.item',
        populate: {
          path: 'creator collaborator legajo',
          select: 'name lastname legajo',
          model: 'User'
        }
      })
      .sort({created_at: -1})

    timelines = awaitFor(filter(timelines, options))
    // We need to remove the events that are archived. It can't be done with a query
    // We can't use the mongoose object, so for each result we use toObject to get a plain object of the document and filter the archived events
    const objectTimelines = []
    timelines.forEach(t => {
      let objectTimeline = t.toObject()
      objectTimeline.events = objectTimeline.events.filter(e => !e.archived)
      objectTimelines.push(objectTimeline)
    })
    return objectTimelines
  }),
  getArchived: async(function (options) {
    let timelines = EventsTimelineModel
      .find({archived: true})
      .populate('collaborator', ['name', 'lastname', 'legajo'])
      .populate({
        path: 'events.item',
        populate: {
          path: 'creator collaborator legajo',
          select: 'name lastname legajo',
          model: 'User'
        }
      })
      .sort({created_at: -1})

    timelines = awaitFor(filter(timelines, options))
    // We need to remove the events that are archived. It can't be done with a query
    // We can't use the mongoose object, so for each result we use toObject to get a plain object of the document and filter the archived events
    const objectTimelines = []
    timelines.forEach(t => {
      let objectTimeline = t.toObject()
      objectTimeline.events = objectTimeline.events.filter(e => !e.archived)
      objectTimelines.push(objectTimeline)
    })
    return objectTimelines
  }),
  getById: async(function (timelineId) {
    let timeline = awaitFor(EventsTimelineModel
      .findById(timelineId)
      .populate('collaborator', ['name', 'lastname'])
      .populate({
        path: 'events.item',
        populate: {
          path: 'creator collaborator',
          select: 'name lastname legajo',
          model: 'User'
        }
      }))
    timeline = timeline.toObject()
    timeline.events = timeline.events.filter(e => !e.archived)
    return timeline
  }),
  archive: async(function (timelineId) {
    return awaitFor(EventsTimelineModel.findByIdAndUpdate(timelineId, {$set: {archived: true}}, {new: true}))
  }),
  desarchive: async(function (timelineId) {
    return awaitFor(EventsTimelineModel.findByIdAndUpdate(timelineId, {$set: {archived: false}}, {new: true}))
  }),
  removeEvent: async(function (eventId, timelineId) {
    const timeline = awaitFor(EventsTimelineModel.findOne({
      _id: timelineId,
      'events.item': eventId
    }).populate('events.item'))
    let event = timeline.events.find(e => e.item._id.toString() === eventId.toString())
    // Event can be StaffRequest or StaffNews

    awaitFor(event.item.remove())
    if (timeline.events.indexOf(event) === 0) {
      timeline.events.forEach(e => {
        awaitFor(e.item.remove())
      })
      awaitFor(timeline.remove())
      return {}
    } else {
      return awaitFor(EventsTimelineModel
        .findOneAndUpdate(
          {
            _id: timelineId
          },
          {
            $pull: {events: {item: eventId}}
          },
          {
            new: true
          }))
    }
  })
}

const filter = function (cursor, options = {}) {
  if (options.teamOf) {
    cursor = awaitFor(cursor.teamOf(options.teamOf)).query
  }
  return cursor
}

module.exports = service

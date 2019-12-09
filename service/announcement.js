const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const AnnouncementModel = require(path.join(__dirname, '../model')).announcement
const service = {
  create: async(function (announcement) {
    announcement = awaitFor(AnnouncementModel.create(announcement))
    return AnnouncementModel
      .findById(announcement._id)
      .populate('creator', 'name lastname')
  }),
  list: async(function () {
    return AnnouncementModel
      .find({})
      .populate('creator', 'name lastname')
  }),
  remove: async(function (id) {
    return AnnouncementModel.remove({_id: id})
  })
}
module.exports = service

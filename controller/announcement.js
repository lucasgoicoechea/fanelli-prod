const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const announcementService = require(path.join(__dirname, '../service')).announcement
const controller = {
  /**
   * @apiDefine createAnnouncement
   * @apiParam {Object} announcement Announcement Object
   * @apiParam {String} announcement.description Announcement description
   *
   */
  create: async(function (req, res) {
    let announcement = {
      description: req.body.announcement.description,
      creator: req.user.id
    }
    announcement = awaitFor(announcementService.create(announcement))
    res.json({success: true, announcement})
  }),

  list: async(function (req, res) {
    const announcements = awaitFor(announcementService.list())
    res.json({success: true, announcements})
  }),

  remove: async(function (req, res) {
    awaitFor(announcementService.remove(req.params.id))
    res.json({success: true, message: 'Aviso eliminado'})
  })
}
module.exports = controller

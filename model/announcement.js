const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
/**
 * @apiDefine AnnouncementEntity
 * @apiSuccess {Object} announcement Announcement Object
 * @apiSuccess {Object} announcement.creator Announcement creator
 * @apiSuccess {String} announcement.description Announcement description
 * @apiSuccess {Date} announcement.created_at Announcement creation date
 * @apiSuccess {Date} announcement.updated_at Announcement last update date
  *
 * */
const announcementSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
const AnnouncementModel = mongoose.model('announcement', announcementSchema)
module.exports = AnnouncementModel

'use strict'
// During the test the env variable is set to test
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const announcementService = require(path.join(__dirname, '/../service')).announcement
const AnnouncementModel = require(path.join(__dirname, '/../model')).announcement
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const ObjectId = require('mongoose').Types.ObjectId
const factory = require(path.join(__dirname, '/helper/factory'))
const dateFns = require('date-fns')
const Const = require(path.join(__dirname, '/../libs/const'))

describe('Announcement', () => {
  beforeEach((done) => {
    // Before the test we empty the database
    AnnouncementModel.remove({})
      .then(() => done())
      .catch(error => done(error))
  })

  it('should create a announcement', async(() => {
    const announcement = awaitFor(announcementService.create(factory.announcement()))
    expect(announcement).to.have.property('_id')
    const announcements = awaitFor(AnnouncementModel.find())
    expect(announcements).to.have.lengthOf(1)
  }))
  it('should delete a announcement', async(() => {
    const announcement = awaitFor(AnnouncementModel.create(factory.announcement()))
    awaitFor(announcementService.remove(announcement._id))
    const announcements = awaitFor(AnnouncementModel.find())
    expect(announcements).to.have.lengthOf(0)
  }))
  it('should get the announcements', async(() => {
    awaitFor(AnnouncementModel.create(factory.announcement()))
    awaitFor(AnnouncementModel.create(factory.announcement()))
    awaitFor(announcementService.list())
    const announcements = awaitFor(AnnouncementModel.find())
    expect(announcements).to.have.lengthOf(2)
  }))
})

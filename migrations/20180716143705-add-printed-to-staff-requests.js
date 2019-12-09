'use strict'
const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

const addPrinted = async(requestCollection => {
  const requests = awaitFor(requestCollection.find({}).toArray())
  requests.forEach(request => {
    let printed = request.archived
    requestCollection.update({_id: request._id}, {$set: {printed}})
  })
})

exports.up = async(function (db) {
  const leaveRequestCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('leaverequests')
  const extraHoursRequestCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('extrahoursrequests')
  const shiftChangeRequestCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('shiftchangerequests')
  addPrinted(leaveRequestCollection)
  addPrinted(extraHoursRequestCollection)
  addPrinted(shiftChangeRequestCollection)
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}

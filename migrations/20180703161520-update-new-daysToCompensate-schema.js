'use strict'
const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')

let dbm
let type
let seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = async(function (db) {
  const leaveRequestCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('leaverequests')
  const leaveRequests = awaitFor(leaveRequestCollection.find({}).toArray())
  leaveRequests.forEach(lr => {
    // If daysToCompensate is not empty and has the old schema (it doesn't have from property)
    // it updates the schema
    if (lr.daysToCompensate.length !== 0 && lr.daysToCompensate[0].from === undefined) {
      const daysToCompensate = []
      lr.daysToCompensate.forEach(day => {
        daysToCompensate.push({from: day, to: day})
      })
      leaveRequestCollection.update({_id: lr._id}, {$set: {daysToCompensate: daysToCompensate}})
    }
  })

  return null
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}

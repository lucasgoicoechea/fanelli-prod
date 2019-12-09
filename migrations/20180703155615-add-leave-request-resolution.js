'use strict'
const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const Const = require(path.join(__dirname, '../libs/const'))
const shiftsDescriptions = require(path.join(__dirname, '../data/shiftDescription'))

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

exports.up = async(function (db) {
  const leaveRequestCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('leaverequests')
  const leaveRequests = awaitFor(db._find('leaverequests', {}))
  leaveRequests.forEach(lr => {
    let resolution
    if (lr.deduct) {
      resolution = Const.LEAVE_RESOLUTION.NO_COMPENSATE
    } else if (lr.compensate) {
      resolution = Const.LEAVE_RESOLUTION.COMPENSATE
    } else {
      resolution = Const.LEAVE_RESOLUTION.NO_DEDUCT
    }
    leaveRequestCollection.update({_id: lr._id}, {
      $set: {resolution: resolution},
      $unset: {deduct: '', compensate: '', dayOff: ''}
    })
  })
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}

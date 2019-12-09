'use strict'
const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
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
  const shiftCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('shifts')
  const shifts = awaitFor(db._find('shifts', {}))
  shifts.forEach(s => {
    let description = shiftsDescriptions.find(sd => sd.value === s.value)
    if (description !== null) {
      awaitFor(shiftCollection.update({_id: s._id}, {$set: {description: description.description}}))
    }
  })
  return true
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}

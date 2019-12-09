'use strict'
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
  const shiftCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('shifts')
  const userCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('users')
  const shifts = awaitFor(shiftCollection.find({}).toArray())
  const user = awaitFor(userCollection.find({}))
  user.forEach(u => {
    if (u.hasOwnProperty('shift')) {
      let userShift = shifts.find(s => s.value === u.shift)
      userCollection.update({_id: u._id}, {$set: {shift: userShift._id}})
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

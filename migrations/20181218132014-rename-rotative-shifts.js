'use strict'
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const shiftRename = [
  {old: 'T1', new: 'T1 (10)'},
  {old: 'T2', new: 'T2 (11)'},
  {old: 'T3', new: 'T3 (12)'},
  {old: 'T4', new: 'T4 (13)'}
]
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
    if (s.rotative) {
      let newName = shiftRename.find(sr => sr.old === s.value)
      if (newName !== null && newName !== undefined) {
        awaitFor(shiftCollection.update({_id: s._id}, {$set: {value: newName.new}}))
      }
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
